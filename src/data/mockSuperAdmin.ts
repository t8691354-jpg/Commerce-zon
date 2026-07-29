import {
  SystemHealthMetric,
  PlatformRevenueMetric,
  GlobalUserRecord,
  MarketplacePolicy,
  FinancialFeeRule,
  ModerationQueueItem,
  TaxonomyCategory,
  CmsSectionBlock,
  PromotionCampaign,
  AiServiceConfig,
  IntegrationGateway,
  SystemBackgroundJob,
  BackupRecord,
  FeatureFlag,
  CentralAuditLog,
  SystemAlertRoute,
} from '../types/superAdmin';

export const MOCK_REVENUE_METRICS: PlatformRevenueMetric = {
  totalRevenue: 142850900,
  dailyRevenue: 482910,
  monthlyRevenue: 14290000,
  annualRevenue: 142850900,
  ordersCount: 3849200,
  activeUsersCount: 1284000,
  platformHealthScore: 99.8,
  commissionEarned: 18420000,
};

export const MOCK_SYSTEM_HEALTH: SystemHealthMetric[] = [
  { name: 'Cloud Run Primary API Cluster', category: 'Infrastructure', status: 'Optimal', value: '42 Instances', latencyMs: 14, uptimePct: 99.99 },
  { name: 'PostgreSQL Multi-Region Primary DB', category: 'Database', status: 'Optimal', value: 'Read Lag: 2ms', latencyMs: 4, uptimePct: 100 },
  { name: 'Redis Cluster Caching Grid', category: 'Cache', status: 'Optimal', value: 'Hit Ratio: 99.7%', latencyMs: 1, uptimePct: 100 },
  { name: 'Gemini 2.5 Flash Neural Assistant', category: 'AI Service', status: 'Optimal', value: '1.2k req/min', latencyMs: 180, uptimePct: 99.95 },
  { name: 'Stripe Global Payment Gateway', category: 'Payment Gateway', status: 'Optimal', value: 'Success: 99.8%', latencyMs: 320, uptimePct: 99.99 },
  { name: 'Elasticsearch Search Index Engine', category: 'Infrastructure', status: 'Optimal', value: 'Docs: 4.8M', latencyMs: 12, uptimePct: 99.98 },
  { name: 'Kafka Real-Time Telemetry Pipeline', category: 'Infrastructure', status: 'Optimal', value: 'Lag: 0 msgs', latencyMs: 6, uptimePct: 100 },
];

export const MOCK_GLOBAL_USERS: GlobalUserRecord[] = [
  { id: 'USR-8821', name: 'Sophia Martinez', email: 'sophia.m@gmail.com', role: 'Buyer', status: 'Active', mfaEnabled: true, registeredDate: '2024-01-15', lastLoginIp: '198.51.100.42', lastLoginDate: '2026-07-28 06:12', totalTransactions: 142, country: 'United States' },
  { id: 'USR-9012', name: 'TechHaven Official Store', email: 'support@techhaven.io', role: 'Professional Seller', status: 'Active', mfaEnabled: true, registeredDate: '2023-08-10', lastLoginIp: '54.210.12.99', lastLoginDate: '2026-07-28 06:05', totalTransactions: 12400, country: 'United States' },
  { id: 'USR-7734', name: 'Liam Chen', email: 'liam.c@affiliates.com', role: 'Affiliate', status: 'Active', mfaEnabled: false, registeredDate: '2024-05-20', lastLoginIp: '103.251.170.12', lastLoginDate: '2026-07-27 18:30', totalTransactions: 890, country: 'Singapore' },
  { id: 'USR-3310', name: 'Global Logistics Hub North', email: 'wh-north@amazon-fake.com', role: 'Warehouse Staff', status: 'Active', mfaEnabled: true, registeredDate: '2023-11-01', lastLoginIp: '192.168.10.4', lastLoginDate: '2026-07-28 05:45', totalTransactions: 45200, country: 'Germany' },
  { id: 'USR-1109', name: 'Express Freight Corp', email: 'partner@expressfreight.com', role: 'Delivery Partner', status: 'Active', mfaEnabled: true, registeredDate: '2024-02-18', lastLoginIp: '185.220.101.9', lastLoginDate: '2026-07-28 06:00', totalTransactions: 8900, country: 'United Kingdom' },
  { id: 'USR-6652', name: 'Suspicious Bot Account 89', email: 'bot89@scamdomain.xyz', role: 'Buyer', status: 'Banned', mfaEnabled: false, registeredDate: '2026-07-26', lastLoginIp: '185.220.101.4', lastLoginDate: '2026-07-26 14:12', totalTransactions: 0, country: 'Unknown' },
  { id: 'USR-5541', name: 'Elena Rostova', email: 'elena@support-desk.com', role: 'Support Agent', status: 'Active', mfaEnabled: true, registeredDate: '2024-04-12', lastLoginIp: '82.165.10.55', lastLoginDate: '2026-07-28 06:20', totalTransactions: 1420, country: 'Estonia' },
];

