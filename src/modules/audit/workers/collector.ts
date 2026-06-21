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

      // 2. Perform Real Collection via HTTP Fetch
      this.logger.info(`Fetching URL for performance metrics: ${targetUrl}`);
      
      const fetchStart = Date.now();
      const response = await fetch(targetUrl, { 
        method: 'GET', 
        headers: { 'User-Agent': 'PresenceOS-AuditEngine/1.0' },
        signal: AbortSignal.timeout(10000)
      }).catch(e => { throw new Error(`Fetch failed: ${e.message}`) });
      
      const ttfb_ms = Date.now() - fetchStart;
      const html = await response.text();
      
      const has_h1 = /<h1[\s>]/i.test(html);
      const has_title = /<title[\s>]/i.test(html);
      const has_meta_description = /<meta\s+name=["']description["']/i.test(html);
      
      const imgTags = html.match(/<img[^>]*>/gi) || [];
      let missingAltCount = 0;
      imgTags.forEach(img => {
        if (!/alt=["'][^"']*["']/i.test(img)) missingAltCount++;
      });
      const missing_alt_ratio = imgTags.length > 0 ? missingAltCount / imgTags.length : 0;
      
      // Calculate rudimentary metrics based on raw HTML fetch
      const actualMetrics = {
        lcp_ms: ttfb_ms + (html.length / 500), // very rough estimation
        cls: 0.05, // static fallback
        ttfb_ms: ttfb_ms,
        has_h1: has_h1,
        has_title: has_title,
        has_meta_description: has_meta_description,
        missing_alt_ratio: missing_alt_ratio,
        page_size_kb: Math.round(html.length / 1024),
        status: response.status
      };

      // 3. Create initial Snapshot Record
      const snapshotId = uuidv4();
      const { error: snapError } = await supabase.from('snapshots').insert([{
        id: snapshotId,
        domain_id: domainId,
        job_id: jobId,
        lighthouse_json: actualMetrics,
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
        payload_json: { snapshot_id: snapshotId, lighthouse_metrics: actualMetrics },
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
