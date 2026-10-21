import { EntityId, MerchantTier, ProductCategory, ProductApprovalStatus } from './domain';

/**
 * Part 14: Seller Center, Vendor Operations & Multi-Seller Management Types
 */

export type SellerApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export interface SellerStatusHistoryEntry {
  id: string;
  fromStatus: SellerApplicationStatus;
  toStatus: SellerApplicationStatus;
  reason?: string;
  adminId?: string;
  adminName?: string;
  timestamp: string;
}

export interface SellerStorePolicies {
  shippingPolicy: string;
  returnPolicy: string;
  warrantyPolicy: string;
  privacyPolicyAccepted: boolean;
  termsAcceptedDate: string;
}

export interface SellerBusinessDetails {
  businessName: string;
  businessType: 'INDIVIDUAL' | 'LLC' | 'CORPORATION' | 'PARTNERSHIP';
  registrationNumber: string;
  taxIdVat: string;
  country: string;
  stateProvince: string;
  city: string;
  addressLine1: string;
  postalCode: string;
  businessPhone: string;
  businessEmail: string;
  websiteUrl?: string;
}

export interface SellerApplication {
  id: string;
  userId: string;
  applicantName: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  category: ProductCategory;
  plan: 'INDIVIDUAL' | 'PROFESSIONAL';
  logoUrl?: string;
  bannerUrl?: string;
  business: SellerBusinessDetails;
  policies: SellerStorePolicies;
  status: SellerApplicationStatus;
  reviewNotes?: string;
  requestedChanges?: string[];
  rejectionReason?: string;
  reviewedByAdminId?: string;
  reviewedByAdminName?: string;
  reviewedAt?: string;
  submittedAt: string;
  updatedAt: string;
  history: SellerStatusHistoryEntry[];
}

export interface SellerStoreProfile {
  merchantId: string;
  userId: string;
  name: string;
  code: string;
  slug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  city: string;
  address: string;
  tier: MerchantTier;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  visibility: 'PUBLIC' | 'MAINTENANCE' | 'HIDDEN';
  suspensionReason?: string;
  adminNotes?: string;
  policies: SellerStorePolicies;
  createdAt: string;
  updatedAt: string;
}

export type SellerStaffRole =
  | 'STORE_OWNER'
  | 'STORE_MANAGER'
  | 'PRODUCT_MANAGER'
  | 'ORDER_MANAGER'
  | 'SUPPORT_STAFF';

export interface SellerStaffPermission {
  canManageProducts: boolean;
  canManageOrders: boolean;
  canViewFinancials: boolean;
  canManageTeam: boolean;
  canEditStoreSettings: boolean;
}

export interface SellerStaffMember {
  id: string;
  merchantId: string;
  userId?: string;
  name: string;
  email: string;
  role: SellerStaffRole;
  permissions: SellerStaffPermission;
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  invitedAt: string;
  joinedAt?: string;
}

export interface SellerStaffInvitation {
  id: string;
  merchantId: string;
  storeName: string;
  email: string;
  role: SellerStaffRole;
  permissions: SellerStaffPermission;
  token: string;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  invitedBy: string;
  createdAt: string;
}

export interface SellerOrderFulfillmentRecord {
  orderId: string;
  orderNumber: string;
  merchantId: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  dispatchNotes?: string;
  shippedAt: string;
  estimatedDeliveryDate?: string;
  fulfillmentStatus: 'PROCESSING' | 'DISPATCHED' | 'SHIPPED' | 'DELIVERED';
}

export interface SellerProductCreateRequest {
  title: string;
  sku: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  price: number;
  currency?: string;
  costPrice?: number;
  totalStock: number;
  reorderLevel?: number;
  images: string[];
  features?: string[];
  tags?: string[];
  brand?: string;
  status?: 'DRAFT' | 'SUBMITTED';
}

export interface SellerProductUpdateRequest extends Partial<SellerProductCreateRequest> {
  approvalStatus?: ProductApprovalStatus;
  rejectionReason?: string;
}
