export type SupplierStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'UNDER_REVIEW';

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export type DropshipOrderStatus =
  | 'PENDING_ROUTING'
  | 'FULFILMENT_REQUESTED'
  | 'SUPPLIER_ACCEPTED'
  | 'PACKED'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED';

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED_BY_SUPPLIER'
  | 'IN_TRANSIT_TO_WAREHOUSE'
  | 'INSPECTED'
  | 'REPLACEMENT_DISPATCHED'
  | 'REFUNDED'
  | 'REJECTED';

export type CarrierCode = 'FEDEX' | 'UPS' | 'DHL' | 'COMMERCE_ZON_LOGISTICS' | 'USPS' | 'SHIPROCKET';

export interface WarehouseDetail {
  id: string;
  name: string;
  code: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactPhone: string;
  dockHours: string;
  supportedCarriers: CarrierCode[];
  isPrimary: boolean;
}

export interface SupplierKYCDocument {
  id: string;
  documentType: 'TAX_CERTIFICATE' | 'BUSINESS_LICENSE' | 'ISO_CERT' | 'PASSPORT' | 'BANK_LETTER';
  documentName: string;
  fileUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface SupplierRecord {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessRegistrationNumber: string;
  taxId: string;
  status: SupplierStatus;
  ratingScore: number; // 1.0 to 5.0
  performanceScore: number; // 0 to 100
  totalProductsCount: number;
  totalOrdersFulfilled: number;
  onTimeDeliveryRatePct: number; // e.g. 98.4
  inventoryAccuracyPct: number; // e.g. 99.2
  cancellationRatePct: number; // e.g. 0.5
  returnRatePct: number; // e.g. 1.2
  country: string;
  supportedRegions: string[];
  warehouses: WarehouseDetail[];
  kycDocuments: SupplierKYCDocument[];
  commissionOverridePct?: number; // e.g. 8.0 instead of default 10%
  registeredAt: string;
  approvedAt?: string;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  supplierName: string;
  title: string;
  sku: string;
  barcode: string;
  category: string;
  description: string;
  images: string[];
  videoUrl?: string;
  wholesalePriceUSD: number;
  suggestedRetailPriceUSD: number;
  moq: number; // Minimum Order Quantity
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  variants: Array<{
    variantId: string;
    name: string; // e.g. "Red / Large"
    sku: string;
    wholesalePriceUSD: number;
    stock: number;
  }>;
  status: ProductStatus;
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  createdAt: string;
  lastStockSyncAt: string;
}

export interface ImportedSellerProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  supplierProductId: string;
  supplierId: string;
  supplierName: string;
  originalTitle: string;
  customTitle: string;
  customDescription: string;
  wholesalePriceUSD: number;
  sellingPriceUSD: number;
  profitMarginPct: number;
  profitMarginAmountUSD: number;
  status: 'PUBLISHED' | 'PAUSED' | 'REMOVED';
  isSyncEnabled: boolean;
  syncedStock: number;
  totalSalesCount: number;
  publishedAt: string;
}

export interface DropshipOrderItem {
  itemId: string;
  supplierProductId: string;
  sku: string;
  productTitle: string;
  quantity: number;
  wholesaleUnitPriceUSD: number;
  sellingUnitPriceUSD: number;
  totalWholesaleUSD: number;
  totalSellingUSD: number;
  sellerMarginUSD: number;
}

export interface OrderTrackingEvent {
  id: string;
  status: DropshipOrderStatus;
  location: string;
  description: string;
  timestamp: string;
  carrierName?: string;
  carrierTrackingCode?: string;
}

export interface DropshipOrder {
  orderId: string;
  marketplaceOrderId: string;
  buyerName: string;
  buyerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  sellerId: string;
  sellerName: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  items: DropshipOrderItem[];
  grossBuyerPaidUSD: number;
  supplierProductCostUSD: number;
  marketplaceCommissionUSD: number;
  sellerProfitUSD: number;
  shippingCostUSD: number;
  taxUSD: number;
  orderStatus: DropshipOrderStatus;
  carrier: CarrierCode;
  trackingNumber?: string;
  labelUrl?: string;
  estimatedDeliveryDate: string;
  trackingTimeline: OrderTrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRMARecord {
  rmaId: string;
  orderId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  productTitle: string;
  reason: 'DEFECTIVE' | 'WRONG_ITEM' | 'BUYER_NO_LONGER_WANTS' | 'DAMAGE_IN_TRANSIT';
  details: string;
  photos: string[];
  status: ReturnStatus;
  inspectionGrade?: 'GRADE_A_RESTOCK' | 'GRADE_B_DISCOUNT' | 'DESTROY_DAMAGED';
  refundAmountUSD: number;
  requestedAt: string;
  resolvedAt?: string;
}

export interface SettlementRecord {
  settlementId: string;
  supplierId: string;
  supplierName: string;
  orderId: string;
  grossAmountUSD: number;
  marketplaceCommissionUSD: number;
  supplierPayoutUSD: number;
  sellerProfitUSD: number;
  payoutStatus: 'SETTLED_TO_WALLET' | 'PENDING' | 'HELD_RISK';
  settledAt: string;
}

export interface DropshipAuditLog {
  id: string;
  actor: string;
  role: 'ADMIN' | 'SUPPLIER' | 'SELLER' | 'SYSTEM_ROUTER';
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}
