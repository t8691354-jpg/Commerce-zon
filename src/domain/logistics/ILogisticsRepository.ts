/**
 * Enterprise Logistics Repository Interface
 * Defines contracts for persisting Shipments, Delivery Zones, Carriers, Drivers, and Returns
 */

import { ShippingCarrier, ShippingMethodConfig, PickupRequest, DeliveryZone, LogisticsStaffDriver } from '../../types/logistics';
import { ShipmentEntity } from './ShipmentEntity';
import { ReturnShipmentRecord } from './ReturnLogisticsEngine';

export interface LogisticsSearchFilter {
  query?: string;
  status?: string;
  carrierId?: string;
  shippingMethod?: string;
  orderId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ILogisticsRepository {
  getShipmentById(shipmentId: string): Promise<ShipmentEntity | null>;
  getShipmentByTrackingNumber(trackingNumber: string): Promise<ShipmentEntity | null>;
  getShipmentsByOrderId(orderId: string): Promise<ShipmentEntity[]>;
  searchShipments(filter: LogisticsSearchFilter): Promise<{ items: ShipmentEntity[]; total: number }>;
  saveShipment(shipment: ShipmentEntity): Promise<ShipmentEntity>;
  updateShipmentStatus(shipmentId: string, status: ShipmentEntity['status']): Promise<ShipmentEntity | null>;

  getCarriers(): Promise<ShippingCarrier[]>;
  getCarrierById(carrierId: string): Promise<ShippingCarrier | null>;

  getShippingMethods(): Promise<ShippingMethodConfig[]>;
  getDeliveryZones(): Promise<DeliveryZone[]>;
  getDrivers(): Promise<LogisticsStaffDriver[]>;

  createReturnRequest(record: ReturnShipmentRecord): Promise<ReturnShipmentRecord>;
  getReturnRequestById(returnId: string): Promise<ReturnShipmentRecord | null>;
  getReturnsByOrderId(orderId: string): Promise<ReturnShipmentRecord[]>;

  getPickupRequests(): Promise<PickupRequest[]>;
}
