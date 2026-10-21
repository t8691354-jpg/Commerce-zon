/**
 * Enterprise Logistics Application Service
 * Coordinates Shipping Rates, Fulfilment Allocation, Carrier Dispatch, Tracking, Split Shipments, and Return Logistics
 */

import { ShippingMethodType, ShippingCarrier, ShippingMethodConfig, DeliveryZone, LogisticsStaffDriver, PickupRequest } from '../../types/logistics';
import { ShipmentEntity, ShippingAddressRecord, ShipmentItemRecord, ShipmentIdGenerator } from '../../domain/logistics/ShipmentEntity';
import { CourierAdapterFactory } from '../../domain/logistics/CourierAdapters';
import { AddressManager, AddressValidationResult } from '../../domain/logistics/AddressManager';
import { ShippingRateEngine, RateCalculationInput, RateCalculationResult } from '../../domain/logistics/ShippingRateEngine';
import { FulfilmentEngine, AllocationPlan } from '../../domain/logistics/FulfilmentEngine';
import { ShipmentTrackingEngine } from '../../domain/logistics/ShipmentTrackingEngine';
import { SplitShipmentEngine, SplitShipmentResult } from '../../domain/logistics/SplitShipmentEngine';
import { ReturnLogisticsEngine, ReturnShipmentRecord, ReturnReason, ReturnInspectionOutcome } from '../../domain/logistics/ReturnLogisticsEngine';
import { ShippingLabelEngine, GeneratedShippingLabel } from '../../domain/logistics/ShippingLabelEngine';
import { ILogisticsRepository, LogisticsSearchFilter } from '../../domain/logistics/ILogisticsRepository';
import { logisticsRepository } from '../../infrastructure/repositories/LogisticsRepository';
import { logger } from '../../infrastructure/logging/Logger';
import { eventBus } from '../../lib/eventBus';

export class LogisticsService {
  private repository: ILogisticsRepository;

  constructor(repo: ILogisticsRepository = logisticsRepository) {
    this.repository = repo;
  }

  /**
   * Validates shipping address and returns normalized format.
   */
  public validateAddress(address: Partial<ShippingAddressRecord>): AddressValidationResult {
    return AddressManager.validateAddress(address);
  }

  /**
   * Calculates shipping costs across available shipping methods.
   */
  public calculateRates(input: RateCalculationInput): RateCalculationResult {
    return ShippingRateEngine.calculateShippingRate(input);
  }

  /**
   * Allocates fulfilment warehouses for order items.
   */
  public allocateFulfilment(items: ShipmentItemRecord[], destAddress: ShippingAddressRecord): AllocationPlan[] {
    const defaultWarehouses = [
      {
        warehouseId: 'WH-MAIN-US-EAST',
        warehouseName: 'Main East Coast Hub (NJ)',
        city: 'Edison',
        stateOrProvince: 'NJ',
        postalCode: '08817',
        availableStock: new Map(items.map(i => [i.sku, i.quantity + 50])),
      },
      {
        warehouseId: 'WH-US-WEST',
        warehouseName: 'West Coast Distribution Center (CA)',
        city: 'Ontario',
        stateOrProvince: 'CA',
        postalCode: '91761',
        availableStock: new Map(items.map(i => [i.sku, i.quantity + 20])),
      },
    ];

    const engine = new FulfilmentEngine(defaultWarehouses);
    return engine.allocateFulfilment(items, destAddress);
  }

