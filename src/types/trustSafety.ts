export type DisputeCategory =
  | 'ITEM_NOT_RECEIVED'
  | 'SIGNIFICANTLY_NOT_AS_DESCRIBED'
  | 'DAMAGED_OR_DEFECTIVE'
  | 'INCORRECT_ITEM'
  | 'SELLER_FULFILLMENT_FAILURE'
  | 'RETURN_REFUND_DISAGREEMENT'
  | 'UNAUTHORIZED_TRANSACTION';

export type DisputeStatus =
  | 'OPEN'
  | 'AWAITING_SELLER_RESPONSE'
  | 'AWAITING_BUYER_RESPONSE'
  | 'UNDER_REVIEW'
  | 'RESOLUTION_PROPOSED'
  | 'RESOLVED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'CLOSED';

export type DesiredOutcome =
  | 'FULL_REFUND'
  | 'PARTIAL_REFUND'
  | 'REPLACEMENT'
  | 'RETURN_FOR_REFUND';

export interface DisputeEvidence {
  id: string;
  uploadedBy: 'BUYER' | 'SELLER' | 'ADMIN';
  uploaderName: string;
  type: 'PHOTO' | 'TRACKING_PROOF' | 'INVOICE' | 'STATEMENT' | 'DAMAGE_CERTIFICATE';
  title: string;
  fileUrl?: string;
  referenceNumber?: string;
  notes?: string;
  timestamp: string;
}

export interface DisputeMessage {
  id: string;
  senderRole: 'BUYER' | 'SELLER' | 'ADMIN' | 'SYSTEM';
  senderName: string;
  content: string;
  isInternalAdminNote?: boolean;
  attachments?: string[];
  timestamp: string;
}

export interface DisputeTimelineEvent {
  id: string;
  action: string;
  actor: string;
  actorRole: 'BUYER' | 'SELLER' | 'ADMIN' | 'SYSTEM';
  details?: string;
  timestamp: string;
}

