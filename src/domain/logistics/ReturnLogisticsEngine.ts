/**
 * Enterprise Return Logistics Engine
 * Manages Return Pickup Requests, Reverse Transit, Warehouse Inspection, Restocking, and Replacement Dispatch
 */

import { ShippingAddressRecord, ShipmentItemRecord, ShipmentIdGenerator } from './ShipmentEntity';
import { TrackingMilestone } from '../../types/logistics';
import { logger } from '../../infrastructure/logging/Logger';

export type ReturnReason =
  | 'DEFECTIVE_PRODUCT'
  | 'WRONG_ITEM_SENT'
  | 'CHANGED_MIND'
  | 'SIZE_FIT_ISSUE'
  | 'DAMAGED_IN_TRANSIT'
  | 'NOT_AS_DESCRIBED';

export type ReturnInspectionOutcome = 'RESTOCK_AS_NEW' | 'OPEN_BOX_DISCOUNT' | 'SALVAGE_PARTS' | 'DISPOSE_SCRAP';

export interface ReturnShipmentRecord {
  returnId: string; // e.g. RET-20260730-XXXX
  originalShipmentId: string;
  orderId: string;
  customerId: string;
  pickupAddress: ShippingAddressRecord;
  returnWarehouseId: string;
  items: ShipmentItemRecord[];
  reason: ReturnReason;
  notes?: string;
  trackingNumber: string;
  scheduledPickupDate: string;
  status: 'RETURN_REQUESTED' | 'PICKUP_SCHEDULED' | 'IN_REVERSE_TRANSIT' | 'RECEIVED_AT_WAREHOUSE' | 'INSPECTED' | 'RESTOCKED' | 'COMPLETED' | 'REJECTED';
  inspectionOutcome?: ReturnInspectionOutcome;
  inspectionNotes?: string;
  createdAt: string;
  updatedAt: string;
  trackingTimeline: TrackingMilestone[];
}

export class ReturnLogisticsEngine {
  public static createReturnRequest(params: {
    originalShipmentId: string;
    orderId: string;
    customerId: string;
    pickupAddress: ShippingAddressRecord;
    returnWarehouseId?: string;
    items: ShipmentItemRecord[];
    reason: ReturnReason;
    notes?: string;
    preferredPickupDate?: string;
  }): ReturnShipmentRecord {
    const returnId = `RET-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const trackingNumber = ShipmentIdGenerator.generateTrackingNumber('RET');
    const now = new Date().toISOString();

    const pickupDate = params.preferredPickupDate || new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10);

    const record: ReturnShipmentRecord = {
      returnId,
      originalShipmentId: params.originalShipmentId,
      orderId: params.orderId,
      customerId: params.customerId,
      pickupAddress: params.pickupAddress,
      returnWarehouseId: params.returnWarehouseId || 'WH-MAIN-US-EAST',
      items: params.items,
      reason: params.reason,
      notes: params.notes,
      trackingNumber,
      scheduledPickupDate: pickupDate,
      status: 'RETURN_REQUESTED',
      createdAt: now,
      updatedAt: now,
      trackingTimeline: [
        {
          stage: 'SHIPMENT_CREATED',
          title: 'Return Request Authorization Approved',
          location: params.pickupAddress.city || 'Customer Address',
          timestamp: now,
          completed: true,
          notes: `Return reason: ${params.reason}`,
        },
      ],
    };

    logger.info(`[ReturnLogisticsEngine] Return request created: ${returnId} for shipment ${params.originalShipmentId}`, 'LogisticsDomain');
    return record;
  }

  public static inspectReturnItem(
    record: ReturnShipmentRecord,
    outcome: ReturnInspectionOutcome,
    inspectorNotes: string
  ): ReturnShipmentRecord {
    const now = new Date().toISOString();
    return {
      ...record,
      status: 'INSPECTED',
      inspectionOutcome: outcome,
      inspectionNotes: inspectorNotes,
      updatedAt: now,
      trackingTimeline: [
        ...record.trackingTimeline,
        {
          stage: 'WAREHOUSE_PROCESSING',
          title: `Return Inspection Complete: ${outcome}`,
          location: record.returnWarehouseId,
          timestamp: now,
          completed: true,
          notes: inspectorNotes,
        },
      ],
    };
  }
}
