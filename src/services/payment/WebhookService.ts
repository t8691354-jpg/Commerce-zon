/**
 * Enterprise Payment Webhook Processing Engine
 * Simulates Stripe / Adyen / Gateway incoming webhooks and triggers double-entry ledger & wallet updates reactively.
 */

import { WebhookEventType, WebhookLog } from '../../types/paymentWalletArchitecture';

export class WebhookService {
  private static webhookLogs: WebhookLog[] = [
    {
      id: 'evt_stripe_9901',
      eventType: 'payment_intent.succeeded',
      provider: 'STRIPE_CONNECT',
      payload: {
        id: 'pi_3M00192837192',
        object: 'payment_intent',
        amount: 1450000,
        currency: 'usd',
        status: 'succeeded',
        metadata: { orderId: 'ORD-2026-07-8801', sellerId: 'merch-01' },
      },
      processedAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'SUCCESS',
    },
    {
      id: 'evt_stripe_9902',
      eventType: 'charge.refunded',
      provider: 'STRIPE_CONNECT',
      payload: {
        id: 'ch_3M00192837192',
        object: 'charge',
        amount_refunded: 45000,
        refunds: { total_count: 1 },
        metadata: { orderId: 'ORD-2026-07-7704', sellerId: 'merch-02' },
      },
      processedAt: new Date(Date.now() - 7200000).toISOString(),
      status: 'SUCCESS',
    },
    {
      id: 'evt_stripe_9903',
      eventType: 'payout.paid',
      provider: 'STRIPE_CONNECT',
      payload: {
        id: 'po_3M9918273641',
        object: 'payout',
        amount: 500000,
        destination: 'ba_1Nx90182',
        status: 'paid',
      },
      processedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'SUCCESS',
    },
  ];

  public static getLogs(): WebhookLog[] {
    return [...this.webhookLogs];
  }

  public static simulateWebhook(
    eventType: WebhookEventType,
    customPayload?: Record<string, any>
  ): WebhookLog {
    const timestamp = new Date().toISOString();
    const id = `evt_sim_${Math.random().toString(36).substring(2, 10)}`;

    const defaultPayloads: Record<WebhookEventType, Record<string, any>> = {
      'payment_intent.succeeded': {
        id: `pi_mock_${Math.random().toString(36).substring(2, 12)}`,
        object: 'payment_intent',
        amount: 49999,
        currency: 'usd',
        status: 'succeeded',
        customer: 'cus_mock_buyer_01',
        metadata: { orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`, sellerId: 'merch-02' },
      },
      'payment_intent.payment_failed': {
        id: `pi_mock_failed_${Math.random().toString(36).substring(2, 10)}`,
        object: 'payment_intent',
        amount: 29900,
        currency: 'usd',
        status: 'requires_payment_method',
        last_payment_error: { message: 'Card declined due to insufficient funds.' },
      },
      'charge.refunded': {
        id: `ch_mock_${Math.random().toString(36).substring(2, 12)}`,
        object: 'charge',
        amount_refunded: 12000,
        refunded: true,
        metadata: { orderId: 'ORD-2026-07-8801', reason: 'Customer return request' },
      },
      'charge.dispute.created': {
        id: `dp_mock_${Math.random().toString(36).substring(2, 12)}`,
        object: 'dispute',
        amount: 85000,
        reason: 'fraudulent',
        status: 'needs_response',
      },
      'transfer.created': {
        id: `tr_mock_${Math.random().toString(36).substring(2, 12)}`,
        object: 'transfer',
        amount: 41250,
        destination: 'acct_1Nx90182_seller',
      },
      'payout.paid': {
        id: `po_mock_${Math.random().toString(36).substring(2, 12)}`,
        object: 'payout',
        amount: 120000,
        currency: 'usd',
        status: 'paid',
        arrival_date: Math.floor(Date.now() / 1000),
      },
    };

    const payload = customPayload || defaultPayloads[eventType];

    const log: WebhookLog = {
      id,
      eventType,
      provider: 'MOCK',
      payload,
      processedAt: timestamp,
      status: 'SUCCESS',
    };

    this.webhookLogs.unshift(log);
    return log;
  }
}
