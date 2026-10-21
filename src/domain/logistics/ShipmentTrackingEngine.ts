/**
 * Enterprise Shipment Tracking & Milestone Engine
 * Manages Shipment Status Lifecycle, Milestone Logs, Proof of Delivery, and Location Tracking
 */

import { ShipmentStatus, TrackingMilestone, ProofOfDelivery } from '../../types/logistics';
import { ShipmentEntity } from './ShipmentEntity';

export class ShipmentTrackingEngine {
  /**
   * Appends a new tracking milestone and updates shipment status.
   */
  public static addMilestone(
    shipment: ShipmentEntity,
    stage: ShipmentStatus,
    title: string,
    location: string,
    notes?: string
  ): ShipmentEntity {
    const timestamp = new Date().toISOString();

    const newMilestone: TrackingMilestone = {
      stage,
      title,
      location,
      timestamp,
      completed: true,
      notes,
    };

    const updatedTimeline = [...shipment.trackingTimeline, newMilestone];

    let dispatchedAt = shipment.dispatchedAt;
    let deliveredAt = shipment.deliveredAt;

    if (stage === 'IN_TRANSIT' || stage === 'PICKED_UP') {
      dispatchedAt = dispatchedAt || timestamp;
    } else if (stage === 'DELIVERED') {
      deliveredAt = timestamp;
    }

    return {
      ...shipment,
      status: stage,
      updatedAt: timestamp,
      dispatchedAt,
      deliveredAt,
      trackingTimeline: updatedTimeline,
    };
  }

  /**
   * Attaches Proof of Delivery to a delivered shipment.
   */
  public static recordProofOfDelivery(
    shipment: ShipmentEntity,
    pod: ProofOfDelivery
  ): ShipmentEntity {
    const updated = this.addMilestone(
      shipment,
      'DELIVERED',
      'Package Delivered & Signed',
      pod.recipientName,
      pod.driverNotes || 'Delivered directly to recipient.'
    );

    return {
      ...updated,
      proofOfDelivery: pod,
    };
  }
}
