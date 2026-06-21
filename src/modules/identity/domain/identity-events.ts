import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { EventNames, EventPayloadMap } from '../../audit/events/contracts';

export class IdentityEventDispatcher {
  /**
   * Appends an event to the job_events store, guaranteeing replayability.
   */
  public async emit<K extends keyof EventPayloadMap>(
    eventName: K,
    aggregateId: string,
    payload: EventPayloadMap[K],
    traceId?: string
  ): Promise<void> {
    const eventId = uuidv4();
    // Default system job_id if not linked to an audit job
    const jobId = '00000000-0000-0000-0000-000000000000'; 
    
    const { error } = await supabase.from('job_events').insert({
      id: eventId,
      job_id: jobId,
      event_name: eventName,
      payload_json: payload,
      aggregate_id: aggregateId,
      correlation_id: traceId || eventId
    });

    if (error) {
      throw new Error(`Failed to emit identity event [${eventName}]: ${error.message}`);
    }
  }
}