export const MOCK_MARKETPLACE_POLICIES: MarketplacePolicy[] = [
  { id: 'POL-01', title: 'Global Seller Conduct & Performance Policy', category: 'Seller', version: 'v4.2', status: 'Published', lastUpdated: '2026-06-15', author: 'Legal Compliance Lead', content: 'Sellers must maintain late shipment rate below 2% and order defect rate below 1%.' },
  { id: 'POL-02', title: 'A-to-z Buyer Guarantee & Refund Standard', category: 'Refund & Return', version: 'v3.1', status: 'Published', lastUpdated: '2026-05-10', author: 'Customer Care Operations', content: 'Buyers are protected for non-delivery or items not matching seller description within 30 days.' },
  { id: 'POL-03', title: 'Affiliate Attribution & Cookie Lifespan Rules', category: 'Affiliate', version: 'v2.0', status: 'Published', lastUpdated: '2026-04-01', author: 'Growth Marketing Director', content: '24-hour cookie attribution applies for qualified Marketplace purchases.' },
  { id: 'POL-04', title: 'GDPR & CCPA Privacy Compliance Statement', category: 'Privacy & Terms', version: 'v5.0', status: 'Published', lastUpdated: '2026-07-01', author: 'Data Protection Officer', content: 'User data deletion requests executed within 30 business days with cryptographic sanitization.' },
];

export const MOCK_FINANCIAL_RULES: FinancialFeeRule[] = [
  { id: 'FEE-01', feeType: 'Marketplace Commission', ratePct: 8.5, flatFeeUsd: 0.30, appliesTo: 'Standard Electronics & Retail', status: 'Active' },
  { id: 'FEE-02', feeType: 'Seller Subscription', ratePct: 0, flatFeeUsd: 39.99, appliesTo: 'Professional Seller Monthly Plan', status: 'Active' },
  { id: 'FEE-03', feeType: 'Affiliate Payout', ratePct: 4.0, flatFeeUsd: 0, appliesTo: 'Qualified Affiliate Referrals', status: 'Active' },
  { id: 'FEE-04', feeType: 'FBA Storage Fee', ratePct: 0, flatFeeUsd: 2.50, appliesTo: 'Fulfillment by Amazon Cubic Foot Storage', status: 'Active' },
  { id: 'FEE-05', feeType: 'Withdrawal Fee', ratePct: 0.5, flatFeeUsd: 1.00, appliesTo: 'Express Merchant Wallet Bank Withdrawal', status: 'Active' },
];

