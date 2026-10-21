import { Order, Product } from '../../types/domain';
import {
  ComprehensiveMasterOrder,
  OrderLifecycleStatus,
  ReturnRequestRecord,
  RefundRecord,
  SellerSettlementRecord,
  OrderItemDetail,
} from '../../types/oms';
import { IOrderRepository, OrderSearchFilter } from '../../domain/orders/IOrderRepository';
import { orderRepository } from '../../infrastructure/repositories/OrderRepository';
import { logger } from '../../infrastructure/logging/Logger';
import { eventBus } from '../../lib/eventBus';
import { OrderNumberGenerator } from '../../domain/orders/OrderNumberGenerator';
import { OrderValidator } from '../../domain/orders/OrderValidator';
import { OrderSplitter } from '../../domain/orders/OrderSplitter';
import { InventoryReservationManager } from '../../domain/orders/InventoryReservationManager';
import { ReturnAndRefundEngine } from '../../domain/orders/ReturnAndRefundEngine';
import { ShippingCalculator, ShippingOption } from '../../domain/orders/ShippingCalculator';
import { productService } from './ProductService';

export interface CheckoutDTO {
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: any;
  billingAddress?: any;
  items: { productId: string; quantity: number; variantId?: string }[];
  paymentMethod?: 'COMMERCE_ZON_PAY' | 'CREDIT_CARD' | 'WALLET' | 'BANK_WIRE';
  couponCode?: string;
  buyerWalletBalance?: number;
  orderNotes?: string;
  idempotencyKey?: string;
}

export class OrderService {
  private idempotencyCache = new Map<string, ComprehensiveMasterOrder>();

  constructor(private repo: IOrderRepository = orderRepository) {}

  // Legacy Methods
  async getAllOrders(): Promise<Order[]> {
    logger.debug('Fetching all standard orders', 'OrderService');
    return this.repo.findAll();
  }

