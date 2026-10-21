/**
 * Commerce Zon Marketplace - Shipping & Fulfillment API Client
 */

import {
  ShipmentRecord,
  FulfillmentStatus,
  ShippingRateQuote,
  AdminShippingConfig,
  PackingSlip,
} from '../types/shippingFulfillment';

export class ShippingFulfillmentClient {
  async calculateRates(params: {
    destinationCountry: string;
    originCountry?: string;
    totalWeightKg: number;
    subtotalUSD: number;
    isPrime?: boolean;
  }): Promise<{ isSupportedDestination: boolean; quotes: ShippingRateQuote[]; unsupportedReason?: string }> {
    const res = await fetch('/api/fulfillment/rates/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to calculate shipping quotes');
    }
    return res.json();
  }

  async getSellerShipments(sellerId: string): Promise<ShipmentRecord[]> {
    const res = await fetch(`/api/fulfillment/seller/${encodeURIComponent(sellerId)}/shipments`);
    if (!res.ok) {
      throw new Error('Failed to fetch seller shipments');
    }
    const data = await res.json();
    return data.shipments || [];
  }

  async createShipment(payload: any): Promise<ShipmentRecord> {
    const res = await fetch('/api/fulfillment/seller/shipments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create shipment');
    }
    const data = await res.json();
    return data.shipment;
  }

  async updateShipmentStatus(
    shipmentId: string,
    payload: {
      actor: { id: string; role: 'SELLER' | 'ADMIN' | 'CARRIER' | 'BUYER' };
      newStatus: FulfillmentStatus;
      location?: string;
      description?: string;
      exceptionType?: string;
      exceptionReason?: string;
    }
  ): Promise<ShipmentRecord> {
    const res = await fetch(`/api/fulfillment/shipments/${encodeURIComponent(shipmentId)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update shipment status');
    }
    const data = await res.json();
    return data.shipment;
  }

  async getShipment(id: string): Promise<ShipmentRecord> {
    const res = await fetch(`/api/fulfillment/shipments/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error('Shipment not found');
    }
    return res.json();
  }

  async getPackingSlip(shipmentId: string, sellerId?: string): Promise<PackingSlip> {
    const query = sellerId ? `?sellerId=${encodeURIComponent(sellerId)}` : '';
    const res = await fetch(`/api/fulfillment/shipments/${encodeURIComponent(shipmentId)}/packing-slip${query}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to retrieve packing slip');
    }
    return res.json();
  }

  async getBuyerOrderTracking(orderId: string): Promise<ShipmentRecord[]> {
    const res = await fetch(`/api/fulfillment/buyer/orders/${encodeURIComponent(orderId)}/tracking`);
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.shipments || [];
  }

  async getAdminShipments(filter?: { status?: string; sellerId?: string; exceptionOnly?: boolean }): Promise<ShipmentRecord[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.set('status', filter.status);
    if (filter?.sellerId) params.set('sellerId', filter.sellerId);
    if (filter?.exceptionOnly) params.set('exceptionOnly', 'true');

    const res = await fetch(`/api/fulfillment/admin/shipments?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to fetch admin shipments');
    }
    const data = await res.json();
    return data.shipments || [];
  }

  async getAdminConfig(): Promise<AdminShippingConfig> {
    const res = await fetch('/api/fulfillment/admin/config');
    if (!res.ok) {
      throw new Error('Failed to fetch admin config');
    }
    return res.json();
  }

  async updateAdminConfig(config: Partial<AdminShippingConfig>, adminId?: string): Promise<AdminShippingConfig> {
    const res = await fetch('/api/fulfillment/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, adminId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update shipping config');
    }
    const data = await res.json();
    return data.config;
  }
}

export const shippingFulfillmentClient = new ShippingFulfillmentClient();
