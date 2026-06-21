import { supabase } from '@/lib/supabase';
import { IdentityEventDispatcher } from '../../identity/domain/identity-events';
import { v4 as uuidv4 } from 'uuid';

export class SubscriptionService {
  private dispatcher = new IdentityEventDispatcher();

  public async createSubscription(identityId: string, planId: string): Promise<string> {
    const subId = uuidv4();

    const { error } = await supabase.from('subscriptions').insert({
      id: subId,
      identity_id: identityId,
      plan_id: planId,
      status: 'ACTIVE'
    });

    if (error) throw new Error(`Subscription creation failed: ${error.message}`);

    await this.dispatcher.emit('SubscriptionCreated', identityId, {
      subscription_id: subId,
      identity_id: identityId,
      plan_id: planId
    }, subId);

    return subId;
  }
}
