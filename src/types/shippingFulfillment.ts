/**
 * Commerce Zon Marketplace - Part 17: Global Shipping, Logistics & Order Fulfillment Engine Types
 */

export type FulfillmentStatus =
  | 'PENDING_FULFILLMENT'
  | 'PROCESSING'
  | 'PACKED'
  | 'READY_FOR_DISPATCH'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELAYED'
  | 'DELIVERY_EXCEPTION'
  | 'RETURNED_TO_SENDER'
  | 'CANCELLED';

export type FulfillmentExceptionType =
  | 'ADDRESS_INCOMPLETE'
  | 'WEATHER_DELAY'
  | 'CUSTOMS_HOLD'
  | 'RECIPIENT_UNAVAILABLE'
  | 'CARRIER_CAPACITY_LIMIT'
  | 'DAMAGED_IN_TRANSIT';

export type ShippingMethodCode =
  | 'STANDARD'
  | 'EXPRESS'
  | 'SAME_DAY'
  | 'LOCAL_DELIVERY'
  | 'STORE_PICKUP'
  | 'INTERNATIONAL';

export interface TrackingEventRecord {
  id: string;
  stage: FulfillmentStatus;
  location: string;
  description: string;
  timestamp: string;
  isException?: boolean;
  exceptionType?: FulfillmentExceptionType;
  actorRole: 'SELLER' | 'CARRIER' | 'ADMIN' | 'SYSTEM';
  actorId?: string;
}

export interface CustomsInfoRecord {
  hsCode: string;
  declaredValueUSD: number;
  countryOfOrigin: string;
  contentsType: 'MERCHANDISE' | 'GIFT' | 'SAMPLE' | 'DOCUMENT';
  dutiesPaidByBuyer: boolean;
  declarationNotes?: string;
}

export interface ShipmentItemDetail {
  sku: string;
  name: string;
  quantity: number;
  unitPriceUSD: number;
  unitWeightKg: number;
  sellerId: string;
}

export interface AddressInfo {
  fullName: string;
  companyName?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  countryCode: string; // ISO 3166-1 alpha-2 e.g. US, PK, GB, DE
  phone?: string;
  email?: string;
}

export interface ShipmentRecord {
  id: string;
  shipmentId: string; // e.g. SHP-2026-8910
  orderId: string;
  orderNumber: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  carrierId: string;
  carrierName: string;
  carrierCode: string;
  trackingNumber: string;
  trackingUrl: string | null;
  status: FulfillmentStatus;
  shippingMethod: ShippingMethodCode;
  originAddress: AddressInfo;
  destinationAddress: AddressInfo;
  items: ShipmentItemDetail[];
  totalWeightKg: number;
  shippingCostUSD: number;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  statusHistory: TrackingEventRecord[];
  exceptionReason?: string;
  customsInfo?: CustomsInfoRecord;
  isManualFulfillment: boolean;
  packingSlipGeneratedAt?: string;
  dispatchNotes?: string;
}

export interface PackingSlip {
  packingSlipNumber: string;
  shipmentId: string;
  orderNumber: string;
  orderDate: string;
  generatedAt: string;
  seller: {
    name: string;
    address: string;
    email: string;
  };
  buyer: {
    name: string;
    shippingAddress: string;
    phone?: string;
  };
  items: {
    sku: string;
    title: string;
    quantity: number;
    unitPriceUSD: number;
    totalUSD: number;
  }[];
  totalItems: number;
  shippingMethod: string;
  carrier: string;
  trackingNumber: string;
  specialInstructions?: string;
  returnPolicyNotice: string;
  isOfficialCarrierLabel: false;
  disclaimer: string;
}

export interface ShippingRateQuote {
  method: ShippingMethodCode;
  name: string;
  carrierName: string;
  costUSD: number;
  estimatedDays: string;
  isFree: boolean;
  isInternational: boolean;
  deliveryWindow: string;
  handlingTimeDays: number;
  destinationCountry: string;
}

export interface AdminShippingConfig {
  freeShippingThresholdUSD: number;
  defaultHandlingDays: number;
  domesticFlatRateUSD: number;
  internationalBaseRateUSD: number;
  perKgRateUSD: number;
  expressMultiplier: number;
  supportedOriginCountries: string[];
  supportedDestinationCountries: string[];
  enabledMethods: ShippingMethodCode[];
  autoNotifyOnDispatch: boolean;
}

/**
 * Valid Status Transition Matrix
 * Enforces server-side integrity and prevents invalid or unauthorized status jumps.
 */
export const VALID_STATUS_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  PENDING_FULFILLMENT: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKED', 'CANCELLED', 'DELIVERY_EXCEPTION'],
  PACKED: ['READY_FOR_DISPATCH', 'CANCELLED', 'DELIVERY_EXCEPTION'],
  READY_FOR_DISPATCH: ['SHIPPED', 'CANCELLED', 'DELIVERY_EXCEPTION'],
  SHIPPED: ['IN_TRANSIT', 'DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'],
  IN_TRANSIT: ['OUT_FOR_DELIVERY', 'DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DELAYED', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'],
  DELAYED: ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERY_EXCEPTION', 'RETURNED_TO_SENDER'],
  DELIVERY_EXCEPTION: ['PROCESSING', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'RETURNED_TO_SENDER', 'CANCELLED'],
  RETURNED_TO_SENDER: ['PROCESSING', 'CANCELLED'],
  DELIVERED: [], // Terminal status
  CANCELLED: ['PENDING_FULFILLMENT'], // Admin reactivation only
};
