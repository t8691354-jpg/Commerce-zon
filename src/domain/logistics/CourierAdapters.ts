/**
 * Enterprise Courier Adapter Implementations
 * Supports CommerceZon Logistics (Fleet), UPS, FedEx, DHL
 */

import { ICourierAdapter, CourierRateRequest, CourierRateResponse, DispatchShipmentRequest, DispatchShipmentResponse } from './ICourierAdapter';
import { ShipmentIdGenerator } from './ShipmentEntity';
import { logger } from '../../infrastructure/logging/Logger';

export class CommerceZonLogisticsAdapter implements ICourierAdapter {
  carrierId = 'CARRIER-AMZL';
  carrierName = 'Commerce Zon Native Logistics Fleet';
  carrierCode = 'CZL';

  async getRates(request: CourierRateRequest): Promise<CourierRateResponse> {
    const baseCost = request.shippingMethod === 'SAME_DAY' ? 19.99 : request.shippingMethod === 'EXPRESS' ? 12.99 : 4.99;
    const weightFee = request.totalWeightKg * 0.85;
    const costUSD = Math.round((baseCost + weightFee) * 100) / 100;

    return {
      carrierId: this.carrierId,
      carrierName: this.carrierName,
      serviceLevel: request.shippingMethod,
      estimatedDays: request.shippingMethod === 'SAME_DAY' ? 'Same Day' : '1-2 Days',
      costUSD,
      guaranteedDelivery: true,
    };
  }

  async dispatchShipment(request: DispatchShipmentRequest): Promise<DispatchShipmentResponse> {
    const trackingNumber = ShipmentIdGenerator.generateTrackingNumber('CZL');
    logger.info(`[CommerceZonLogisticsAdapter] Dispatched native fleet shipment ${request.shipmentId} -> Tracking: ${trackingNumber}`, 'LogisticsDomain');

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (request.shippingMethod === 'SAME_DAY' ? 0 : 2));

    return {
      success: true,
      trackingNumber,
      estimatedDeliveryDate: deliveryDate.toISOString().slice(0, 10),
      carrierReferenceId: `czl_manifest_${Date.now()}`,
    };
  }

  async cancelShipment(trackingNumber: string, reason: string): Promise<boolean> {
    logger.info(`[CommerceZonLogisticsAdapter] Cancelled shipment ${trackingNumber} - Reason: ${reason}`, 'LogisticsDomain');
    return true;
  }

  async verifyTrackingStatus(trackingNumber: string): Promise<{ status: string; currentLocation?: string; timestamp: string }> {
    return {
      status: 'IN_TRANSIT',
      currentLocation: 'Commerce Zon Regional Sorting Hub',
      timestamp: new Date().toISOString(),
    };
  }
}

export class UPSGlobalAdapter implements ICourierAdapter {
  carrierId = 'CARRIER-UPS';
  carrierName = 'UPS Worldwide Express';
  carrierCode = 'UPS';

  async getRates(request: CourierRateRequest): Promise<CourierRateResponse> {
    const baseCost = 14.50;
    const weightFee = request.totalWeightKg * 1.15;
    return {
      carrierId: this.carrierId,
      carrierName: this.carrierName,
      serviceLevel: 'EXPEDITED',
      estimatedDays: '2-3 Days',
      costUSD: Math.round((baseCost + weightFee) * 100) / 100,
      guaranteedDelivery: true,
    };
  }

  async dispatchShipment(request: DispatchShipmentRequest): Promise<DispatchShipmentResponse> {
    const trackingNumber = `1Z${Math.random().toString(36).substring(2, 10).toUpperCase()}0491823`;
    return {
      success: true,
      trackingNumber,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      carrierReferenceId: `ups_pkg_${Date.now()}`,
    };
  }

  async cancelShipment(trackingNumber: string, reason: string): Promise<boolean> {
    return true;
  }

