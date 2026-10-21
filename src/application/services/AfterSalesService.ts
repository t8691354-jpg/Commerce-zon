/**
 * Commerce Zon Marketplace - Part 18: Returns, Refunds, Cancellations & After-Sales Service Engine
 * Handles Policy Configuration, Return Window Validation, Multi-Seller Return Processing,
 * Quality Inspection, Safe Inventory Restock, Safe Cancellations, and Cumulative Refund Safeguards.
 */

import {
  ReturnRequest,
  ReturnStatus,
  ReturnReason,
  InspectionCondition,
  RefundMethod,
  CategoryReturnPolicy,
  ReturnMessage,
  ReturnInspectionReport,
} from '../../types/returns';
import { MOCK_CATEGORY_POLICIES, MOCK_RETURN_REQUESTS, MOCK_RETURN_MESSAGES } from '../../data/returnsMockData';
import { auditService } from './AuditService';
import { notificationService } from './NotificationService';
import { trustSafetyService } from './TrustSafetyService';
import { logger } from '../../infrastructure/logging/Logger';

export interface CancellationRequest {
  cancellationId: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  cancelledBy: 'BUYER' | 'SELLER' | 'ADMIN';
  actorId: string;
  reason: string;
  itemSkus?: string[]; // If partial cancellation, specific SKUs. If undefined, whole order.
  cancelledAt: string;
  refundAmountUSD: number;
  inventoryRestored: boolean;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
}

export interface RefundExecutionRequest {
  orderId: string;
  orderNumber: string;
  returnId?: string;
  cancellationId?: string;
  buyerId: string;
  sellerId: string;
  amountUSD: number;
  reason: string;
  refundMethod: RefundMethod;
  actorRole: 'SELLER' | 'ADMIN' | 'SYSTEM';
  actorId: string;
  maxOrderTotalUSD?: number;
  notes?: string;
}

export interface RefundRecord {
  refundId: string;
  orderId: string;
  orderNumber: string;
  returnId?: string;
  cancellationId?: string;
  buyerId: string;
  sellerId: string;
  amountUSD: number;
  currency: string;
  refundMethod: RefundMethod;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  processedAt: string;
  processedBy: string;
  providerReference: string;
  notes?: string;
}

export class AfterSalesService {
  private returnRequests: Map<string, ReturnRequest> = new Map();
  private policies: Map<string, CategoryReturnPolicy> = new Map();
  private messages: Map<string, ReturnMessage[]> = new Map();
  private cancellations: Map<string, CancellationRequest> = new Map();
  private refunds: Map<string, RefundRecord> = new Map();
  private orderCumulativeRefunds: Map<string, number> = new Map();
  private inventoryRestorationRecords: Set<string> = new Set(); // Prevent duplicate restock

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed policies
    MOCK_CATEGORY_POLICIES.forEach((p) => {
      this.policies.set(p.category.toLowerCase(), p);
    });

    // Default catch-all policy if not specifically configured
    if (!this.policies.has('default')) {
      this.policies.set('default', {
        category: 'Standard Marketplace Goods',
        returnWindowDays: 30,
        isReturnable: true,
        requiresInspection: true,
        restockingFeePercent: 0,
        allowAutoApproval: true,
        autoApprovalMaxUSD: 50,
      });
    }

    // Seed returns
    MOCK_RETURN_REQUESTS.forEach((r) => {
      this.returnRequests.set(r.returnId, r);
      if (r.refundAmountUSD && r.status === 'REFUND_PROCESSED') {
        const cur = this.orderCumulativeRefunds.get(r.orderId) || 0;
        this.orderCumulativeRefunds.set(r.orderId, Number((cur + r.refundAmountUSD).toFixed(2)));
      }
    });

    // Seed messages
    MOCK_RETURN_MESSAGES.forEach((m) => {
      const arr = this.messages.get(m.returnId) || [];
      arr.push(m);
      this.messages.set(m.returnId, arr);
    });

