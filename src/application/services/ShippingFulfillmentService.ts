/**
 * Commerce Zon Marketplace - Part 17: Global Shipping, Logistics & Order Fulfillment Service
 * Handles Shipping Rates, Multi-Seller Fulfillment Separation, Carrier Dispatch, Tracking State Machine,
 * Packing Slips, Notifications, and Admin Logistics Configurations.
 */

import {
  ShipmentRecord,
  FulfillmentStatus,
  ShippingMethodCode,
  ShippingRateQuote,
  AdminShippingConfig,
  PackingSlip,
  TrackingEventRecord,
  VALID_STATUS_TRANSITIONS,
  AddressInfo,
  ShipmentItemDetail,
} from '../../types/shippingFulfillment';
import { CarrierRegistry } from '../../domain/logistics/CarrierProviderFramework';
import { notificationService } from './NotificationService';
import { auditService } from './AuditService';
import { logger } from '../../infrastructure/logging/Logger';

export const DEFAULT_ADMIN_SHIPPING_CONFIG: AdminShippingConfig = {
  freeShippingThresholdUSD: 99.0,
  defaultHandlingDays: 1,
  domesticFlatRateUSD: 4.99,
  internationalBaseRateUSD: 24.99,
  perKgRateUSD: 1.5,
  expressMultiplier: 2.2,
  supportedOriginCountries: ['US', 'PK', 'GB', 'DE', 'AE', 'SA', 'CA', 'AU'],
  supportedDestinationCountries: ['US', 'PK', 'GB', 'DE', 'AE', 'SA', 'CA', 'AU'],
  enabledMethods: ['STANDARD', 'EXPRESS', 'SAME_DAY', 'LOCAL_DELIVERY', 'INTERNATIONAL'],
  autoNotifyOnDispatch: true,
};

export class ShippingFulfillmentService {
  private shipments: Map<string, ShipmentRecord> = new Map();
  private config: AdminShippingConfig = { ...DEFAULT_ADMIN_SHIPPING_CONFIG };

  constructor() {
    this.seedInitialShipments();
  }

  private seedInitialShipments() {
    const seedShipment1: ShipmentRecord = {
      id: 'shp-seed-01',
      shipmentId: 'SHP-2026-8091',
      orderId: 'ord-seed-901',
      orderNumber: 'CZ-ORD-2026-901',
      sellerId: 'merch-01',
      sellerName: 'Titan Robotics USA',
      buyerId: 'buyer-01',
      buyerName: 'Alex Mercer',
      buyerEmail: 'alex.mercer@example.com',
      carrierId: 'CARRIER_FEDEX',
      carrierName: 'FedEx Priority Global',
      carrierCode: 'FEDEX',
      trackingNumber: '794918239012',
      trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=794918239012',
      status: 'IN_TRANSIT',
      shippingMethod: 'EXPRESS',
      originAddress: {
        fullName: 'Titan Robotics Fulfillment Depot',
        streetLine1: '850 Tech Park Way',
        city: 'Newark',
        stateOrProvince: 'NJ',
        postalCode: '07102',
        countryCode: 'US',
        phone: '+1-555-019-2834',
      },
      destinationAddress: {
        fullName: 'Alex Mercer',
        streetLine1: '742 Evergreen Terrace',
        city: 'Springfield',
        stateOrProvince: 'OR',
        postalCode: '97477',
        countryCode: 'US',
        phone: '+1-555-329-8472',
      },
      items: [
        {
          sku: 'TITAN-ROBO-X1',
          name: 'Titan Pro Robotic Arm Kit (Part 1)',
          quantity: 1,
          unitPriceUSD: 899.99,
          unitWeightKg: 4.5,
          sellerId: 'merch-01',
        },
      ],
      totalWeightKg: 4.5,
      shippingCostUSD: 14.99,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      dispatchedAt: new Date(Date.now() - 86400000).toISOString(),
      isManualFulfillment: false,
      statusHistory: [
        {
          id: 'ev-1',
          stage: 'PROCESSING',
          location: 'Newark Hub, NJ',
          description: 'Order received and picked from warehouse inventory bin.',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          actorRole: 'SELLER',
        },
        {
          id: 'ev-2',
          stage: 'PACKED',
          location: 'Newark Hub, NJ',
          description: 'Package secured with anti-static foam and packing slip enclosed.',
          timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
          actorRole: 'SELLER',
        },
        {
          id: 'ev-3',
          stage: 'READY_FOR_DISPATCH',
          location: 'Newark Hub, NJ',
          description: 'Shipment manifest prepared for courier pickup.',
          timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
          actorRole: 'SELLER',
        },
        {
          id: 'ev-4',
          stage: 'SHIPPED',
          location: 'Newark Sort Facility, NJ',
          description: 'Handed over to FedEx courier.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          actorRole: 'CARRIER',
        },
        {
          id: 'ev-5',
          stage: 'IN_TRANSIT',
          location: 'Memphis Sorting Hub, TN',
          description: 'En route to regional distribution center.',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          actorRole: 'CARRIER',
        },
      ],
    };

    this.shipments.set(seedShipment1.id, seedShipment1);
  }

