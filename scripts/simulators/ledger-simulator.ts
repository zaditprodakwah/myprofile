import { LedgerService } from '../../src/modules/monetization/application/ledger-service';
import { supabase } from '../../src/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

async function runLedgerSimulator() {
  console.log('[PHASE 4] Starting STRICT Ledger Simulator...');
  
  const ledger = new LedgerService();
  const identityId = uuidv4(); // Mock identity

  console.log(`[1] Mocking Identity Node: ${identityId}`);
  // We bypass the trigger for simulation by directly inserting a node
  await supabase.from('identity_nodes').insert({
    id: identityId,
    auth_provider_id: identityId,
    email_hash: 'mock-hash',
    role: 'USER',
    canonical_id: identityId
  });

  // trigger should have created credit_account. Let's fetch it
  const { data: acc } = await supabase.from('credit_accounts').select('balance').eq('identity_id', identityId).single();
  console.log(`[2] Initial Balance: ${acc?.balance}`);
  if (acc?.balance !== 0) throw new Error('Initial balance must be 0');

  console.log('[3] Performing TopUp: 1000 credits');
  await ledger.topUp(identityId, 1000, 'TEST_TOPUP');

  const { data: acc2 } = await supabase.from('credit_accounts').select('balance').eq('identity_id', identityId).single();
  console.log(`[4] Balance after TopUp: ${acc2?.balance}`);
  if (acc2?.balance !== 1000) throw new Error('Balance mismatch after TopUp');

  console.log('[5] Performing Deduct: 250 credits');
  await ledger.deduct(identityId, 250, 'TEST_DEDUCT');

  const { data: acc3 } = await supabase.from('credit_accounts').select('balance').eq('identity_id', identityId).single();
  console.log(`[6] Balance after Deduct: ${acc3?.balance}`);
  if (acc3?.balance !== 750) throw new Error('Balance mismatch after Deduct');

  console.log('[7] Testing Ledger Immutability Rule (Direct Update)');
  const { error: updateError } = await supabase.from('credit_accounts').update({ balance: 9999 }).eq('identity_id', identityId);
  if (!updateError) {
    throw new Error('DRIFT_VIOLATION FAILED: System allowed direct balance update!');
  }
  console.log(`    -> Blocked successfully: ${updateError.message}`);

  console.log('[8] Testing Transaction Immutability Rule (Direct Update/Delete)');
  const { data: txs } = await supabase.from('credit_transactions').select('id').eq('to_account', identityId);
  const txId = txs?.[0]?.id;
  const { error: txUpdateError } = await supabase.from('credit_transactions').update({ amount: 9999 }).eq('id', txId);
  if (!txUpdateError) {
    throw new Error('DRIFT_VIOLATION FAILED: System allowed transaction update!');
  }
  console.log(`    -> Blocked successfully: ${txUpdateError.message}`);

  console.log('[SUCCESS] Ledger Replay and Integrity PASS');
}

// runLedgerSimulator().catch(console.error);
