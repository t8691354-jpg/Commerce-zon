/**
 * Enterprise Payment Gateway Abstraction Layer
 * Provider-Independent Payment Adapters & Interfaces
 */

import { PaymentEntity, PaymentStatus } from './PaymentEntity';

export interface PaymentGatewayRequest {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  paymentMethod: string;
  cardToken?: string;
  returnUrl?: string;
  idempotencyKey?: string;
  metadata?: Record<string, any>;
}

export interface PaymentGatewayResponse {
  success: boolean;
  status: PaymentStatus;
  providerTransactionId: string;
  gatewayRawResponse?: Record<string, any>;
  errorMessage?: string;
  errorCode?: string;
  requiresRedirect?: boolean;
  redirectUrl?: string;
}

export interface IPaymentGatewayAdapter {
  providerId: string;
  providerName: string;
  processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse>;
  authorizePayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse>;
  capturePayment(paymentId: string, amount: number): Promise<PaymentGatewayResponse>;
  refundPayment(providerTransactionId: string, amount: number, reason: string): Promise<PaymentGatewayResponse>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}
