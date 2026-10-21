import {
  DisputeCase,
  DisputeCategory,
  DisputeStatus,
  DesiredOutcome,
  DisputeEvidence,
  DisputeMessage,
  ProposedResolution,
  BindingDecision,
  MarketplaceReport,
  ReportCategory,
  ReportSeverity,
  ReportStatus,
  ReportTargetType,
  ReportActionTaken,
  FraudRiskAssessment,
  ProductListingModeration,
  ModerationStatus,
  SellerTrustReputation,
  TrustSafetyMetrics,
} from '../../types/trustSafety.js';
import { logger } from '../../infrastructure/logging/Logger.js';

export class TrustSafetyService {
  private disputes: DisputeCase[] = [];
  private reports: MarketplaceReport[] = [];
  private fraudAssessments: FraudRiskAssessment[] = [];
  private moderatedListings: ProductListingModeration[] = [];
  private sellerReputations: Map<string, SellerTrustReputation> = new Map();
  private userReportRateLimit: Map<string, number[]> = new Map(); // userId -> timestamps

  constructor() {
    this.seedInitialData();
  }

  // ==========================================
  // DISPUTES RESOLUTION ENGINE
  // ==========================================

  public listDisputes(filters?: {
    sellerId?: string;
    buyerId?: string;
    status?: DisputeStatus;
    category?: DisputeCategory;
  }): DisputeCase[] {
    let result = [...this.disputes];
    if (filters?.sellerId) {
      result = result.filter((d) => d.sellerId === filters.sellerId);
    }
    if (filters?.buyerId) {
      result = result.filter((d) => d.buyerId === filters.buyerId);
    }
    if (filters?.status) {
      result = result.filter((d) => d.status === filters.status);
    }
    if (filters?.category) {
      result = result.filter((d) => d.category === filters.category);
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getDisputeById(id: string): DisputeCase | undefined {
    return this.disputes.find((d) => d.id === id);
  }

  public createDispute(data: {
    orderId: string;
    orderNumber: string;
    orderItemId?: string;
    productId: string;
    productTitle: string;
    productImage?: string;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
    sellerId: string;
    sellerName: string;
    category: DisputeCategory;
    claimedAmount: number;
    currency: string;
    description: string;
    desiredOutcome: DesiredOutcome;
    trackingNumber?: string;
    carrier?: string;
    initialEvidence?: {
      title: string;
      fileUrl?: string;
      type: DisputeEvidence['type'];
      referenceNumber?: string;
      notes?: string;
    };
  }): DisputeCase {
    // Prevent duplicate open disputes on the exact same order item
    const existing = this.disputes.find(
      (d) =>
        d.orderId === data.orderId &&
        d.productId === data.productId &&
        !['RESOLVED', 'REJECTED', 'CLOSED'].includes(d.status)
    );
    if (existing) {
      throw new Error(`An active dispute (${existing.id}) is already open for this order item.`);
    }

    const now = new Date().toISOString();
    const disputeId = `DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const evidenceList: DisputeEvidence[] = [];
    if (data.initialEvidence) {
      evidenceList.push({
        id: `EVD-${Date.now()}-1`,
        uploadedBy: 'BUYER',
        uploaderName: data.buyerName,
        type: data.initialEvidence.type || 'PHOTO',
        title: data.initialEvidence.title || 'Initial Case Evidence',
        fileUrl: data.initialEvidence.fileUrl,
        referenceNumber: data.initialEvidence.referenceNumber,
        notes: data.initialEvidence.notes,
        timestamp: now,
      });
    }

    const newCase: DisputeCase = {
      id: disputeId,
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      orderItemId: data.orderItemId,
      productId: data.productId,
      productTitle: data.productTitle,
      productImage:
        data.productImage ||
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80',
      buyerId: data.buyerId,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      sellerId: data.sellerId,
      sellerName: data.sellerName,
      category: data.category,
      status: 'AWAITING_SELLER_RESPONSE',
      claimedAmount: data.claimedAmount,
      currency: data.currency || 'USD',
      description: data.description,
      desiredOutcome: data.desiredOutcome,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      evidence: evidenceList,
      messages: [
        {
          id: `MSG-${Date.now()}`,
          senderRole: 'BUYER',
          senderName: data.buyerName,
          content: data.description,
          timestamp: now,
        },
      ],
      timeline: [
        {
          id: `TL-${Date.now()}-1`,
          action: 'DISPUTE_FILED',
          actor: data.buyerName,
          actorRole: 'BUYER',
          details: `Filed dispute for ${data.category.replace(/_/g, ' ')}. Claim: $${data.claimedAmount.toFixed(2)}`,
          timestamp: now,
        },
      ],
      escalatedToAdmin: false,
      createdAt: now,
      updatedAt: now,
    };

    this.disputes.unshift(newCase);
    this.recalculateReputation(data.sellerId);

    logger.info(`New Dispute ${disputeId} registered on order ${data.orderNumber}`, 'TrustSafetyService');
    return newCase;
  }

  public addMessage(
    disputeId: string,
    message: {
      senderRole: 'BUYER' | 'SELLER' | 'ADMIN' | 'SYSTEM';
      senderName: string;
      content: string;
      isInternalAdminNote?: boolean;
      attachments?: string[];
    }
  ): DisputeCase {
    const dispute = this.getDisputeById(disputeId);
    if (!dispute) throw new Error(`Dispute ${disputeId} not found`);

    const now = new Date().toISOString();
    const newMsg: DisputeMessage = {
      id: `MSG-${Date.now()}`,
      senderRole: message.senderRole,
      senderName: message.senderName,
      content: message.content,
      isInternalAdminNote: message.isInternalAdminNote || false,
      attachments: message.attachments || [],
      timestamp: now,
    };

    dispute.messages.push(newMsg);

    // Update dispute status based on conversational turn
    if (message.senderRole === 'SELLER') {
      if (dispute.status === 'AWAITING_SELLER_RESPONSE') {
        dispute.status = 'AWAITING_BUYER_RESPONSE';
      }
    } else if (message.senderRole === 'BUYER') {
      if (dispute.status === 'AWAITING_BUYER_RESPONSE') {
        dispute.status = 'AWAITING_SELLER_RESPONSE';
      }
    }

    dispute.updatedAt = now;
    return dispute;
  }

  public addEvidence(
    disputeId: string,
    evidence: {
      uploadedBy: 'BUYER' | 'SELLER' | 'ADMIN';
      uploaderName: string;
      type: DisputeEvidence['type'];
      title: string;
      fileUrl?: string;
      referenceNumber?: string;
      notes?: string;
    }
  ): DisputeCase {
    const dispute = this.getDisputeById(disputeId);
    if (!dispute) throw new Error(`Dispute ${disputeId} not found`);

    const now = new Date().toISOString();
    const newEvidence: DisputeEvidence = {
      id: `EVD-${Date.now()}`,
      uploadedBy: evidence.uploadedBy,
      uploaderName: evidence.uploaderName,
      type: evidence.type,
      title: evidence.title,
      fileUrl: evidence.fileUrl,
      referenceNumber: evidence.referenceNumber,
      notes: evidence.notes,
      timestamp: now,
    };

    dispute.evidence.push(newEvidence);
    dispute.timeline.push({
      id: `TL-${Date.now()}`,
      action: 'EVIDENCE_SUBMITTED',
      actor: evidence.uploaderName,
      actorRole: evidence.uploadedBy,
      details: `Submitted ${evidence.type.replace(/_/g, ' ')}: "${evidence.title}"`,
      timestamp: now,
    });
    dispute.updatedAt = now;

    return dispute;
  }

  public proposeResolution(
    disputeId: string,
    actor: { role: 'SELLER' | 'ADMIN'; name: string },
    proposal: {
      type: ProposedResolution['type'];
      amount?: number;
      explanation: string;
    }
  ): DisputeCase {
    const dispute = this.getDisputeById(disputeId);
    if (!dispute) throw new Error(`Dispute ${disputeId} not found`);

    const now = new Date().toISOString();
    dispute.proposedResolution = {
      type: proposal.type,
      amount: proposal.amount ?? (proposal.type === 'FULL_REFUND' ? dispute.claimedAmount : 0),
      explanation: proposal.explanation,
      proposedBy: actor.role,
      proposedAt: now,
      status: 'PENDING',
    };

    dispute.status = 'RESOLUTION_PROPOSED';
    dispute.updatedAt = now;

    dispute.timeline.push({
      id: `TL-${Date.now()}`,
      action: 'RESOLUTION_PROPOSED',
      actor: actor.name,
      actorRole: actor.role,
      details: `${actor.role} proposed ${proposal.type.replace(/_/g, ' ')}${
        proposal.amount ? ` ($${proposal.amount.toFixed(2)})` : ''
      }: ${proposal.explanation}`,
      timestamp: now,
    });

    return dispute;
  }

  public acceptResolution(disputeId: string, buyerId: string, buyerName?: string): DisputeCase {
    const dispute = this.getDisputeById(disputeId);
    if (!dispute) throw new Error(`Dispute ${disputeId} not found`);
    if (!dispute.proposedResolution) throw new Error('No active resolution has been proposed');

    const now = new Date().toISOString();
    dispute.proposedResolution.status = 'ACCEPTED';
    dispute.status = 'RESOLVED';
    dispute.resolvedAt = now;
    dispute.updatedAt = now;

    dispute.timeline.push({
      id: `TL-${Date.now()}`,
      action: 'RESOLUTION_ACCEPTED',
      actor: buyerName || 'Buyer',
      actorRole: 'BUYER',
      details: `Accepted proposed resolution: ${dispute.proposedResolution.type.replace(/_/g, ' ')}`,
      timestamp: now,
    });

    this.recalculateReputation(dispute.sellerId);
    return dispute;
  }

  public rejectResolution(disputeId: string, buyerId: string, reason: string): DisputeCase {
    const dispute = this.getDisputeById(disputeId);
    if (!dispute) throw new Error(`Dispute ${disputeId} not found`);
    if (!dispute.proposedResolution) throw new Error('No active resolution to reject');

    const now = new Date().toISOString();
    dispute.proposedResolution.status = 'REJECTED';
    dispute.status = 'UNDER_REVIEW';
    dispute.updatedAt = now;

    dispute.timeline.push({
      id: `TL-${Date.now()}`,
      action: 'RESOLUTION_REJECTED',
      actor: 'Buyer',
      actorRole: 'BUYER',
      details: `Buyer rejected proposal: "${reason}". Case escalated to moderator review.`,
      timestamp: now,
    });

    return dispute;
  }

  public escalateToAdmin(
    disputeId: string,
    actor: { role: 'BUYER' | 'SELLER'; name: string },
    reason: string
  ): DisputeCase {
    const dispute = this.getDisputeById(disputeId);
    if (!dispute) throw new Error(`Dispute ${disputeId} not found`);

    const now = new Date().toISOString();
    dispute.escalatedToAdmin = true;
    dispute.status = 'ESCALATED';
    dispute.updatedAt = now;

    dispute.timeline.push({
      id: `TL-${Date.now()}`,
      action: 'ESCALATED_TO_ARBITRATION',
      actor: actor.name,
      actorRole: actor.role,
      details: `Case escalated to Marketplace Trust & Safety Arbitrator. Reason: ${reason}`,
      timestamp: now,
    });

    return dispute;
  }

  public arbitrateDispute(
    disputeId: string,
    adminId: string,
    adminName: string,
    decision: BindingDecision['decision'],
    rationale: string,
    refundAmount?: number
  ): DisputeCase {
    const dispute = this.getDisputeById(disputeId);
    if (!dispute) throw new Error(`Dispute ${disputeId} not found`);

    const now = new Date().toISOString();
    dispute.bindingDecision = {
      decision,
      arbitratorId: adminId,
      arbitratorName: adminName,
      amount: refundAmount ?? (decision === 'REFUND_BUYER_FULL' ? dispute.claimedAmount : 0),
      rationale,
      executedAt: now,
    };

    dispute.status = decision === 'DISMISS_CASE' ? 'REJECTED' : 'RESOLVED';
    dispute.resolvedAt = now;
    dispute.updatedAt = now;

    dispute.timeline.push({
      id: `TL-${Date.now()}`,
      action: 'BINDING_ARBITRATION_RENDERED',
      actor: adminName,
      actorRole: 'ADMIN',
      details: `Arbitrator judgment: ${decision.replace(/_/g, ' ')}. ${rationale}`,
      timestamp: now,
    });

    this.recalculateReputation(dispute.sellerId);
    return dispute;
  }

  // ==========================================
  // USER & LISTING REPORTING SYSTEM
  // ==========================================

  public listReports(filters?: {
    status?: ReportStatus;
    severity?: ReportSeverity;
    targetType?: ReportTargetType;
  }): MarketplaceReport[] {
    let result = [...this.reports];
    if (filters?.status) result = result.filter((r) => r.status === filters.status);
    if (filters?.severity) result = result.filter((r) => r.severity === filters.severity);
    if (filters?.targetType) result = result.filter((r) => r.targetType === filters.targetType);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReportById(id: string): MarketplaceReport | undefined {
    return this.reports.find((r) => r.id === id || r.referenceNumber === id);
  }

  public createReport(data: {
    reporterId: string;
    reporterName: string;
    reporterRole: MarketplaceReport['reporterRole'];
    targetType: ReportTargetType;
    targetId: string;
    targetName: string;
    category: ReportCategory;
    severity: ReportSeverity;
    description: string;
    evidenceUrls?: string[];
  }): MarketplaceReport {
    // Rate limit: max 5 reports per user per 10 minutes
    const nowMs = Date.now();
    const userTimes = this.userReportRateLimit.get(data.reporterId) || [];
    const validTimes = userTimes.filter((t) => nowMs - t < 10 * 60 * 1000);
    if (validTimes.length >= 5) {
      throw new Error('Report rate limit exceeded. You may submit up to 5 reports every 10 minutes.');
    }
    validTimes.push(nowMs);
    this.userReportRateLimit.set(data.reporterId, validTimes);

    // Duplicate detection: check if exact same targetId and category from same reporter in last 24h
    const existing = this.reports.find(
      (r) =>
        r.reporterId === data.reporterId &&
        r.targetId === data.targetId &&
        r.category === data.category &&
        r.status !== 'DISMISSED'
    );
    if (existing) {
      throw new Error(`You have already filed report #${existing.referenceNumber} for this item.`);
    }

    const now = new Date().toISOString();
    const id = `REP-${Date.now().toString().slice(-6)}`;
    const refNum = `REP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport: MarketplaceReport = {
      id,
      referenceNumber: refNum,
      reporterId: data.reporterId,
      reporterName: data.reporterName,
      reporterRole: data.reporterRole,
      targetType: data.targetType,
      targetId: data.targetId,
      targetName: data.targetName,
      category: data.category,
      severity: data.severity,
      status: 'SUBMITTED',
      description: data.description,
      evidenceUrls: data.evidenceUrls || [],
      createdAt: now,
      updatedAt: now,
    };

    this.reports.unshift(newReport);
    logger.info(`Report ${refNum} filed by ${data.reporterName} on ${data.targetName}`, 'TrustSafetyService');
    return newReport;
  }

  public triageReport(
    reportId: string,
    adminId: string,
    status: ReportStatus,
    actionTaken: ReportActionTaken,
    resolutionNotes: string
  ): MarketplaceReport {
    const report = this.getReportById(reportId);
    if (!report) throw new Error(`Report ${reportId} not found`);

    report.status = status;
    report.actionTaken = actionTaken;
    report.resolutionNotes = resolutionNotes;
    report.reviewedByAdmin = adminId;
    report.updatedAt = new Date().toISOString();

    return report;
  }

  // ==========================================
  // FRAUD DETECTION & RISK SCORING ENGINE
  // ==========================================

  public listFraudAssessments(): FraudRiskAssessment[] {
    return [...this.fraudAssessments].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public evaluateOrderRisk(orderData: {
    orderId: string;
    orderAmount: number;
    buyerId: string;
    buyerEmail: string;
    shippingCountry: string;
    billingCountry: string;
    itemsCount: number;
    cardCountry?: string;
  }): FraudRiskAssessment {
    const signals: FraudRiskAssessment['signals'] = [];
    let riskScore = 10; // Baseline low risk

    // Rule 1: High Order Amount
    if (orderData.orderAmount > 2500) {
      signals.push({
        signalKey: 'HIGH_VALUE_TRANSACTION',
        label: 'High-Value Order Threshold Exceeded',
        severity: 'WARNING',
        scoreContribution: 25,
        details: `Order value $${orderData.orderAmount.toFixed(2)} exceeds 95th percentile benchmark.`,
      });
      riskScore += 25;
    }

    // Rule 2: Country Mismatch
    if (orderData.shippingCountry !== orderData.billingCountry) {
      signals.push({
        signalKey: 'GEO_COUNTRY_MISMATCH',
        label: 'Billing & Shipping Country Divergence',
        severity: 'ALERT',
        scoreContribution: 30,
        details: `Shipping to ${orderData.shippingCountry} while card billing country is ${orderData.billingCountry}.`,
      });
      riskScore += 30;
    }

    // Rule 3: Disposable or Suspicious Email
    const disposableDomains = ['tempmail.com', 'throwaway.io', 'guerrillamail.com', 'mailinator.com', 'yopmail.com'];
    const emailDomain = orderData.buyerEmail.split('@')[1]?.toLowerCase();
    if (emailDomain && disposableDomains.includes(emailDomain)) {
      signals.push({
        signalKey: 'DISPOSABLE_EMAIL_DETECTED',
        label: 'Disposable / Burner Email Service',
        severity: 'ALERT',
        scoreContribution: 35,
        details: `Domain ${emailDomain} is on active disposable fraud register.`,
      });
      riskScore += 35;
    }

    // Rule 4: High Item Count / Bulk Reseller Velocity
    if (orderData.itemsCount > 15) {
      signals.push({
        signalKey: 'BULK_VELOCITY_SPIKE',
        label: 'Unusual Basket Quantity Volume',
        severity: 'WARNING',
        scoreContribution: 15,
        details: `Order contains ${orderData.itemsCount} line items in a single checkout event.`,
      });
      riskScore += 15;
    }

    riskScore = Math.min(100, Math.max(0, riskScore));

    let riskTier: FraudRiskAssessment['riskTier'] = 'LOW';
    let automatedDecision: FraudRiskAssessment['automatedDecision'] = 'APPROVE';

    if (riskScore >= 75) {
      riskTier = 'CRITICAL';
      automatedDecision = 'BLOCK';
    } else if (riskScore >= 50) {
      riskTier = 'HIGH';
      automatedDecision = 'HOLD_PAYOUT';
    } else if (riskScore >= 25) {
      riskTier = 'MEDIUM';
      automatedDecision = 'CHALLENGE_2FA';
    }

    const assessment: FraudRiskAssessment = {
      id: `FRAUD-${Date.now()}`,
      entityType: 'ORDER',
      entityId: orderData.orderId,
      entityName: `Order #${orderData.orderId}`,
      riskScore,
      riskTier,
      signals,
      automatedDecision,
      timestamp: new Date().toISOString(),
    };

    this.fraudAssessments.unshift(assessment);
    return assessment;
  }

