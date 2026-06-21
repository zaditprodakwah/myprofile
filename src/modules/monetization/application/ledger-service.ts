import { supabase } from '@/lib/supabase';
import { IdentityEventDispatcher } from '../../identity/domain/identity-events';
import { v4 as uuidv4 } from 'uuid';

export class LedgerService {
  private dispatcher = new IdentityEventDispatcher();

  private async getAccountId(identityId: string): Promise<string> {
    const { data, error } = await supabase
      .from('credit_accounts')
      .select('id')
      .eq('identity_id', identityId)
      .single();
    
    if (error || !data) {
      throw new Error(`Could not find credit account for identity: ${identityId}`);
    }
    return data.id;
  }

  public async topUp(identityId: string, amount: number, reason: string): Promise<string> {
    const txId = uuidv4();
    const accountId = await this.getAccountId(identityId);
    
    const { error } = await supabase.from('credit_transactions').insert({
      id: txId,
      to_account: accountId,
      amount: amount,
      reason: reason,
      event_id: txId
    });

    if (error) throw new Error(`TopUp failed: ${error.message}`);

    await this.dispatcher.emit('CreditsAdded', identityId, {
      transaction_id: txId,
      to_account: accountId,
      amount,
      reason
    }, txId);

    return txId;
  }

  public async deduct(identityId: string, amount: number, reason: string): Promise<string> {
    const txId = uuidv4();
    const accountId = await this.getAccountId(identityId);

    // The DB trigger handles deduction, but if it drops below 0 it should throw via constraint
    const { error } = await supabase.from('credit_transactions').insert({
      id: txId,
      from_account: accountId,
      amount: amount,
      reason: reason,
      event_id: txId
    });

    if (error) throw new Error(`Deduct failed: ${error.message}`);

    await this.dispatcher.emit('CreditsDeducted', identityId, {
      transaction_id: txId,
      from_account: accountId,
      amount,
      reason
    }, txId);

    return txId;
  }

  public async transfer(fromId: string, toId: string, amount: number, reason: string): Promise<string> {
    const txId = uuidv4();
    const fromAccountId = await this.getAccountId(fromId);
    const toAccountId = await this.getAccountId(toId);

    const { error } = await supabase.from('credit_transactions').insert({
      id: txId,
      from_account: fromAccountId,
      to_account: toAccountId,
      amount: amount,
      reason: reason,
      event_id: txId
    });

    if (error) throw new Error(`Transfer failed: ${error.message}`);

    await this.dispatcher.emit('CreditsTransferred', fromId, {
      transaction_id: txId,
      from_account: fromAccountId,
      to_account: toAccountId,
      amount,
      reason
    }, txId);

    return txId;
  }
}
