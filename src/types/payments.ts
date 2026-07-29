export type PaymentMethodType =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'MARKETPLACE_WALLET'
  | 'BANK_TRANSFER'
  | 'CASH_ON_DELIVERY'
  | 'GIFT_CARD'
  | 'STORE_CREDIT'
  | 'BUY_NOW_PAY_LATER';

export type PaymentProviderId =
  | 'STRIPE'
  | 'PAYPAL'
  | 'PAYONEER'
  | 'ADYEN'
  | 'RAZORPAY'
  | 'PAYFAST'
  | 'JAZZCASH'
  | 'EASYPAISA'
  | 'INTERNAL_WALLET';

export type PaymentTransactionStatus =
  | 'PENDING'
  | 'AUTHORISED'
  | 'CAPTURED'
  | 'SUCCESSFUL'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'CHARGEBACK'
  | 'DISPUTED';

export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CurrencyRate {
  code: string;
  symbol: string;
  name: string;
  exchangeRateToUSD: number; // e.g. 1 USD = 0.92 EUR, 278.50 PKR
  lastUpdated: string;
}

export interface PaymentGatewayConfig {
  id: PaymentProviderId;
  name: string;
  logoUrl?: string;
  isEnabled: boolean;
  isTestMode: boolean;
  supportedMethods: PaymentMethodType[];
  transactionFeeFixed: number;
  transactionFeePct: number;
  supportedCurrencies: string[];
  apiKeyPreview?: string;
  webhookSecretConfigured: boolean;
}

export interface PaymentMethodSetting {
  type: PaymentMethodType;
  label: string;
  description: string;
  isEnabled: boolean;
  iconName: string;
  surchargePct: number;
  surchargeFixed: number;
  minOrderValue: number;
  maxOrderValue: number;
  requires3DSecure: boolean;
}

export interface TransactionRecord {
  transactionId: string;
  paymentId: string;
  orderId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  sellerId: string;
  sellerName: string;
  paymentMethod: PaymentMethodType;
  provider: PaymentProviderId;
  currency: string;
  amount: number;
  tax: number;
  shippingCost: number;
  discount: number;
  marketplaceFee: number;
  processingFee: number;
  netSellerAmount: number;
  status: PaymentTransactionStatus;
  idempotencyKey: string;
  gatewayReference: string;
  fraudRiskScore: number; // 0 - 100
  fraudRiskLevel: FraudRiskLevel;
  timestamp: string;
  notes?: string;
}

export interface SubscriptionBillingRecord {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  planName: 'PROFESSIONAL' | 'ENTERPRISE';
  monthlyFeeUSD: number;
  billingStatus: 'ACTIVE' | 'PAST_DUE' | 'GRACE_PERIOD' | 'SUSPENDED' | 'CANCELLED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  failedAttempts: number;
  gracePeriodEndsAt?: string;
  lastPaymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  autoRenew: boolean;
  paymentMethod: PaymentMethodType;
}

export interface CODRuleSetting {
  isEnabled: boolean;
  maxOrderLimitUSD: number;
  codFeeUSD: number;
  minCustomerTrustScore: number;
  restrictedCountries: string[];
  verificationOTPRequired: boolean;
}

export interface RefundTransactionRecord {
  refundId: string;
  transactionId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  refundType: 'FULL' | 'PARTIAL' | 'WALLET' | 'ORIGINAL_PAYMENT_METHOD' | 'STORE_CREDIT';
  amountUSD: number;
  reason: string;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  buyerWalletCredited: boolean;
  sellerWalletDebited: boolean;
  marketplaceFeeAdjusted: boolean;
  createdAt: string;
  processedAt?: string;
}

export interface ChargebackRecord {
  chargebackId: string;
  transactionId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  disputeAmountUSD: number;
  reasonCode: 'UNAUTHORIZED_CLAIM' | 'ITEM_NOT_RECEIVED' | 'NOT_AS_DESCRIBED' | 'DUPLICATE_CHARGE';
  status: 'OPEN' | 'UNDER_REVIEW' | 'EVIDENCE_SUBMITTED' | 'WON' | 'LOST';
  evidenceSubmitted: string[];
  openedAt: string;
  dueDate: string;
  resolutionNotes?: string;
}

export interface FraudScanRecord {
  scanId: string;
  transactionId: string;
  orderId: string;
  ipAddress: string;
  ipCountry: string;
  isProxyVPN: boolean;
  cardCountry: string;
  riskScore: number; // 0 - 100
  riskLevel: FraudRiskLevel;
  signals: string[];
  status: 'FLAGGED' | 'CLEARED' | 'BLOCKED';
  scannedAt: string;
}

export interface TaxRuleSetting {
  id: string;
  countryCode: string;
  countryName: string;
  taxName: string; // Sales Tax, VAT, GST
  standardRatePct: number;
  reducedRatePct?: number;
  vatNumberRequired: boolean;
  isEnabled: boolean;
}

export interface PaymentNotificationLog {
  id: string;
  transactionId: string;
  recipientEmail: string;
  recipientPhone?: string;
  type:
    | 'PAYMENT_SUCCESS'
    | 'PAYMENT_FAILED'
    | 'PAYMENT_PENDING'
    | 'REFUND_COMPLETED'
    | 'SUBSCRIPTION_CHARGED'
    | 'CHARGEBACK_CREATED'
    | 'WALLET_CREDITED'
    | 'WALLET_DEBITED';
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  title: string;
  body: string;
  sentAt: string;
  isRead: boolean;
}

export interface CheckoutState {
  currentStep: number; // 1 to 6
  guestEmail?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billingAddressSameAsShipping: boolean;
  billingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  shippingMethod: 'STANDARD' | 'PRIME_EXPRESS' | 'SAME_DAY' | 'INTERNATIONAL';
  shippingCostUSD: number;
  deliveryEstimateDays: string;
  paymentMethod: PaymentMethodType;
  selectedProvider: PaymentProviderId;
  cardDetails: {
    cardNumber: string;
    cardHolder: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
  bankDetails: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  giftCardCode: string;
  appliedGiftCardAmountUSD: number;
  appliedWalletAmountUSD: number;
  couponCode: string;
  appliedDiscountUSD: number;
  idempotencyKey: string;
  is3DSecureRequired: boolean;
  otpInput: string;
  isProcessing: boolean;
  completedTransaction?: TransactionRecord;
}