export const MOCK_MODERATION_ITEMS: ModerationQueueItem[] = [
  { id: 'MOD-991', itemType: 'Product Listing', entityTitle: 'Ultra Pro Wireless Noise Cancelling Headphones', submittedBy: 'TechHaven Store', riskFlags: ['Counterfeit Risk: Low', 'Text Quality: High'], submittedAt: '2026-07-28 05:30', status: 'Pending Review', aiSafetyScorePct: 98 },
  { id: 'MOD-992', itemType: 'Customer Review', entityTitle: 'Scam product do not buy!', submittedBy: 'Anonymous User', riskFlags: ['Inappropriate Language', 'Competitor Sabotage Suspected'], submittedAt: '2026-07-28 04:15', status: 'Pending Review', aiSafetyScorePct: 45 },
  { id: 'MOD-993', itemType: 'Seller Application', entityTitle: 'Apex Global Trading LLC', submittedBy: 'Apex Corp', riskFlags: ['Document Verification Passed', 'Tax ID Verified'], submittedAt: '2026-07-27 22:00', status: 'Approved', aiSafetyScorePct: 99 },
  { id: 'MOD-994', itemType: 'Product Video', entityTitle: 'Unboxing 4K Smart TV Demo', submittedBy: 'Visionary Retail', riskFlags: ['Video Stream Clean', 'No Copyright Match'], submittedAt: '2026-07-28 01:20', status: 'Approved', aiSafetyScorePct: 96 },
];

export const MOCK_TAXONOMY_CATEGORIES: TaxonomyCategory[] = [
  { id: 'CAT-100', name: 'Electronics & Gadgets', slug: 'electronics', subcategoriesCount: 14, productsCount: 18240, commissionTierPct: 8.0, isFeatured: true, status: 'Active' },
  { id: 'CAT-200', name: 'Home & Kitchen', slug: 'home-kitchen', subcategoriesCount: 22, productsCount: 32100, commissionTierPct: 10.0, isFeatured: true, status: 'Active' },
  { id: 'CAT-300', name: 'Fashion & Apparel', slug: 'fashion', subcategoriesCount: 18, productsCount: 45200, commissionTierPct: 12.0, isFeatured: true, status: 'Active' },
  { id: 'CAT-400', name: 'Industrial & Scientific', slug: 'industrial', subcategoriesCount: 8, productsCount: 6400, commissionTierPct: 6.5, isFeatured: false, status: 'Active' },
  { id: 'CAT-500', name: 'Automotive & Logistics', slug: 'automotive', subcategoriesCount: 11, productsCount: 12900, commissionTierPct: 9.0, isFeatured: false, status: 'Active' },
];

export const MOCK_CMS_BLOCKS: CmsSectionBlock[] = [
  { id: 'CMS-01', type: 'Announcement Bar', title: 'Prime Summer Mega Sale - Up to 60% Off Free Express Delivery', order: 1, isActive: true, targetAudience: 'All' },
  { id: 'CMS-02', type: 'Hero Banner Slider', title: 'Next-Gen Electronics & Smart Home Innovations', order: 2, isActive: true, targetAudience: 'All' },
  { id: 'CMS-03', type: 'Flash Sale Counter', title: 'Live Lightning Deals (Ends in 03h:42m)', order: 3, isActive: true, targetAudience: 'All' },
  { id: 'CMS-04', type: 'Featured Categories', title: 'Top Marketplace Department Grid', order: 4, isActive: true, targetAudience: 'All' },
  { id: 'CMS-05', type: 'Promotional Banner Grid', title: 'Exclusive Prime Member Cash Back Perks', order: 5, isActive: true, targetAudience: 'Prime Buyers' },
];

export const MOCK_PROMOTIONS: PromotionCampaign[] = [
  { id: 'PRM-101', title: 'Summer Tech Blowout 2026', code: 'SUMMERTECH20', type: 'Coupon Code', discountPct: 20, startDate: '2026-07-01', endDate: '2026-08-01', targetUserSegment: 'All Buyers', usageCount: 4820, usageLimit: 10000, status: 'Active' },
  { id: 'PRM-102', title: 'Prime Lightning Flash Sale', type: 'Flash Sale', discountPct: 35, startDate: '2026-07-28 00:00', endDate: '2026-07-28 23:59', targetUserSegment: 'Prime Members', usageCount: 8900, usageLimit: 15000, status: 'Active' },
  { id: 'PRM-103', title: 'Referral Bonus $15 Credit', code: 'REF15AMZ', type: 'Referral Boost', discountPct: 15, startDate: '2026-06-01', endDate: '2026-12-31', targetUserSegment: 'New User Affiliates', usageCount: 1240, usageLimit: 50000, status: 'Active' },
];