  // --------------------------------------------------------------------------
  // 1. SHIPPING RATES & ESTIMATES ENGINE
  // --------------------------------------------------------------------------

  public calculateShippingQuotes(input: {
    originCountry?: string;
    destinationCountry: string;
    totalWeightKg: number;
    subtotalUSD: number;
    isPrime?: boolean;
  }): {
    isSupportedDestination: boolean;
    quotes: ShippingRateQuote[];
    unsupportedReason?: string;
  } {
    const destCountry = (input.destinationCountry || 'US').toUpperCase().trim();
    const originCountry = (input.originCountry || 'US').toUpperCase().trim();

    if (!this.config.supportedDestinationCountries.includes(destCountry)) {
      return {
        isSupportedDestination: false,
        quotes: [],
        unsupportedReason: `Country code '${destCountry}' is currently outside Commerce Zon authorized delivery network.`,
      };
    }

    const isInternational = originCountry !== destCountry;
    const weight = Math.max(0.1, input.totalWeightKg || 1.0);
    const quotes: ShippingRateQuote[] = [];

    // Rule 1: Free Shipping on Standard Delivery if >= threshold or Prime
    const qualifiesForFreeStandard =
      input.isPrime || input.subtotalUSD >= this.config.freeShippingThresholdUSD;

    // Standard Shipping
    if (this.config.enabledMethods.includes('STANDARD')) {
      const baseCost = isInternational
        ? this.config.internationalBaseRateUSD
        : this.config.domesticFlatRateUSD;
      const weightCost = weight * this.config.perKgRateUSD;
      const rawCost = Number((baseCost + weightCost).toFixed(2));
      const finalCost = qualifiesForFreeStandard && !isInternational ? 0 : rawCost;

      quotes.push({
        method: 'STANDARD',
        name: isInternational ? 'International Standard' : 'Commerce Zon Standard',
        carrierName: isInternational ? 'DHL Express Worldwide' : 'Commerce Zon Logistics',
        costUSD: finalCost,
        estimatedDays: isInternational ? '5 - 9 Business Days' : '3 - 5 Business Days',
        isFree: finalCost === 0,
        isInternational,
        deliveryWindow: isInternational ? '5-9 days' : '3-5 days',
        handlingTimeDays: this.config.defaultHandlingDays,
        destinationCountry: destCountry,
      });
    }

    // Express Shipping
    if (this.config.enabledMethods.includes('EXPRESS')) {
      const baseCost = (isInternational ? 39.99 : 12.99) * this.config.expressMultiplier * 0.6;
      const weightCost = weight * (this.config.perKgRateUSD * 1.8);
      const costUSD = Number((baseCost + weightCost).toFixed(2));

      quotes.push({
        method: 'EXPRESS',
        name: isInternational ? 'Global Priority Express' : 'FedEx Priority Air',
        carrierName: isInternational ? 'FedEx Priority Global' : 'FedEx Priority Air',
        costUSD,
        estimatedDays: isInternational ? '2 - 4 Business Days' : '1 - 2 Business Days',
        isFree: false,
        isInternational,
        deliveryWindow: isInternational ? '2-4 days' : '1-2 days',
        handlingTimeDays: 1,
        destinationCountry: destCountry,
      });
    }

    // Local Delivery (Domestic only)
    if (!isInternational && this.config.enabledMethods.includes('LOCAL_DELIVERY')) {
      quotes.push({
        method: 'LOCAL_DELIVERY',
        name: 'Same-Day / Next-Day Local Express',
        carrierName: 'Commerce Zon City Van Dispatch',
        costUSD: 7.99,
        estimatedDays: 'Within 24 Hours',
        isFree: false,
        isInternational: false,
        deliveryWindow: '24 hours',
        handlingTimeDays: 0,
        destinationCountry: destCountry,
      });
    }

    return {
      isSupportedDestination: true,
      quotes,
    };
  }

  // --------------------------------------------------------------------------
  // 2. SELLER FULFILLMENT & SHIPMENT CREATION
  // --------------------------------------------------------------------------

