import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';
import { JobOrchestrator } from '@/modules/audit/application/job-orchestrator';
import { CollectorWorker } from '@/modules/audit/workers/collector';
import { AnalyzerEngine } from '@/modules/audit/workers/analyzer';
import { ScoringEngine } from '@/modules/audit/workers/scoring';
import { RecommendationEngine } from '@/modules/audit/workers/recommendation';
import { DirectorySyncWorker } from '@/modules/audit/workers/directory-sync';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url } = body;

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL parameter is required' }, { status: 400 });
    }

    return await runAudit(url);
  } catch (error) {
    console.error('Audit API Error (POST):', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      // Query recent audits list securely without leaking contact info
      const { data, error } = await supabase
        .from('utility_leads')
        .select('target_site_url, accessibility_score, narrative_score, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      const filtered = (data || []).filter(item => item.target_site_url);
      return NextResponse.json({ success: true, data: filtered });
    }

    return await runAudit(url);
  } catch (error) {
    console.error('Audit API Error (GET):', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

async function runAudit(url: string) {
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  const hostname = new URL(targetUrl).hostname;
  const jobId = uuidv4();
  // We create a real domain record to satisfy the FK constraint on snapshots.domain_id
  let domainId = uuidv4();
  const orchestrator = new JobOrchestrator();
  const warnings: string[] = [];

  try {
    // 1. Ensure a domain record exists so snapshot FK is satisfied
    let { data: existingDomain } = await supabase
      .from('domains')
      .select('id')
      .eq('domain_name', hostname)
      .maybeSingle();

    if (!existingDomain) {
      const { data: newDomain, error: domainError } = await supabase
        .from('domains')
        .insert([{ id: domainId, domain_name: hostname }])
        .select('id')
        .single();

      if (domainError || !newDomain) {
        throw new Error(`Failed to create domain record: ${domainError?.message}`);
      }
      domainId = newDomain.id;
    } else {
      domainId = existingDomain.id;
    }

    // 2. Create the Job row BEFORE emitting any event (FK requirement)
    const { error: jobInsertError } = await supabase
      .from('jobs')
      .insert([{ id: jobId, target_type: 'DOMAIN', target_id: domainId }]);

    if (jobInsertError) throw new Error(`Failed to create job record: ${jobInsertError.message}`);

    // 3. Emit AuditRequested event (now job row exists)
    await orchestrator.emitEvent({
      job_id: jobId,
      aggregate_id: jobId,
      aggregate_type: 'JOB',
      event_name: 'AuditRequested',
      event_version: 1,
      payload_json: { target_url: targetUrl },
      metadata_json: {},
      correlation_id: jobId,
    });

    // 4. Execute Pipeline — each stage is isolated; failure = warning, not crash
    const collector = new CollectorWorker();
    const analyzer = new AnalyzerEngine();
    const scoring = new ScoringEngine();
    const recommendation = new RecommendationEngine();

    try {
      await collector.execute(jobId, domainId, targetUrl);
    } catch (collectorErr: any) {
      warnings.push(`Collector partial failure: ${collectorErr.message}`);
      console.warn('[AuditPipeline] Collector error (non-fatal):', collectorErr.message);
    }

    // Fetch snapshot — may have been partially created by collector
    const { data: snapshotData } = await supabase
      .from('snapshots')
      .select('id')
      .eq('domain_id', domainId)
      .order('collected_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!snapshotData) {
      // Collector failed entirely — return graceful fallback score
      warnings.push('Tidak dapat terhubung ke website target. Menggunakan estimasi bawaan.');
      await orchestrator.emitEvent({
        job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
        event_name: 'AuditFailed', event_version: 1,
        payload_json: { reason: 'COLLECTOR_FAILED', warnings },
        metadata_json: {}, correlation_id: jobId,
      });
      return NextResponse.json({
        success: true,
        fallback: true,
        warnings,
        data: { accessibility: 50, narrative: 50, performance: 50, bestPractices: 50, seo: 50 },
        message: 'Audit menggunakan estimasi bawaan karena website tidak dapat dijangkau.',
      });
    }

    const snapshotId = snapshotData.id;

    try { await analyzer.execute(jobId, snapshotId, jobId); }
    catch (e: any) { warnings.push(`Analyzer partial: ${e.message}`); }

    try { await scoring.execute(jobId, snapshotId, jobId); }
    catch (e: any) { warnings.push(`Scoring partial: ${e.message}`); }

    try { await recommendation.execute(jobId, snapshotId, jobId); }
    catch (e: any) { warnings.push(`Recommendation partial: ${e.message}`); }

    await orchestrator.emitEvent({
      job_id: jobId, aggregate_id: jobId, aggregate_type: 'JOB',
      event_name: 'AuditCompleted', event_version: 1,
      payload_json: { snapshot_id: snapshotId, warnings },
      metadata_json: {}, correlation_id: jobId,
    });

    try {
      const directorySync = new DirectorySyncWorker();
      await directorySync.execute(jobId, domainId, snapshotId, jobId);
    } catch (e: any) {
      warnings.push(`DirectorySync partial: ${e.message}`);
    }

    // Fetch final scores
    const { data: scoresData } = await supabase
      .from('scores')
      .select('*')
      .eq('snapshot_id', snapshotId)
      .maybeSingle();

    const scores = scoresData
      ? {
          accessibility: scoresData.accessibility_score,
          narrative: scoresData.composite_score,
          performance: scoresData.performance_score,
          bestPractices: scoresData.best_practices_score,
          seo: scoresData.seo_score,
        }
      : { accessibility: 50, narrative: 50, performance: 50, bestPractices: 50, seo: 50 };

    return NextResponse.json({
      success: true,
      fallback: !scoresData,
      warnings: warnings.length > 0 ? warnings : undefined,
      data: scores,
      message: warnings.length > 0 ? 'Audit selesai dengan sebagian komponen menggunakan estimasi.' : undefined,
    });

  } catch (error) {
    console.error('[AuditPipeline] Fatal error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