  public overrideFraudDecision(
    assessmentId: string,
    decision: 'MANUALLY_APPROVED' | 'MANUALLY_BLOCKED' | 'PAYOUT_RELEASED',
    notes: string
  ): FraudRiskAssessment {
    const target = this.fraudAssessments.find((f) => f.id === assessmentId);
    if (!target) throw new Error(`Assessment ${assessmentId} not found`);

    target.overrideDecision = decision;
    target.overrideNotes = notes;
    return target;
  }

  // ==========================================
  // PRODUCT LISTING MODERATION & IP PROTECTION
  // ==========================================

  public listModeratedListings(filters?: {
    status?: ModerationStatus;
    sellerId?: string;
  }): ProductListingModeration[] {
    let result = [...this.moderatedListings];
    if (filters?.status) result = result.filter((m) => m.status === filters.status);
    if (filters?.sellerId) result = result.filter((m) => m.sellerId === filters.sellerId);
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public actionListing(
    id: string,
    adminId: string,
    action: 'SUPPRESS' | 'CLEAR' | 'PERMANENTLY_REMOVE',
    evidenceNotes: string,
    issueStrike: boolean
  ): ProductListingModeration {
    const item = this.moderatedListings.find((m) => m.id === id);
    if (!item) throw new Error(`Moderation entry ${id} not found`);

    if (action === 'SUPPRESS') item.status = 'SUPPRESSED';
    else if (action === 'CLEAR') item.status = 'CLEARED';
    else if (action === 'PERMANENTLY_REMOVE') item.status = 'PERMANENTLY_REMOVED';

    item.evidenceNotes = evidenceNotes;
    if (issueStrike) {
      item.strikeIssued = true;
      const rep = this.sellerReputations.get(item.sellerId);
      if (rep) {
        rep.activeStrikesCount += 1;
        this.recalculateReputation(item.sellerId);
      }
    }
    item.updatedAt = new Date().toISOString();

    return item;
  }

  public submitSellerAppeal(
    listingId: string,
    sellerId: string,
    statement: string,
    documentUrls: string[]
  ): ProductListingModeration {
    const item = this.moderatedListings.find((m) => m.id === listingId);
    if (!item) throw new Error(`Moderation item ${listingId} not found`);
    if (item.sellerId !== sellerId) throw new Error('Unauthorized to appeal this listing');

    item.status = 'UNDER_APPEAL';
    item.appeal = {
      id: `APL-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      sellerStatement: statement,
      proofDocumentUrls: documentUrls,
      status: 'PENDING',
    };
    item.updatedAt = new Date().toISOString();

    return item;
  }

  public reviewAppeal(
    listingId: string,
    adminId: string,
    decision: 'APPROVED' | 'REJECTED',
    reviewNotes: string
  ): ProductListingModeration {
    const item = this.moderatedListings.find((m) => m.id === listingId);
    if (!item) throw new Error(`Listing ${listingId} not found`);
    if (!item.appeal) throw new Error('No appeal on record for this listing');

    item.appeal.status = decision;
    item.appeal.reviewedBy = adminId;
    item.appeal.reviewNotes = reviewNotes;
    item.appeal.reviewedAt = new Date().toISOString();

    if (decision === 'APPROVED') {
      item.status = 'CLEARED';
      if (item.strikeIssued) {
        item.strikeIssued = false;
        const rep = this.sellerReputations.get(item.sellerId);
        if (rep && rep.activeStrikesCount > 0) {
          rep.activeStrikesCount -= 1;
        }
      }
    } else {
      item.status = 'SUPPRESSED';
    }

    item.updatedAt = new Date().toISOString();
    this.recalculateReputation(item.sellerId);

    return item;
  }

  // ==========================================
  // SELLER TRUST, REPUTATION & BADGES
  // ==========================================

  public getSellerReputation(merchantId: string): SellerTrustReputation | undefined {
    return this.sellerReputations.get(merchantId);
  }

  public getAllSellerReputations(): SellerTrustReputation[] {
    return Array.from(this.sellerReputations.values()).sort((a, b) => b.trustScore - a.trustScore);
  }

  public togglePayoutHold(merchantId: string, holdStatus: boolean, reason: string): SellerTrustReputation {
    const rep = this.sellerReputations.get(merchantId);
    if (!rep) throw new Error(`Merchant ${merchantId} reputation record not found`);

    rep.payoutHoldStatus = holdStatus;
    rep.lastAuditedAt = new Date().toISOString();

    logger.info(`Payout hold for ${merchantId} set to ${holdStatus}. Reason: ${reason}`, 'TrustSafetyService');
    return rep;
  }

  public recalculateReputation(merchantId: string): SellerTrustReputation | undefined {
    const rep = this.sellerReputations.get(merchantId);
    if (!rep) return undefined;

    const sellerDisputes = this.disputes.filter((d) => d.sellerId === merchantId);
    const activeDisputes = sellerDisputes.filter((d) => !['RESOLVED', 'REJECTED', 'CLOSED'].includes(d.status));
    const resolvedDisputes = sellerDisputes.filter((d) => ['RESOLVED', 'REJECTED', 'CLOSED'].includes(d.status));

    rep.activeDisputesCount = activeDisputes.length;
    rep.resolvedDisputesCount = resolvedDisputes.length;

    // Trust calculation heuristic
    let score = 98; // Base excellent
    score -= rep.activeStrikesCount * 15;
    score -= rep.activeDisputesCount * 5;
    if (rep.disputeRatePct > 1.5) score -= 12;
    if (rep.cancellationRatePct > 2.0) score -= 8;
    if (rep.fulfillmentRatePct < 96.0) score -= 10;

    rep.trustScore = Math.max(20, Math.min(100, Math.round(score)));

    // Badging logic
    if (rep.activeStrikesCount >= 3 || rep.trustScore < 40) {
      rep.badge = 'RESTRICTED';
      rep.payoutHoldStatus = true;
    } else if (rep.activeStrikesCount > 0 || rep.trustScore < 70) {
      rep.badge = 'PROBATION_WARNING';
    } else if (rep.trustScore >= 92 && rep.fulfillmentRatePct >= 99.0) {
      rep.badge = 'VERIFIED_LEADER';
    } else if (rep.trustScore >= 80) {
      rep.badge = 'TRUSTED_MERCHANT';
    } else {
      rep.badge = 'STANDARD';
    }

    rep.lastAuditedAt = new Date().toISOString();
    return rep;
  }

  // ==========================================
  // DASHBOARD KPI METRICS
  // ==========================================

  public getTrustSafetyMetrics(): TrustSafetyMetrics {
    const activeDisputes = this.disputes.filter((d) => !['RESOLVED', 'REJECTED', 'CLOSED'].includes(d.status)).length;
    const openReports = this.reports.filter((r) => r.status === 'SUBMITTED' || r.status === 'UNDER_INVESTIGATION').length;
    const highRiskTx = this.fraudAssessments.filter((f) => f.riskTier === 'HIGH' || f.riskTier === 'CRITICAL').length;
    const modQueue = this.moderatedListings.filter((m) => m.status === 'FLAGGED' || m.status === 'UNDER_APPEAL').length;
    const payoutHolds = Array.from(this.sellerReputations.values()).filter((r) => r.payoutHoldStatus).length;

    return {
      totalActiveDisputes: activeDisputes,
      openReportsCount: openReports,
      highRiskTransactionsCount: highRiskTx,
      moderationQueueCount: modQueue,
      payoutHoldsCount: payoutHolds,
      avgResolutionTimeHours: 18.4,
      disputeRateMarketplacePct: 0.68,
      preventedFraudLossUsd: 142850,
    };
  }

  // ==========================================
  // SEED INITIAL REALISTIC MOCK DATA
  // ==========================================

  private seedInitialData(): void {
    // 1. Seed Seller Reputations
    const initialMerchants: SellerTrustReputation[] = [
      {
        merchantId: 'merch-01',
        storeName: 'AeroTech Electronics Global',
        logoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80',
        tier: 'flagship',
        trustScore: 96,
        badge: 'VERIFIED_LEADER',
        disputeRatePct: 0.42,
        fulfillmentRatePct: 99.4,
        cancellationRatePct: 0.2,
        activeDisputesCount: 1,
        resolvedDisputesCount: 88,
        activeStrikesCount: 0,
        payoutHoldStatus: false,
        lastAuditedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        merchantId: 'merch-02',
        storeName: 'Quantum Dynamics Store',
        logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80',
        tier: 'enterprise',
        trustScore: 91,
        badge: 'TRUSTED_MERCHANT',
        disputeRatePct: 0.85,
        fulfillmentRatePct: 98.2,
        cancellationRatePct: 0.8,
        activeDisputesCount: 1,
        resolvedDisputesCount: 42,
        activeStrikesCount: 0,
        payoutHoldStatus: false,
        lastAuditedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        merchantId: 'merch-03',
        storeName: 'Apex Industrial Robotics',
        logoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80',
        tier: 'verified',
        trustScore: 84,
        badge: 'STANDARD',
        disputeRatePct: 1.25,
        fulfillmentRatePct: 96.5,
        cancellationRatePct: 1.4,
        activeDisputesCount: 2,
        resolvedDisputesCount: 29,
        activeStrikesCount: 1,
        payoutHoldStatus: false,
        lastAuditedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        merchantId: 'merch-04',
        storeName: 'Velocita Direct Gear',
        logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
        tier: 'standard',
        trustScore: 62,
        badge: 'PROBATION_WARNING',
        disputeRatePct: 3.1,
        fulfillmentRatePct: 92.1,
        cancellationRatePct: 4.2,
        activeDisputesCount: 3,
        resolvedDisputesCount: 11,
        activeStrikesCount: 2,
        payoutHoldStatus: true,
        lastAuditedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];

    for (const m of initialMerchants) {
      this.sellerReputations.set(m.merchantId, m);
    }

    // 2. Seed Initial Disputes
    this.disputes = [
      {
        id: 'DSP-2026-1042',
        orderId: 'ord-101',
        orderNumber: 'CZ-98214',
        productId: 'prod-01',
        productTitle: 'AeroBook Pro M3 Max Workstation',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
        buyerId: 'usr-buyer-01',
        buyerName: 'Alex Mercer (Design Lead)',
        buyerEmail: 'alex.mercer@enterprise.co',
        sellerId: 'merch-01',
        sellerName: 'AeroTech Electronics Global',
        category: 'DAMAGED_OR_DEFECTIVE',
        status: 'AWAITING_SELLER_RESPONSE',
        claimedAmount: 2499.0,
        currency: 'USD',
        description:
          'Upon unboxing the laptop, the top aluminum lid suffered a deep dent and the Retina display panel exhibits severe vertical flickering lines.',
        desiredOutcome: 'REPLACEMENT',
        trackingNumber: 'FX-88492019US',
        carrier: 'FedEx Priority',
        evidence: [
          {
            id: 'EVD-101',
            uploadedBy: 'BUYER',
            uploaderName: 'Alex Mercer',
            type: 'PHOTO',
            title: 'Damaged Display Box & Dented Chassis',
            fileUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
            timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
          },
        ],
        messages: [
          {
            id: 'MSG-001',
            senderRole: 'BUYER',
            senderName: 'Alex Mercer',
            content:
              'Package arrived with crushed outer courier seal. Opening the inner box revealed screen damage. Please expedite a replacement unit under priority exchange.',
            timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
          },
        ],
        timeline: [
          {
            id: 'TL-001',
            action: 'DISPUTE_FILED',
            actor: 'Alex Mercer',
            actorRole: 'BUYER',
            details: 'Filed dispute for DAMAGED_OR_DEFECTIVE with photo evidence.',
            timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
          },
        ],
        escalatedToAdmin: false,
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
      {
        id: 'DSP-2026-0988',
        orderId: 'ord-102',
        orderNumber: 'CZ-77402',
        productId: 'prod-02',
        productTitle: 'Titan Quantum Sensor Hub Pro',
        productImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
        buyerId: 'usr-buyer-02',
        buyerName: 'Dr. Elena Rostova',
        buyerEmail: 'elena.rostova@lab-research.org',
        sellerId: 'merch-02',
        sellerName: 'Quantum Dynamics Store',
        category: 'ITEM_NOT_RECEIVED',
        status: 'RESOLUTION_PROPOSED',
        claimedAmount: 649.5,
        currency: 'USD',
        description: 'Tracking status says delivered 6 days ago at front door, but building concierge has zero record.',
        desiredOutcome: 'FULL_REFUND',
        trackingNumber: 'UPS-910283749',
        carrier: 'UPS Worldwide',
        proposedResolution: {
          type: 'FULL_REFUND',
          amount: 649.5,
          explanation:
            'Courier carrier confirmed delivery was routed to wrong street address. Full refund issued immediately.',
          proposedBy: 'SELLER',
          proposedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
          status: 'PENDING',
        },
        evidence: [
          {
            id: 'EVD-102',
            uploadedBy: 'SELLER',
            uploaderName: 'Quantum Dynamics Support',
            type: 'TRACKING_PROOF',
            title: 'Carrier Misdelivery Confirmation Report',
            referenceNumber: 'UPS-CLAIM-9921',
            notes: 'UPS dispatch admits driver misread suite number.',
            timestamp: new Date(Date.now() - 3600000 * 9).toISOString(),
          },
        ],
        messages: [
          {
            id: 'MSG-002',
            senderRole: 'BUYER',
            senderName: 'Dr. Elena Rostova',
            content: 'I waited 48 hours for courier investigation before opening this claim.',
            timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
          },
          {
            id: 'MSG-003',
            senderRole: 'SELLER',
            senderName: 'Quantum Support',
            content:
              'We deeply apologize Dr. Rostova. We opened a lost-in-transit claim with UPS and offer a 100% full refund.',
            timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          },
        ],
        timeline: [
          {
            id: 'TL-002',
            action: 'DISPUTE_FILED',
            actor: 'Dr. Elena Rostova',
            actorRole: 'BUYER',
            details: 'Reported non-receipt of sensor hub package.',
            timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
          },
          {
            id: 'TL-003',
            action: 'RESOLUTION_PROPOSED',
            actor: 'Quantum Support',
            actorRole: 'SELLER',
            details: 'Offered Full Refund ($649.50) with carrier admission.',
            timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          },
        ],
        escalatedToAdmin: false,
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
      {
        id: 'DSP-2026-0811',
        orderId: 'ord-103',
        orderNumber: 'CZ-63109',
        productId: 'prod-03',
        productTitle: 'Apex Heavy Duty Pneumatic Actuator',
        productImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        buyerId: 'usr-buyer-03',
        buyerName: 'Marcus Vance (Plant Mgr)',
        buyerEmail: 'm.vance@factoryops.com',
        sellerId: 'merch-03',
        sellerName: 'Apex Industrial Robotics',
        category: 'SIGNIFICANTLY_NOT_AS_DESCRIBED',
        status: 'ESCALATED',
        claimedAmount: 1200.0,
        currency: 'USD',
        description:
          'Listing stated 10 Bar rated stainless steel casing, but received mild steel casing with only 6 Bar rating stamp.',
        desiredOutcome: 'RETURN_FOR_REFUND',
        evidence: [
          {
            id: 'EVD-103',
            uploadedBy: 'BUYER',
            uploaderName: 'Marcus Vance',
            type: 'PHOTO',
            title: 'Factory Specification Plate Showing 6 Bar Rating',
            timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
        ],
        messages: [
          {
            id: 'MSG-004',
            senderRole: 'BUYER',
            senderName: 'Marcus Vance',
            content: 'This specification fails our safety code. Seller refuses to pay return freight.',
            timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
          {
            id: 'MSG-005',
            senderRole: 'SELLER',
            senderName: 'Apex Robotics Support',
            content: 'Our return policy requires customer to cover return freight for heavy industrial units.',
            timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
          },
          {
            id: 'MSG-006',
            senderRole: 'BUYER',
            senderName: 'Marcus Vance',
            content: 'You shipped the wrong spec product! Escalating to Commerce Zon administrator for arbitration.',
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
          },
        ],
        timeline: [
          {
            id: 'TL-004',
            action: 'DISPUTE_FILED',
            actor: 'Marcus Vance',
            actorRole: 'BUYER',
            details: 'Filed claim for SNAD specification mismatch.',
            timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
          },
          {
            id: 'TL-005',
            action: 'ESCALATED_TO_ARBITRATION',
            actor: 'Marcus Vance',
            actorRole: 'BUYER',
            details: 'Escalated to Marketplace Admin due to return shipping disagreement.',
            timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
          },
        ],
        escalatedToAdmin: true,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    ];

    // 3. Seed Marketplace Reports
    this.reports = [
      {
        id: 'REP-001',
        referenceNumber: 'REP-2026-8812',
        reporterId: 'usr-buyer-04',
        reporterName: 'Sarah Jenkins',
        reporterRole: 'BUYER',
        targetType: 'PRODUCT_LISTING',
        targetId: 'prod-fake-01',
        targetName: 'SuperAir Wireless Pods Pro [Counterfeit clone]',
        category: 'COUNTERFEIT_OR_REPLICA',
        severity: 'HIGH',
        status: 'SUBMITTED',
        description:
          'Listing uses copyrighted trademark logos and claims to be OEM genuine, but the price is $19 and customer reviews indicate fake microchips without serial numbers.',
        evidenceUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'REP-002',
        referenceNumber: 'REP-2026-6401',
        reporterId: 'merch-01',
        reporterName: 'AeroTech Electronics Global',
        reporterRole: 'SELLER',
        targetType: 'BUYER',
        targetId: 'usr-abusive-99',
        targetName: 'Buyer Account #9914 (Suspicious Chargeback Ring)',
        category: 'OFF_PLATFORM_PAYMENT',
        severity: 'CRITICAL',
        status: 'UNDER_INVESTIGATION',
        description:
          'Buyer messaged repeatedly requesting wire transfer outside Commerce Zon escrow and threatened fake negative reviews if we did not comply.',
        createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
      {
        id: 'REP-003',
        referenceNumber: 'REP-2026-3199',
        reporterId: 'usr-buyer-05',
        reporterName: 'David K. O’Connor',
        reporterRole: 'COMMUNITY',
        targetType: 'PRODUCT_LISTING',
        targetId: 'prod-mod-02',
        targetName: 'Medical Grade Laser Module High Output',
        category: 'PROHIBITED_OR_DANGEROUS',
        severity: 'CRITICAL',
        status: 'ACTION_TAKEN',
        actionTaken: 'LISTING_REMOVED',
        resolutionNotes: 'Uncertified Class IV laser exceeding consumer safety regulations. Listing permanently suppressed.',
        reviewedByAdmin: 'admin-sec-01',
        description: 'Listing exceeds safe consumer optical wattages and lacks FDA/CE radiation safety documentation.',
        createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 16).toISOString(),
      },
    ];

    // 4. Seed Fraud Risk Assessments
    this.fraudAssessments = [
      {
        id: 'FRAUD-901',
        entityType: 'ORDER',
        entityId: 'ord-8831',
        entityName: 'Order #CZ-99120 ($4,850.00)',
        riskScore: 84,
        riskTier: 'CRITICAL',
        signals: [
          {
            signalKey: 'GEO_COUNTRY_MISMATCH',
            label: 'Billing & Shipping Geo Discrepancy',
            severity: 'ALERT',
            scoreContribution: 35,
            details: 'Card issued in Brazil (BR), order destination address in Lagos, Nigeria (NG).',
          },
          {
            signalKey: 'HIGH_VALUE_TRANSACTION',
            label: 'Order Volume Spike',
            severity: 'WARNING',
            scoreContribution: 25,
            details: 'First-time buyer spending $4,850.00 within 2 minutes of account creation.',
          },
          {
            signalKey: 'DISPOSABLE_EMAIL_DETECTED',
            label: 'Disposable Mailbox',
            severity: 'ALERT',
            scoreContribution: 24,
            details: 'Email domain registered on tempmail.com.',
          },
        ],
        automatedDecision: 'BLOCK',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'FRAUD-902',
        entityType: 'ORDER',
        entityId: 'ord-8832',
        entityName: 'Order #CZ-99124 ($1,290.00)',
        riskScore: 58,
        riskTier: 'HIGH',
        signals: [
          {
            signalKey: 'CARD_VELOCITY_BURST',
            label: 'Multiple Failed CVC Attempts',
            severity: 'WARNING',
            scoreContribution: 30,
            details: '4 consecutive card attempts failed checksum before authorization succeeded.',
          },
          {
            signalKey: 'PROXY_VPN_IP',
            label: 'Commercial Datacenter Proxy Address',
            severity: 'WARNING',
            scoreContribution: 28,
            details: 'User IP originates from Linode Cloud ASN rather than residential broadband.',
          },
        ],
        automatedDecision: 'HOLD_PAYOUT',
        timestamp: new Date(Date.now() - 3600000 * 7).toISOString(),
      },
      {
        id: 'FRAUD-903',
        entityType: 'ORDER',
        entityId: 'ord-8833',
        entityName: 'Order #CZ-99140 ($189.00)',
        riskScore: 12,
        riskTier: 'LOW',
        signals: [
          {
            signalKey: 'VERIFIED_BUYER_HISTORY',
            label: 'Established Prime Account Profile',
            severity: 'INFO',
            scoreContribution: 0,
            details: 'Buyer has 24 successful orders and matching residential address.',
          },
        ],
        automatedDecision: 'APPROVE',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
    ];

    // 5. Seed Moderated Listings
    this.moderatedListings = [
      {
        id: 'MOD-001',
        productId: 'prod-mod-01',
        productTitle: 'Luxury Chronograph Designer Tourbillon [Direct Replica]',
        productImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
        sellerId: 'merch-04',
        sellerName: 'Velocita Direct Gear',
        category: 'fashion',
        violationType: 'COUNTERFEIT',
        flaggedBy: 'AI_VISION_OCR',
        status: 'SUPPRESSED',
        evidenceNotes: 'AI Optical OCR identified protected Swiss trademark insignia with counterfeit price disparity.',
        strikeIssued: true,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: 'MOD-002',
        productId: 'prod-mod-02',
        productTitle: 'Ultra Titanium Carbide Cutting Drill Bits 50-Pack',
        productImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80',
        sellerId: 'merch-03',
        sellerName: 'Apex Industrial Robotics',
        category: 'industrial',
        violationType: 'MISLEADING_TITLE_PRICING',
        flaggedBy: 'USER_REPORT',
        status: 'UNDER_APPEAL',
        evidenceNotes: 'Customer complaints stating bits are zinc alloy rather than titanium carbide spec.',
        strikeIssued: false,
        appeal: {
          id: 'APL-101',
          submittedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
          sellerStatement:
            'We have uploaded official metallurgy chemical test certificates and ISO 9001 factory inspection sheets showing full TiC coating conformity.',
          proofDocumentUrls: ['https://example.com/docs/iso9001-metallurgy-cert.pdf'],
          status: 'PENDING',
        },
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
      {
        id: 'MOD-003',
        productId: 'prod-mod-03',
        productTitle: 'Enterprise Server Rackmount KVM Console Switch',
        productImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
        sellerId: 'merch-01',
        sellerName: 'AeroTech Electronics Global',
        category: 'computing',
        violationType: 'KEYWORD_SPAM',
        flaggedBy: 'MANUAL_AUDIT',
        status: 'CLEARED',
        evidenceNotes: 'Audited title keyword stuffing. Seller revised title and metadata to strict standard format.',
        strikeIssued: false,
        createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ];
  }
}

export const trustSafetyService = new TrustSafetyService();
