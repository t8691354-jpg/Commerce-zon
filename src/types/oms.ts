import { EntityId, Money, Location } from './domain';

export type OrderLifecycleStatus =
  | 'CART'
  | 'CHECKOUT'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'ORDER_CONFIRMED'
  | 'SELLER_ACCEPTED'
  | 'PROCESSING'
  | 'PACKED'
  | 'READY_FOR_SHIPMENT'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_APPROVED'
  | 'RETURNED'
  | 'REFUNDED'
  | 'EXCHANGE_REQUESTED'
  | 'EXCHANGE_APPROVED'
  | 'EXCHANGE_COMPLETED'
  | 'FAILED'
  | 'DISPUTED';

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN' | 'LOGISTICS_AGENT';

export interface OrderItemDetail {
  id: EntityId;
  productId: EntityId;
  productTitle: string;
  sku: string;
  variantName?: string;
  merchantId: EntityId;
  merchantName: string;
  warehouseId: EntityId;
  warehouseName?: string;
  unitPrice: Money;
  quantity: number;
  discountAmount?: Money;
  taxAmount?: Money;
  totalPrice: Money;
  imageUrl?: string;
}

export interface MultiSellerSubOrder {
  subOrderId: EntityId;
  parentOrderId: EntityId;
  merchantId: EntityId;
  merchantName: string;
  items: OrderItemDetail[];
  subtotal: Money;
  shippingFee: Money;
  taxFee: Money;
  marketplaceFee: Money;
  total: Money;
  status: OrderLifecycleStatus;
  warehouseId: EntityId;
  warehouseName: string;
  trackingNumber?: string;
  carrierName?: string;
  packingSlipUrl?: string;
  shippingLabelUrl?: string;
}

export interface OrderTimelineEvent {
  id: EntityId;
  orderId: EntityId;
  status: OrderLifecycleStatus;
  actorRole: UserRole | 'SYSTEM' | 'AI_FRAUD_ENGINE';
  actorName: string;
  note: string;
  location?: string;
  timestamp: string;
}

export interface ShipmentTrackingLog {
  id: EntityId;
  orderId: EntityId;
  subOrderId?: EntityId;
  trackingNumber: string;
  carrier: 'Amazon Logistics' | 'DHL Express' | 'FedEx' | 'UPS' | 'Prime Air';
  stage: 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'LOCAL_DISTRIBUTION_CENTER' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  location: string;
  description: string;
  estimatedDelivery: string;
  timestamp: string;
}

export interface ReturnRequestRecord {
  id: EntityId;
  orderId: EntityId;
  subOrderId?: EntityId;
  customerId: EntityId;
  customerName: string;
  customerEmail: string;
  productId: EntityId;
  productTitle: string;
  reason: string;
  comment: string;
  mediaUrls: string[];
  refundMethod: 'WALLET' | 'ORIGINAL_PAYMENT_METHOD' | 'STORE_CREDIT';
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'IN_TRANSIT' | 'INSPECTED' | 'REFUNDED' | 'COMPLETED';
  requestedAt: string;
  inspectedAt?: string;
  completedAt?: string;
  refundAmount: Money;
  warehouseInspectionNote?: string;
}

export interface ExchangeRequestRecord {
  id: EntityId;
  orderId: EntityId;
  subOrderId?: EntityId;
  customerId: EntityId;
  customerName: string;
  productId: EntityId;
  originalSku: string;
  requestedSku: string;
  requestedVariantName: string;
  reason: 'SIZE_EXCHANGE' | 'COLOR_EXCHANGE' | 'DEFECTIVE_REPLACEMENT' | 'WRONG_ITEM';
  comment: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'REPLACEMENT_SHIPPED' | 'COMPLETED';
  replacementTrackingNumber?: string;
  requestedAt: string;
  completedAt?: string;
}

export interface RefundRecord {
  id: EntityId;
  orderId: EntityId;
  subOrderId?: EntityId;
  customerId: EntityId;
  sellerId: EntityId;
  refundType: 'FULL' | 'PARTIAL' | 'WALLET' | 'ORIGINAL_CARD' | 'STORE_CREDIT';
  amount: Money;
  reason: string;
  status: 'PROCESSED' | 'PENDING' | 'FAILED';
  buyerWalletCredited: boolean;
  sellerWalletDebited: boolean;
  marketplaceFeeAdjusted: boolean;
  processedAt: string;
}

export interface OrderInvoice {
  id: EntityId;
  orderId: EntityId;
  invoiceNumber: string;
  type: 'TAX_INVOICE' | 'PRO_FORMA' | 'CREDIT_NOTE' | 'PACKING_SLIP';
  customerName: string;
  customerAddress: Location;
  sellerName: string;
  sellerTaxId?: string;
  items: OrderItemDetail[];
  subtotal: Money;
  discount: Money;
  couponCode?: string;
  shippingFee: Money;
  taxFee: Money;
  marketplaceFee: Money;
  grandTotal: Money;
  paymentMethod: string;
  issuedAt: string;
}

export interface SellerSettlementRecord {
  id: EntityId;
  orderId: EntityId;
  subOrderId: EntityId;
  sellerId: EntityId;
  sellerName: string;
  grossProductRevenue: Money;
  marketplaceCommissionRatePct: number;
  commissionAmount: Money;
  subscriptionCharge: Money;
  shippingFeeDeducted: Money;
  taxAmount: Money;
  refundAdjustments: Money;
  netSettlementAmount: Money;
  status: 'SETTLED' | 'PENDING' | 'HELD_RESERVE';
  settledAt: string;
}

export interface OrderFraudScan {
  id: EntityId;
  orderId: EntityId;
  customerEmail: string;
  riskScore: number; // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isFlagged: boolean;
  reasons: string[];
  status: 'UNDER_REVIEW' | 'CLEARED' | 'CANCELLED_FRAUD';
  flaggedAt: string;
}

export interface OrderNotificationRecord {
  id: EntityId;
  orderId: EntityId;
  recipientEmail: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  eventTitle: string;
  message: string;
  sentAt: string;
  isRead: boolean;
}

export interface ComprehensiveMasterOrder {
  id: EntityId;
  orderNumber: string;
  invoiceNumber: string;
  trackingNumber: string;
  customerId: EntityId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: 'AMAZON_PAY' | 'CREDIT_CARD' | 'WALLET' | 'BANK_WIRE';
  status: OrderLifecycleStatus;
  items: OrderItemDetail[];
  subOrders: MultiSellerSubOrder[];
  subtotal: Money;
  discount: Money;
  couponCode?: string;
  shippingFee: Money;
  taxFee: Money;
  marketplaceFee: Money;
  grandTotal: Money;
  shippingAddress: Location;
  billingAddress: Location;
  estimatedDeliveryDate: string;
  orderNotes?: string;
  timeline: OrderTimelineEvent[];
  trackingLogs: ShipmentTrackingLog[];
  fraudScan?: OrderFraudScan;
  createdAt: string;
  updatedAt: string;
}
