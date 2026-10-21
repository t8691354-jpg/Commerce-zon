import {
  SellerApplication,
  SellerApplicationStatus,
  SellerOrderFulfillmentRecord,
  SellerProductCreateRequest,
  SellerProductUpdateRequest,
  SellerStaffInvitation,
  SellerStaffMember,
  SellerStaffRole,
  SellerStoreProfile,
} from '../types/sellerCenter';
import { MerchantTier, Product } from '../types/domain';

class SellerCenterClient {
  private currentUserId: string = 'usr-02'; // default session user (seller)

  setUserId(id: string) {
    this.currentUserId = id;
  }

  getUserId(): string {
    return this.currentUserId;
  }

  // --- Onboarding & Applications ---

  async applySeller(data: Partial<SellerApplication>): Promise<SellerApplication> {
    const res = await fetch('/api/seller/onboarding/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUserId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to submit application: ${res.statusText}`);
    }
    const json = await res.json();
    return json.application;
  }

  async getApplicationStatus(userId: string = this.currentUserId): Promise<SellerApplication | null> {
    const res = await fetch(`/api/seller/onboarding/status/${encodeURIComponent(userId)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.application || null;
  }

  async resubmitApplication(applicationId: string, data: Partial<SellerApplication>): Promise<SellerApplication> {
    const res = await fetch(`/api/seller/onboarding/${encodeURIComponent(applicationId)}/resubmit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUserId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to resubmit application: ${res.statusText}`);
    }
    const json = await res.json();
    return json.application;
  }

  // --- Store Profile ---

  async getStoreProfile(merchantId: string): Promise<SellerStoreProfile> {
    const res = await fetch(`/api/seller/store/${encodeURIComponent(merchantId)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch store profile: ${res.statusText}`);
    }
    const json = await res.json();
    return json.store;
  }

  async updateStoreProfile(merchantId: string, updates: Partial<SellerStoreProfile>): Promise<SellerStoreProfile> {
    const res = await fetch(`/api/seller/store/${encodeURIComponent(merchantId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUserId, ...updates }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update store: ${res.statusText}`);
    }
    const json = await res.json();
    return json.store;
  }

  // --- Team & Permissions ---

  async getStoreTeam(merchantId: string): Promise<SellerStaffMember[]> {
    const res = await fetch(`/api/seller/team/${encodeURIComponent(merchantId)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.team || [];
  }

  async inviteTeamMember(
    merchantId: string,
    data: { email: string; name: string; role: SellerStaffRole }
  ): Promise<SellerStaffInvitation> {
    const res = await fetch(`/api/seller/team/${encodeURIComponent(merchantId)}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviterUserId: this.currentUserId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to invite team member: ${res.statusText}`);
    }
    const json = await res.json();
    return json.invitation;
  }

  async removeTeamMember(merchantId: string, memberId: string): Promise<void> {
    const res = await fetch(`/api/seller/team/${encodeURIComponent(merchantId)}/member/${encodeURIComponent(memberId)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestingUserId: this.currentUserId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to remove member: ${res.statusText}`);
    }
  }

  // --- Product Operations ---

  async getSellerProducts(merchantId: string): Promise<Product[]> {
    const res = await fetch(`/api/seller/products/${encodeURIComponent(merchantId)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.products || [];
  }

  async createProduct(merchantId: string, data: SellerProductCreateRequest): Promise<Product> {
    const res = await fetch(`/api/seller/products/${encodeURIComponent(merchantId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUserId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create product: ${res.statusText}`);
    }
    const json = await res.json();
    return json.product;
  }

  async updateProduct(merchantId: string, productId: string, data: SellerProductUpdateRequest): Promise<Product> {
    const res = await fetch(`/api/seller/products/${encodeURIComponent(merchantId)}/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.currentUserId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update product: ${res.statusText}`);
    }
    const json = await res.json();
    return json.product;
  }

  // --- Order Operations ---

  async getSellerOrders(merchantId: string): Promise<any[]> {
    const res = await fetch(`/api/seller/orders/${encodeURIComponent(merchantId)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.orders || [];
  }

  async fulfillOrder(
    merchantId: string,
    orderId: string,
    data: { carrier: string; trackingNumber: string; dispatchNotes?: string }
  ): Promise<SellerOrderFulfillmentRecord> {
    const res = await fetch(`/api/seller/orders/${encodeURIComponent(merchantId)}/${encodeURIComponent(orderId)}/fulfill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fulfill order: ${res.statusText}`);
    }
    const json = await res.json();
    return json.record;
  }

  // --- Admin Vendor Operations ---

  async listApplications(status?: SellerApplicationStatus): Promise<SellerApplication[]> {
    const url = `/api/admin/sellers/applications${status ? `?status=${encodeURIComponent(status)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.applications || [];
  }

  async reviewApplication(
    applicationId: string,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES',
    params: { notes?: string; requestedChanges?: string[]; rejectionReason?: string; tier?: MerchantTier }
  ): Promise<SellerApplication> {
    const res = await fetch(`/api/admin/sellers/applications/${encodeURIComponent(applicationId)}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminId: 'admin-01',
        adminName: 'Super Admin',
        decision,
        ...params,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to review application: ${res.statusText}`);
    }
    const json = await res.json();
    return json.application;
  }

  async listStores(): Promise<SellerStoreProfile[]> {
    const res = await fetch('/api/admin/sellers/merchants');
    if (!res.ok) return [];
    const json = await res.json();
    return json.stores || [];
  }

  async setStoreStatus(merchantId: string, status: 'ACTIVE' | 'SUSPENDED', reason?: string): Promise<SellerStoreProfile> {
    const res = await fetch(`/api/admin/sellers/merchants/${encodeURIComponent(merchantId)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminId: 'admin-01',
        status,
        reason,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update store status: ${res.statusText}`);
    }
    const json = await res.json();
    return json.store;
  }

  async setStoreTier(merchantId: string, tier: MerchantTier): Promise<SellerStoreProfile> {
    const res = await fetch(`/api/admin/sellers/merchants/${encodeURIComponent(merchantId)}/tier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: 'admin-01', tier }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update store tier: ${res.statusText}`);
    }
    const json = await res.json();
    return json.store;
  }

  async moderateProduct(productId: string, decision: 'APPROVE' | 'REJECT', reason?: string): Promise<Product> {
    const res = await fetch(`/api/admin/sellers/products/${encodeURIComponent(productId)}/moderation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: 'admin-01', decision, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to moderate product: ${res.statusText}`);
    }
    const json = await res.json();
    return json.product;
  }

  async getVendorOperationsMetrics() {
    const res = await fetch('/api/admin/sellers/metrics');
    if (!res.ok) {
      return {
        pendingApplications: 0,
        approvedApplications: 0,
        changesRequested: 0,
        rejectedApplications: 0,
        activeStores: 0,
        suspendedStores: 0,
        totalStores: 0,
        pendingProductModeration: 0,
      };
    }
    const json = await res.json();
    return json.metrics;
  }
}

export const sellerCenterClient = new SellerCenterClient();
