import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { JobOrchestrator } from '@/modules/audit/application/job-orchestrator';
import { CollectorWorker } from '@/modules/audit/workers/collector';
import { AnalyzerWorker } from '@/modules/audit/workers/analyzer';
import { ScoringEngine } from '@/modules/audit/workers/scoring';
import { RecommendationEngine } from '@/modules/audit/workers/recommendation';

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

  const jobId = uuidv4();
  const domainId = uuidv4();

  try {
    // 1. Initialize Job
    await supabase.from('jobs').insert([{ id: jobId, target_type: 'DOMAIN', target_id: domainId }]);
    
    const orchestrator = new JobOrchestrator();
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

    // 2. Execute Pipeline
    const collector = new CollectorWorker();
    const analyzer = new AnalyzerWorker();
    const scoring = new ScoringEngine();
    const recommendation = new RecommendationEngine();

    await collector.execute(jobId, domainId, targetUrl);

    // Get snapshot ID
    const { data: snapshotData, error: snapError } = await supabase
      .from('snapshots')
      .select('id')
      .eq('job_id', jobId)
      .order('captured_at', { ascending: false })
      .limit(1)
      .single();

    if (snapError || !snapshotData) throw new Error('Snapshot not found after collection');
    const snapshotId = snapshotData.id;

    await analyzer.execute(jobId, snapshotId, jobId);
    await scoring.execute(jobId, snapshotId, jobId);
    await recommendation.execute(jobId, snapshotId, jobId);

    await orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'AuditCompleted',
        event_version: 1,
        payload_json: { snapshot_id: snapshotId },
        metadata_json: {},
        correlation_id: jobId,
    });

    // Fetch final scores
    const { data: scoresData } = await supabase
      .from('scores')
      .select('*')
      .eq('snapshot_id', snapshotId)
      .single();

    if (scoresData) {
      return NextResponse.json({
        success: true,
        data: {
          accessibility: scoresData.accessibility_score,
          narrative: scoresData.composite_score,
          performance: scoresData.performance_score,
          bestPractices: scoresData.best_practices_score,
          seo: scoresData.seo_score
        }
      });
    }

    throw new Error('Scores were not generated properly');
  } catch (error) {
    console.error('Audit Pipeline Error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
