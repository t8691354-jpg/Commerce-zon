/**
 * Commerce Zon Marketplace - After Sales Client API
 */

import {
  ReturnRequest,
  CategoryReturnPolicy,
  ReturnMessage,
} from '../types/returns';
import { CancellationRequest, RefundRecord } from '../application/services/AfterSalesService';

export class AfterSalesClient {
  async getBuyerReturns(buyerId: string): Promise<ReturnRequest[]> {
    const res = await fetch(`/api/after-sales/returns/buyer/${encodeURIComponent(buyerId)}`);
    if (!res.ok) throw new Error('Failed to fetch buyer returns');
    const data = await res.json();
    return data.returns || [];
  }

  async getSellerReturns(sellerId: string): Promise<ReturnRequest[]> {
    const res = await fetch(`/api/after-sales/returns/seller/${encodeURIComponent(sellerId)}`);
    if (!res.ok) throw new Error('Failed to fetch seller returns');
    const data = await res.json();
    return data.returns || [];
  }

  async submitReturn(payload: any): Promise<ReturnRequest> {
    const res = await fetch('/api/after-sales/returns/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit return request');
    }
    const data = await res.json();
    return data.returnRequest;
  }

  async sellerApproveReturn(returnId: string, payload: { sellerId: string; returnAddress: string; instructions: string }): Promise<ReturnRequest> {
    const res = await fetch(`/api/after-sales/returns/${encodeURIComponent(returnId)}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to approve return');
    }
    const data = await res.json();
    return data.returnRequest;
  }

  async sellerRejectReturn(returnId: string, payload: { sellerId: string; reason: string }): Promise<ReturnRequest> {
    const res = await fetch(`/api/after-sales/returns/${encodeURIComponent(returnId)}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reject return');
    }
    const data = await res.json();
    return data.returnRequest;
  }

  async cancelOrder(payload: {
    orderId: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    cancelledBy: 'BUYER' | 'SELLER' | 'ADMIN';
    actorId: string;
    reason: string;
    itemSkus?: string[];
    orderStatus: string;
    orderTotalUSD: number;
  }): Promise<CancellationRequest> {
    const res = await fetch('/api/after-sales/cancellations/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to cancel order');
    }
    const data = await res.json();
    return data.cancellation;
  }

  async executeRefund(payload: any): Promise<RefundRecord> {
    const res = await fetch('/api/after-sales/refunds/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to execute refund');
    }
    const data = await res.json();
    return data.refund;
  }

  async getPolicies(): Promise<CategoryReturnPolicy[]> {
    const res = await fetch('/api/after-sales/policies');
    if (!res.ok) throw new Error('Failed to fetch policies');
    const data = await res.json();
    return data.policies || [];
  }

  async updatePolicy(policy: CategoryReturnPolicy, adminId?: string): Promise<CategoryReturnPolicy> {
    const res = await fetch('/api/after-sales/policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policy, adminId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update policy');
    }
    const data = await res.json();
    return data.policy;
  }

  async escalateToDispute(returnId: string, payload: { actorRole: 'BUYER' | 'SELLER'; actorId: string; actorName: string; reason: string }) {
    const res = await fetch(`/api/after-sales/returns/${encodeURIComponent(returnId)}/escalate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to escalate to dispute');
    }
    return res.json();
  }
}

export const afterSalesClient = new AfterSalesClient();