  public async createShipment(params: {
    sellerId: string;
    sellerName: string;
    orderId: string;
    orderNumber: string;
    buyerId: string;
    buyerName: string;
    buyerEmail?: string;
    carrierName: string;
    trackingNumber?: string;
    shippingMethod?: ShippingMethodCode;
    originAddress: AddressInfo;
    destinationAddress: AddressInfo;
    items: ShipmentItemDetail[];
    customsInfo?: any;
    dispatchNotes?: string;
    isManualFulfillment?: boolean;
  }): Promise<ShipmentRecord> {
    if (!params.sellerId || !params.orderId) {
      throw new Error('sellerId and orderId are required to create a shipment.');
    }

    if (!params.items || params.items.length === 0) {
      throw new Error('At least one item is required to create a shipment.');
    }

    // Multi-seller verification: verify items belong to this seller
    const unauthorizedItems = params.items.filter((i) => i.sellerId && i.sellerId !== params.sellerId);
    if (unauthorizedItems.length > 0) {
      throw new Error(
        `Multi-seller isolation violation: Seller '${params.sellerId}' cannot fulfill items belonging to another merchant.`
      );
    }

    // Duplicate check: check if a shipment already exists for this order and seller with same items
    const existing = Array.from(this.shipments.values()).find(
      (s) =>
        s.orderId === params.orderId &&
        s.sellerId === params.sellerId &&
        s.status !== 'CANCELLED' &&
        s.items.some((si) => params.items.some((pi) => pi.sku === si.sku))
    );

    if (existing) {
      throw new Error(
        `Duplicate shipment prevention: Order #${params.orderNumber} already has an active shipment (${existing.shipmentId}) for these items.`
      );
    }

    const carrierProvider = CarrierRegistry.getCarrier(params.carrierName);
    const trackingNum =
      params.trackingNumber && params.trackingNumber.trim()
        ? params.trackingNumber.trim()
        : `TRK-${carrierProvider?.metadata.carrierCode || 'CZ'}-${Date.now().toString().slice(-8)}`;

    const trackingUrl = carrierProvider ? carrierProvider.generateTrackingUrl(trackingNum) : null;
    const now = new Date().toISOString();
    const uniqueId = `shp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const shipmentCode = `SHP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const totalWeightKg = params.items.reduce(
      (sum, item) => sum + (item.unitWeightKg || 0.5) * item.quantity,
      0
    );

    const estDays = params.shippingMethod === 'EXPRESS' ? 2 : 4;
    const estDate = new Date(Date.now() + 86400000 * estDays).toISOString().slice(0, 10);

    const newShipment: ShipmentRecord = {
      id: uniqueId,
      shipmentId: shipmentCode,
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      sellerId: params.sellerId,
      sellerName: params.sellerName,
      buyerId: params.buyerId,
      buyerName: params.buyerName,
      buyerEmail: params.buyerEmail,
      carrierId: carrierProvider?.metadata.carrierId || 'CARRIER_GENERIC',
      carrierName: carrierProvider?.metadata.name || params.carrierName,
      carrierCode: carrierProvider?.metadata.carrierCode || 'GEN',
      trackingNumber: trackingNum,
      trackingUrl,
      status: 'PROCESSING',
      shippingMethod: params.shippingMethod || 'STANDARD',
      originAddress: params.originAddress,
      destinationAddress: params.destinationAddress,
      items: params.items,
      totalWeightKg: Number(totalWeightKg.toFixed(2)),
      shippingCostUSD: params.shippingMethod === 'EXPRESS' ? 14.99 : 4.99,
      estimatedDeliveryDate: estDate,
      createdAt: now,
      updatedAt: now,
      customsInfo: params.customsInfo,
      dispatchNotes: params.dispatchNotes,
      isManualFulfillment: params.isManualFulfillment ?? true,
      statusHistory: [
        {
          id: `ev-${Date.now()}`,
          stage: 'PROCESSING',
          location: `${params.originAddress.city}, ${params.originAddress.countryCode}`,
          description: `Shipment created by merchant '${params.sellerName}'. Items queued for packaging.`,
          timestamp: now,
          actorRole: 'SELLER',
          actorId: params.sellerId,
        },
      ],
    };

    this.shipments.set(newShipment.id, newShipment);

    auditService.recordEvent(
      'MOCK_MERCHANT',
      params.sellerId,
      'SHIPMENT_CREATED',
      'LOGISTICS',
      `Created shipment ${newShipment.shipmentId} for order ${params.orderNumber} with tracking ${newShipment.trackingNumber}`
    );

    return newShipment;
  }

