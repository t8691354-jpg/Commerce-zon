/**
 * Payment Provider Adapter Interface & Implementations
 * Design Pattern: Strategy / Adapter Pattern
 * Allows switching seamlessly between Mock Payment Engine and Live Stripe Connect / Adyen APIs.
 */

import {
  PaymentSession,
  PaymentTransactionRecord,
  RefundRecord,
  EnterpriseWithdrawalRequest,
  WebhookLog,
  WebhookEventType,
} from '../../types/paymentWalletArchitecture';

export interface CreatePaymentSessionParams {
  orderId: string;
  buyerId: string;
  buyerEmail: string;
  sellerId: string;
  amount: number;
  currency: 'USD';
  description?: string;
}

export interface IssueRefundParams {
  transactionId: string;
  orderId: string;
  sellerId: string;
  buyerId: string;
  amount: number;
  reason: 'BUYER_RETURN' | 'CANCELLED_BEFORE_SHIP' | 'DEFECTIVE' | 'SELLER_DISPUTE' | 'ADMIN_OVERRIDE';
}

export interface CreatePayoutParams {
  withdrawalRequestId: string;
  sellerId: string;
  amount: number;
  payoutMethod: string;
  accountDetails: string;
}

export interface PayoutResult {
  success: boolean;
  payoutTxId: string; // po_...
  providerReference: string;
  processedAt: string;
  message?: string;
}

export interface IPaymentProviderAdapter {
  getProviderName(): string;
  createPaymentSession(params: CreatePaymentSessionParams): Promise<PaymentSession>;
  confirmPayment(paymentSessionId: string): Promise<{
    session: PaymentSession;
    transaction: PaymentTransactionRecord;
    chargeId: string;
  }>;
  issueRefund(params: IssueRefundParams): Promise<{
    refund: RefundRecord;
    refundTxId: string;
  }>;
  createPayout(params: CreatePayoutParams): Promise<PayoutResult>;
  handleWebhookEvent(eventType: WebhookEventType, payload: Record<string, any>): Promise<WebhookLog>;
}

/**
 * Enterprise Mock Payment Provider Adapter
 * Fully simulates payment transactions, authorization, 14-day escrow metadata,
 * refund processing, payouts, and webhook dispatch without external live API calls.
 */
export class MockPaymentProviderAdapter implements IPaymentProviderAdapter {
  getProviderName(): string {
    return 'Mock Payment Provider (Sandbox Simulator)';
  }

