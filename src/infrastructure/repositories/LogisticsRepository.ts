/**
 * Enterprise Logistics Repository Implementation
 * Manages in-memory & persistent storage of shipments, tracking, carriers, drivers, and returns
 */

import { ShippingCarrier, ShippingMethodConfig, PickupRequest, DeliveryZone, LogisticsStaffDriver } from '../../types/logistics';
import { ShipmentEntity } from '../../domain/logistics/ShipmentEntity';
import { ReturnShipmentRecord } from '../../domain/logistics/ReturnLogisticsEngine';
import { ILogisticsRepository, LogisticsSearchFilter } from '../../domain/logistics/ILogisticsRepository';
import { MOCK_CARRIERS, MOCK_SHIPPING_METHODS, MOCK_DELIVERY_ZONES, MOCK_LOGISTICS_DRIVERS as MOCK_DRIVERS, MOCK_PICKUP_REQUESTS, MOCK_SHIPMENTS } from '../../data/logisticsMockData';
import { logger } from '../logging/Logger';

export class LogisticsRepository implements ILogisticsRepository {
  private shipments: Map<string, ShipmentEntity> = new Map();
  private trackingIndex: Map<string, string> = new Map(); // trackingNumber -> shipmentId
  private orderIndex: Map<string, string[]> = new Map(); // orderId -> shipmentId[]
  private carriers: ShippingCarrier[] = [...MOCK_CARRIERS];
  private shippingMethods: ShippingMethodConfig[] = [...MOCK_SHIPPING_METHODS];
  private deliveryZones: DeliveryZone[] = [...MOCK_DELIVERY_ZONES];
  private drivers: LogisticsStaffDriver[] = [...MOCK_DRIVERS];
  private pickupRequests: PickupRequest[] = [...MOCK_PICKUP_REQUESTS];
  private returnsMap: Map<string, ReturnShipmentRecord> = new Map();

  constructor() {
    this.seedMockData();
  }

  private seedMockData(): void {
    if (Array.isArray(MOCK_SHIPMENTS)) {
      MOCK_SHIPMENTS.forEach(shp => {
        const originAddr = {
          id: 'wh-addr-1',
          fullName: 'Commerce Zon East Warehouse',
          streetLine1: '100 Logistics Way',
          city: 'Edison',
          stateOrProvince: 'NJ',
          postalCode: '08817',
          countryCode: 'US',
          phone: '+1-800-555-0199',
          email: 'wh-east@commercezon.com',
        };

        const destAddr = {
          id: 'dest-addr-1',
          fullName: shp.recipientName || 'Valued Customer',
          streetLine1: shp.destinationAddress || '456 Market St',
          city: 'New York',
          stateOrProvince: 'NY',
          postalCode: '10001',
          countryCode: shp.destinationCountry || 'US',
          phone: shp.recipientPhone || '+1-555-0192',
          email: 'customer@example.com',
        };

        const entity: ShipmentEntity = {
          shipmentId: shp.shipmentId,
          orderId: shp.orderId,
          orderNumber: `ORD-${shp.orderId}`,
          trackingNumber: shp.trackingNumber,
          carrierId: shp.carrierId,
          carrierName: shp.carrierName,
          shippingMethod: shp.shippingMethod,
          warehouseId: 'WH-MAIN-US-EAST',
          originAddress: originAddr,
          destinationAddress: destAddr,
          items: shp.items || [
            { sku: 'SKU-LOG-101', name: 'Standard Commercial Goods', quantity: 1, unitWeightKg: shp.weightKg || 1.5, unitValueUSD: 49.99 }
          ],
          totalWeightKg: shp.weightKg || 1.5,
          dimensionsCm: shp.dimensionsCm || { length: 30, width: 20, height: 10 },
          shippingCostUSD: shp.shippingCostUSD || 9.99,
          status: shp.status,
          estimatedDeliveryDate: shp.estimatedDeliveryDate,
          createdAt: shp.createdAt,
          updatedAt: shp.createdAt,
          trackingTimeline: shp.trackingTimeline || [],
          proofOfDelivery: shp.proofOfDelivery,
          customs: shp.customs,
          insurance: shp.insurance,
          driverId: shp.driverId,
          driverName: shp.driverName,
        };

        this.saveShipmentSync(entity);
      });
    }

    logger.info(`[LogisticsRepository] Seeded ${this.shipments.size} initial shipments and carriers`, 'LogisticsRepository');
  }

