/**
 * Enterprise AI Marketplace Domain Models
 * Clean Architecture & Domain-Driven Design (DDD) Types
 */

export type EntityId = string;

export interface Money {
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type MerchantTier = 'standard' | 'verified' | 'enterprise' | 'flagship';

export interface Merchant {
  id: EntityId;
  name: string;
  code: string;
  tier: MerchantTier;
  rating: number;
  reviewCount: number;
  logoUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export type ProductCategory =
  | 'electronics'
  | 'computing'
  | 'fashion'
  | 'industrial'
  | 'home'
  | 'automotive'
  | 'robotics';

export interface WarehouseStock {
  warehouseId: EntityId;
  warehouseName: string;
  code: string;
  quantity: number;
  reserved: number;
  reorderLevel: number;
}

export interface ProductVariant {
  id: EntityId;
  sku: string;
  name: string;
  barcode?: string;
  attributes: Record<string, string>; // size, color, material, storage, ram, style
  price: Money;
  salePrice?: Money;
  stock: number;
  weightKg?: number;
  image?: string;
}

export type ProductApprovalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'ARCHIVED';

export interface ProductPricing {
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  wholesalePrice?: number;
  bulkPricing?: { minQty: number; price: number }[];
  flashSalePrice?: number;
  flashSaleEnd?: string;
}

export interface ProductInventoryDetails {
  liveStock: number;
  reservedStock: number;
  incomingStock: number;
  reorderLevel: number;
  batchNumber?: string;
  serialNumbers?: string[];
}

export interface ProductMedia {
  images: string[];
  videoUrl?: string;
  view360Url?: string;
}

export interface ProductSEO {
  title: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
}

export interface ProductAnalytics {
  views: number;
  clicks: number;
  salesCount: number;
  conversionRatePct: number;
  revenue: number;
  returnRatePct: number;
  wishlistCount: number;
  cartAdditionsCount: number;
  searchRank: number;
}

export interface Product {
  id: EntityId;
  title: string;
  slug: string;
  sku: string;
  barcode?: string;
  gtin?: string;
  upc?: string;
  isbn?: string;
  brand?: string;
  manufacturer?: string;
  modelNumber?: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  subcategory?: string;
  features?: string[];
  technicalSpecs?: Record<string, string>;
  warranty?: string;
  returnPolicy?: string;
  countryOfOrigin?: string;
  tags: string[];
  price: Money;
  pricingDetails?: ProductPricing;
  merchant: Merchant;
  images: string[];
  mediaDetails?: ProductMedia;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  warehouseStock: WarehouseStock[];
  inventoryDetails?: ProductInventoryDetails;
  totalStock: number;
  approvalStatus?: ProductApprovalStatus;
  seoDetails?: ProductSEO;
  analyticsDetails?: ProductAnalytics;
  aiSuggestedPrice?: Money;
  aiDemandScore?: number; // 0-100
  aiTagKeywords?: string[];
  isFlaggedForModeration?: boolean;
  flagReason?: string;
  isArchived: boolean;
  shippingWeightKg?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewItem {
  id: EntityId;
  productId: EntityId;
  buyerName: string;
  rating: number;
  title: string;
  comment: string;
  mediaUrls?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  sellerReply?: {
    merchantName: string;
    comment: string;
    repliedAt: string;
  };
  createdAt: string;
}

export interface ProductQuestionAnswer {
  id: EntityId;
  productId: EntityId;
  buyerName: string;
  question: string;
  upvotes: number;
  answers: {
    id: string;
    responderName: string;
    responderRole: 'SELLER' | 'ADMIN' | 'BUYER';
    answer: string;
    upvotes: number;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface CategoryNode {
  id: EntityId;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
  collections: string[];
  productCount: number;
  isHidden: boolean;
  displayOrder: number;
}

export interface Warehouse {
  id: EntityId;
  code: string;
  name: string;
  location: Location;
  capacityUnits: number;
  utilizedUnits: number;
  status: 'active' | 'maintenance' | 'full';
  fulfillmentSpeedDays: number;
}

export type OrderStatus =
  | 'draft'
  | 'placed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'disputed';

export interface OrderItem {
  id: EntityId;
  productId: EntityId;
  productTitle: string;
  sku: string;
  merchantId: EntityId;
  merchantName: string;
  warehouseId: EntityId;
  unitPrice: Money;
  quantity: number;
  totalPrice: Money;
}

export interface Order {
  id: EntityId;
  orderNumber: string;
  customerId: EntityId; // Temporary mock user id
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: Money;
  shippingFee: Money;
  taxFee: Money;
  total: Money;
  status: OrderStatus;
  shippingAddress: Location;
  fraudRiskScore?: number; // 0-100 score from AI Fraud Engine
  createdAt: string;
  updatedAt: string;
}

export interface DomainEvent<T = unknown> {
  id: EntityId;
  eventType: string;
  domain: 'CATALOG' | 'INVENTORY' | 'ORDER' | 'AI_SERVICE' | 'SECURITY' | 'PAYMENT' | 'LOGISTICS' | 'COMMUNICATION';
  aggregateId: string;
  timestamp: string;
  payload: T;
  actor: {
    type: 'SYSTEM' | 'MOCK_USER' | 'MOCK_MERCHANT' | 'AI_ENGINE';
    id: string;
  };
}

export interface AuditLog {
  id: EntityId;
  timestamp: string;
  actorType: 'SYSTEM' | 'MOCK_USER' | 'MOCK_MERCHANT' | 'AI_ENGINE';
  actorId: string;
  action: string;
  domain: 'CATALOG' | 'INVENTORY' | 'ORDER' | 'AI_SERVICE' | 'SECURITY' | 'PAYMENT' | 'LOGISTICS' | 'COMMUNICATION';
  details: string;
  metadata?: Record<string, unknown>;
}

export interface AIOperationLog {
  id: EntityId;
  timestamp: string;
  service: 'AI_SEARCH' | 'AI_RECOMMENDATION' | 'AI_GENERATOR' | 'AI_FRAUD_CHECK' | 'AI_PRICE_OPTIMIZER';
  promptTokens?: number;
  responseTokens?: number;
  latencyMs: number;
  status: 'success' | 'fallback' | 'error';
  summary: string;
}

// Master Roadmap Governance Types
export type TaskStatus = 'completed' | 'in_progress' | 'pending';

export interface MasterTask {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TaskStatus;
  completedAt?: string;
}

export interface MasterMilestone {
  id: string;
  code: string;
  title: string;
  description: string;
  tasks: MasterTask[];
}

export interface MasterPhase {
  id: string;
  code: string;
  title: string;
  description: string;
  milestones: MasterMilestone[];
}

export interface ProductSearchFilter {
  query?: string;
  category?: ProductCategory | 'all';
  merchantId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  aiSemanticSearch?: boolean;
}

export type WalletType = 'BUYER' | 'SELLER' | 'AFFILIATE' | 'ADMIN';

export type TransactionType =
  | 'PURCHASE'
  | 'REFUND'
  | 'WALLET_PAYMENT'
  | 'CASHBACK_CREDIT'
  | 'REWARD_CREDIT'
  | 'SELLER_SETTLEMENT'
  | 'AFFILIATE_COMMISSION'
  | 'WITHDRAWAL'
  | 'DEPOSIT'
  | 'SUBSCRIPTION'
  | 'PLATFORM_FEE'
  | 'MARKETPLACE_COMMISSION'
  | 'SHIPPING_CHARGE'
  | 'TAX_COLLECTION'
  | 'MANUAL_ADJUSTMENT'
  | 'PROMOTIONAL_CREDIT';

export type WithdrawalStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export interface WalletTransaction {
  id: EntityId;
  userId: string;
  userName: string;
  walletType: WalletType;
  type: TransactionType;
  amount: number;
  feeAmount?: number;
  taxAmount?: number;
  currency: 'USD' | 'EUR' | 'PKR' | 'GBP' | 'JPY' | 'INR';
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';
  referenceId?: string;
  orderId?: string;
  ipAddress?: string;
  auditNote?: string;
}

export interface WalletCard {
  id: EntityId;
  cardHolderName: string;
  cardNumberMasked: string;
  expiry: string;
  brand: 'VISA' | 'MASTERCARD' | 'AMEX';
  isDefault: boolean;
}

export interface BuyerWalletState {
  walletBalance: number;
  cashbackBalance: number;
  refundBalance: number;
  rewardBalance: number;
  rewardPoints: number;
  giftCardBalance: number;
  storeCredit: number;
  isFrozen: boolean;
  autoPayEnabled: boolean;
}

export interface SellerWalletState {
  merchantId: string;
  merchantName: string;
  availableBalance: number;
  pendingBalance: number;
  reservedBalance: number;
  withdrawableBalance: number;
  totalSettled: number;
  commissionDeducted: number;
  marketplaceFees: number;
  refundAdjustments: number;
  chargebacks: number;
  taxesAdjusted: number;
  withdrawnBalance?: number;
  isFrozen: boolean;
}

export interface AffiliateWalletState {
  affiliateId: string;
  affiliateName: string;
  approvedCommission: number;
  pendingCommission: number;
  paidCommission: number;
  bonusRewards: number;
  referralEarnings: number;
  cashbackRewards: number;
  withdrawableBalance: number;
  isFrozen: boolean;
}

export interface AdminWalletState {
  marketplaceRevenue: number;
  commissionRevenue: number;
  subscriptionRevenue: number;
  advertisementRevenue: number;
  processingFees: number;
  shippingRevenue: number;
  penaltiesCollected: number;
  refundAdjustments: number;
  taxesCollected: number;
  platformProfit: number;
  frozenWalletsCount: number;
}

export interface WithdrawalRequest {
  id: EntityId;
  userId: string;
  userName: string;
  userRole: 'SELLER' | 'AFFILIATE' | 'BUYER';
  amount: number;
  currency: 'USD' | 'PKR' | 'EUR' | 'GBP';
  payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'CRYPTO' | 'COMMERCE_ZONE_PAY';
  accountDetails: string;
  status: WithdrawalStatus;
  fraudRiskScore: number; // 0-100
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
}

export interface WalletNotification {
  id: EntityId;
  title: string;
  message: string;
  type: 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'REFUND' | 'CASHBACK' | 'REWARD' | 'WITHDRAWAL' | 'SECURITY';
  read: boolean;
  timestamp: string;
  amount?: number;
}

export interface GiftCardItem {
  id: EntityId;
  code: string;
  initialBalance: number;
  currentBalance: number;
  currency: 'USD';
  expiryDate: string;
  redeemedAt?: string;
  isUsed: boolean;
}

export interface WalletState {
  balance: number;
  currency: 'USD';
  cashbackEarned: number;
  autoPayEnabled: boolean;
  cards: WalletCard[];
  transactions: WalletTransaction[];
  // Extended Enterprise Wallet System State
  buyerWallet: BuyerWalletState;
  sellerWallet: SellerWalletState;
  affiliateWallet: AffiliateWalletState;
  adminWallet: AdminWalletState;
  withdrawals: WithdrawalRequest[];
  notifications: WalletNotification[];
  giftCards: GiftCardItem[];
  pinProtected: boolean;
}

// Module 5: Individual Seller Plan & Fee Engine Domain Models
export type SellerPlanType = 'INDIVIDUAL' | 'PROFESSIONAL';

export type SellerVerificationStatus =
  | 'UNVERIFIED'
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'KYC_PENDING'
  | 'VERIFIED'
  | 'SUSPENDED';

export interface SellerPlanLimits {
  maxActiveProducts: number;
  maxCategories: number;
  storageLimitMb: number;
  imageUploadLimitPerProduct: number;
  apiLimitRequestsPerMin: number;
  promotionalFeatureAccess: boolean;
}

export interface IndividualSellerProfile {
  id: EntityId;
  userId: string;
  fullName: string;
  storeName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  nationalId: string;
  taxId: string;
  plan: SellerPlanType;
  planFeePerSale: number; // $0.99 for Individual, $0.00 for Professional
  monthlySubscriptionPrice: number; // $0.00 for Individual, $39.99 for Professional
  verificationStatus: SellerVerificationStatus;
  kycVerified: boolean;
  acceptedTerms: boolean;
  activeProductsCount: number;
  totalOrders: number;
  totalRevenue: number;
  totalPerItemFeesPaid: number;
  totalMarketplaceFeesPaid: number;
  walletBalance: number;
  pendingBalance: number;
  storeHealthScore: number; // 0-100
  orderSuccessRate: number; // %
  cancellationRate: number; // %
  returnRate: number; // %
  avgResponseTimeHours: number;
  customerRating: number;
  createdAt: string;
  limits: SellerPlanLimits;
}

export interface SellerBillingRecord {
  id: EntityId;
  sellerId: string;
  sellerName: string;
  orderId: string;
  productTitle: string;
  grossSaleAmount: number;
  marketplacePerItemFee: number; // $0.99
  marketplaceCommissionFee: number;
  shippingFee: number;
  taxFee: number;
  discountAmount: number;
  netSellerEarnings: number;
  status: 'CHARGED' | 'REFUNDED' | 'CANCELLED';
  createdAt: string;
}

export interface SellerNotificationAlert {
  id: EntityId;
  sellerId: string;
  title: string;
  message: string;
  type:
    | 'PRODUCT_SOLD'
    | 'FEE_DEDUCTED'
    | 'WALLET_UPDATED'
    | 'WITHDRAWAL'
    | 'UPGRADE_AVAILABLE'
    | 'KYC_REQUIRED'
    | 'POLICY_WARNING'
    | 'SECURITY'
    | 'SUBSCRIPTION_RENEWED'
    | 'SUBSCRIPTION_FAILED'
    | 'GRACE_PERIOD_STARTED';
  channels: ('EMAIL' | 'SMS' | 'PUSH')[];
  read: boolean;
  createdAt: string;
}

// Module 6: Professional Seller Plan ($36/mo) Domain Models
export type ProSubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'PENDING'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'CANCELLED';

export type StaffRole =
  | 'OWNER'
  | 'MANAGER'
  | 'INVENTORY_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'FINANCE_MANAGER'
  | 'MARKETING_MANAGER';

export interface ProStaffMember {
  id: EntityId;
  name: string;
  email: string;
  role: StaffRole;
  permissions: string[];
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  addedAt: string;
  lastActive: string;
}

export interface ProSubscriptionDetails {
  id: EntityId;
  sellerId: string;
  planName: 'Professional Seller Plan';
  monthlyFee: number; // $36.00
  status: ProSubscriptionStatus;
  autoRenew: boolean;
  startDate: string;
  nextBillingDate: string;
  lastPaymentDate: string;
  paymentMethod: 'CREDIT_CARD' | 'SELLER_WALLET' | 'BANK_TRANSFER' | 'PAYPAL';
  cardLast4?: string;
  cardBrand?: string;
  gracePeriodDays: number; // e.g. 7 days
  retryCount: number;
}

export interface ProSellerInvoice {
  id: EntityId;
  invoiceNumber: string;
  sellerId: string;
  sellerName: string;
  planName: string;
  billingPeriod: string;
  subtotal: number; // $36.00
  taxAmount: number;
  totalAmount: number; // $36.00
  status: 'PAID' | 'FAILED' | 'PENDING' | 'REFUNDED';
  paymentMethod: string;
  issuedAt: string;
  paidAt?: string;
}

export interface ProStoreBranding {
  logoUrl: string;
  bannerUrl: string;
  description: string;
  aboutPageText: string;
  themeColor: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  featuredProductIds: string[];
}

export interface ProBankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumberMasked: string;
  routingNumber: string;
  swiftCode: string;
  country: string;
}

export interface ProMarketingCampaign {
  id: EntityId;
  title: string;
  type: 'SPONSORED_PRODUCT' | 'COUPON' | 'BOGO' | 'FLASH_SALE' | 'BUNDLE' | 'FEATURED';
  discountCode?: string;
  discountPercentage?: number;
  flatDiscountAmount?: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'PAUSED' | 'EXPIRED';
  salesGenerated: number;
  clicks: number;
  conversions: number;
}

export interface ProApiKeyConfig {
  id: EntityId;
  keyName: string;
  apiKey: string;
  permissions: string[];
  rateLimitPerMin: number;
  createdAt: string;
  lastUsedAt: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface ProWebhookConfig {
  id: EntityId;
  event: 'ORDER_CREATED' | 'STOCK_LOW' | 'INVENTORY_SYNC' | 'PAYMENT_RECEIVED' | 'REFUND_ISSUED';
  targetUrl: string;
  secret: string;
  status: 'ACTIVE' | 'DISABLED';
  lastTriggered: string;
}

export interface ProfessionalSellerProfile {
  id: EntityId;
  userId: string;
  businessName: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessRegistrationNumber: string;
  taxIdVat: string;
  businessAddress: string;
  country: string;
  plan: 'PROFESSIONAL';
  monthlyPrice: number; // $36.00
  verificationStatus: SellerVerificationStatus;
  kycVerified: boolean;
  acceptedTerms: boolean;
  subscription: ProSubscriptionDetails;
  bankDetails: ProBankDetails;
  branding: ProStoreBranding;
  staff: ProStaffMember[];
  campaigns: ProMarketingCampaign[];
  apiKeys: ProApiKeyConfig[];
  webhooks: ProWebhookConfig[];
  totalOrdersProcessed: number;
  totalRevenue: number;
  walletBalance: number;
  pendingBalance: number;
  mrrContribution: number; // $36.00
  storeRating: number;
  createdAt: string;
}

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'FINANCE_ADMIN'
  | 'PRODUCT_ADMIN'
  | 'CUSTOMER_SUPPORT_ADMIN'
  | 'MARKETING_ADMIN'
  | 'WAREHOUSE_ADMIN'
  | 'SECURITY_ADMIN';

export interface AdminUser {
  id: EntityId;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  lastLogin: string;
  avatarUrl: string;
}

export interface MarketplaceBuyer {
  id: EntityId;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'FLAGGED';
  isVerified: boolean;
  walletBalance: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastLoginIp: string;
  loginHistory: { timestamp: string; ip: string; device: string }[];
}

export interface MarketplaceAffiliate {
  id: EntityId;
  name: string;
  email: string;
  referralCode: string;
  commissionRatePct: number;
  totalEarnings: number;
  pendingCommission: number;
  withdrawnAmount: number;
  clicks: number;
  conversions: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
}

export interface DropshippingSupplier {
  id: EntityId;
  name: string;
  contactPerson: string;
  email: string;
  country: string;
  productCount: number;
  apiStatus: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  commissionMarginPct: number;
}

export interface SupportTicket {
  id: EntityId;
  ticketNumber: string;
  userType: 'BUYER' | 'SELLER' | 'AFFILIATE';
  userName: string;
  subject: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedAdmin: string;
  createdAt: string;
}

export interface ProductReviewModeration {
  id: EntityId;
  productTitle: string;
  reviewerName: string;
  rating: number;
  comment: string;
  aiFraudScore: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface MarketplaceSettings {
  marketplaceName: string;
  logoUrl: string;
  primaryCurrency: string;
  taxRatePct: number;
  flatShippingFee: number;
  mfaEnforced: boolean;
  jwtExpiryHours: number;
  maintenanceMode: boolean;
  aiFraudAutoBlock: boolean;
  supportEmail: string;
  sellerCommissionPct: number;
}




