import { PaymentProvider, PaymentRequest, PaymentResult } from '../domain/payment-provider';

export class XenditProvider implements PaymentProvider {
  public async createInvoice(req: PaymentRequest): Promise<PaymentResult> {
    // Stub for implementation lock: would call Xendit API here
    return {
      paymentUrl: 'https://checkout.xendit.co/web/mock',
      externalId: 'mock-ext-id'
    };
  }

  public validateWebhook(payload: any, signature: string): boolean {
    // Stub for implementation lock
    return true;
  }
}