  // --------------------------------------------------------------------------
  // 3. SHIPMENT STATUS STATE MACHINE & TRANSITIONS
  // --------------------------------------------------------------------------

  public async updateShipmentStatus(params: {
    shipmentId: string;
    actor: { id: string; role: 'SELLER' | 'ADMIN' | 'CARRIER' | 'BUYER' };
    newStatus: FulfillmentStatus;
    location?: string;
    description?: string;
    exceptionType?: any;
    exceptionReason?: string;
  }): Promise<ShipmentRecord> {
    const shipment = this.getShipmentById(params.shipmentId);
    if (!shipment) {
      throw new Error(`Shipment with identifier '${params.shipmentId}' was not found.`);
    }

    // Role-based authorization enforcement
    if (params.actor.role === 'BUYER') {
      throw new Error('Security Violation: Buyers cannot modify shipment or fulfillment statuses.');
    }

    if (params.actor.role === 'SELLER' && shipment.sellerId !== params.actor.id) {
      throw new Error('Forbidden: Sellers can only modify fulfillment records belonging to their store.');
    }

    if (params.actor.role === 'SELLER') {
      // Sellers can only advance their package up to ready/shipped or report exception
      const allowedSellerStatuses: FulfillmentStatus[] = [
        'PROCESSING',
        'PACKED',
        'READY_FOR_DISPATCH',
        'SHIPPED',
        'DELIVERY_EXCEPTION',
        'CANCELLED',
      ];
      if (!allowedSellerStatuses.includes(params.newStatus)) {
        throw new Error(
          `Permission Denied: Sellers cannot set status to '${params.newStatus}'. Only certified carriers or platform administrators can confirm in-transit or final delivery.`
        );
      }
    }

    // State machine check
    const allowedTransitions = VALID_STATUS_TRANSITIONS[shipment.status];
    if (params.actor.role !== 'ADMIN' && !allowedTransitions.includes(params.newStatus)) {
      throw new Error(
        `Invalid Status Transition: Cannot transition shipment from '${shipment.status}' to '${params.newStatus}'. Valid next states: [${allowedTransitions.join(
          ', '
        )}]`
      );
    }

    const now = new Date().toISOString();
    shipment.status = params.newStatus;
    shipment.updatedAt = now;

    if (params.newStatus === 'SHIPPED') {
      shipment.dispatchedAt = now;
    } else if (params.newStatus === 'DELIVERED') {
      shipment.deliveredAt = now;
    }

    if (params.exceptionReason) {
      shipment.exceptionReason = params.exceptionReason;
    }

    const eventRecord: TrackingEventRecord = {
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      stage: params.newStatus,
      location: params.location || `${shipment.originAddress.city}, ${shipment.originAddress.countryCode}`,
      description:
        params.description ||
        `Status updated to ${params.newStatus} by ${params.actor.role.toLowerCase()}.`,
      timestamp: now,
      isException: params.newStatus === 'DELAYED' || params.newStatus === 'DELIVERY_EXCEPTION',
      exceptionType: params.exceptionType,
      actorRole: params.actor.role,
      actorId: params.actor.id,
    };

    shipment.statusHistory.push(eventRecord);

    // Notifications dispatching
    if (this.config.autoNotifyOnDispatch && ['SHIPPED', 'DELAYED', 'DELIVERY_EXCEPTION', 'DELIVERED'].includes(params.newStatus)) {
      await notificationService.sendNotification({
        recipientId: shipment.buyerId,
        role: 'Buyer',
        category: 'Order',
        channel: 'in_app',
        title: `Shipment Update: ${params.newStatus.replace(/_/g, ' ')}`,
        body: `Package for Order #${shipment.orderNumber} (${shipment.carrierName} #${shipment.trackingNumber}) is now ${params.newStatus.replace(/_/g, ' ')}.`,
        priority: params.newStatus === 'DELIVERY_EXCEPTION' ? 'high' : 'normal',
      });
    }

    auditService.recordEvent(
      params.actor.role === 'ADMIN' ? 'SYSTEM' : 'MOCK_MERCHANT',
      params.actor.id,
      'SHIPMENT_STATUS_UPDATED',
      'LOGISTICS',
      `Updated shipment ${shipment.shipmentId} status to ${params.newStatus}`
    );

    return shipment;
  }

  // --------------------------------------------------------------------------
  // 4. PRINTABLE PACKING SLIP & ITEM CHECKLIST (Requirement 8)
  // --------------------------------------------------------------------------

