import { supabaseServer as supabase } from '@/lib/supabase-server';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';

export class DirectorySyncWorker {
  public async execute(jobId: string, domainId: string, snapshotId: string, correlationId: string): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'DIRECTORY_SYNC' });
    const startTime = Date.now();

    try {
      logger.info(`Starting directory sync for domain ${domainId} and snapshot ${snapshotId}`);

      // 1. Fetch snapshot data
      const { data: snapshot, error: snapshotError } = await supabase
        .from('snapshots')
        .select('*')
        .eq('id', snapshotId)
        .single();

      if (snapshotError || !snapshot) {
        throw new Error(`Failed to fetch snapshot for sync: ${snapshotError?.message}`);
      }

      // 2. Fetch score data
      const { data: score, error: scoreError } = await supabase
        .from('scores')
        .select('*')
        .eq('snapshot_id', snapshotId)
        .single();

      if (scoreError || !score) {
        throw new Error(`Failed to fetch scores for sync: ${scoreError?.message}`);
      }

      // 3. Fetch domain details to get entity_id and hostname
      const { data: domain, error: domainError } = await supabase
        .from('domains')
        .select('*')
        .eq('id', domainId)
        .single();

      if (domainError || !domain) {
        throw new Error(`Failed to fetch domain for sync: ${domainError?.message}`);
      }

      const hostname = domain.domain_name;
      const entityId = domain.entity_id;

      const martech = snapshot.martech_stack_json || {};
      const security = snapshot.security_headers_json || {};
      const summary = snapshot.ai_narrative_summary || '';
      const trustScore = score.composite_score || 50;

      // 4. Update Organizations table if entity_id is available
      if (entityId) {
        const { error: orgError } = await supabase
          .from('organizations')
          .update({
            trust_score: trustScore,
            martech_detected_json: martech,
            security_status_json: security,
            business_nature_summary: summary,
            last_audited_at: new Date().toISOString(),
          })
          .eq('entity_id', entityId);

        if (orgError) {
          logger.warn(`Failed to update organization for entity ${entityId}: ${orgError.message}`);
        } else {
          logger.info(`Successfully updated organization for entity ${entityId}`);
        }
      }

      // 5. Update directory_entities table matching by website_url
      const { data: directoryEntities, error: dirSelectError } = await supabase
        .from('directory_entities')
        .select('id, website_url')
        .or(`website_url.ilike.%${hostname}%`);

      if (dirSelectError) {
        logger.warn(`Failed to search directory_entities: ${dirSelectError.message}`);
      } else if (directoryEntities && directoryEntities.length > 0) {
        for (const entity of directoryEntities) {
          const { error: dirUpdateError } = await supabase
            .from('directory_entities')
            .update({
              martech_detected_json: martech,
              security_status_json: security,
              business_nature_summary: summary,
              last_audited_at: new Date().toISOString(),
              trust_score: trustScore,
            })
            .eq('id', entity.id);

          if (dirUpdateError) {
            logger.warn(`Failed to update directory_entity ${entity.id}: ${dirUpdateError.message}`);
          } else {
            logger.info(`Successfully updated directory_entity ${entity.id} (matched on website_url)`);
          }
        }
      } else {
        logger.info(`No matching directory_entities found for hostname: ${hostname}`);
      }

      logger.info(`Directory sync completed in ${Date.now() - startTime}ms`);
    } catch (error: any) {
      logger.error('Directory sync worker failed', error);
    }
  }
}
