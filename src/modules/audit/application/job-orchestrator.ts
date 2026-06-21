import { AuditState, AuditStateMachine } from '../domain/state-machine';
import { BaseEvent } from '../events/contracts';
import { supabase } from '@/lib/supabase';

/**
 * JobOrchestrator manages the lifecycle of a Job, which is distinct from an AuditRun.
 * It enforces that state changes only happen via events.
 */
export class JobOrchestrator {
  
  /**
   * Appends an event to the Event Store and triggers projection update.
   */
  public async emitEvent(event: Omit<BaseEvent, 'id' | 'occurred_at'>): Promise<void> {
    const { error } = await supabase.from('job_events').insert([
      {
        job_id: event.job_id,
        aggregate_id: event.aggregate_id,
        aggregate_type: event.aggregate_type,
        event_name: event.event_name,
        event_version: event.event_version,
        payload_json: event.payload_json,
        metadata_json: event.metadata_json,
        correlation_id: event.correlation_id,
        causation_id: event.causation_id,
      }
    ]);

    if (error) {
      throw new Error(`Failed to emit event ${event.event_name}: ${error.message}`);
    }

    // After emitting, project the new state to the jobs table.
    // In a real CQRS system this might be handled by a read-model projector.
    await this.projectStateFromEvents(event.job_id);
  }

  /**
   * Reads all events for a job to determine its current state.
   */
  private async projectStateFromEvents(jobId: string): Promise<void> {
    const { data: events, error } = await supabase
      .from('job_events')
      .select('event_name')
      .eq('job_id', jobId)
      .order('occurred_at', { ascending: true });

    if (error || !events || events.length === 0) return;

    let currentState = AuditState.QUEUED;
    const stateMachine = new AuditStateMachine(currentState);

    for (const evt of events) {
      const nextState = this.mapEventToState(evt.event_name);
      if (nextState) {
        try {
          if (stateMachine.canTransitionTo(nextState)) {
             stateMachine.transitionTo(nextState);
          } else if (nextState === AuditState.FAILED) {
             stateMachine.fail();
          }
        } catch (e) {
          console.warn(`Invalid state transition projected for job ${jobId}`, e);
        }
      }
    }

    // Update the projected status on the job record
    await supabase.from('jobs').update({ status: stateMachine.getState(), updated_at: new Date().toISOString() }).eq('id', jobId);
  }

  private mapEventToState(eventName: string): AuditState | null {
    switch (eventName) {
      case 'AuditRequested': return AuditState.QUEUED;
      case 'AuditValidated': return AuditState.VALIDATING; // Translates internally to ready for discovery
      case 'DiscoveryCompleted': return AuditState.DISCOVERING;
      case 'AuditStarted': return AuditState.AUDITING;
      case 'AuditCollected': return AuditState.COLLECTING;
      case 'SnapshotNormalized': return AuditState.NORMALIZING;
      case 'ScoreComputed': return AuditState.SCORING;
      case 'SnapshotCreated': return AuditState.PERSISTING;
      case 'RecommendationGenerated': return AuditState.RECOMMENDING; // Mapped to RECOMMENDING for Phase 2
      case 'DirectoryPublished': return AuditState.PUBLISHING;
      case 'AuditCompleted': return AuditState.COMPLETED;
      case 'AuditFailed': return AuditState.FAILED;
      default: return null;
    }
  }

  /**
   * Starts a new AuditRun (execution instance) for a Job.
   * Useful for retries.
   */
  public async createAuditRun(jobId: string, workerId: string): Promise<string> {
    const { data, error } = await supabase.from('audit_runs').insert([
      {
        job_id: jobId,
        worker_id: workerId,
        status: 'STARTED',
      }
    ]).select('id').single();

    if (error || !data) {
      throw new Error(`Failed to create AuditRun for Job ${jobId}: ${error?.message}`);
    }

    return data.id;
  }
}
