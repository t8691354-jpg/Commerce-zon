import { Order } from '../../types/domain';
import {
  ComprehensiveMasterOrder,
  OrderLifecycleStatus,
  ReturnRequestRecord,
  RefundRecord,
  SellerSettlementRecord,
  UserRole,
} from '../../types/oms';
import { IOrderRepository, OrderSearchFilter } from '../../domain/orders/IOrderRepository';
import { MOCK_ORDERS } from '../../data/mockData';
import {
  MOCK_OMS_ORDERS,
  MOCK_RETURNS_DATA,
  MOCK_REFUNDS_DATA,
  MOCK_SETTLEMENTS_DATA,
} from '../../data/omsMockData';
import { NotFoundError } from '../errors/AppError';
import { OrderSplitter } from '../../domain/orders/OrderSplitter';

export class OrderRepository implements IOrderRepository {
  private orders: Order[] = [...MOCK_ORDERS];
  private omsOrders: ComprehensiveMasterOrder[] = [...MOCK_OMS_ORDERS];
  private returnsData: ReturnRequestRecord[] = [...MOCK_RETURNS_DATA];
  private refundsData: RefundRecord[] = [...MOCK_REFUNDS_DATA];
  private settlementsData: SellerSettlementRecord[] = [...MOCK_SETTLEMENTS_DATA];

  // Legacy / Basic Methods
  async findAll(): Promise<Order[]> {
    return [...this.orders];
  }

  async findById(id: string): Promise<Order | null> {
    const o = this.orders.find((item) => item.id === id || item.orderNumber === id);
    return o ? { ...o } : null;
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.orders.filter((o) => o.customerId === customerId);
  }

