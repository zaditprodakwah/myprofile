export interface PaymentRequest {
  identityId: string;
  amount: number;
  description: string;
}

export interface PaymentResult {
  paymentUrl: string;
  externalId: string;
}

export interface PaymentProvider {
  createInvoice(req: PaymentRequest): Promise<PaymentResult>;
  validateWebhook(payload: any, signature: string): boolean;
}