  async getOrderById(id: string): Promise<Order | null> {
    logger.debug(`Fetching order by ID ${id}`, 'OrderService');
    return this.repo.findById(id);
  }

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    logger.audit(`Creating new order for customer "${orderData.customerId}"`, 'OrderService');
    return this.repo.create(orderData);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    logger.audit(`Updating order ID ${id} status to ${status}`, 'OrderService');
    return this.repo.updateStatus(id, status);
  }

  // Enterprise OMS Methods
  async getAllOMSOrders(filter?: OrderSearchFilter): Promise<ComprehensiveMasterOrder[]> {
    logger.debug('Fetching OMS Orders with filter', 'OrderService');
    return this.repo.findAllOMSOrders(filter);
  }

  async getOMSOrderById(id: string): Promise<ComprehensiveMasterOrder | null> {
    logger.debug(`Fetching OMS order by ID/Number ${id}`, 'OrderService');
    return this.repo.findOMSOrderById(id);
  }

  /**
   * Enterprise Checkout Engine: Validates, Reserves Stock, Splits Orders, Calculates Tax & Shipping,
   * Generates Order Number & Documents, dispatches events.
   */
  async processCheckout(dto: CheckoutDTO): Promise<{ order: ComprehensiveMasterOrder; warnings: string[] }> {
    // Idempotency check
    if (dto.idempotencyKey && this.idempotencyCache.has(dto.idempotencyKey)) {
      logger.info(`[OMS Checkout] Returned cached order for idempotency key "${dto.idempotencyKey}".`, 'OrderService');
      return { order: this.idempotencyCache.get(dto.idempotencyKey)!, warnings: [] };
    }

    // Load available products for validation & calculation
    const allProducts = await productService.getAllProducts();

    // 1. Validation Step
    const valResult = OrderValidator.validateCheckoutRequest({
      items: dto.items,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod,
      buyerWalletBalance: dto.buyerWalletBalance,
      availableProducts: allProducts,
    });

    if (!valResult.isValid) {
      throw new Error(`Checkout Validation Failed: ${valResult.errors.join(' | ')}`);
    }

    // 2. Build Order Items Detail & Calculate Financials
    let subtotalAmount = 0;
    const orderItems: OrderItemDetail[] = dto.items.map((item, index) => {
      const p = allProducts.find((prod) => prod.id === item.productId)!;
      const unitPrice = p.price.amount;
      const itemSubtotal = unitPrice * item.quantity;
      subtotalAmount += itemSubtotal;

      const firstWh = p.warehouseStock[0];

      return {
        id: `item-${Date.now()}-${index}`,
        productId: p.id,
        productTitle: p.title,
        sku: p.sku,
        variantName: p.variants && p.variants.length > 0 ? p.variants[0].name : undefined,
        merchantId: p.merchant.id,
        merchantName: p.merchant.name,
        warehouseId: firstWh ? firstWh.warehouseId : 'wh-01',
        warehouseName: firstWh ? firstWh.warehouseName : 'Main Fulfillment Hub',
        unitPrice: { amount: unitPrice, currency: p.price.currency || 'USD' },
        quantity: item.quantity,
        taxAmount: { amount: Math.round(itemSubtotal * 0.08 * 100) / 100, currency: p.price.currency || 'USD' },
        totalPrice: { amount: itemSubtotal, currency: p.price.currency || 'USD' },
        imageUrl: p.images[0] || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      };
    });

    subtotalAmount = Math.round(subtotalAmount * 100) / 100;

    // Apply Coupon Discount if valid
    let discountAmount = 0;
    if (dto.couponCode) {
      if (dto.couponCode.toUpperCase() === 'PRIME100') discountAmount = 100;
      else if (dto.couponCode.toUpperCase() === 'SAVE10') discountAmount = Math.round(subtotalAmount * 0.10 * 100) / 100;
      else if (dto.couponCode.toUpperCase() === 'ENTERPRISE50') discountAmount = 50;
    }

    const discountedSubtotal = Math.max(0, subtotalAmount - discountAmount);
    const taxFeeAmount = Math.round(discountedSubtotal * 0.08 * 100) / 100;
    const shippingFeeAmount = 25.0;
    const marketplaceFeeAmount = Math.round(discountedSubtotal * 0.10 * 100) / 100;
    const grandTotalAmount = Math.round((discountedSubtotal + taxFeeAmount + shippingFeeAmount) * 100) / 100;

    const orderId = `ord-${Date.now()}`;
    const orderNumber = OrderNumberGenerator.generateOrderNumber('US', 'ORD');
    const invoiceNumber = OrderNumberGenerator.generateInvoiceNumber('INV');
    const trackingNumber = OrderNumberGenerator.generateTrackingNumber('CZL');

    // 3. Reserve Stock immediately
    InventoryReservationManager.reserveStockForOrder(orderId, orderItems, allProducts);

    // 4. Split Multi-Seller / Multi-Warehouse Sub-Orders
    const subOrders = OrderSplitter.splitOrder(orderId, orderItems, 'ORDER_CONFIRMED');

    // 5. Construct Master Order Entity
    const newMasterOrder: Partial<ComprehensiveMasterOrder> = {
      id: orderId,
      orderNumber,
      invoiceNumber,
      trackingNumber,
      customerId: dto.customerId || `cust-${Math.floor(100 + Math.random() * 900)}`,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone || '+1 (555) 019-2831',
      paymentMethod: dto.paymentMethod || 'COMMERCE_ZON_PAY',
      status: 'ORDER_CONFIRMED',
      items: orderItems,
      subOrders,
      subtotal: { amount: subtotalAmount, currency: 'USD' },
      discount: { amount: discountAmount, currency: 'USD' },
      couponCode: dto.couponCode,
      shippingFee: { amount: shippingFeeAmount, currency: 'USD' },
      taxFee: { amount: taxFeeAmount, currency: 'USD' },
      marketplaceFee: { amount: marketplaceFeeAmount, currency: 'USD' },
      grandTotal: { amount: grandTotalAmount, currency: 'USD' },
      shippingAddress: dto.shippingAddress,
      billingAddress: dto.billingAddress || dto.shippingAddress,
      orderNotes: dto.orderNotes,
    };

    const savedOrder = await this.repo.createOMSOrder(newMasterOrder);

    // Store in Idempotency cache if key provided
    if (dto.idempotencyKey) {
      this.idempotencyCache.set(dto.idempotencyKey, savedOrder);
    }

    // Publish OrderCreated event to EventBus
    eventBus.publish({
      id: `evt-ord-${Date.now()}`,
      eventType: 'OrderCreated',
      domain: 'ORDER',
      aggregateId: savedOrder.id,
      timestamp: new Date().toISOString(),
      payload: {
        orderId: savedOrder.id,
        orderNumber: savedOrder.orderNumber,
        grandTotal: savedOrder.grandTotal,
        customerEmail: savedOrder.customerEmail,
        subOrderCount: savedOrder.subOrders.length,
      },
      actor: { type: 'MOCK_USER', id: savedOrder.customerId },
    });

    logger.audit(`[OMS] Successfully processed Order ${savedOrder.orderNumber} ($${grandTotalAmount}).`, 'OrderService');

    return { order: savedOrder, warnings: valResult.warnings };
  }

  /**
   * Updates an Order's lifecycle status and records state transition timeline.
   */
  async transitionOrderStatus(
    orderId: string,
    targetStatus: OrderLifecycleStatus,
    actorName: string = 'System Admin',
    actorRole: string = 'ADMIN',
    note: string = 'Status transition triggered'
  ): Promise<ComprehensiveMasterOrder | null> {
    const existingOrder = await this.repo.findOMSOrderById(orderId);
    if (!existingOrder) throw new Error(`Order ${orderId} not found.`);

    const check = OrderValidator.canTransitionStatus(existingOrder.status, targetStatus, actorRole);
    if (!check.allowed) {
      throw new Error(check.reason || 'Invalid state transition.');
    }

    const updated = await this.repo.updateOMSOrderStatus(orderId, targetStatus, actorName, actorRole, note);

    if (updated) {
      // If cancelled, release inventory back
      if (targetStatus === 'CANCELLED') {
        const allProducts = await productService.getAllProducts();
        InventoryReservationManager.releaseStockForOrder(updated.id, updated.items, allProducts, note);
      } else if (targetStatus === 'SHIPPED' || targetStatus === 'DELIVERED') {
        const allProducts = await productService.getAllProducts();
        InventoryReservationManager.commitStockForOrder(updated.id, updated.items, allProducts);
      }

      eventBus.publish({
        id: `evt-ord-status-${Date.now()}`,
        eventType: `Order_${targetStatus}`,
        domain: 'ORDER',
        aggregateId: updated.id,
        timestamp: new Date().toISOString(),
        payload: { orderId: updated.id, status: targetStatus, actorName, note },
        actor: { type: actorRole as any, id: actorName },
      });
    }

    return updated;
  }

  // Returns & RMA
  async getAllReturns(): Promise<ReturnRequestRecord[]> {
    return this.repo.findAllReturns();
  }

  async requestReturn(payload: {
    orderId: string;
    subOrderId?: string;
    productId: string;
    reason: string;
    comment: string;
    mediaUrls?: string[];
    refundMethod?: 'WALLET' | 'ORIGINAL_PAYMENT_METHOD' | 'STORE_CREDIT';
  }): Promise<ReturnRequestRecord> {
    const order = await this.repo.findOMSOrderById(payload.orderId);
    if (!order) throw new Error(`Order ${payload.orderId} not found.`);

    const returnReq = ReturnAndRefundEngine.createReturnRequest({
      order,
      subOrderId: payload.subOrderId,
      productId: payload.productId,
      reason: payload.reason,
      comment: payload.comment,
      mediaUrls: payload.mediaUrls,
      refundMethod: payload.refundMethod,
    });

    const saved = await this.repo.createReturnRequest(returnReq);
    await this.repo.updateOMSOrderStatus(order.id, 'RETURN_REQUESTED', order.customerName, 'BUYER', `Return requested for item: ${payload.reason}`);
    return saved;
  }

  async updateReturnStatus(returnId: string, status: ReturnRequestRecord['status'], note?: string): Promise<ReturnRequestRecord | null> {
    const updated = await this.repo.updateReturnStatus(returnId, status, note);
    if (updated && status === 'APPROVED') {
      const order = await this.repo.findOMSOrderById(updated.orderId);
      if (order) {
        await this.repo.updateOMSOrderStatus(order.id, 'RETURN_APPROVED', 'Warehouse Staff', 'LOGISTICS_AGENT', `Return RMA ${returnId} approved.`);
      }
    }
    return updated;
  }

  // Refunds
  async getAllRefunds(): Promise<RefundRecord[]> {
    return this.repo.findAllRefunds();
  }

  async processRefund(payload: {
    orderId: string;
    subOrderId?: string;
    refundType: 'FULL' | 'PARTIAL' | 'WALLET' | 'ORIGINAL_CARD' | 'STORE_CREDIT';
    amount: number;
    reason: string;
    buyerWalletBalanceCurrent?: number;
  }): Promise<RefundRecord> {
    const order = await this.repo.findOMSOrderById(payload.orderId);
    if (!order) throw new Error(`Order ${payload.orderId} not found.`);

    const { refundRecord } = ReturnAndRefundEngine.executeRefund({
      order,
      subOrderId: payload.subOrderId,
      refundType: payload.refundType,
      amount: { amount: payload.amount, currency: order.grandTotal.currency },
      reason: payload.reason,
      buyerWalletBalanceCurrent: payload.buyerWalletBalanceCurrent || 2450.00,
    });

    const saved = await this.repo.createRefundRecord(refundRecord);
    await this.repo.updateOMSOrderStatus(order.id, 'REFUNDED', 'Finance Gateway', 'ADMIN', `Refund executed ($${payload.amount}).`);
    return saved;
  }

  // Shipping Calculator
  getShippingOptions(destination: any, totalWeightKg?: number): ShippingOption[] {
    return ShippingCalculator.calculateShippingOptions(destination, totalWeightKg);
  }

  // OMS Analytics Data Calculation
  async getOMSAnalyticsMetrics() {
    const allOMS = await this.repo.findAllOMSOrders();
    const allReturns = await this.repo.findAllReturns();
    const allRefunds = await this.repo.findAllRefunds();

    const totalOrders = allOMS.length;
    let gmv = 0;
    let totalTax = 0;
    let totalShipping = 0;
    let cancelledCount = 0;
    let deliveredCount = 0;

    allOMS.forEach((o) => {
      gmv += o.grandTotal.amount;
      totalTax += o.taxFee.amount;
      totalShipping += o.shippingFee.amount;
      if (o.status === 'CANCELLED') cancelledCount++;
      if (o.status === 'DELIVERED' || o.status === 'COMPLETED') deliveredCount++;
    });

    const aov = totalOrders > 0 ? gmv / totalOrders : 0;
    const cancellationRatePct = totalOrders > 0 ? (cancelledCount / totalOrders) * 100 : 0;
    const fulfillmentRatePct = totalOrders > 0 ? (deliveredCount / totalOrders) * 100 : 0;
    const returnRatePct = totalOrders > 0 ? (allReturns.length / totalOrders) * 100 : 0;

    return {
      totalOrders,
      gmv: Math.round(gmv * 100) / 100,
      aov: Math.round(aov * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      totalShipping: Math.round(totalShipping * 100) / 100,
      cancellationRatePct: Math.round(cancellationRatePct * 10) / 10,
      fulfillmentRatePct: Math.round(fulfillmentRatePct * 10) / 10,
      returnRatePct: Math.round(returnRatePct * 10) / 10,
      activeReturnsCount: allReturns.length,
      totalRefundsProcessed: allRefunds.length,
    };
  }
}

export const orderService = new OrderService();
