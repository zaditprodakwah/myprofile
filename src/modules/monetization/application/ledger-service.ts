import { supabase } from '@/lib/supabase';
import { IdentityEventDispatcher } from '../../identity/domain/identity-events';
import { v4 as uuidv4 } from 'uuid';

export class LedgerService {
  private dispatcher = new IdentityEventDispatcher();

  public async topUp(identityId: string, amount: number, reason: string): Promise<string> {
    const txId = uuidv4();
    
    const { error } = await supabase.from('credit_transactions').insert({
      id: txId,
      to_account: identityId, // identityId === accountId
      amount: amount,
      reason: reason,
      event_id: txId
    });

    if (error) throw new Error(`TopUp failed: ${error.message}`);

    await this.dispatcher.emit('CreditsAdded', identityId, {
      transaction_id: txId,
      to_account: identityId,
      amount,
      reason
    }, txId);

    return txId;
  }

  public async deduct(identityId: string, amount: number, reason: string): Promise<string> {
    const txId = uuidv4();

    // The DB trigger handles deduction, but if it drops below 0 it should throw via constraint
    const { error } = await supabase.from('credit_transactions').insert({
      id: txId,
      from_account: identityId,
      amount: amount,
      reason: reason,
      event_id: txId
    });

    if (error) throw new Error(`Deduct failed: ${error.message}`);

    await this.dispatcher.emit('CreditsDeducted', identityId, {
      transaction_id: txId,
      from_account: identityId,
      amount,
      reason
    }, txId);

    return txId;
  }

  public async transfer(fromId: string, toId: string, amount: number, reason: string): Promise<string> {
    const txId = uuidv4();

    const { error } = await supabase.from('credit_transactions').insert({
      id: txId,
      from_account: fromId,
      to_account: toId,
      amount: amount,
      reason: reason,
      event_id: txId
    });

    if (error) throw new Error(`Transfer failed: ${error.message}`);

    await this.dispatcher.emit('CreditsTransferred', fromId, {
      transaction_id: txId,
      from_account: fromId,
      to_account: toId,
      amount,
      reason
    }, txId);

    return txId;
  }
}