export const MOCK_AI_SERVICES: AiServiceConfig[] = [
  { serviceId: 'AI-SRC', name: 'Gemini Semantic Natural Language Search Engine', model: 'gemini-2.5-flash', status: 'Enabled', latencyMs: 120, monthlyCostEstimateUsd: 1420, rateLimitPerMin: 6000, confidenceThresholdPct: 92 },
  { serviceId: 'AI-REC', name: 'Personalized Behavioral Recommendation Model', model: 'gemini-2.5-flash', status: 'Enabled', latencyMs: 140, monthlyCostEstimateUsd: 1890, rateLimitPerMin: 10000, confidenceThresholdPct: 88 },
  { serviceId: 'AI-AST', name: 'Interactive AI Shopping Assistant Chatbot', model: 'gemini-2.5-flash', status: 'Enabled', latencyMs: 280, monthlyCostEstimateUsd: 980, rateLimitPerMin: 3000, confidenceThresholdPct: 95 },
  { serviceId: 'AI-FRD', name: 'Real-time Payment & Account Fraud Classifier', model: 'custom-ml-neural', status: 'Enabled', latencyMs: 35, monthlyCostEstimateUsd: 2100, rateLimitPerMin: 25000, confidenceThresholdPct: 98 },
];

export const MOCK_INTEGRATIONS: IntegrationGateway[] = [
  { id: 'INT-01', providerName: 'Stripe Connect & Card Processing', category: 'Payment Gateway', status: 'Connected', environment: 'Production', lastPingMs: 320, apiKeyMasked: 'sk_live_51M...9x4A' },
  { id: 'INT-02', providerName: 'Amazon Shipping & FedEx Logistics API', category: 'Shipping Carrier', status: 'Connected', environment: 'Production', lastPingMs: 180, apiKeyMasked: 'fedex_prod_99...21' },
  { id: 'INT-03', providerName: 'SendGrid Enterprise Email Dispatcher', category: 'Email Service', status: 'Connected', environment: 'Production', lastPingMs: 95, apiKeyMasked: 'SG.xK2...890' },
  { id: 'INT-04', providerName: 'Twilio Programmable SMS & OTP Gateway', category: 'SMS Gateway', status: 'Connected', environment: 'Production', lastPingMs: 110, apiKeyMasked: 'AC_89a...77' },
  { id: 'INT-05', providerName: 'Google Cloud Storage & Cloudfront CDN', category: 'Cloud Storage', status: 'Connected', environment: 'Production', lastPingMs: 12, apiKeyMasked: 'gcp_s3_key_...44' },
];

export const MOCK_BACKGROUND_JOBS: SystemBackgroundJob[] = [
  { id: 'JOB-8801', jobName: 'Daily Seller Payout & Wallet Ledger Settlement', queue: 'high-priority', status: 'Completed', executionTimeMs: 4200, lastRun: '2026-07-28 00:00', nextRun: '2026-07-29 00:00' },
  { id: 'JOB-8802', jobName: 'Elasticsearch Search Index Sync (4.8M Items)', queue: 'cron-scheduled', status: 'Running', executionTimeMs: 12400, lastRun: '2026-07-28 06:00', nextRun: '2026-07-28 07:00' },
  { id: 'JOB-8803', jobName: 'ClickHouse Data Warehouse ETL Aggregator', queue: 'default', status: 'Completed', executionTimeMs: 8900, lastRun: '2026-07-28 05:00', nextRun: '2026-07-28 06:00' },
  { id: 'JOB-8804', jobName: 'PostgreSQL Automated Snapshot & PITR Verify', queue: 'high-priority', status: 'Completed', executionTimeMs: 18200, lastRun: '2026-07-28 02:00', nextRun: '2026-07-29 02:00' },
];