  public generatePackingSlip(shipmentId: string, requestedBySellerId?: string): PackingSlip {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment '${shipmentId}' not found.`);
    }

    if (requestedBySellerId && shipment.sellerId !== requestedBySellerId) {
      throw new Error('Forbidden: Cannot access packing slip for another merchant shipment.');
    }

    const now = new Date().toISOString();
    shipment.packingSlipGeneratedAt = now;

    const formattedItems = shipment.items.map((i) => ({
      sku: i.sku,
      title: i.name,
      quantity: i.quantity,
      unitPriceUSD: i.unitPriceUSD,
      totalUSD: Number((i.unitPriceUSD * i.quantity).toFixed(2)),
    }));

    const packingSlip: PackingSlip = {
      packingSlipNumber: `PKSLP-${shipment.shipmentId}`,
      shipmentId: shipment.shipmentId,
      orderNumber: shipment.orderNumber,
      orderDate: shipment.createdAt,
      generatedAt: now,
      seller: {
        name: shipment.sellerName,
        address: `${shipment.originAddress.streetLine1}, ${shipment.originAddress.city}, ${shipment.originAddress.stateOrProvince} ${shipment.originAddress.postalCode}, ${shipment.originAddress.countryCode}`,
        email: 'merchant-support@commercezon.com',
      },
      buyer: {
        name: shipment.buyerName,
        shippingAddress: `${shipment.destinationAddress.streetLine1}, ${shipment.destinationAddress.city}, ${shipment.destinationAddress.stateOrProvince} ${shipment.destinationAddress.postalCode}, ${shipment.destinationAddress.countryCode}`,
        phone: shipment.destinationAddress.phone,
      },
      items: formattedItems,
      totalItems: formattedItems.reduce((acc, i) => acc + i.quantity, 0),
      shippingMethod: shipment.shippingMethod,
      carrier: shipment.carrierName,
      trackingNumber: shipment.trackingNumber,
      specialInstructions: shipment.dispatchNotes || 'Standard handling — fragile items enclosed.',
      returnPolicyNotice:
        'Commerce Zon 30-Day Hassle-Free Returns: Return eligible items in original packaging via Commerce Zon Customer Portal.',
      isOfficialCarrierLabel: false,
      disclaimer:
        'OFFICIAL COMMERCE ZON WAREHOUSE PACKING SLIP & CHECKLIST — THIS DOCUMENT IS NOT A PREPAID POSTAGE CARRIER SHIPPING LABEL.',
    };

    return packingSlip;
  }

  // --------------------------------------------------------------------------
  // 5. QUERY HELPERS
  // --------------------------------------------------------------------------

  public getShipmentById(idOrShipmentId: string): ShipmentRecord | null {
    if (!idOrShipmentId) return null;
    const clean = idOrShipmentId.trim();
    for (const s of this.shipments.values()) {
      if (s.id === clean || s.shipmentId === clean || s.trackingNumber === clean) {
        return s;
      }
    }
    return null;
  }

  public getSellerShipments(sellerId: string): ShipmentRecord[] {
    return Array.from(this.shipments.values()).filter((s) => s.sellerId === sellerId);
  }

  public getBuyerShipments(buyerIdOrOrderId: string): ShipmentRecord[] {
    return Array.from(this.shipments.values()).filter(
      (s) => s.buyerId === buyerIdOrOrderId || s.orderId === buyerIdOrOrderId
    );
  }

  public getAllShipments(filter?: {
    status?: string;
    sellerId?: string;
    exceptionOnly?: boolean;
  }): ShipmentRecord[] {
    let list = Array.from(this.shipments.values());
    if (filter?.status) {
      list = list.filter((s) => s.status === filter.status);
    }
    if (filter?.sellerId) {
      list = list.filter((s) => s.sellerId === filter.sellerId);
    }
    if (filter?.exceptionOnly) {
      list = list.filter(
        (s) => s.status === 'DELAYED' || s.status === 'DELIVERY_EXCEPTION'
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAdminConfig(): AdminShippingConfig {
    return { ...this.config };
  }

  public updateAdminConfig(newConfig: Partial<AdminShippingConfig>, adminId: string): AdminShippingConfig {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    auditService.recordEvent(
      'SYSTEM',
      adminId,
      'SHIPPING_CONFIG_UPDATED',
      'LOGISTICS',
      `Updated platform shipping and fulfillment rates configuration`
    );
    logger.info('[ShippingFulfillmentService] Admin updated platform shipping configuration.');
    return this.getAdminConfig();
  }
}

export const shippingFulfillmentService = new ShippingFulfillmentService();