  async verifyTrackingStatus(trackingNumber: string): Promise<{ status: string; currentLocation?: string; timestamp: string }> {
    return { status: 'DEPARTED_FACILITY', currentLocation: 'UPS Worldport Louisville KY', timestamp: new Date().toISOString() };
  }
}

export class FedExPriorityAdapter implements ICourierAdapter {
  carrierId = 'CARRIER-FEDEX';
  carrierName = 'FedEx Priority Freight';
  carrierCode = 'FEDEX';

  async getRates(request: CourierRateRequest): Promise<CourierRateResponse> {
    const baseCost = 15.99;
    const weightFee = request.totalWeightKg * 1.10;
    return {
      carrierId: this.carrierId,
      carrierName: this.carrierName,
      serviceLevel: 'PRIORITY_OVERNIGHT',
      estimatedDays: '1-2 Days',
      costUSD: Math.round((baseCost + weightFee) * 100) / 100,
      guaranteedDelivery: true,
    };
  }

  async dispatchShipment(request: DispatchShipmentRequest): Promise<DispatchShipmentResponse> {
    const trackingNumber = `77${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    return {
      success: true,
      trackingNumber,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      carrierReferenceId: `fedex_awb_${Date.now()}`,
    };
  }

  async cancelShipment(trackingNumber: string, reason: string): Promise<boolean> {
    return true;
  }

  async verifyTrackingStatus(trackingNumber: string): Promise<{ status: string; currentLocation?: string; timestamp: string }> {
    return { status: 'IN_TRANSIT', currentLocation: 'FedEx Memphis Superhub', timestamp: new Date().toISOString() };
  }
}

export class DHLInternationalAdapter implements ICourierAdapter {
  carrierId = 'CARRIER-DHL';
  carrierName = 'DHL Express International';
  carrierCode = 'DHL';

  async getRates(request: CourierRateRequest): Promise<CourierRateResponse> {
    const baseCost = 24.99;
    const weightFee = request.totalWeightKg * 1.80;
    return {
      carrierId: this.carrierId,
      carrierName: this.carrierName,
      serviceLevel: 'EXPRESS_WORLDWIDE',
      estimatedDays: '2-4 Days',
      costUSD: Math.round((baseCost + weightFee) * 100) / 100,
      guaranteedDelivery: true,
    };
  }

  async dispatchShipment(request: DispatchShipmentRequest): Promise<DispatchShipmentResponse> {
    const trackingNumber = `DHL-${Math.floor(100000000 + Math.random() * 900000000)}`;
    return {
      success: true,
      trackingNumber,
      estimatedDeliveryDate: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10),
      carrierReferenceId: `dhl_manifest_${Date.now()}`,
    };
  }

  async cancelShipment(trackingNumber: string, reason: string): Promise<boolean> {
    return true;
  }

  async verifyTrackingStatus(trackingNumber: string): Promise<{ status: string; currentLocation?: string; timestamp: string }> {
    return { status: 'CUSTOMS_CLEARANCE', currentLocation: 'Frankfurt Hub Germany', timestamp: new Date().toISOString() };
  }
}

export class CourierAdapterFactory {
  private static adapters: Map<string, ICourierAdapter> = new Map([
    ['CARRIER-AMZL', new CommerceZonLogisticsAdapter()],
    ['CARRIER-UPS', new UPSGlobalAdapter()],
    ['CARRIER-FEDEX', new FedExPriorityAdapter()],
    ['CARRIER-DHL', new DHLInternationalAdapter()],
  ]);

  public static getAdapter(carrierId: string): ICourierAdapter {
    const adapter = this.adapters.get(carrierId.toUpperCase()) || this.adapters.get('CARRIER-AMZL');
    return adapter || new CommerceZonLogisticsAdapter();
  }

  public static registerAdapter(adapter: ICourierAdapter): void {
    this.adapters.set(adapter.carrierId.toUpperCase(), adapter);
  }
}
