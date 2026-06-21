import { NextResponse } from 'next/server';
import { XenditProvider } from '@/modules/monetization/infrastructure/xendit-provider';
import { LedgerService } from '@/modules/monetization/application/ledger-service';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const signature = req.headers.get('x-callback-token') || '';

    const provider = new XenditProvider();
    if (!provider.validateWebhook(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process topup
    if (payload.status === 'PAID') {
      const ledger = new LedgerService();
      // Assuming payload.external_id contains the identity_id for this mock
      const identityId = payload.external_id; 
      const amount = payload.amount;
      
      await ledger.topUp(identityId, amount, 'XENDIT_TOPUP');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
