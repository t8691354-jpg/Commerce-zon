export type SuperAdminSubTab =
  | 'overview'
  | 'users'
  | 'platform_config'
  | 'policies'
  | 'financials'
  | 'moderation'
  | 'categories'
  | 'homepage_cms'
  | 'promotions'
  | 'ai_controls'
  | 'integrations'
  | 'system_monitoring'
  | 'backups'
  | 'feature_flags'
  | 'audit_logs'
  | 'reports'
  | 'alert_routing';

export interface SystemHealthMetric {
  name: string;
  category: 'Infrastructure' | 'Database' | 'Cache' | 'AI Service' | 'Payment Gateway';
  status: 'Optimal' | 'Degraded' | 'Critical';
  value: string;
  latencyMs: number;
  uptimePct: number;
}

export interface PlatformRevenueMetric {
  totalRevenue: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  ordersCount: number;
  activeUsersCount: number;
  platformHealthScore: number;
  commissionEarned: number;
}

export interface GlobalUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Buyer' | 'Seller' | 'Professional Seller' | 'Affiliate' | 'Supplier' | 'Warehouse Staff' | 'Delivery Partner' | 'Support Agent' | 'Admin' | 'Super Admin';
  status: 'Active' | 'Suspended' | 'Banned' | 'Pending Verification';
  mfaEnabled: boolean;
  registeredDate: string;
  lastLoginIp: string;
  lastLoginDate: string;
  totalTransactions: number;
  country: string;
}

export interface MarketplacePolicy {
  id: string;
  title: string;
  category: 'Seller' | 'Buyer' | 'Affiliate' | 'Refund & Return' | 'Shipping' | 'Privacy & Terms';
  version: string;
  status: 'Published' | 'Draft' | 'Archived';
  lastUpdated: string;
  author: string;
  content: string;
}

export interface FinancialFeeRule {
  id: string;
  feeType: 'Marketplace Commission' | 'Seller Subscription' | 'Affiliate Payout' | 'Withdrawal Fee' | 'FBA Storage Fee' | 'Dropshipping Service Fee' | 'Platform Handling Fee';
  ratePct: number;
  flatFeeUsd: number;
  appliesTo: string;
  status: 'Active' | 'Inactive';
}

export interface ModerationQueueItem {
  id: string;
  itemType: 'Product Listing' | 'Seller Application' | 'Customer Review' | 'Q&A Comment' | 'Product Video';
  entityTitle: string;
  submittedBy: string;
  riskFlags: string[];
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Hidden';
  aiSafetyScorePct: number;
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string;
  subcategoriesCount: number;
  productsCount: number;
  commissionTierPct: number;
  isFeatured: boolean;
  status: 'Active' | 'Disabled';
}

export interface CmsSectionBlock {
  id: string;
  type: 'Hero Banner Slider' | 'Promotional Banner Grid' | 'Featured Categories' | 'Flash Sale Counter' | 'Announcement Bar' | 'Footer Widget';
  title: string;
  order: number;
  isActive: boolean;
  targetAudience: 'All' | 'Prime Buyers' | 'New Users';
}

export interface PromotionCampaign {
  id: string;
  title: string;
  code?: string;
  type: 'Coupon Code' | 'Flash Sale' | 'Lightning Deal' | 'BOGO Offer' | 'Referral Boost';
  discountPct: number;
  startDate: string;
  endDate: string;
  targetUserSegment: string;
  usageCount: number;
  usageLimit: number;
  status: 'Scheduled' | 'Active' | 'Expired';
}

export interface AiServiceConfig {
  serviceId: string;
  name: string;
  model: string;
  status: 'Enabled' | 'Disabled' | 'Throttled';
  latencyMs: number;
  monthlyCostEstimateUsd: number;
  rateLimitPerMin: number;
  confidenceThresholdPct: number;
}

export interface IntegrationGateway {
  id: string;
  providerName: string;
  category: 'Payment Gateway' | 'Shipping Carrier' | 'Email Service' | 'SMS Gateway' | 'Cloud Storage' | 'CDN Provider';
  status: 'Connected' | 'Degraded' | 'Disconnected';
  environment: 'Production' | 'Sandbox';
  lastPingMs: number;
  apiKeyMasked: string;
}

export interface SystemBackgroundJob {
  id: string;
  jobName: string;
  queue: 'high-priority' | 'default' | 'cron-scheduled';
  status: 'Running' | 'Completed' | 'Failed' | 'Queued';
  executionTimeMs: number;
  lastRun: string;
  nextRun: string;
}

export interface BackupRecord {
  id: string;
  backupType: 'Full Database' | 'S3 Assets' | 'System Configuration' | 'PITR Delta Snapshot';
  sizeMb: number;
  storageLocation: string;
  createdAt: string;
  status: 'Verified Healthy' | 'InProgress' | 'Failed';
  durationSeconds: number;
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  status: 'Enabled' | 'Disabled' | 'Canary 10%' | 'Beta Testers Only';
  targetRegions: string[];
  lastModifiedBy: string;
}

export interface CentralAuditLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  targetModule: string;
  ipAddress: string;
  timestamp: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

export interface SystemAlertRoute {
  id: string;
  triggerEvent: string;
  channel: 'Email' | 'SMS' | 'Push Notification' | 'In-App Alert' | 'PagerDuty Webhook';
  recipients: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'Active' | 'Paused';
}