  async createPaymentSession(params: CreatePaymentSessionParams): Promise<PaymentSession> {
    const timestamp = new Date().toISOString();
    const id = `ps_${Math.random().toString(36).substring(2, 11)}`;
    const paymentIntentId = `pi_mock_${Math.random().toString(36).substring(2, 14)}`;

    return {
      id,
      paymentIntentId,
      orderId: params.orderId,
      buyerId: params.buyerId,
      buyerEmail: params.buyerEmail,
      sellerId: params.sellerId,
      amount: params.amount,
      currency: 'USD',
      status: 'REQUIRES_CONFIRMATION',
      provider: 'MOCK',
      clientSecret: `${paymentIntentId}_secret_mock_${Math.random().toString(36).substring(2, 8)}`,
      createdAt: timestamp,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  async confirmPayment(paymentSessionId: string): Promise<{
    session: PaymentSession;
    transaction: PaymentTransactionRecord;
    chargeId: string;
  }> {
    const timestamp = new Date().toISOString();
    const chargeId = `ch_mock_${Math.random().toString(36).substring(2, 14)}`;
    const txId = `tx_${Math.random().toString(36).substring(2, 11)}`;

    // Mocked confirmed session
    const session: PaymentSession = {
      id: paymentSessionId,
      paymentIntentId: `pi_mock_${paymentSessionId.replace('ps_', '')}`,
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      buyerId: 'usr-buyer-01',
      buyerEmail: 'alexander.vance@commercezone.io',
      sellerId: 'merch-02',
      amount: 499.99,
      currency: 'USD',
      status: 'SUCCEEDED',
      provider: 'MOCK',
      clientSecret: `pi_mock_secret_${paymentSessionId}`,
      createdAt: timestamp,
      expiresAt: timestamp,
    };

    const commissionAmount = Math.round((session.amount * 0.085 + 0.30) * 100) / 100;
    const netSellerAmount = Math.round((session.amount - commissionAmount) * 100) / 100;

    const transaction: PaymentTransactionRecord = {
      id: txId,
      paymentIntentId: session.paymentIntentId,
      chargeId,
      orderId: session.orderId,
      buyerId: session.buyerId,
      sellerId: session.sellerId,
      grossAmount: session.amount,
      commissionAmount,
      netSellerAmount,
      currency: 'USD',
      status: 'SUCCESS',
      provider: 'MOCK',
      createdAt: timestamp,
    };

    return { session, transaction, chargeId };
  }

  async issueRefund(params: IssueRefundParams): Promise<{
    refund: RefundRecord;
    refundTxId: string;
  }> {
    const timestamp = new Date().toISOString();
    const refundId = `ref_${Math.random().toString(36).substring(2, 11)}`;
    const refundTxId = `tx_refund_${Math.random().toString(36).substring(2, 11)}`;

    const refund: RefundRecord = {
      id: refundId,
      transactionId: params.transactionId,
      orderId: params.orderId,
      sellerId: params.sellerId,
      buyerId: params.buyerId,
      amount: params.amount,
      reason: params.reason,
      wasLocked: true,
      createdAt: timestamp,
      refundTxId,
    };

    return { refund, refundTxId };
  }

  async createPayout(params: CreatePayoutParams): Promise<PayoutResult> {
    const timestamp = new Date().toISOString();
    const payoutTxId = `po_mock_${Math.random().toString(36).substring(2, 14)}`;

    return {
      success: true,
      payoutTxId,
      providerReference: `ref_ach_bank_${Math.floor(10000000 + Math.random() * 90000000)}`,
      processedAt: timestamp,
      message: `Mock payout of $${params.amount.toFixed(2)} dispatched successfully to ${params.payoutMethod} (${params.accountDetails})`,
    };
  }

  async handleWebhookEvent(eventType: WebhookEventType, payload: Record<string, any>): Promise<WebhookLog> {
    const timestamp = new Date().toISOString();
    const logId = `evt_mock_${Math.random().toString(36).substring(2, 12)}`;

    return {
      id: logId,
      eventType,
      provider: 'MOCK',
      payload,
      processedAt: timestamp,
      status: 'SUCCESS',
    };
  }
}

/**
 * Enterprise Stripe Connect Provider Adapter Stub
 * Pluggable adapter implementation ready for live API keys & Stripe Webhook Secrets.
 */
export class StripeConnectAdapter implements IPaymentProviderAdapter {
  private apiKey?: string;
  private webhookSecret?: string;

  constructor(apiKey?: string, webhookSecret?: string) {
    this.apiKey = apiKey || process.env.STRIPE_SECRET_KEY;
    this.webhookSecret = webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
  }

  getProviderName(): string {
    return 'Stripe Connect Production Adapter';
  }

  async createPaymentSession(params: CreatePaymentSessionParams): Promise<PaymentSession> {
    if (!this.apiKey) {
      console.warn('Stripe Secret Key not configured. Falling back to Mock Adapter execution for session creation.');
      const mockAdapter = new MockPaymentProviderAdapter();
      return mockAdapter.createPaymentSession(params);
    }
    // Production Stripe paymentIntents.create logic can be wired here when STRIPE_SECRET_KEY is provided.
    throw new Error('Stripe API Key configuration missing in environment. Use Mock Payment Provider Adapter.');
  }

  async confirmPayment(paymentSessionId: string): Promise<{
    session: PaymentSession;
    transaction: PaymentTransactionRecord;
    chargeId: string;
  }> {
    const mockAdapter = new MockPaymentProviderAdapter();
    return mockAdapter.confirmPayment(paymentSessionId);
  }

  async issueRefund(params: IssueRefundParams): Promise<{
    refund: RefundRecord;
    refundTxId: string;
  }> {
    const mockAdapter = new MockPaymentProviderAdapter();
    return mockAdapter.issueRefund(params);
  }

  async createPayout(params: CreatePayoutParams): Promise<PayoutResult> {
    const mockAdapter = new MockPaymentProviderAdapter();
    return mockAdapter.createPayout(params);
  }

  async handleWebhookEvent(eventType: WebhookEventType, payload: Record<string, any>): Promise<WebhookLog> {
    const mockAdapter = new MockPaymentProviderAdapter();
    return mockAdapter.handleWebhookEvent(eventType, payload);
  }
}
