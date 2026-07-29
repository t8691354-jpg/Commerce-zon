export type ShipmentStatus =
  | 'SHIPMENT_CREATED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'WAREHOUSE_PROCESSING'
  | 'IN_TRANSIT'
  | 'CUSTOMS_CLEARANCE'
  | 'REGIONAL_DISTRIBUTION'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_ATTEMPT'
  | 'RESCHEDULED'
  | 'RETURNED_TO_SENDER'
  | 'LOST'
  | 'DAMAGED';

export type ShippingMethodType =
  | 'STANDARD'
  | 'EXPRESS'
  | 'SAME_DAY'
  | 'NEXT_DAY'
  | 'SCHEDULED'
  | 'INTERNATIONAL'
  | 'FREIGHT'
  | 'LOCAL_DELIVERY'
  | 'STORE_PICKUP';

export type CarrierServiceLevel = 'ECONOMY' | 'STANDARD' | 'EXPEDITED' | 'OVERNIGHT' | 'FREIGHT_HEAVY';

export interface ShippingCarrier {
  id: string;
  name: string;
  code: string; // e.g., AMZL, UPS, FEDEX, DHL
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  supportedCountries: string[];
  supportedRegions: string[];
  avgDeliverySpeedDays: string;
  serviceLevels: CarrierServiceLevel[];
  basePricingRate: number; // Base rate multiplier
  isActive: boolean;
}

export interface ShippingMethodConfig {
  id: ShippingMethodType;
  name: string;
  description: string;
  estimatedDays: string;
  baseCostUSD: number;
  perKgCostUSD: number;
  isEnabled: boolean;
  requiresScheduledTime?: boolean;
}

export interface PickupRequest {
  id: string;
  sellerOrWarehouseName: string;
  locationAddress: string;
  scheduledDate: string;
  timeSlot: string;
  driverName?: string;
  vehicleReg?: string;
  status: 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  packageCount: number;
  totalWeightKg: number;
}

export interface ShipmentItem {
  sku: string;
  name: string;
  quantity: number;
  unitWeightKg: number;
  unitValueUSD: number;
}

export interface ProofOfDelivery {
  recipientName: string;
  signatureDataUrl?: string;
  photoUrl?: string;
  gpsLatitude: number;
  gpsLongitude: number;
  timestamp: string;
  driverNotes?: string;
}

export interface CustomsDeclaration {
  declarationId: string;
  hsCode: string;
  declaredValueUSD: number;
  countryOfOrigin: string;
  importDutyUSD: number;
  exportDutyUSD: number;
  customsTaxUSD: number;
  clearedStatus: 'PENDING' | 'CLEARED' | 'INSPECTION_HOLD' | 'REJECTED';
  documentsGenerated: string[]; // e.g. ["Commercial Invoice", "CN22 Form"]
}

export interface InsurancePolicy {
  isInsured: boolean;
  insuredAmountUSD: number;
  premiumUSD: number;
  claimStatus?: 'NONE' | 'FILED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
  claimNotes?: string;
}

export interface TrackingMilestone {
  stage: ShipmentStatus;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  notes?: string;
}

export interface Shipment {
  shipmentId: string; // e.g. SHP-9081
  orderId: string;
  trackingNumber: string; // e.g. TRK-881920391
  carrierId: string;
  carrierName: string;
  shippingMethod: ShippingMethodType;
  originAddress: string;
  destinationAddress: string;
  destinationCountry: string;
  recipientName: string;
  recipientPhone: string;
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  items: ShipmentItem[];
  shippingCostUSD: number;
  status: ShipmentStatus;
  estimatedDeliveryDate: string;
  createdAt: string;
  trackingTimeline: TrackingMilestone[];
  proofOfDelivery?: ProofOfDelivery;
  customs?: CustomsDeclaration;
  insurance?: InsurancePolicy;
  driverId?: string;
  driverName?: string;
}

export interface DeliveryRouteStop {
  stopOrder: number;
  shipmentId: string;
  address: string;
  recipientName: string;
  estimatedArrival: string;
  distanceKm: number;
  trafficStatus: 'CLEAR' | 'MODERATE' | 'HEAVY';
  isCompleted: boolean;
}

export interface DeliveryZone {
  zoneId: string;
  zoneName: string;
  country: string;
  statesOrCities: string[];
  postalCodes: string[];
  baseDeliveryFeeUSD: number;
  estimatedHours: number;
  isServiceable: boolean;
}

export interface LogisticsReportTemplate {
  id: string;
  title: string;
  type: 'SHIPPING' | 'CARRIER' | 'DELIVERY_SLA' | 'COST_ANALYSIS' | 'DELAYS' | 'RETURNS_LOGISTICS';
  description: string;
}

export interface LogisticsNotification {
  id: string;
  shipmentId: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  title: string;
  message: string;
  timestamp: string;
  recipient: string;
  isRead: boolean;
}

export interface LogisticsStaffDriver {
  driverId: string;
  name: string;
  phone: string;
  vehicleType: 'VAN' | 'TRUCK' | 'SCOOTER' | 'CARGO_BIKE';
  licensePlate: string;
  currentZone: string;
  activeShipmentCount: number;
  completedDeliveries: number;
  status: 'AVAILABLE' | 'ON_ROUTE' | 'OFF_DUTY';
}
