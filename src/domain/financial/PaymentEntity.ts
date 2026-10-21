/**
 * Enterprise Payment, Wallet & Financial Ledger System
 * Payment Entity & Domain Specifications
 */

export type PaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'PROCESSING'
  | 'SUCCESSFUL'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'EXPIRED';

export type PaymentMethodType =
  | 'COMMERCE_ZON_PAY'
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PAYPAL'
  | 'STRIPE'
  | 'ADYEN'
  | 'RAZORPAY'
  | 'JAZZCASH'
  | 'EASYPAISA'
  | 'BANK_WIRE'
  | 'CASH_ON_DELIVERY';

export interface PaymentAttempt {
  attemptId: string;
  timestamp: string;
  gateway: string;
  status: PaymentStatus;
  responseCode?: string;
  errorMessage?: string;
  rawGatewayResponse?: Record<string, any>;
}

export interface PaymentMetadata {
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  riskScore?: number;
  idempotencyKey?: string;
  couponCodeApplied?: string;
  taxAmount?: number;
  shippingFee?: number;
}

export interface PaymentEntity {
  id: string; // pay-YYYYMMDD-XXXX
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  sellerId?: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'JPY' | 'CAD';
  paymentMethod: PaymentMethodType;
  gatewayProvider: string;
  status: PaymentStatus;
  attempts: PaymentAttempt[];
  metadata: PaymentMetadata;
  createdAt: string;
  updatedAt: string;
  settledAt?: string;
}

export class PaymentNumberGenerator {
  public static generatePaymentId(): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `pay-${dateStr}-${randomHex}`;
  }

  public static generateJournalId(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `jnl-${dateStr}-${randomHex}`;
  }
}
