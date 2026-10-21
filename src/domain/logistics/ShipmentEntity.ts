/**
 * Enterprise Shipping & Logistics Platform
 * Shipment Entity & Domain Models
 */

import { ShipmentStatus, ShippingMethodType, TrackingMilestone, ProofOfDelivery, CustomsDeclaration, InsurancePolicy } from '../../types/logistics';

export interface ShipmentItemRecord {
  sku: string;
  name: string;
  quantity: number;
  unitWeightKg: number;
  unitValueUSD: number;
  warehouseId?: string;
  sellerId?: string;
}

export interface ShippingAddressRecord {
  id: string;
  fullName: string;
  companyName?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  countryCode: string; // ISO-2 e.g. US, CA, GB, DE
  phone: string;
  email: string;
  isDefault?: boolean;
}

export interface ShipmentEntity {
  shipmentId: string; // e.g. SHP-20260730-8910
  parentShipmentId?: string; // Set if this is part of a split shipment
  orderId: string;
  orderNumber: string;
  trackingNumber: string; // e.g. TRK-CZ-881920391
  carrierId: string;
  carrierName: string;
  shippingMethod: ShippingMethodType;
  warehouseId: string;
  sellerId?: string;
  originAddress: ShippingAddressRecord;
  destinationAddress: ShippingAddressRecord;
  items: ShipmentItemRecord[];
  totalWeightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  shippingCostUSD: number;
  status: ShipmentStatus;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  trackingTimeline: TrackingMilestone[];
  proofOfDelivery?: ProofOfDelivery;
  customs?: CustomsDeclaration;
  insurance?: InsurancePolicy;
  driverId?: string;
  driverName?: string;
}

export class ShipmentIdGenerator {
  public static generateShipmentId(): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SHP-${dateStr}-${randomHex}`;
  }

  public static generateTrackingNumber(carrierCode: string = 'CZ'): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${carrierCode}-${dateStr}-${randomNum}`;
  }
}
