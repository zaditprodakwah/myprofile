import { JobOrchestrator } from '../../audit/application/job-orchestrator';
import { supabase } from '@/lib/supabase';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';
import { v4 as uuidv4 } from 'uuid';
import { normalize_url } from '@/modules/shared/utils/url-normalizer';

export class DiscoveryEngineWorker {
  private orchestrator: JobOrchestrator;
  private maxDepth = 3;

  constructor() {
    this.orchestrator = new JobOrchestrator();
  }

  public async execute(jobId: string, correlationId: string): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'DISCOVERING_GRAPH' });
    const startTime = Date.now();

    try {
      // 1. Fetch pending crawl tasks from queue
      const { data: queueItems, error: qError } = await supabase
        .from('crawl_queue')
        .select('*')
        .eq('status', 'PENDING')
        .lte('depth', this.maxDepth)
        .limit(10);

      if (qError) throw new Error(`Failed to fetch crawl queue: ${qError.message}`);
      if (!queueItems || queueItems.length === 0) {
        logger.info('No pending crawl items found within depth limit.');
        return;
      }

      for (const item of queueItems) {
        // Mark as processing
        await supabase.from('crawl_queue').update({ status: 'PROCESSING' }).eq('id', item.id);

        logger.info(`Crawling ${item.target_url} at depth ${item.depth}`);

        // MOCK CRAWL RESULTS
        const discoveredEntities = [
          { url: 'example-partner.com', attributes: { title: 'Partner Inc', is_domain: true } }
        ];

        // Process discovered entities
        for (const ent of discoveredEntities) {
          const normUrl = normalize_url(ent.url);
          
          // Emit EntityDiscovered Event
          await this.orchestrator.emitEvent({
            job_id: jobId,
            aggregate_id: jobId,
            aggregate_type: 'JOB',
            event_name: 'EntityDiscovered',
            event_version: 1,
            payload_json: { source_url: ent.url, raw_attributes: ent.attributes },
            metadata_json: {},
            correlation_id: correlationId,
          });

          // Add to crawl queue if within depth
          if (item.depth < this.maxDepth) {
            // Upsert conceptually, handled by ON CONFLICT DO NOTHING in reality
            await supabase.from('crawl_queue').insert({
              target_url: ent.url,
              normalized_url: normUrl,
              depth: item.depth + 1,
              status: 'PENDING'
            }).select().single().then(({error}) => {
                // Ignore conflict errors due to UNIQUE constraint
            });
          }
        }

        // Mark completed
        await supabase.from('crawl_queue').update({ status: 'COMPLETED' }).eq('id', item.id);
      }

      logger.info('Discovery batch completed', { duration_ms: Date.now() - startTime });

    } catch (error: any) {
      logger.error('Discovery Engine failed', error, { duration_ms: Date.now() - startTime });
      // Depending on severity, we might emit AuditFailed or just fail the specific worker run.
    }
  }
}