export const MOCK_BACKUP_RECORDS: BackupRecord[] = [
  { id: 'BKP-2026-0728', backupType: 'Full Database', sizeMb: 14200, storageLocation: 's3://amz-backups-us-east-1/db_full_20260728.sql.gz', createdAt: '2026-07-28 02:00', status: 'Verified Healthy', durationSeconds: 182 },
  { id: 'BKP-2026-0727', backupType: 'S3 Assets', sizeMb: 89000, storageLocation: 's3://amz-backups-us-east-1/media_20260727.tar.gz', createdAt: '2026-07-27 02:00', status: 'Verified Healthy', durationSeconds: 840 },
  { id: 'BKP-2026-0726', backupType: 'System Configuration', sizeMb: 140, storageLocation: 's3://amz-backups-us-east-1/config_20260726.json', createdAt: '2026-07-26 02:00', status: 'Verified Healthy', durationSeconds: 12 },
];

export const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  { key: 'ff_ai_shopping_assistant_v2', name: 'AI Voice & Multi-Modal Assistant v2', description: 'Enables Gemini live audio & image search capabilities for buyers.', status: 'Canary 10%', targetRegions: ['us-east-1', 'eu-west-1'], lastModifiedBy: 'Super Admin Principal' },
  { key: 'ff_fba_same_day_delivery', name: 'FBA Same-Day Drone Dispatch', description: 'Autonomous warehouse robot fulfillment routing for fast delivery.', status: 'Beta Testers Only', targetRegions: ['us-west-2'], lastModifiedBy: 'Ops Admin Director' },
  { key: 'ff_zero_fee_crypto_payouts', name: 'USDC Merchant Payout Rail', description: 'Allows sellers to request instant wallet withdrawals in USDC stablecoin.', status: 'Enabled', targetRegions: ['Global'], lastModifiedBy: 'FinTech Lead Architect' },
];

export const MOCK_CENTRAL_AUDIT_LOGS: CentralAuditLog[] = [
  { id: 'AUD-9001', actor: 'superadmin@amazon-fake.com', role: 'Super Admin', action: 'Updated Global Commission Fee Policy for Retail', targetModule: 'Financial Controls', ipAddress: '54.210.12.99', timestamp: '2026-07-28 06:10:22', severity: 'WARN' },
  { id: 'AUD-9002', actor: 'sec-ops@amazon-fake.com', role: 'Security Admin', action: 'Banned Malicious Bot Account USR-6652 & Revoked Tokens', targetModule: 'User Management', ipAddress: '198.51.100.42', timestamp: '2026-07-28 05:42:11', severity: 'CRITICAL' },
  { id: 'AUD-9003', actor: 'superadmin@amazon-fake.com', role: 'Super Admin', action: 'Triggered Manual Multi-Region DB Backup Snapshot', targetModule: 'Backup & Restore', ipAddress: '54.210.12.99', timestamp: '2026-07-28 02:00:00', severity: 'INFO' },
];

export const MOCK_SYSTEM_ALERT_ROUTES: SystemAlertRoute[] = [
  { id: 'ALT-01', triggerEvent: 'Critical Database Failover or Loss', channel: 'PagerDuty Webhook', recipients: ['oncall-devops@amazon-fake.com', '+1 (555) 019-2831'], severity: 'CRITICAL', status: 'Active' },
  { id: 'ALT-02', triggerEvent: 'Payment Gateway Error Rate > 2%', channel: 'Email', recipients: ['fintech-alerts@amazon-fake.com'], severity: 'HIGH', status: 'Active' },
  { id: 'ALT-03', triggerEvent: 'AI Model Rate Limit or High Latency', channel: 'In-App Alert', recipients: ['ai-ops-leads'], severity: 'MEDIUM', status: 'Active' },
];
