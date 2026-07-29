export type ReturnStatus =
  | 'REQUESTED'
  | 'SELLER_REVIEW'
  | 'AUTO_APPROVED'
  | 'ADMIN_REVIEW'
  | 'APPROVED'
  | 'LABEL_GENERATED'
  | 'SHIPPED_BY_BUYER'
  | 'WAREHOUSE_RECEIVED'
  | 'QUALITY_INSPECTED'
  | 'REFUND_PROCESSED'
  | 'EXCHANGE_DISPATCHED'
  | 'CLOSED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'CANCELLED';

export type ReturnReason =
  | 'DAMAGED_ITEM'
  | 'WRONG_ITEM'
  | 'MISSING_PARTS'
  | 'DEFECTIVE'
  | 'QUALITY_ISSUE'
  | 'CHANGED_MIND'
  | 'LATE_DELIVERY'
  | 'FAKE_PRODUCT'
  | 'OTHER';

export type InspectionCondition =
  | 'RESELLABLE_NEW'
  | 'RESELLABLE_OPEN_BOX'
  | 'REPAIR_REQUIRED'
  | 'DAMAGED_SCRAP'
  | 'RETURN_TO_SELLER';

export type ResolutionType = 'REFUND' | 'EXCHANGE' | 'REPLACEMENT';

export type RefundMethod =
  | 'ORIGINAL_PAYMENT'
  | 'WALLET_CREDIT'
  | 'STORE_CREDIT'
  | 'PARTIAL_REFUND';

export type ExchangeType =
  | 'SIZE_EXCHANGE'
  | 'COLOR_EXCHANGE'
  | 'VARIANT_EXCHANGE'
  | 'PRODUCT_REPLACEMENT';

export interface ReturnItemInfo {
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unitPriceUSD: number;
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
}

export interface ReturnInspectionReport {
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  productCondition: InspectionCondition;
  packagingCondition: 'INTACT' | 'DAMAGED' | 'MISSING';
  missingAccessories: string[];
  damagePhotosUrl: string[];
  notes: string;
  inspectionResult: 'APPROVED_FOR_FULL_REFUND' | 'APPROVED_FOR_PARTIAL_REFUND' | 'APPROVED_FOR_EXCHANGE' | 'REJECTED_CUSTOMER_DAMAGED';
  restockingFeeUSD: number;
}

export interface ReturnLabelInfo {
  carrier: string;
  trackingNumber: string;
  labelUrl: string;
  qrCodeUrl: string;
  returnAddress: string;
  pickupScheduledDate?: string;
}

export interface ReturnFraudDetails {
  fraudRiskScore: number; // 0 - 100
  riskFlags: string[]; // e.g. ["Excessive Returns (5 in 30 days)", "Serial Number Mismatch Alert"]
  requiresAdminOverride: boolean;
  isFrozen: boolean;
}

export interface ReturnRequest {
  returnId: string; // e.g., RMA-88102
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  item: ReturnItemInfo;
  reason: ReturnReason;
  comments: string;
  proofImages: string[];
  proofVideos?: string[];
  resolutionRequested: ResolutionType;
  exchangeType?: ExchangeType;
  requestedVariant?: string;
  status: ReturnStatus;
  createdAt: string;
  updatedAt: string;
  policyWindowDays: number;
  purchaseDate: string;
  shippingLabel?: ReturnLabelInfo;
  inspection?: ReturnInspectionReport;
  refundAmountUSD?: number;
  refundMethod?: RefundMethod;
  replacementTrackingNumber?: string;
  sellerNotes?: string;
  adminNotes?: string;
  fraudDetails: ReturnFraudDetails;
}

export interface CategoryReturnPolicy {
  category: string;
  returnWindowDays: number;
  isReturnable: boolean;
  requiresInspection: boolean;
  restockingFeePercent: number;
  allowAutoApproval: boolean;
  autoApprovalMaxUSD: number;
}

export interface ReturnMessage {
  id: string;
  returnId: string;
  senderRole: 'BUYER' | 'SELLER' | 'ADMIN' | 'WAREHOUSE';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface ReturnFraudCase {
  caseId: string;
  buyerId: string;
  buyerName: string;
  riskScore: number;
  flagReason: string;
  totalReturnsCount: number;
  totalOrderValueUSD: number;
  returnedValueUSD: number;
  returnRatePercent: number;
  status: 'PENDING_REVIEW' | 'VERIFIED_FRAUD' | 'CLEARED' | 'ACCOUNT_FROZEN';
}
