/**
 * Enterprise Courier Integration Abstraction Layer
 * Provider-Independent Interface for Multi-Carrier Logistics
 */

import { ShippingMethodType } from '../../types/logistics';
import { ShippingAddressRecord, ShipmentItemRecord } from './ShipmentEntity';

export interface CourierRateRequest {
  originAddress: ShippingAddressRecord;
  destinationAddress: ShippingAddressRecord;
  items: ShipmentItemRecord[];
  totalWeightKg: number;
  shippingMethod: ShippingMethodType;
}

export interface CourierRateResponse {
  carrierId: string;
  carrierName: string;
  serviceLevel: string;
  estimatedDays: string;
  costUSD: number;
  guaranteedDelivery: boolean;
}

export interface DispatchShipmentRequest {
  shipmentId: string;
  orderId: string;
  originAddress: ShippingAddressRecord;
  destinationAddress: ShippingAddressRecord;
  items: ShipmentItemRecord[];
  totalWeightKg: number;
  shippingMethod: ShippingMethodType;
  declaredValueUSD: number;
}

export interface DispatchShipmentResponse {
  success: boolean;
  trackingNumber: string;
  labelUrl?: string;
  estimatedDeliveryDate: string;
  carrierReferenceId: string;
  errorMessage?: string;
}

export interface ICourierAdapter {
  carrierId: string;
  carrierName: string;
  carrierCode: string;
  getRates(request: CourierRateRequest): Promise<CourierRateResponse>;
  dispatchShipment(request: DispatchShipmentRequest): Promise<DispatchShipmentResponse>;
  cancelShipment(trackingNumber: string, reason: string): Promise<boolean>;
  verifyTrackingStatus(trackingNumber: string): Promise<{ status: string; currentLocation?: string; timestamp: string }>;
}
