/**
 * Enterprise Payment Gateway Adapter Implementations
 * Supports CommerceZonPay, Stripe, PayPal, Adyen, Razorpay, JazzCash, COD
 */

import { IPaymentGatewayAdapter, PaymentGatewayRequest, PaymentGatewayResponse } from './IPaymentGatewayAdapter';
import { logger } from '../../infrastructure/logging/Logger';

export class CommerceZonPayAdapter implements IPaymentGatewayAdapter {
  providerId = 'COMMERCE_ZON_PAY';
  providerName = 'Commerce Zon Native Pay Engine';

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    logger.info(`[CommerceZonPayAdapter] Processing payment $${request.amount} for Order ${request.orderId}`, 'FinancialDomain');
    
    // Simulate instantaneous zero-fee internal wallet settlement
    return {
      success: true,
      status: 'SUCCESSFUL',
      providerTransactionId: `czp_tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      gatewayRawResponse: {
        settlementSpeed: 'INSTANT',
        internalLedgerPosted: true,
        feeRatePct: 0.0,
      },
    };
  }

  async authorizePayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    return this.processPayment(request);
  }

  async capturePayment(paymentId: string, amount: number): Promise<PaymentGatewayResponse> {
    return {
      success: true,
      status: 'SUCCESSFUL',
      providerTransactionId: `czp_cap_${paymentId}`,
    };
  }

  async refundPayment(providerTransactionId: string, amount: number, reason: string): Promise<PaymentGatewayResponse> {
    return {
      success: true,
      status: 'REFUNDED',
      providerTransactionId: `czp_rfd_${providerTransactionId}`,
      gatewayRawResponse: { refundedAmount: amount, reason },
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return true;
  }
}

export class StripeGatewayAdapter implements IPaymentGatewayAdapter {
  providerId = 'STRIPE';
  providerName = 'Stripe Global Payments';

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    logger.info(`[StripeAdapter] Creating PaymentIntent $${request.amount} ${request.currency}`, 'FinancialDomain');
    
    // Simulate Stripe payment processing
    const isSuccess = request.amount < 50000; // Mock risk rule
    return {
      success: isSuccess,
      status: isSuccess ? 'SUCCESSFUL' : 'FAILED',
      providerTransactionId: `pi_stripe_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      gatewayRawResponse: {
        object: 'payment_intent',
        status: isSuccess ? 'succeeded' : 'requires_payment_method',
        client_secret: `pi_secret_mock_${Date.now()}`,
      },
      errorMessage: isSuccess ? undefined : 'Card declined by issuing bank (Mock Test Flag)',
    };
  }

  async authorizePayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    return {
      success: true,
      status: 'AUTHORIZED',
      providerTransactionId: `pi_auth_stripe_${Date.now()}`,
    };
  }

  async capturePayment(paymentId: string, amount: number): Promise<PaymentGatewayResponse> {
    return {
      success: true,
      status: 'SUCCESSFUL',
      providerTransactionId: `pi_cap_stripe_${paymentId}`,
    };
  }

  async refundPayment(providerTransactionId: string, amount: number, reason: string): Promise<PaymentGatewayResponse> {
    return {
      success: true,
      status: 'REFUNDED',
      providerTransactionId: `re_stripe_${Date.now()}`,
      gatewayRawResponse: { amount_refunded: amount * 100, currency: 'usd' },
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return Boolean(signature && signature.length > 5);
  }
}

export class PayPalGatewayAdapter implements IPaymentGatewayAdapter {
  providerId = 'PAYPAL';
  providerName = 'PayPal Commerce Platform';

  async processPayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    logger.info(`[PayPalAdapter] Executing PayPal Order $${request.amount}`, 'FinancialDomain');
    return {
      success: true,
      status: 'SUCCESSFUL',
      providerTransactionId: `pp_ord_${Date.now()}`,
      gatewayRawResponse: { paypal_order_status: 'APPROVED', payer_email: request.customerEmail },
    };
  }

  async authorizePayment(request: PaymentGatewayRequest): Promise<PaymentGatewayResponse> {
    return this.processPayment(request);
  }

  async capturePayment(paymentId: string, amount: number): Promise<PaymentGatewayResponse> {
    return { success: true, status: 'SUCCESSFUL', providerTransactionId: `pp_cap_${paymentId}` };
  }

  async refundPayment(providerTransactionId: string, amount: number, reason: string): Promise<PaymentGatewayResponse> {
    return { success: true, status: 'REFUNDED', providerTransactionId: `pp_rf_${providerTransactionId}` };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    return true;
  }
}

export class PaymentGatewayFactory {
  private static adapters: Map<string, IPaymentGatewayAdapter> = new Map([
    ['COMMERCE_ZON_PAY', new CommerceZonPayAdapter()],
    ['STRIPE', new StripeGatewayAdapter()],
    ['PAYPAL', new PayPalGatewayAdapter()],
  ]);

  public static getAdapter(providerId: string): IPaymentGatewayAdapter {
    const adapter = this.adapters.get(providerId.toUpperCase());
    if (!adapter) {
      // Fallback to CommerceZonPay
      return new CommerceZonPayAdapter();
    }
    return adapter;
  }

  public static registerAdapter(adapter: IPaymentGatewayAdapter): void {
    this.adapters.set(adapter.providerId.toUpperCase(), adapter);
  }
}
