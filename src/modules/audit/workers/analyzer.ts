import { JobOrchestrator } from '../application/job-orchestrator';
import { supabase } from '@/lib/supabase';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';

export class AnalyzerEngine {
  private orchestrator: JobOrchestrator;

  constructor() {
    this.orchestrator = new JobOrchestrator();
  }

  public async execute(jobId: string, snapshotId: string, correlationId: string): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'NORMALIZING' });
    const startTime = Date.now();

    try {
      logger.info(`Starting normalization for snapshot ${snapshotId}`);

      // 1. Fetch raw data
      const { data: snapshot, error: fetchError } = await supabase
        .from('snapshots')
        .select('lighthouse_json')
        .eq('id', snapshotId)
        .single();

      if (fetchError || !snapshot) throw new Error('Failed to fetch snapshot raw data');

      const raw = snapshot.lighthouse_json as any;

      // 2. Normalize Data
      const performanceMetrics = {
        lcp_ms: raw.lcp_ms || 0,
        cls: raw.cls || 0,
        ttfb_ms: raw.ttfb_ms || 0,
      };

      const seoMetrics = {
        has_h1: !!raw.has_h1,
        // Mocking others
        has_meta_description: true,
        has_title: true,
      };

      const a11yMetrics = {
        missing_alt_ratio: raw.missing_alt_ratio || 0,
      };

      // 3. Update Snapshot with normalized chunks
      const { error: updateError } = await supabase.from('snapshots').update({
        performance_metrics_json: performanceMetrics,
        seo_metrics_json: seoMetrics,
        accessibility_metrics_json: a11yMetrics,
      }).eq('id', snapshotId);

      if (updateError) throw new Error(`Failed to update normalized snapshot: ${updateError.message}`);

      // 4. Emit Event
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'SnapshotNormalized',
        event_version: 1,
        payload_json: { snapshot_id: snapshotId },
        metadata_json: {},
        correlation_id: correlationId,
      });

      logger.info('Normalization completed', { duration_ms: Date.now() - startTime });

    } catch (error: any) {
      logger.error('Analyzer failed', error, { duration_ms: Date.now() - startTime });
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'AuditFailed',
        event_version: 1,
        payload_json: { reason: 'ANALYZER_ERROR', error_message: error.message },
        metadata_json: {},
        correlation_id: correlationId,
      });
    }
  }
}
