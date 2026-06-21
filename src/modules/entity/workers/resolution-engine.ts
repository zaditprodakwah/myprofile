import { JobOrchestrator } from '../../audit/application/job-orchestrator';
import { supabase } from '@/lib/supabase';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';
import { v4 as uuidv4 } from 'uuid';

export class ResolutionEngineWorker {
  private orchestrator: JobOrchestrator;

  constructor() {
    this.orchestrator = new JobOrchestrator();
  }

  // Very naive deterministic normalization
  private normalizeDomain(domain: string): string {
    return domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
  }

  public async execute(jobId: string, correlationId: string, sourceUrl: string, rawAttributes: any): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'RESOLVING_ENTITY' });
    const startTime = Date.now();

    try {
      logger.info(`Starting entity resolution for ${sourceUrl}`);

      const normDomain = this.normalizeDomain(sourceUrl);

      // 1. Check if canonical entity already exists based on deterministic domain match
      const { data: existingEntities, error: searchError } = await supabase
        .from('entity_nodes')
        .select('*')
        .eq('entity_type', 'DOMAIN')
        .contains('attributes', { normalized_domain: normDomain });

      if (searchError) throw new Error(`Search error: ${searchError.message}`);

      let canonicalId: string;
      let originalId = uuidv4();
      let ruleId = 'RES_EXACT_DOMAIN_01';

      if (existingEntities && existingEntities.length > 0) {
        // Deterministic resolution: pick the oldest one as canonical
        existingEntities.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        const canonicalEntity = existingEntities[0];
        
        // Use its id if it is the root canonical, or follow its pointer
        canonicalId = canonicalEntity.canonical_id || canonicalEntity.id;
        ruleId = 'RES_EXACT_DOMAIN_MATCH';
      } else {
        // No match found, it forms a new canonical root
        canonicalId = originalId;
        ruleId = 'RES_NEW_CANONICAL';
      }

      // 2. Emit EntityResolved Event
      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'EntityResolved',
        event_version: 1,
        payload_json: {
          original_id: originalId,
          canonical_id: canonicalId,
          rule_id: ruleId,
          attributes: { ...rawAttributes, normalized_domain: normDomain }
        },
        metadata_json: {},
        correlation_id: correlationId,
      });

      logger.info('Entity resolution completed', { duration_ms: Date.now() - startTime });

    } catch (error: any) {
      logger.error('Resolution Engine failed', error, { duration_ms: Date.now() - startTime });
    }
  }
}
