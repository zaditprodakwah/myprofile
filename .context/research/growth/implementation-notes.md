# Implementation Notes: PRODUCT-LED GROWTH (PLG)

Blueprints for payment gateway integrations.

## Xendit Invoice Generation Route (SIN1 Serverless)

```typescript
import Xendit from 'xendit-node';

const xenditClient = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY! });

export async function createTopUpInvoice(identityId: string, amount: number, email: string) {
  const { Invoice } = xenditClient;
  const invoiceInstance = new Invoice({});
  
  const result = await invoiceInstance.createInvoice({
    externalID: `topup-${identityId}-${Date.now()}`,
    amount: amount,
    payerEmail: email,
    description: "Credit top-up for Digital Intelligence Platform",
    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/xendit`
  });
  
  return result.invoiceURL;
}
```

## Action Plan
- Setup Xendit invoice endpoints under `src/app/api/payment/topup`.
- Connect credit ledgers to invoice updates.
