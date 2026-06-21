import { JobOrchestrator } from '../application/job-orchestrator';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';

export class CollectorWorker {
  private orchestrator: JobOrchestrator;
  private logger: PresenceLogger;

  constructor() {
    this.orchestrator = new JobOrchestrator();
    this.logger = new PresenceLogger({ state: 'AUDITING' });
  }

  /**
   * Mock implementation of Lighthouse execution for Phase 2.
   * In reality, this would run Lighthouse or call PageSpeed Insights API.
   */
  public async execute(jobId: string, domainId: string, targetUrl: string): Promise<void> {
    const traceId = uuidv4();
    const startTime = Date.now();
    this.logger = new PresenceLogger({ job_id: jobId, trace_id: traceId, state: 'AUDITING' });

    try {
      this.logger.info(`Starting collection for ${targetUrl}`);

      // 1. Mark Audit as Started
      const runId = await this.orchestrator.createAuditRun(jobId, 'worker_collector_v1');
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: runId,
        aggregate_type: 'AUDIT_RUN',
        event_name: 'AuditStarted',
        event_version: 1,
        payload_json: { worker_id: 'worker_collector_v1', audit_run_id: runId },
        metadata_json: {},
        correlation_id: traceId,
      });

      // 2. Perform Mock Collection (e.g., fetch Lighthouse)
      const mockLighthouseMetrics = {
        lcp_ms: 2500 + Math.random() * 2000,
        cls: 0.1 + Math.random() * 0.2,
        ttfb_ms: 300 + Math.random() * 600,
        has_h1: true,
        missing_alt_ratio: Math.random() * 0.5,
      };

      // 3. Create initial Snapshot Record
      const snapshotId = uuidv4();
      const { error: snapError } = await supabase.from('snapshots').insert([{
        id: snapshotId,
        domain_id: domainId,
        job_id: jobId,
        lighthouse_json: mockLighthouseMetrics,
        collected_at: new Date().toISOString()
      }]);

      if (snapError) throw new Error(`Failed to insert snapshot: ${snapError.message}`);

      // 4. Emit AuditCollected
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'AuditCollected',
        event_version: 1,
        payload_json: { snapshot_id: snapshotId, lighthouse_metrics: mockLighthouseMetrics },
        metadata_json: {},
        correlation_id: traceId,
      });

      const durationMs = Date.now() - startTime;
      this.logger.info('Collection completed successfully', { duration_ms: durationMs });

    } catch (error: any) {
      this.logger.error('Collector failed', error, { duration_ms: Date.now() - startTime });
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'AuditFailed',
        event_version: 1,
        payload_json: { reason: 'COLLECTOR_ERROR', error_message: error.message },
        metadata_json: {},
        correlation_id: traceId,
      });
    }
  }
}
