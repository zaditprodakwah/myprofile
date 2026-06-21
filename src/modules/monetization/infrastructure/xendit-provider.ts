import { PaymentProvider, PaymentRequest, PaymentResult } from '../domain/payment-provider';

export class XenditProvider implements PaymentProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.xendit.co';

  constructor() {
    this.apiKey = process.env.XENDIT_SECRET_KEY || '';
  }

  public async createInvoice(req: PaymentRequest): Promise<PaymentResult> {
    if (!this.apiKey) {
      throw new Error('Xendit API Key is not configured');
    }

    const externalId = `${req.identityId}_${Date.now()}`;

    const response = await fetch(`${this.baseUrl}/v2/invoices`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: req.amount,
        description: req.description,
        invoice_duration: 86400,
        currency: 'IDR'
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Xendit API Error: ${err}`);
    }

    const data = await response.json();

    return {
      paymentUrl: data.invoice_url,
      externalId: data.external_id
    };
  }

  public validateWebhook(payload: any, signature: string): boolean {
    const xenditToken = process.env.XENDIT_WEBHOOK_TOKEN;
    if (!xenditToken) {
        console.warn('XENDIT_WEBHOOK_TOKEN is not configured');
        return false;
    }
    return signature === xenditToken;
  }
}
