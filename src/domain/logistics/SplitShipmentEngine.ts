/**
 * Enterprise Split Shipment Engine
 * Automatically splits multi-item orders into parent-child sub-shipments based on Warehouse or Seller origin
 */

import { ShipmentEntity, ShipmentItemRecord, ShippingAddressRecord, ShipmentIdGenerator } from './ShipmentEntity';
import { ShippingMethodType } from '../../types/logistics';
import { CourierAdapterFactory } from './CourierAdapters';

export interface SplitShipmentResult {
  isSplit: boolean;
  parentShipmentId: string;
  subShipments: ShipmentEntity[];
}

export class SplitShipmentEngine {
  public static processSplitShipment(params: {
    orderId: string;
    orderNumber: string;
    items: ShipmentItemRecord[];
    originAddress: ShippingAddressRecord;
    destinationAddress: ShippingAddressRecord;
    shippingMethod: ShippingMethodType;
    carrierId: string;
    estimatedDeliveryDate: string;
  }): SplitShipmentResult {
    const parentShipmentId = ShipmentIdGenerator.generateShipmentId();

    // Group items by sellerId or warehouseId
    const groupsMap = new Map<string, ShipmentItemRecord[]>();

    for (const item of params.items) {
      const groupKey = item.sellerId || item.warehouseId || 'DEFAULT_ORIGIN';
      const existing = groupsMap.get(groupKey) || [];
      existing.push(item);
      groupsMap.set(groupKey, existing);
    }

    const isSplit = groupsMap.size > 1;
    const subShipments: ShipmentEntity[] = [];
    const now = new Date().toISOString();

    let index = 1;
    for (const [groupKey, groupItems] of groupsMap.entries()) {
      const subShipmentId = isSplit ? `${parentShipmentId}-S${index}` : parentShipmentId;
      const carrier = CourierAdapterFactory.getAdapter(params.carrierId);
      const trackingNumber = ShipmentIdGenerator.generateTrackingNumber(carrier.carrierCode);

      const totalWeightKg = groupItems.reduce((acc, i) => acc + (i.unitWeightKg * i.quantity), 0);
      const subCostUSD = Math.round((params.shippingMethod === 'EXPRESS' ? 12.99 : 4.99) * (groupItems.length / params.items.length) * 100) / 100;

      const shipment: ShipmentEntity = {
        shipmentId: subShipmentId,
        parentShipmentId: isSplit ? parentShipmentId : undefined,
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        trackingNumber,
        carrierId: carrier.carrierId,
        carrierName: carrier.carrierName,
        shippingMethod: params.shippingMethod,
        warehouseId: groupItems[0]?.warehouseId || 'WH-MAIN-US-EAST',
        sellerId: groupItems[0]?.sellerId,
        originAddress: params.originAddress,
        destinationAddress: params.destinationAddress,
        items: groupItems,
        totalWeightKg,
        dimensionsCm: { length: 25, width: 20, height: 15 },
        shippingCostUSD: subCostUSD,
        status: 'SHIPMENT_CREATED',
        estimatedDeliveryDate: params.estimatedDeliveryDate,
        createdAt: now,
        updatedAt: now,
        trackingTimeline: [
          {
            stage: 'SHIPMENT_CREATED',
            title: isSplit ? `Sub-shipment ${index} Created` : 'Shipment Created',
            location: params.originAddress.city || 'Distribution Hub',
            timestamp: now,
            completed: true,
            notes: `Fulfilling ${groupItems.length} item(s) from origin ${groupKey}`,
          },
        ],
      };

      subShipments.push(shipment);
      index++;
    }

    return {
      isSplit,
      parentShipmentId,
      subShipments,
    };
  }
}