  /**
   * Creates shipments (with split shipment support) for an order.
   */
  public async createOrderShipments(params: {
    orderId: string;
    orderNumber: string;
    items: ShipmentItemRecord[];
    originAddress: ShippingAddressRecord;
    destinationAddress: ShippingAddressRecord;
    shippingMethod: ShippingMethodType;
    carrierId?: string;
  }): Promise<ShipmentEntity[]> {
    const carrierId = params.carrierId || 'CARRIER-AMZL';

    const rateResult = ShippingRateEngine.calculateShippingRate({
      originAddress: params.originAddress,
      destinationAddress: params.destinationAddress,
      items: params.items,
      shippingMethod: params.shippingMethod,
      subtotalUSD: params.items.reduce((sum, i) => sum + (i.unitValueUSD * i.quantity), 0),
    });

    const splitResult: SplitShipmentResult = SplitShipmentEngine.processSplitShipment({
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      items: params.items,
      originAddress: params.originAddress,
      destinationAddress: params.destinationAddress,
      shippingMethod: params.shippingMethod,
      carrierId,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    });

    const createdShipments: ShipmentEntity[] = [];

    for (const shp of splitResult.subShipments) {
      const saved = await this.repository.saveShipment(shp);
      createdShipments.push(saved);

      logger.info(`[LogisticsService] Created shipment ${saved.shipmentId} (Tracking: ${saved.trackingNumber}) for order ${params.orderId}`, 'LogisticsService');

      eventBus.publish({
        id: ShipmentIdGenerator.generateShipmentId(),
        eventType: 'ShipmentCreated',
        domain: 'LOGISTICS',
        aggregateId: saved.shipmentId,
        timestamp: new Date().toISOString(),
        payload: {
          shipmentId: saved.shipmentId,
          orderId: saved.orderId,
          trackingNumber: saved.trackingNumber,
          carrierId: saved.carrierId,
          status: saved.status,
        },
        actor: { type: 'SYSTEM', id: 'LOGISTICS_SERVICE' },
      });
    }

    return createdShipments;
  }

