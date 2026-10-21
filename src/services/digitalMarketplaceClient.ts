import {
  DigitalProduct,
  DigitalVaultItem,
  DigitalOrder,
  LicenseType,
  DigitalMarketplaceMetrics
} from '../domain/digital/DigitalProductTypes';

export const digitalMarketplaceClient = {
  async getProducts(params?: {
    category?: string;
    q?: string;
    licenseType?: LicenseType;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  }): Promise<{ products: DigitalProduct[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.q) query.set('q', params.q);
    if (params?.licenseType) query.set('licenseType', params.licenseType);
    if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    if (params?.sortBy) query.set('sortBy', params.sortBy);

    const res = await fetch(`/api/digital/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch digital products');
    return res.json();
  },

  async getProductById(id: string): Promise<DigitalProduct> {
    const res = await fetch(`/api/digital/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch digital product details');
    const data = await res.json();
    return data.product;
  },

  async checkout(payload: {
    productId: string;
    licenseType: LicenseType;
    buyerId?: string;
    buyerEmail?: string;
    paymentMethod?: 'WALLET' | 'CARD';
  }): Promise<{ success: boolean; order: DigitalOrder; vaultItem: DigitalVaultItem }> {
    const res = await fetch('/api/digital/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Digital checkout failed');
    return data;
  },

  async getVault(): Promise<{ items: DigitalVaultItem[]; count: number }> {
    const res = await fetch('/api/digital/vault');
    if (!res.ok) throw new Error('Failed to fetch user digital vault');
    return res.json();
  },

  async verifyLicense(licenseKey: string, productId?: string): Promise<{
    valid: boolean;
    productTitle?: string;
    licenseType?: LicenseType;
    tierName?: string;
    maxSeats?: number;
    activeSeatsCount?: number;
    seatsRemaining?: number;
    purchasedAt?: string;
    message: string;
  }> {
    const res = await fetch('/api/digital/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, productId })
    });
    return res.json();
  },

  async activateLicense(licenseKey: string, domainOrDeviceId: string): Promise<{
    success: boolean;
    activationId?: string;
    seatsRemaining?: number;
    message: string;
  }> {
    const res = await fetch('/api/digital/licenses/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, domainOrDeviceId })
    });
    return res.json();
  },

  async revokeActivation(vaultItemId: string, activationId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/digital/vault/${vaultItemId}/activations/${activationId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async refreshToken(vaultItemId: string): Promise<{ success: boolean; token: string; expiresAt: string }> {
    const res = await fetch(`/api/digital/vault/${vaultItemId}/refresh-token`, {
      method: 'POST'
    });
    return res.json();
  },

  async publishProduct(payload: any): Promise<{ success: boolean; product: DigitalProduct }> {
    const res = await fetch('/api/digital/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to publish digital product');
    return data;
  },

  async releaseVersion(productId: string, version: string, changes: string[]): Promise<{ success: boolean }> {
    const res = await fetch(`/api/digital/products/${productId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version, changes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to release version');
    return data;
  },

  async getMetrics(): Promise<{ metrics: DigitalMarketplaceMetrics }> {
    const res = await fetch('/api/digital/metrics');
    if (!res.ok) throw new Error('Failed to fetch digital metrics');
    return res.json();
  }
};