  async create(orderData: Omit<Order, 'id'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    this.orders.unshift(newOrder);
    return { ...newOrder };
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) throw new NotFoundError(`Order with ID ${id} not found`);
    order.status = status;
    return { ...order };
  }

  // Enterprise OMS Methods
  async findAllOMSOrders(filter?: OrderSearchFilter): Promise<ComprehensiveMasterOrder[]> {
    let result = [...this.omsOrders];

    if (filter) {
      if (filter.status && filter.status !== 'ALL') {
        result = result.filter((o) => o.status === filter.status);
      }
      if (filter.customerId) {
        result = result.filter((o) => o.customerId === filter.customerId);
      }
      if (filter.sellerId) {
        result = result.filter(
          (o) =>
            o.items.some((i) => i.merchantId === filter.sellerId) ||
            o.subOrders.some((so) => so.merchantId === filter.sellerId)
        );
      }
      if (filter.warehouseId) {
        result = result.filter(
          (o) =>
            o.items.some((i) => i.warehouseId === filter.warehouseId) ||
            o.subOrders.some((so) => so.warehouseId === filter.warehouseId)
        );
      }
      if (filter.query && filter.query.trim().length > 0) {
        const q = filter.query.toLowerCase();
        result = result.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q) ||
            o.trackingNumber.toLowerCase().includes(q) ||
            o.items.some((i) => i.productTitle.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
        );
      }
    }

    return result;
  }

  async findOMSOrderById(id: string): Promise<ComprehensiveMasterOrder | null> {
    const o = this.omsOrders.find(
      (item) => item.id === id || item.orderNumber === id || item.trackingNumber === id
    );
    return o ? JSON.parse(JSON.stringify(o)) : null;
  }

  async createOMSOrder(orderData: Partial<ComprehensiveMasterOrder>): Promise<ComprehensiveMasterOrder> {
    const now = new Date().toISOString();
    const id = orderData.id || `ord-${Date.now()}`;
    const items = orderData.items || [];
    
    // Auto-split sub-orders if subOrders not explicitly passed
    const subOrders = orderData.subOrders && orderData.subOrders.length > 0
      ? orderData.subOrders
      : OrderSplitter.splitOrder(id, items, orderData.status || 'ORDER_CONFIRMED');

    const newOMSOrder: ComprehensiveMasterOrder = {
      id,
      orderNumber: orderData.orderNumber || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: orderData.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: orderData.trackingNumber || `TRK-CZL-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: orderData.customerId || 'cust-901',
      customerName: orderData.customerName || 'AeroSpace Global Procurement',
      customerEmail: orderData.customerEmail || 'procurement@aerospace.io',
      customerPhone: orderData.customerPhone || '+1 (555) 019-2831',
      paymentMethod: orderData.paymentMethod || 'COMMERCE_ZON_PAY',
      status: orderData.status || 'ORDER_CONFIRMED',
      items,
      subOrders,
      subtotal: orderData.subtotal || { amount: 0, currency: 'USD' },
      discount: orderData.discount || { amount: 0, currency: 'USD' },
      couponCode: orderData.couponCode,
      shippingFee: orderData.shippingFee || { amount: 25, currency: 'USD' },
      taxFee: orderData.taxFee || { amount: 0, currency: 'USD' },
      marketplaceFee: orderData.marketplaceFee || { amount: 0, currency: 'USD' },
      grandTotal: orderData.grandTotal || { amount: 0, currency: 'USD' },
      shippingAddress: orderData.shippingAddress || {
        address: '500 Technology Parkway',
        city: 'San Jose',
        state: 'CA',
        country: 'USA',
        latitude: 37.3382,
        longitude: -121.8863,
      },
      billingAddress: orderData.billingAddress || {
        address: '500 Technology Parkway',
        city: 'San Jose',
        state: 'CA',
        country: 'USA',
        latitude: 37.3382,
        longitude: -121.8863,
      },
      estimatedDeliveryDate: orderData.estimatedDeliveryDate || new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      orderNotes: orderData.orderNotes,
      timeline: orderData.timeline || [
        {
          id: `tl-${Date.now()}`,
          orderId: id,
          status: orderData.status || 'ORDER_CONFIRMED',
          actorRole: 'BUYER',
          actorName: orderData.customerName || 'AeroSpace Global Procurement',
          note: 'Order placed and payment authorized via Commerce Zon Pay.',
          timestamp: now,
        },
      ],
      trackingLogs: orderData.trackingLogs || [
        {
          id: `trk-${Date.now()}`,
          orderId: id,
          trackingNumber: orderData.trackingNumber || 'TRK-CZL-90001',
          carrier: 'Commerce Zon Logistics',
          stage: 'CREATED',
          location: 'San Jose Fulfillment Hub',
          description: 'Order confirmed and sent to warehouse fulfillment queue.',
          estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.omsOrders.unshift(newOMSOrder);
    
    // Also push simplified Order to legacy list
    this.orders.unshift({
      id: newOMSOrder.id,
      orderNumber: newOMSOrder.orderNumber,
      customerId: newOMSOrder.customerId,
      customerName: newOMSOrder.customerName,
      customerEmail: newOMSOrder.customerEmail,
      items: newOMSOrder.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productTitle: i.productTitle,
        sku: i.sku,
        merchantId: i.merchantId,
        merchantName: i.merchantName,
        warehouseId: i.warehouseId,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        totalPrice: i.totalPrice,
      })),
      subtotal: newOMSOrder.subtotal,
      shippingFee: newOMSOrder.shippingFee,
      taxFee: newOMSOrder.taxFee,
      total: newOMSOrder.grandTotal,
      status: 'processing',
      shippingAddress: newOMSOrder.shippingAddress,
      createdAt: now,
      updatedAt: now,
    });

    return JSON.parse(JSON.stringify(newOMSOrder));
  }

  async updateOMSOrderStatus(
    orderId: string,
    status: OrderLifecycleStatus,
    actorName: string = 'System Admin',
    actorRole: string = 'ADMIN',
    note: string = 'Status updated by operator'
  ): Promise<ComprehensiveMasterOrder | null> {
    const order = this.omsOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    // Update sub-orders
    order.subOrders.forEach((so) => {
      so.status = status;
    });

    // Record timeline event
    order.timeline.unshift({
      id: `tl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId: order.id,
      status,
      actorRole: actorRole as any,
      actorName,
      note,
      timestamp: new Date().toISOString(),
    });

    return JSON.parse(JSON.stringify(order));
  }

  async addOMSOrderNote(orderId: string, note: string, author: string): Promise<ComprehensiveMasterOrder | null> {
    const order = this.omsOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.orderNotes = order.orderNotes ? `${order.orderNotes}\n[${author}]: ${note}` : `[${author}]: ${note}`;
    order.updatedAt = new Date().toISOString();

    order.timeline.unshift({
      id: `tl-note-${Date.now()}`,
      orderId: order.id,
      status: order.status,
      actorRole: 'ADMIN',
      actorName: author,
      note: `Added internal note: "${note}"`,
      timestamp: new Date().toISOString(),
    });

    return JSON.parse(JSON.stringify(order));
  }

  async findAllReturns(): Promise<ReturnRequestRecord[]> {
    return [...this.returnsData];
  }

  async createReturnRequest(returnReq: ReturnRequestRecord): Promise<ReturnRequestRecord> {
    this.returnsData.unshift(returnReq);
    return { ...returnReq };
  }

  async updateReturnStatus(returnId: string, status: ReturnRequestRecord['status'], note?: string): Promise<ReturnRequestRecord | null> {
    const r = this.returnsData.find((ret) => ret.id === returnId);
    if (!r) return null;
    r.status = status;
    if (note) r.warehouseInspectionNote = note;
    return { ...r };
  }

  async findAllRefunds(): Promise<RefundRecord[]> {
    return [...this.refundsData];
  }

  async createRefundRecord(refund: RefundRecord): Promise<RefundRecord> {
    this.refundsData.unshift(refund);
    return { ...refund };
  }

  async findAllSettlements(): Promise<SellerSettlementRecord[]> {
    return [...this.settlementsData];
  }
}

export const orderRepository = new OrderRepository();
