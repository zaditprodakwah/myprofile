import { JobOrchestrator } from '../../audit/application/job-orchestrator';
import { supabase } from '@/lib/supabase';
import { PresenceLogger } from '@/modules/shared/infrastructure/logger';
import * as crypto from 'crypto';

export class GraphConstructionPipeline {
  private orchestrator: JobOrchestrator;

  constructor() {
    this.orchestrator = new JobOrchestrator();
  }

  private computeHash(fromId: string, toId: string, relType: string, ruleId: string, confidence: number, sequence: number): string {
    const data = `${fromId}|${toId}|${relType}|${ruleId}|${confidence}|${sequence}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  public async createNode(jobId: string, correlationId: string, id: string, canonicalId: string, type: string, attributes: any): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'MAPPING_RELATIONSHIPS' });
    try {
      const isCanonical = (id === canonicalId);
      
      const { error } = await supabase.from('entity_nodes').insert({
        id: id,
        canonical_id: isCanonical ? null : canonicalId, // Enforce constraint: NULL or self
        entity_type: type,
        attributes: attributes
      });
      
      if (error) {
        // If unique constraint violation or something else
        logger.warn(`Failed to insert node ${id}: ${error.message}`);
      }

      // If resolving to an existing canonical, write audit trail
      if (!isCanonical) {
        await supabase.from('entity_merge_history').insert({
          from_entity_id: id,
          to_canonical_id: canonicalId,
          rule_id: 'NODE_CREATION_MERGE'
        });
      }

    } catch (err: any) {
      logger.error('Node creation failed', err);
    }
  }

  public async createEdge(jobId: string, correlationId: string, fromId: string, toId: string, relType: string, confidence: number, ruleId: string, sequence: number): Promise<void> {
    const logger = new PresenceLogger({ job_id: jobId, trace_id: correlationId, state: 'MAPPING_RELATIONSHIPS' });
    
    try {
      const graphHash = this.computeHash(fromId, toId, relType, ruleId, confidence, sequence);

      const { error } = await supabase.from('entity_edges').insert({
        from_entity_id: fromId,
        to_entity_id: toId,
        relationship_type: relType,
        confidence_score: confidence,
        rule_id: ruleId,
        graph_hash: graphHash
      });

      if (error) {
        logger.warn(`Failed to insert edge: ${error.message}`);
        return;
      }

      await this.orchestrator.emitEvent({
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'JOB',
        event_name: 'GraphUpdated',
        event_version: 1,
        payload_json: {
          entity_id: fromId,
          changes: [{ type: 'EDGE_CREATED', to_id: toId, rel_type: relType, hash: graphHash }]
        },
        metadata_json: {},
        correlation_id: correlationId,
      });

    } catch (err: any) {
      logger.error('Edge creation failed', err);
    }
  }
}
