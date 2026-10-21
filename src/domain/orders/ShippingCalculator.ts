/**
 * Enterprise Order Management System (OMS)
 * Shipping, Carrier Rate Calculator & Tracking Engine
 */

import { Money, Location } from '../../types/domain';
import { ShipmentTrackingLog } from '../../types/oms';
import { OrderNumberGenerator } from './OrderNumberGenerator';

export interface ShippingOption {
  id: string;
  carrier: 'Commerce Zon Logistics' | 'DHL Express' | 'FedEx' | 'UPS' | 'Prime Air';
  serviceName: string;
  cost: Money;
  estimatedDeliveryDays: number;
  deliveryDateFormatted: string;
}

export class ShippingCalculator {
  /**
   * Calculates available shipping rates and delivery dates based on destination.
   */
  public static calculateShippingOptions(
    destination: Location,
    totalWeightKg: number = 2.5
  ): ShippingOption[] {
    const today = new Date();
    const isInternational = destination.country !== 'USA' && destination.country !== 'US';

    const addDays = (days: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };

    if (isInternational) {
      return [
        {
          id: 'ship-dhl-express',
          carrier: 'DHL Express',
          serviceName: 'DHL Worldwide Air Express',
          cost: { amount: 65.00, currency: 'USD' },
          estimatedDeliveryDays: 3,
          deliveryDateFormatted: addDays(3),
        },
        {
          id: 'ship-fedex-intl',
          carrier: 'FedEx',
          serviceName: 'FedEx International Economy',
          cost: { amount: 45.00, currency: 'USD' },
          estimatedDeliveryDays: 5,
          deliveryDateFormatted: addDays(5),
        },
      ];
    }

    return [
      {
        id: 'ship-czl-standard',
        carrier: 'Commerce Zon Logistics',
        serviceName: 'Commerce Zon Standard Ground',
        cost: { amount: 15.00, currency: 'USD' },
        estimatedDeliveryDays: 3,
        deliveryDateFormatted: addDays(3),
      },
      {
        id: 'ship-czl-express',
        carrier: 'Commerce Zon Logistics',
        serviceName: 'Commerce Zon 2-Day Express',
        cost: { amount: 25.00, currency: 'USD' },
        estimatedDeliveryDays: 2,
        deliveryDateFormatted: addDays(2),
      },
      {
        id: 'ship-prime-air',
        carrier: 'Prime Air',
        serviceName: 'Prime Air Same-Day Autonomous Drone Delivery',
        cost: { amount: 49.99, currency: 'USD' },
        estimatedDeliveryDays: 1,
        deliveryDateFormatted: addDays(1),
      },
    ];
  }

  /**
   * Generates initial tracking log timeline for a new shipment.
   */
  public static createInitialTrackingLog(
    orderId: string,
    subOrderId?: string,
    carrierName: 'Commerce Zon Logistics' | 'DHL Express' | 'FedEx' | 'UPS' | 'Prime Air' = 'Commerce Zon Logistics',
    trackingNumber?: string
  ): ShipmentTrackingLog {
    const tracking = trackingNumber || OrderNumberGenerator.generateTrackingNumber('CZL');
    return {
      id: `trk-log-${Date.now()}`,
      orderId,
      subOrderId,
      trackingNumber: tracking,
      carrier: carrierName,
      stage: 'CREATED',
      location: 'Logistics Warehouse Intake Facility',
      description: 'Shipment label created and package queued for dispatch scan.',
      estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      timestamp: new Date().toISOString(),
    };
  }
}