  private saveShipmentSync(shipment: ShipmentEntity): void {
    this.shipments.set(shipment.shipmentId, shipment);
    this.trackingIndex.set(shipment.trackingNumber, shipment.shipmentId);

    const existingOrderShipments = this.orderIndex.get(shipment.orderId) || [];
    if (!existingOrderShipments.includes(shipment.shipmentId)) {
      existingOrderShipments.push(shipment.shipmentId);
      this.orderIndex.set(shipment.orderId, existingOrderShipments);
    }
  }

  async getShipmentById(shipmentId: string): Promise<ShipmentEntity | null> {
    return this.shipments.get(shipmentId) || null;
  }

  async getShipmentByTrackingNumber(trackingNumber: string): Promise<ShipmentEntity | null> {
    const id = this.trackingIndex.get(trackingNumber);
    if (!id) return null;
    return this.shipments.get(id) || null;
  }

  async getShipmentsByOrderId(orderId: string): Promise<ShipmentEntity[]> {
    const ids = this.orderIndex.get(orderId) || [];
    return ids.map(id => this.shipments.get(id)!).filter(Boolean);
  }

  async searchShipments(filter: LogisticsSearchFilter): Promise<{ items: ShipmentEntity[]; total: number }> {
    let results = Array.from(this.shipments.values());

    if (filter.query) {
      const q = filter.query.toLowerCase();
      results = results.filter(
        s =>
          s.shipmentId.toLowerCase().includes(q) ||
          s.trackingNumber.toLowerCase().includes(q) ||
          s.orderId.toLowerCase().includes(q) ||
          s.destinationAddress.fullName.toLowerCase().includes(q)
      );
    }

    if (filter.status) {
      results = results.filter(s => s.status === filter.status);
    }

    if (filter.carrierId) {
      results = results.filter(s => s.carrierId === filter.carrierId);
    }

    if (filter.shippingMethod) {
      results = results.filter(s => s.shippingMethod === filter.shippingMethod);
    }

    const total = results.length;
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const startIndex = (page - 1) * limit;

    const items = results.slice(startIndex, startIndex + limit);
    return { items, total };
  }

  async saveShipment(shipment: ShipmentEntity): Promise<ShipmentEntity> {
    this.saveShipmentSync(shipment);
    return shipment;
  }

  async updateShipmentStatus(shipmentId: string, status: ShipmentEntity['status']): Promise<ShipmentEntity | null> {
    const shipment = this.shipments.get(shipmentId);
    if (!shipment) return null;

    const updated: ShipmentEntity = {
      ...shipment,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.saveShipmentSync(updated);
    return updated;
  }

  async getCarriers(): Promise<ShippingCarrier[]> {
    return this.carriers;
  }

  async getCarrierById(carrierId: string): Promise<ShippingCarrier | null> {
    return this.carriers.find(c => c.id === carrierId) || null;
  }

  async getShippingMethods(): Promise<ShippingMethodConfig[]> {
    return this.shippingMethods;
  }

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    return this.deliveryZones;
  }

  async getDrivers(): Promise<LogisticsStaffDriver[]> {
    return this.drivers;
  }

  async createReturnRequest(record: ReturnShipmentRecord): Promise<ReturnShipmentRecord> {
    this.returnsMap.set(record.returnId, record);
    return record;
  }

  async getReturnRequestById(returnId: string): Promise<ReturnShipmentRecord | null> {
    return this.returnsMap.get(returnId) || null;
  }

  async getReturnsByOrderId(orderId: string): Promise<ReturnShipmentRecord[]> {
    return Array.from(this.returnsMap.values()).filter(r => r.orderId === orderId);
  }

  async getPickupRequests(): Promise<PickupRequest[]> {
    return this.pickupRequests;
  }
}

export const logisticsRepository = new LogisticsRepository();