export interface ProposedResolution {
  type: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'REPLACEMENT' | 'RETURN_REQUIRED' | 'REJECT_CLAIM';
  amount?: number;
  explanation: string;
  proposedBy: 'SELLER' | 'ADMIN';
  proposedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface BindingDecision {
  decision:
    | 'REFUND_BUYER_FULL'
    | 'REFUND_BUYER_PARTIAL'
    | 'RELEASE_FUNDS_TO_SELLER'
    | 'REQUIRE_RETURN_THEN_REFUND'
    | 'DISMISS_CASE';
  arbitratorId: string;
  arbitratorName: string;
  amount?: number;
  rationale: string;
  executedAt: string;
}

export interface DisputeCase {
  id: string; // e.g. DSP-2026-001
  orderId: string;
  orderNumber: string;
  orderItemId?: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string; // merchantId
  sellerName: string;
  category: DisputeCategory;
  status: DisputeStatus;
  claimedAmount: number;
  currency: string;
  description: string;
  desiredOutcome: DesiredOutcome;
  trackingNumber?: string;
  carrier?: string;
  proposedResolution?: ProposedResolution;
  bindingDecision?: BindingDecision;
  evidence: DisputeEvidence[];
  messages: DisputeMessage[];
  timeline: DisputeTimelineEvent[];
  escalatedToAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// User & Listing Reports
export type ReportTargetType =
  | 'PRODUCT_LISTING'
  | 'SELLER'
  | 'BUYER'
  | 'ORDER'
  | 'REVIEW'
  | 'SCAM_SCHEME';

export type ReportCategory =
  | 'COUNTERFEIT_OR_REPLICA'
  | 'SUSPECTED_SCAM'
  | 'HARASSMENT_OR_ABUSE'
  | 'PROHIBITED_OR_DANGEROUS'
  | 'PRICE_GOUGING'
  | 'REVIEW_MANIPULATION'
  | 'OFF_PLATFORM_PAYMENT'
  | 'MISLEADING_SPECIFICATION'
  | 'OTHER';

export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_INVESTIGATION'
  | 'ACTION_TAKEN'
  | 'DISMISSED'
  | 'FALSE_REPORT';

export type ReportActionTaken =
  | 'LISTING_REMOVED'
  | 'SELLER_WARNED'
  | 'ACCOUNT_RESTRICTED'
  | 'NO_VIOLATION_FOUND'
  | 'REFERRED_TO_LEGAL';

export interface MarketplaceReport {
  id: string;
  referenceNumber: string; // e.g. REP-2026-9812
  reporterId: string;
  reporterName: string;
  reporterRole: 'BUYER' | 'SELLER' | 'COMMUNITY' | 'AUTOMATED_SCAN';
  targetType: ReportTargetType;
  targetId: string;
  targetName: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  description: string;
  evidenceUrls?: string[];
  resolutionNotes?: string;
  actionTaken?: ReportActionTaken;
  reviewedByAdmin?: string;
  createdAt: string;
  updatedAt: string;
}

// Fraud & Risk Scoring
export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskSignal {
  signalKey: string;
  label: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
  scoreContribution: number;
  details: string;
}

export interface FraudRiskAssessment {
  id: string;
  entityType: 'ORDER' | 'BUYER' | 'SELLER' | 'PAYMENT';
  entityId: string;
  entityName: string;
  riskScore: number; // 0 to 100
  riskTier: RiskTier;
  signals: RiskSignal[];
  automatedDecision: 'APPROVE' | 'FLAG_FOR_REVIEW' | 'HOLD_PAYOUT' | 'CHALLENGE_2FA' | 'BLOCK';
  overrideDecision?: 'MANUALLY_APPROVED' | 'MANUALLY_BLOCKED' | 'PAYOUT_RELEASED';
  overrideNotes?: string;
  timestamp: string;
}

// Listing Moderation & IP Protection
export type ListingViolationType =
  | 'COUNTERFEIT'
  | 'IP_INFRINGEMENT'
  | 'PROHIBITED_GOODS'
  | 'MISLEADING_TITLE_PRICING'
  | 'KEYWORD_SPAM'
  | 'EXPIRED_SAFETY_CERT';

export type ModerationStatus =
  | 'FLAGGED'
  | 'SUPPRESSED'
  | 'UNDER_APPEAL'
  | 'CLEARED'
  | 'PERMANENTLY_REMOVED';

export interface SellerListingAppeal {
  id: string;
  submittedAt: string;
  sellerStatement: string;
  proofDocumentUrls: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface ProductListingModeration {
  id: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  sellerId: string;
  sellerName: string;
  category: string;
  violationType: ListingViolationType;
  flaggedBy: 'AI_VISION_OCR' | 'USER_REPORT' | 'BRAND_REGISTRY' | 'MANUAL_AUDIT';
  status: ModerationStatus;
  evidenceNotes: string;
  strikeIssued: boolean;
  appeal?: SellerListingAppeal;
  createdAt: string;
  updatedAt: string;
}

// Seller Trust & Reputation
export type TrustBadge =
  | 'VERIFIED_LEADER'
  | 'TRUSTED_MERCHANT'
  | 'STANDARD'
  | 'PROBATION_WARNING'
  | 'RESTRICTED';

export interface SellerTrustReputation {
  merchantId: string;
  storeName: string;
  logoUrl?: string;
  tier: string;
  trustScore: number; // 0-100
  badge: TrustBadge;
  disputeRatePct: number;
  fulfillmentRatePct: number;
  cancellationRatePct: number;
  activeDisputesCount: number;
  resolvedDisputesCount: number;
  activeStrikesCount: number;
  payoutHoldStatus: boolean;
  lastAuditedAt: string;
}

export interface TrustSafetyMetrics {
  totalActiveDisputes: number;
  openReportsCount: number;
  highRiskTransactionsCount: number;
  moderationQueueCount: number;
  payoutHoldsCount: number;
  avgResolutionTimeHours: number;
  disputeRateMarketplacePct: number;
  preventedFraudLossUsd: number;
}