    // Seed a completed refund record
    const seedRefund: RefundRecord = {
      refundId: 'RFND-2026-1001',
      orderId: 'ORD-77801-US',
      orderNumber: 'CZ-ORD-2026-901',
      returnId: 'RMA-90412',
      buyerId: 'USR-8821',
      sellerId: 'merch-01',
      amountUSD: 149.99,
      currency: 'USD',
      refundMethod: 'ORIGINAL_PAYMENT',
      status: 'PROCESSED',
      processedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      processedBy: 'SYSTEM',
      providerReference: 'STRIPE_RE_9918239012',
      notes: 'Initial seed refund for approved return',
    };
    this.refunds.set(seedRefund.refundId, seedRefund);
  }

  // --------------------------------------------------------------------------
  // 1. POLICY CONFIGURATION & ELIGIBILITY ENGINE
  // --------------------------------------------------------------------------

  public getCategoryPolicy(categoryName: string): CategoryReturnPolicy {
    const key = (categoryName || '').toLowerCase().trim();
    for (const [catKey, pol] of this.policies.entries()) {
      if (key.includes(catKey) || catKey.includes(key)) {
        return pol;
      }
    }
    return this.policies.get('default') || {
      category: categoryName || 'General',
      returnWindowDays: 30,
      isReturnable: true,
      requiresInspection: true,
      restockingFeePercent: 0,
      allowAutoApproval: false,
      autoApprovalMaxUSD: 0,
    };
  }

  public getAllPolicies(): CategoryReturnPolicy[] {
    return Array.from(this.policies.values());
  }

  public updatePolicy(policy: CategoryReturnPolicy, adminId: string): CategoryReturnPolicy {
    this.policies.set(policy.category.toLowerCase().trim(), policy);
    auditService.recordEvent(
      'SYSTEM',
      adminId,
      'RETURN_POLICY_UPDATED',
      'ORDER',
      `Updated return policy for category '${policy.category}' (Window: ${policy.returnWindowDays}d, Returnable: ${policy.isReturnable})`
    );
    logger.info(`[AfterSalesService] Updated return policy for category: ${policy.category}`);
    return policy;
  }

  public checkReturnEligibility(params: {
    category: string;
    purchaseDate: string;
    deliveryDate?: string;
    itemPriceUSD: number;
    orderStatus: string;
  }): {
    isEligible: boolean;
    daysRemaining: number;
    policy: CategoryReturnPolicy;
    reason?: string;
  } {
    const policy = this.getCategoryPolicy(params.category);

    if (!policy.isReturnable) {
      return {
        isEligible: false,
        daysRemaining: 0,
        policy,
        reason: `Items in '${policy.category}' are non-returnable under marketplace consumer protection standards.`,
      };
    }

    if (params.orderStatus === 'CANCELLED') {
      return {
        isEligible: false,
        daysRemaining: 0,
        policy,
        reason: 'Order has already been cancelled.',
      };
    }

    const baselineDate = params.deliveryDate ? new Date(params.deliveryDate) : new Date(params.purchaseDate);
    const msPassed = Date.now() - baselineDate.getTime();
    const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, policy.returnWindowDays - daysPassed);

    if (daysPassed > policy.returnWindowDays) {
      return {
        isEligible: false,
        daysRemaining: 0,
        policy,
        reason: `Return window expired. Returns for '${policy.category}' must be requested within ${policy.returnWindowDays} days of delivery (requested ${daysPassed} days after delivery).`,
      };
    }

    return {
      isEligible: true,
      daysRemaining,
      policy,
    };
  }

  // --------------------------------------------------------------------------
  // 2. BUYER RETURN REQUEST SUBMISSION (RMA)
  // --------------------------------------------------------------------------

  public async submitReturnRequest(params: {
    orderId: string;
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
    sellerId: string;
    sellerName: string;
    item: {
      sku: string;
      name: string;
      category: string;
      quantity: number;
      unitPriceUSD: number;
      imageUrl?: string;
    };
    reason: ReturnReason;
    comments: string;
    proofImages: string[];
    resolutionRequested?: 'REFUND' | 'EXCHANGE' | 'REPLACEMENT';
    purchaseDate?: string;
    deliveryDate?: string;
  }): Promise<ReturnRequest> {
    if (!params.orderId || !params.buyerId || !params.item?.sku) {
      throw new Error('orderId, buyerId, and item details are required to submit a return request.');
    }

    // Duplicate check: check if an active return already exists for this order item
    const existing = Array.from(this.returnRequests.values()).find(
      (r) =>
        r.orderId === params.orderId &&
        r.item.sku === params.item.sku &&
        r.status !== 'REJECTED' &&
        r.status !== 'CLOSED' &&
        r.status !== 'CANCELLED'
    );

    if (existing) {
      throw new Error(
        `Duplicate Return Request: Active return request (${existing.returnId}) already exists for SKU ${params.item.sku}.`
      );
    }

    // Check policy eligibility
    const purchaseDate = params.purchaseDate || new Date(Date.now() - 86400000 * 5).toISOString();
    const eligibility = this.checkReturnEligibility({
      category: params.item.category || 'General',
      purchaseDate,
      deliveryDate: params.deliveryDate,
      itemPriceUSD: params.item.unitPriceUSD,
      orderStatus: 'DELIVERED',
    });

    if (!eligibility.isEligible) {
      throw new Error(`Ineligible for Return: ${eligibility.reason}`);
    }

    const rmaNumber = `RMA-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const totalItemValue = Number((params.item.unitPriceUSD * params.item.quantity).toFixed(2));

    const newRequest: ReturnRequest = {
      returnId: rmaNumber,
      orderId: params.orderId,
      buyerId: params.buyerId,
      buyerName: params.buyerName,
      buyerEmail: params.buyerEmail,
      sellerId: params.sellerId,
      sellerName: params.sellerName,
      item: {
        sku: params.item.sku,
        name: params.item.name,
        category: params.item.category || 'General',
        quantity: params.item.quantity,
        unitPriceUSD: params.item.unitPriceUSD,
        imageUrl: params.item.imageUrl,
        sellerId: params.sellerId,
        sellerName: params.sellerName,
      },
      reason: params.reason,
      comments: params.comments || 'No comments provided',
      proofImages: params.proofImages || [],
      resolutionRequested: params.resolutionRequested || 'REFUND',
      status: 'SELLER_REVIEW',
      createdAt: now,
      updatedAt: now,
      policyWindowDays: eligibility.policy.returnWindowDays,
      purchaseDate,
      refundAmountUSD: totalItemValue,
      refundMethod: 'WALLET_CREDIT',
      fraudDetails: {
        fraudRiskScore: 12,
        riskFlags: [],
        requiresAdminOverride: false,
        isFrozen: false,
      },
    };

    this.returnRequests.set(newRequest.returnId, newRequest);

    // Initial communication message
    const firstMsg: ReturnMessage = {
      id: `msg-${Date.now()}`,
      returnId: newRequest.returnId,
      senderRole: 'BUYER',
      senderName: params.buyerName,
      message: `Return request opened. Reason: ${params.reason.replace(/_/g, ' ')}. ${params.comments}`,
      timestamp: now,
      attachments: params.proofImages,
    };
    this.messages.set(newRequest.returnId, [firstMsg]);

    // In-app notification to Seller
    await notificationService.sendNotification({
      recipientId: params.sellerId,
      role: 'Seller',
      category: 'Returns',
      channel: 'in_app',
      title: `New Return Request ${newRequest.returnId}`,
      body: `Buyer ${params.buyerName} submitted return for SKU ${params.item.sku} on Order #${params.orderId}.`,
      priority: 'normal',
    });

    auditService.recordEvent(
      'MOCK_USER',
      params.buyerId,
      'RETURN_REQUEST_CREATED',
      'ORDER',
      `Created return request ${newRequest.returnId} on order ${params.orderId}`
    );

    return newRequest;
  }

  // --------------------------------------------------------------------------
  // 3. SELLER RETURN OPERATIONS & AUTHORIZATION
  // --------------------------------------------------------------------------

  public getSellerReturns(sellerId: string): ReturnRequest[] {
    if (!sellerId) return [];
    return Array.from(this.returnRequests.values())
      .filter((r) => r.sellerId === sellerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBuyerReturns(buyerId: string): ReturnRequest[] {
    if (!buyerId) return [];
    return Array.from(this.returnRequests.values())
      .filter((r) => r.buyerId === buyerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getReturnById(returnId: string): ReturnRequest | null {
    return this.returnRequests.get(returnId) || null;
  }

  public async sellerApproveReturn(params: {
    returnId: string;
    sellerId: string;
    returnAddress: string;
    instructions: string;
    returnCarrier?: string;
  }): Promise<ReturnRequest> {
    const returnReq = this.getReturnById(params.returnId);
    if (!returnReq) throw new Error(`Return request '${params.returnId}' not found.`);

    if (returnReq.sellerId !== params.sellerId) {
      throw new Error('Forbidden: You can only approve returns for items sold by your merchant store.');
    }

    if (returnReq.status !== 'REQUESTED' && returnReq.status !== 'SELLER_REVIEW') {
      throw new Error(`Cannot approve return in current status '${returnReq.status}'.`);
    }

    const now = new Date().toISOString();
    returnReq.status = 'APPROVED';
    returnReq.updatedAt = now;
    returnReq.sellerNotes = params.instructions;
    returnReq.shippingLabel = {
      carrier: params.returnCarrier || 'Commerce Zon Regional Logistics Return Network',
      trackingNumber: `RET-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      labelUrl: `/api/after-sales/returns/${returnReq.returnId}/label`,
      qrCodeUrl: `/api/after-sales/returns/${returnReq.returnId}/qr`,
      returnAddress: params.returnAddress || '100 Returns Depot Way, Suite 4, Newark NJ 07102',
    };

    // Add communication message
    const msg: ReturnMessage = {
      id: `msg-${Date.now()}`,
      returnId: returnReq.returnId,
      senderRole: 'SELLER',
      senderName: returnReq.sellerName,
      message: `Return Approved! Please send package to: ${returnReq.shippingLabel.returnAddress}. Instructions: ${params.instructions}`,
      timestamp: now,
    };
    const msgs = this.messages.get(returnReq.returnId) || [];
    msgs.push(msg);
    this.messages.set(returnReq.returnId, msgs);

    // Notify Buyer
    await notificationService.sendNotification({
      recipientId: returnReq.buyerId,
      role: 'Buyer',
      category: 'Returns',
      channel: 'in_app',
      title: `Return Request Approved (${returnReq.returnId})`,
      body: `Merchant approved your return. Return shipping label and instructions are ready in your portal.`,
      priority: 'high',
    });

    auditService.recordEvent(
      'MOCK_MERCHANT',
      params.sellerId,
      'RETURN_APPROVED',
      'ORDER',
      `Merchant approved return ${returnReq.returnId}`
    );

    return returnReq;
  }

  public async sellerRejectReturn(params: {
    returnId: string;
    sellerId: string;
    reason: string;
  }): Promise<ReturnRequest> {
    const returnReq = this.getReturnById(params.returnId);
    if (!returnReq) throw new Error(`Return request '${params.returnId}' not found.`);

    if (returnReq.sellerId !== params.sellerId) {
      throw new Error('Forbidden: You can only action returns for items sold by your store.');
    }

    const now = new Date().toISOString();
    returnReq.status = 'REJECTED';
    returnReq.updatedAt = now;
    returnReq.sellerNotes = `Rejected by seller: ${params.reason}`;

    const msg: ReturnMessage = {
      id: `msg-${Date.now()}`,
      returnId: returnReq.returnId,
      senderRole: 'SELLER',
      senderName: returnReq.sellerName,
      message: `Return request rejected by seller. Reason: ${params.reason}`,
      timestamp: now,
    };
    const msgs = this.messages.get(returnReq.returnId) || [];
    msgs.push(msg);
    this.messages.set(returnReq.returnId, msgs);

    // Notify Buyer with option to escalate
    await notificationService.sendNotification({
      recipientId: returnReq.buyerId,
      role: 'Buyer',
      category: 'Returns',
      channel: 'in_app',
      title: `Return Request Rejected (${returnReq.returnId})`,
      body: `Merchant declined return: "${params.reason}". You may escalate to platform arbitration if you believe this is incorrect.`,
      priority: 'high',
    });

    auditService.recordEvent(
      'MOCK_MERCHANT',
      params.sellerId,
      'RETURN_REJECTED',
      'ORDER',
      `Merchant rejected return ${returnReq.returnId}: ${params.reason}`
    );

    return returnReq;
  }

  // --------------------------------------------------------------------------
  // 4. RETURN SHIPPING & QUALITY INSPECTION (WAREHOUSE)
  // --------------------------------------------------------------------------

  public async markReturnShippedByBuyer(params: {
    returnId: string;
    buyerId: string;
    carrier: string;
    trackingNumber: string;
  }): Promise<ReturnRequest> {
    const returnReq = this.getReturnById(params.returnId);
    if (!returnReq) throw new Error(`Return '${params.returnId}' not found.`);
    if (returnReq.buyerId !== params.buyerId) throw new Error('Forbidden: Not authorized.');

    const now = new Date().toISOString();
    returnReq.status = 'SHIPPED_BY_BUYER';
    returnReq.updatedAt = now;
    if (returnReq.shippingLabel) {
      returnReq.shippingLabel.carrier = params.carrier || returnReq.shippingLabel.carrier;
      returnReq.shippingLabel.trackingNumber = params.trackingNumber || returnReq.shippingLabel.trackingNumber;
    }

    return returnReq;
  }

  public async recordWarehouseReceiptAndInspection(params: {
    returnId: string;
    inspectorId: string;
    inspectorName: string;
    condition: InspectionCondition;
    packagingCondition: 'INTACT' | 'DAMAGED' | 'MISSING';
    notes: string;
    inspectionResult:
      | 'APPROVED_FOR_FULL_REFUND'
      | 'APPROVED_FOR_PARTIAL_REFUND'
      | 'APPROVED_FOR_EXCHANGE'
      | 'REJECTED_CUSTOMER_DAMAGED';
    restockingFeeUSD?: number;
  }): Promise<{ returnRequest: ReturnRequest; inventoryRestored: boolean }> {
    const returnReq = this.getReturnById(params.returnId);
    if (!returnReq) throw new Error(`Return '${params.returnId}' not found.`);

    const now = new Date().toISOString();
    const fee = Number((params.restockingFeeUSD || 0).toFixed(2));

    const inspectionReport: ReturnInspectionReport = {
      inspectorId: params.inspectorId,
      inspectorName: params.inspectorName,
      inspectionDate: now,
      productCondition: params.condition,
      packagingCondition: params.packagingCondition,
      missingAccessories: [],
      damagePhotosUrl: [],
      notes: params.notes,
      inspectionResult: params.inspectionResult,
      restockingFeeUSD: fee,
    };

    returnReq.inspection = inspectionReport;
    returnReq.status = 'QUALITY_INSPECTED';
    returnReq.updatedAt = now;

    // INVENTORY RESTORATION CHECK (Requirement 8 & 12):
    // Only resellable condition goods can be restored to live sellable inventory.
    // Damaged goods are marked SCRAP or RETURN_TO_SELLER to prevent corrupted stock!
    let inventoryRestored = false;
    const restockKey = `restock-${returnReq.returnId}-${returnReq.item.sku}`;

    if (
      (params.condition === 'RESELLABLE_NEW' || params.condition === 'RESELLABLE_OPEN_BOX') &&
      !this.inventoryRestorationRecords.has(restockKey)
    ) {
      this.inventoryRestorationRecords.add(restockKey);
      inventoryRestored = true;
      logger.info(
        `[AfterSalesService] Safe Inventory Restocked: ${returnReq.item.quantity} units of SKU ${returnReq.item.sku} returned to warehouse pool.`
      );
    } else {
      logger.warn(
        `[AfterSalesService] Item condition is '${params.condition}'. Not restored to active sellable inventory.`
      );
    }

    // Auto calculate adjusted refund amount after restocking fee
    if (returnReq.refundAmountUSD) {
      returnReq.refundAmountUSD = Math.max(0, Number((returnReq.refundAmountUSD - fee).toFixed(2)));
    }

    auditService.recordEvent(
      'SYSTEM',
      params.inspectorId,
      'RETURN_QUALITY_INSPECTED',
      'ORDER',
      `Inspection completed on ${returnReq.returnId}. Condition: ${params.condition}, Result: ${params.inspectionResult}, Restocked: ${inventoryRestored}`
    );

    return { returnRequest: returnReq, inventoryRestored };
  }

  // --------------------------------------------------------------------------
  // 5. CANCELLATION ENGINE (ORDER & ITEM CANCELLATIONS)
  // --------------------------------------------------------------------------

  public async requestOrderCancellation(params: {
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    cancelledBy: 'BUYER' | 'SELLER' | 'ADMIN';
    actorId: string;
    reason: string;
    itemSkus?: string[];
    orderStatus: string;
    orderTotalUSD: number;
  }): Promise<CancellationRequest> {
    if (!params.orderId) throw new Error('orderId is required for cancellation.');

    // Enforce cancellation rules based on order fulfillment status
    // Cancellation is permitted only before dispatch (CREATED, PROCESSING, PACKED)
    const nonCancellableStatuses = ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'];
    if (params.cancelledBy !== 'ADMIN' && nonCancellableStatuses.includes(params.orderStatus)) {
      throw new Error(
        `Order #${params.orderNumber} cannot be cancelled because it is already '${params.orderStatus}'. Please wait for delivery and submit a Return Request.`
      );
    }

    // Duplicate check
    const existing = Array.from(this.cancellations.values()).find(
      (c) => c.orderId === params.orderId && c.status !== 'REJECTED'
    );
    if (existing) {
      throw new Error(`Cancellation already registered for Order #${params.orderNumber}.`);
    }

    const cancelId = `CNCL-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    // Safe stock reservation release exactly once
    const restockKey = `cancel-stock-${params.orderId}`;
    let inventoryRestored = false;
    if (!this.inventoryRestorationRecords.has(restockKey)) {
      this.inventoryRestorationRecords.add(restockKey);
      inventoryRestored = true;
      logger.info(`[AfterSalesService] Stock reservation released for cancelled Order #${params.orderNumber}.`);
    }

    const cancelRecord: CancellationRequest = {
      cancellationId: cancelId,
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      customerId: params.customerId,
      customerName: params.customerName,
      cancelledBy: params.cancelledBy,
      actorId: params.actorId,
      reason: params.reason,
      itemSkus: params.itemSkus,
      cancelledAt: now,
      refundAmountUSD: params.orderTotalUSD,
      inventoryRestored,
      status: 'COMPLETED',
    };

    this.cancellations.set(cancelId, cancelRecord);

    // Auto-credit or queue refund for buyer
    await this.executeRefund({
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      cancellationId: cancelId,
      buyerId: params.customerId,
      sellerId: 'merch-01',
      amountUSD: params.orderTotalUSD,
      reason: `Order Cancelled: ${params.reason}`,
      refundMethod: 'WALLET_CREDIT',
      actorRole: params.cancelledBy === 'ADMIN' ? 'ADMIN' : 'SYSTEM',
      actorId: params.actorId,
      notes: `Cancellation initiated by ${params.cancelledBy.toLowerCase()}`,
    });

    // Notify Customer
    await notificationService.sendNotification({
      recipientId: params.customerId,
      role: 'Buyer',
      category: 'Orders',
      channel: 'in_app',
      title: `Order Cancelled #${params.orderNumber}`,
      body: `Your order #${params.orderNumber} has been cancelled. Full refund of $${params.orderTotalUSD.toFixed(2)} USD credited.`,
      priority: 'high',
    });

    auditService.recordEvent(
      params.cancelledBy === 'ADMIN' ? 'SYSTEM' : 'MOCK_USER',
      params.actorId,
      'ORDER_CANCELLED',
      'ORDER',
      `Order ${params.orderNumber} cancelled by ${params.cancelledBy}. Restocked: ${inventoryRestored}`
    );

    return cancelRecord;
  }

  public async cancelOrder(params: {
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    cancelledBy: 'BUYER' | 'SELLER' | 'ADMIN';
    actorId: string;
    reason: string;
    itemSkus?: string[];
    orderStatus: string;
    orderTotalUSD: number;
  }): Promise<CancellationRequest> {
    return this.requestOrderCancellation(params);
  }

  // --------------------------------------------------------------------------
  // 6. SERVER-SIDE REFUND CALCULATION & EXECUTION (FINANCIAL SAFEGUARDS)
  // --------------------------------------------------------------------------

  public async executeRefund(req: RefundExecutionRequest): Promise<RefundRecord> {
    if (!req.orderId || !req.amountUSD || req.amountUSD <= 0) {
      throw new Error('Valid orderId and positive amountUSD are required for refund.');
    }

    // Financial arithmetic safety: avoid floating-point drift
    const refundAmt = Number(req.amountUSD.toFixed(2));

    // Cumulative refund safeguard: check previous refunds on this order
    const priorRefunded = this.orderCumulativeRefunds.get(req.orderId) || 0;
    if (req.maxOrderTotalUSD && priorRefunded + refundAmt > req.maxOrderTotalUSD) {
      throw new Error(
        `Cumulative Refund Violation: Total refunded ($${(priorRefunded + refundAmt).toFixed(2)}) exceeds maximum order value ($${req.maxOrderTotalUSD.toFixed(2)}).`
      );
    }
    if (refundAmt > 25000) {
      throw new Error(`Refund amount $${refundAmt} exceeds platform cumulative transaction limit.`);
    }
    
    // Idempotency check: if returnId already has a processed refund, prevent double refund
    if (req.returnId) {
      const existingReturnRefund = Array.from(this.refunds.values()).find(
        (rf) => rf.returnId === req.returnId && rf.status === 'PROCESSED'
      );
      if (existingReturnRefund) {
        throw new Error(
          `Idempotency Violation: Return ${req.returnId} has already been refunded via ${existingReturnRefund.refundId}.`
        );
      }
    }

    const refundId = `RFND-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const refundRecord: RefundRecord = {
      refundId,
      orderId: req.orderId,
      orderNumber: req.orderNumber,
      returnId: req.returnId,
      cancellationId: req.cancellationId,
      buyerId: req.buyerId,
      sellerId: req.sellerId,
      amountUSD: refundAmt,
      currency: 'USD',
      refundMethod: req.refundMethod,
      status: 'PROCESSED',
      processedAt: now,
      processedBy: `${req.actorRole}:${req.actorId}`,
      providerReference: `CZ_PAY_LEDGER_${Date.now()}`,
      notes: req.notes || req.reason,
    };

    this.refunds.set(refundId, refundRecord);
    this.orderCumulativeRefunds.set(req.orderId, Number((priorRefunded + refundAmt).toFixed(2)));

    // Update return request status if linked
    if (req.returnId) {
      const ret = this.getReturnById(req.returnId);
      if (ret) {
        ret.status = 'REFUND_PROCESSED';
        ret.updatedAt = now;
      }
    }

    // In-app notification to buyer
    await notificationService.sendNotification({
      recipientId: req.buyerId,
      role: 'Buyer',
      category: 'Refunds',
      channel: 'in_app',
      title: `Refund Processed ($${refundAmt.toFixed(2)} USD)`,
      body: `Refund for Order #${req.orderNumber} successfully processed via ${req.refundMethod.replace(/_/g, ' ')}.`,
      priority: 'high',
    });

    auditService.recordEvent(
      req.actorRole === 'ADMIN' ? 'SYSTEM' : 'MOCK_MERCHANT',
      req.actorId,
      'REFUND_EXECUTED',
      'ORDER',
      `Executed refund ${refundId} on order ${req.orderNumber} for $${refundAmt} USD (${req.refundMethod})`
    );

    return refundRecord;
  }

  // --------------------------------------------------------------------------
  // 7. DISPUTE ESCALATION (PART 15 INTEGRATION)
  // --------------------------------------------------------------------------

  public async escalateReturnToDispute(params: {
    returnId: string;
    actorRole: 'BUYER' | 'SELLER';
    actorId: string;
    actorName: string;
    reason: string;
  }): Promise<{ returnRequest: ReturnRequest; disputeId: string }> {
    const returnReq = this.getReturnById(params.returnId);
    if (!returnReq) throw new Error(`Return '${params.returnId}' not found.`);

    const now = new Date().toISOString();
    returnReq.status = 'ESCALATED';
    returnReq.updatedAt = now;

    // Create official dispute in TrustSafetyService
    const dispute = await trustSafetyService.createDispute({
      orderId: returnReq.orderId,
      orderNumber: returnReq.orderId,
      productId: returnReq.item.sku,
      productTitle: returnReq.item.name,
      productImage: returnReq.item.imageUrl,
      buyerId: returnReq.buyerId,
      buyerName: returnReq.buyerName,
      buyerEmail: returnReq.buyerEmail,
      sellerId: returnReq.sellerId,
      sellerName: returnReq.sellerName,
      category: 'RETURN_REFUND_DISAGREEMENT',
      claimedAmount: returnReq.refundAmountUSD || returnReq.item.unitPriceUSD,
      currency: 'USD',
      description: `Dispute escalated from Return Request ${returnReq.returnId}. Item: ${returnReq.item.name} ($${returnReq.item.unitPriceUSD}). Reason: ${params.reason}`,
      desiredOutcome: 'FULL_REFUND',
      initialEvidence: returnReq.proofImages?.[0]
        ? {
            title: 'Customer Return Evidence',
            fileUrl: returnReq.proofImages[0],
            type: 'PHOTO',
            notes: params.reason,
          }
        : undefined,
    });

    const disputeCaseId = dispute.id || (dispute as any).disputeId;
    const msg: ReturnMessage = {
      id: `msg-${Date.now()}`,
      returnId: returnReq.returnId,
      senderRole: params.actorRole,
      senderName: params.actorName,
      message: `Return escalated to Platform Arbitration. Formal Dispute Case opened: ${disputeCaseId}.`,
      timestamp: now,
    };
    const msgs = this.messages.get(returnReq.returnId) || [];
    msgs.push(msg);
    this.messages.set(returnReq.returnId, msgs);

    auditService.recordEvent(
      'SYSTEM',
      params.actorId,
      'RETURN_ESCALATED_TO_DISPUTE',
      'ORDER',
      `Return ${returnReq.returnId} escalated to dispute ${disputeCaseId}`
    );

    return { returnRequest: returnReq, disputeId: disputeCaseId };
  }

  public async escalateToDispute(
    returnId: string,
    actorRole: 'BUYER' | 'SELLER',
    actorId: string,
    actorName: string,
    reason: string
  ): Promise<{ returnRequest: ReturnRequest; disputeId: string }> {
    return this.escalateReturnToDispute({ returnId, actorRole, actorId, actorName, reason });
  }

  // --------------------------------------------------------------------------
  // 8. QUERY & HISTORY HELPERS
  // --------------------------------------------------------------------------

  public getAllReturns(): ReturnRequest[] {
    return Array.from(this.returnRequests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getAllRefunds(): RefundRecord[] {
    return Array.from(this.refunds.values()).sort(
      (a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
    );
  }

  public getAllCancellations(): CancellationRequest[] {
    return Array.from(this.cancellations.values()).sort(
      (a, b) => new Date(b.cancelledAt).getTime() - new Date(a.cancelledAt).getTime()
    );
  }

  public getReturnMessages(returnId: string): ReturnMessage[] {
    return this.messages.get(returnId) || [];
  }

  public addReturnMessage(
    returnId: string,
    senderRole: 'BUYER' | 'SELLER' | 'ADMIN' | 'WAREHOUSE',
    senderName: string,
    message: string,
    attachments?: string[]
  ): ReturnMessage {
    const msg: ReturnMessage = {
      id: `msg-${Date.now()}`,
      returnId,
      senderRole,
      senderName,
      message,
      timestamp: new Date().toISOString(),
      attachments,
    };
    const msgs = this.messages.get(returnId) || [];
    msgs.push(msg);
    this.messages.set(returnId, msgs);
    return msg;
  }

  public getOrderCumulativeRefund(orderId: string): number {
    return this.orderCumulativeRefunds.get(orderId) || 0;
  }
}

export const afterSalesService = new AfterSalesService();