  /**
   * Dispatches shipment with designated courier adapter.
   */
  public async dispatchShipment(shipmentId: string): Promise<ShipmentEntity> {
    const shipment = await this.repository.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found.`);
    }

    const adapter = CourierAdapterFactory.getAdapter(shipment.carrierId);
    const dispatchResult = await adapter.dispatchShipment({
      shipmentId: shipment.shipmentId,
      orderId: shipment.orderId,
      originAddress: shipment.originAddress,
      destinationAddress: shipment.destinationAddress,
      items: shipment.items,
      totalWeightKg: shipment.totalWeightKg,
      shippingMethod: shipment.shippingMethod,
      declaredValueUSD: shipment.items.reduce((sum, i) => sum + (i.unitValueUSD * i.quantity), 0),
    });

    const updated = ShipmentTrackingEngine.addMilestone(
      shipment,
      'IN_TRANSIT',
      `Handed over to ${adapter.carrierName}`,
      shipment.originAddress.city || 'Carrier Sorting Facility',
      `Courier Ref: ${dispatchResult.carrierReferenceId}`
    );

    const saved = await this.repository.saveShipment(updated);

    eventBus.publish({
      id: ShipmentIdGenerator.generateShipmentId(),
      eventType: 'ShipmentDispatched',
      domain: 'LOGISTICS',
      aggregateId: saved.shipmentId,
      timestamp: new Date().toISOString(),
      payload: {
        shipmentId: saved.shipmentId,
        trackingNumber: saved.trackingNumber,
        carrierName: adapter.carrierName,
      },
      actor: { type: 'SYSTEM', id: 'LOGISTICS_SERVICE' },
    });

    return saved;
  }

  /**
   * Advances shipment milestone status.
   */
  public async updateShipmentStatus(
    shipmentId: string,
    stage: ShipmentEntity['status'],
    title: string,
    location: string,
    notes?: string
  ): Promise<ShipmentEntity> {
    const shipment = await this.repository.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found.`);
    }

    const updated = ShipmentTrackingEngine.addMilestone(shipment, stage, title, location, notes);
    const saved = await this.repository.saveShipment(updated);

    logger.info(`[LogisticsService] Shipment ${shipmentId} updated status to ${stage}`, 'LogisticsService');
    return saved;
  }

  /**
   * Records Proof of Delivery upon successful delivery.
   */
  public async confirmDelivery(
    shipmentId: string,
    recipientName: string,
    driverNotes?: string
  ): Promise<ShipmentEntity> {
    const shipment = await this.repository.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found.`);
    }

    const pod = {
      recipientName,
      gpsLatitude: 40.7128,
      gpsLongitude: -74.0060,
      timestamp: new Date().toISOString(),
      driverNotes: driverNotes || 'Delivered directly to recipient front porch.',
    };

    const updated = ShipmentTrackingEngine.recordProofOfDelivery(shipment, pod);
    const saved = await this.repository.saveShipment(updated);

    eventBus.publish({
      id: ShipmentIdGenerator.generateShipmentId(),
      eventType: 'ShipmentDelivered',
      domain: 'LOGISTICS',
      aggregateId: saved.shipmentId,
      timestamp: new Date().toISOString(),
      payload: {
        shipmentId: saved.shipmentId,
        orderId: saved.orderId,
        recipientName,
      },
      actor: { type: 'SYSTEM', id: 'LOGISTICS_SERVICE' },
    });

    return saved;
  }

  /**
   * Generates shipping label and packing slip documents.
   */
  public async generateLabelAndPackingSlip(shipmentId: string): Promise<GeneratedShippingLabel> {
    const shipment = await this.repository.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found.`);
    }

    return ShippingLabelEngine.generateLabelAndPackingSlip(shipment);
  }

  /**
   * Initiates return logistics workflow.
   */
  public async requestReturn(params: {
    originalShipmentId: string;
    orderId: string;
    customerId: string;
    pickupAddress: ShippingAddressRecord;
    items: ShipmentItemRecord[];
    reason: ReturnReason;
    notes?: string;
  }): Promise<ReturnShipmentRecord> {
    const record = ReturnLogisticsEngine.createReturnRequest(params);
    const saved = await this.repository.createReturnRequest(record);

    eventBus.publish({
      id: ShipmentIdGenerator.generateShipmentId(),
      eventType: 'ReturnRequested',
      domain: 'LOGISTICS',
      aggregateId: saved.returnId,
      timestamp: new Date().toISOString(),
      payload: {
        returnId: saved.returnId,
        originalShipmentId: saved.originalShipmentId,
        orderId: saved.orderId,
        reason: saved.reason,
      },
      actor: { type: 'MOCK_USER', id: params.customerId },
    });

    return saved;
  }

  /**
   * Inspects returned items at warehouse.
   */
  public async inspectReturn(
    returnId: string,
    outcome: ReturnInspectionOutcome,
    inspectorNotes: string
  ): Promise<ReturnShipmentRecord> {
    const record = await this.repository.getReturnRequestById(returnId);
    if (!record) {
      throw new Error(`Return request ${returnId} not found.`);
    }

    const updated = ReturnLogisticsEngine.inspectReturnItem(record, outcome, inspectorNotes);
    return await this.repository.createReturnRequest(updated);
  }

  // Read Queries
  public async getShipmentById(id: string): Promise<ShipmentEntity | null> {
    return this.repository.getShipmentById(id);
  }

  public async getShipmentByTrackingNumber(tracking: string): Promise<ShipmentEntity | null> {
    return this.repository.getShipmentByTrackingNumber(tracking);
  }

  public async getShipmentsByOrderId(orderId: string): Promise<ShipmentEntity[]> {
    return this.repository.getShipmentsByOrderId(orderId);
  }

  public async searchShipments(filter: LogisticsSearchFilter) {
    return this.repository.searchShipments(filter);
  }

  public async getCarriers(): Promise<ShippingCarrier[]> {
    return this.repository.getCarriers();
  }

  public async getShippingMethods(): Promise<ShippingMethodConfig[]> {
    return this.repository.getShippingMethods();
  }

  public async getDeliveryZones(): Promise<DeliveryZone[]> {
    return this.repository.getDeliveryZones();
  }

  public async getDrivers(): Promise<LogisticsStaffDriver[]> {
    return this.repository.getDrivers();
  }

  public async getPickupRequests(): Promise<PickupRequest[]> {
    return this.repository.getPickupRequests();
  }
}

export const logisticsService = new LogisticsService();
