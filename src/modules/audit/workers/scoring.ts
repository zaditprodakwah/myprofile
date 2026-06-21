import { JobOrchestrator } from '../application/job-orchestrator';
import { supabase } from '@/lib/supabase';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';
import { v4 as uuidv4 } from 'uuid';

export class ScoringEngine {
  private orchestrator: JobOrchestrator;

  constructor() {
    this.orchestrator = new JobOrchestrator();
  }

  public async execute(jobId: string, snapshotId: string, correlationId: string): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'SCORING' });
    const startTime = Date.now();

    try {
      logger.info(`Starting scoring for snapshot ${snapshotId}`);

      const { data: snapshot, error: fetchError } = await supabase
        .from('snapshots')
        .select('*')
        .eq('id', snapshotId)
        .single();

      if (fetchError || !snapshot) throw new Error('Failed to fetch snapshot data');

      const perf = snapshot.performance_metrics_json as any;
      const seo = snapshot.seo_metrics_json as any;
      const a11y = snapshot.accessibility_metrics_json as any;

      // Rule-based scoring logic
      let performanceScore = 100;
      if (perf.lcp_ms > 4000) performanceScore -= 30;
      else if (perf.lcp_ms > 2500) performanceScore -= 15;
      if (perf.cls > 0.25) performanceScore -= 20;
      if (perf.ttfb_ms > 800) performanceScore -= 15;

      let seoScore = 100;
      if (!seo.has_title) seoScore -= 25;
      if (!seo.has_meta_description) seoScore -= 20;
      if (!seo.has_h1) seoScore -= 15;

      let accessibilityScore = 100;
      if (a11y.missing_alt_ratio > 0.3) accessibilityScore -= 20;

      // Bound checks
      performanceScore = Math.max(0, performanceScore);
      seoScore = Math.max(0, seoScore);
      accessibilityScore = Math.max(0, accessibilityScore);
      
      // Best Practices Scoring
      let bestPracticesScore = 100;
      if (perf.status !== 200) bestPracticesScore -= 50;
      if (perf.page_size_kb > 2000) bestPracticesScore -= 20;
      else if (perf.page_size_kb > 1000) bestPracticesScore -= 10;
      bestPracticesScore = Math.max(0, bestPracticesScore);

      const compositeScore = Math.round((performanceScore + seoScore + accessibilityScore + bestPracticesScore) / 4);

      const scoreId = uuidv4();
      const scores = {
        performance_score: performanceScore,
        seo_score: seoScore,
        accessibility_score: accessibilityScore,
        best_practices_score: bestPracticesScore,
        composite_score: compositeScore
      };

      const { error: insertError } = await supabase.from('scores').insert([{
        id: scoreId,
        snapshot_id: snapshotId,
        ...scores
      }]);

      if (insertError) throw new Error(`Failed to insert score: ${insertError.message}`);

      // Emit Event
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'ScoreComputed',
        event_version: 1,
        payload_json: { snapshot_id: snapshotId, scores },
        metadata_json: {},
        correlation_id: correlationId,
      });

      logger.info('Scoring completed', { duration_ms: Date.now() - startTime });

    } catch (error: any) {
      logger.error('Scoring failed', error, { duration_ms: Date.now() - startTime });
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'AuditFailed',
        event_version: 1,
        payload_json: { reason: 'SCORING_ERROR', error_message: error.message },
        metadata_json: {},
        correlation_id: correlationId,
      });
    }
  }
}
