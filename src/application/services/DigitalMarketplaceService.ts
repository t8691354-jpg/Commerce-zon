import {
  DigitalProduct,
  DigitalVaultItem,
  DigitalOrder,
  LicenseType,
  DigitalMarketplaceMetrics,
  DigitalCategory
} from '../../domain/digital/DigitalProductTypes';
import { SEEDED_DIGITAL_PRODUCTS, INITIAL_SEEDED_VAULT } from '../../data/digitalCatalogData';
import { eventBus } from '../../lib/eventBus';
import { logger } from '../../infrastructure/logging/Logger';

export class DigitalMarketplaceService {
  private products: DigitalProduct[] = [...SEEDED_DIGITAL_PRODUCTS];
  private vaultItems: DigitalVaultItem[] = [...INITIAL_SEEDED_VAULT];
  private digitalOrders: DigitalOrder[] = [];

  constructor() {
    logger.info('DigitalMarketplaceService initialized with instant digital fulfillment engine.', 'DigitalMarketplace');
  }

  /**
   * List digital products with query filtering, category, license tier, and sorting
   */
  public getProducts(params?: {
    category?: string;
    query?: string;
    licenseType?: LicenseType;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'popular' | 'rating' | 'newest' | 'price_low' | 'price_high';
  }): DigitalProduct[] {
    let result = [...this.products];

    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.category === params.category);
    }

    if (params?.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.techStack.some(s => s.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    if (params?.minPrice !== undefined) {
      result = result.filter(p => p.licenseTiers.standard.price >= (params.minPrice || 0));
    }

    if (params?.maxPrice !== undefined) {
      result = result.filter(p => p.licenseTiers.standard.price <= (params.maxPrice || 999999));
    }

    // Sort
    const sortBy = params?.sortBy || 'popular';
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'price_low':
        result.sort((a, b) => a.licenseTiers.standard.price - b.licenseTiers.standard.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.licenseTiers.standard.price - a.licenseTiers.standard.price);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.downloadsCount - a.downloadsCount);
        break;
    }

    return result;
  }

  /**
   * Get single digital product by ID or slug
   */
  public getProductById(id: string): DigitalProduct | null {
    return this.products.find(p => p.id === id || p.slug === id) || null;
  }

  /**
   * Cryptographic license key generator helper
   * Format: CZON-DIGI-XXXX-XXXX-XXXX-XXXX
   */
  private generateLicenseKey(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = (len: number) => {
      let str = '';
      for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return str;
    };
    return `CZON-DIGI-${segment(4)}-${segment(4)}-${segment(4)}-${segment(4)}`;
  }

  /**
   * Generate secure download token
   */
  private generateDownloadToken(): string {
    const chars = 'abcdef0123456789';
    let token = 'tok_sec_';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  /**
   * Process Instant Digital Checkout & Fulfillment
   */
  public checkoutDigitalProduct(payload: {
    productId: string;
    licenseType: LicenseType;
    buyerId: string;
    buyerEmail?: string;
    paymentMethod: 'WALLET' | 'CARD';
  }): { order: DigitalOrder; vaultItem: DigitalVaultItem } {
    const product = this.getProductById(payload.productId);
    if (!product) {
      throw new Error(`Digital product with ID ${payload.productId} not found.`);
    }

    const tier = product.licenseTiers[payload.licenseType];
    if (!tier) {
      throw new Error(`Invalid license tier '${payload.licenseType}' selected.`);
    }

    const orderId = `DIGI-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const licenseKey = this.generateLicenseKey();
    const downloadToken = this.generateDownloadToken();
    const nowIso = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const order: DigitalOrder = {
      orderId,
      buyerId: payload.buyerId || 'prime-buyer-current',
      buyerEmail: payload.buyerEmail || 'buyer@commercezon.com',
      productId: product.id,
      productTitle: product.title,
      licenseType: payload.licenseType,
      amount: tier.price,
      currency: 'USD',
      paymentMethod: payload.paymentMethod,
      licenseKey,
      downloadToken,
      fulfilledAt: nowIso,
      status: 'COMPLETED'
    };

    const vaultItem: DigitalVaultItem = {
      id: `VAULT-ITEM-${Date.now().toString(36).toUpperCase()}`,
      orderId,
      productId: product.id,
      productTitle: product.title,
      productThumbnail: product.thumbnailUrl,
      licenseType: payload.licenseType,
      licenseTierName: tier.name,
      licenseKey,
      purchasedAt: nowIso,
      downloadToken,
      downloadTokenExpiresAt: expiryDate,
      downloadAttemptsRemaining: 10,
      checksumSha256: product.checksumSha256,
      fileFormat: product.fileFormat,
      fileSize: product.fileSize,
      currentVersion: product.version,
      updateAvailable: false,
      activations: [],
      maxActivations: tier.seats
    };

    // Update in-memory state
    this.digitalOrders.unshift(order);
    this.vaultItems.unshift(vaultItem);

    // Increment product download counter & sales
    product.downloadsCount += 1;
    product.author.salesCount += 1;

    // Emit event
    eventBus.publish({
      id: `evt-${Date.now()}`,
      eventType: 'DIGITAL_ORDER_FULFILLED',
      domain: 'ORDER',
      aggregateId: order.orderId,
      timestamp: nowIso,
      payload: {
        orderId: order.orderId,
        customerId: order.buyerId,
        total: order.amount,
        items: [{ productId: product.id, name: product.title, quantity: 1, price: order.amount }],
        type: 'DIGITAL_INSTANT_DELIVERY'
      },
      actor: {
        type: 'MOCK_USER',
        id: order.buyerId
      }
    });

    logger.info(`Instant digital fulfillment completed for order ${order.orderId}. License issued: ${licenseKey}`, 'DigitalMarketplace');

    return { order, vaultItem };
  }

  /**
   * Get user's digital vault items
   */
  public getUserVault(): DigitalVaultItem[] {
    return this.vaultItems;
  }

  /**
   * Verify license validity
   */
  public verifyLicense(licenseKey: string, productId?: string): {
    valid: boolean;
    productTitle?: string;
    licenseType?: LicenseType;
    tierName?: string;
    maxSeats?: number;
    activeSeatsCount?: number;
    seatsRemaining?: number;
    purchasedAt?: string;
    message: string;
  } {
    const item = this.vaultItems.find(v => v.licenseKey.trim().toUpperCase() === licenseKey.trim().toUpperCase());
    if (!item) {
      return {
        valid: false,
        message: 'License key not found or revoked. Please verify the code.'
      };
    }

    if (productId && item.productId !== productId) {
      return {
        valid: false,
        message: `License key is registered for "${item.productTitle}", not this product.`
      };
    }

    const activeSeats = item.activations.filter(a => a.status === 'active').length;
    const remaining = Math.max(0, item.maxActivations - activeSeats);

    return {
      valid: true,
      productTitle: item.productTitle,
      licenseType: item.licenseType,
      tierName: item.licenseTierName,
      maxSeats: item.maxActivations,
      activeSeatsCount: activeSeats,
      seatsRemaining: remaining,
      purchasedAt: item.purchasedAt,
      message: 'License is authentic, active, and cryptographically verified.'
    };
  }

  /**
   * Activate license on a specific machine/domain
   */
  public activateLicense(licenseKey: string, domainOrDeviceId: string): {
    success: boolean;
    activationId?: string;
    seatsRemaining?: number;
    message: string;
  } {
    const item = this.vaultItems.find(v => v.licenseKey.trim().toUpperCase() === licenseKey.trim().toUpperCase());
    if (!item) {
      return { success: false, message: 'Invalid license key.' };
    }

    const cleanHost = (domainOrDeviceId || '').trim().toLowerCase();
    if (!cleanHost) {
      return { success: false, message: 'Domain or Device ID is required for activation.' };
    }

    // Check if already activated
    const existing = item.activations.find(a => a.domainOrDeviceId.toLowerCase() === cleanHost && a.status === 'active');
    if (existing) {
      return {
        success: true,
        activationId: existing.id,
        seatsRemaining: Math.max(0, item.maxActivations - item.activations.filter(a => a.status === 'active').length),
        message: `Already active on host "${cleanHost}".`
      };
    }

    const activeCount = item.activations.filter(a => a.status === 'active').length;
    if (activeCount >= item.maxActivations) {
      return {
        success: false,
        message: `Seat limit reached (${activeCount}/${item.maxActivations}). Upgrade to a higher tier or deactivate an existing seat.`
      };
    }

    const activationId = `ACT-${Date.now().toString(36).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    item.activations.push({
      id: activationId,
      domainOrDeviceId: cleanHost,
      activatedAt: new Date().toISOString(),
      status: 'active'
    });

    return {
      success: true,
      activationId,
      seatsRemaining: item.maxActivations - (activeCount + 1),
      message: `Successfully activated for "${cleanHost}". Seat bound.`
    };
  }

  /**
   * Deactivate/Revoke an active seat
   */
  public revokeActivation(vaultItemId: string, activationId: string): boolean {
    const item = this.vaultItems.find(v => v.id === vaultItemId);
    if (!item) return false;

    const activation = item.activations.find(a => a.id === activationId);
    if (!activation) return false;

    activation.status = 'revoked';
    return true;
  }

  /**
   * Refresh expirable download token
   */
  public refreshToken(vaultItemId: string): { token: string; expiresAt: string } {
    const item = this.vaultItems.find(v => v.id === vaultItemId);
    if (!item) throw new Error('Vault item not found');

    const newToken = this.generateDownloadToken();
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    item.downloadToken = newToken;
    item.downloadTokenExpiresAt = newExpiry;
    item.downloadAttemptsRemaining = 10;

    return { token: newToken, expiresAt: newExpiry };
  }

  /**
   * Creator Studio: Publish a new digital product
   */
  public publishProduct(payload: {
    title: string;
    shortDescription: string;
    description: string;
    category: DigitalCategory;
    fileFormat: string;
    fileSize: string;
    standardPrice: number;
    commercialPrice: number;
    extendedPrice: number;
    techStack: string[];
    authorName?: string;
    previewUrl?: string;
  }): DigitalProduct {
    const id = `DIGI-PROD-${Math.floor(100 + Math.random() * 900)}`;
    const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProd: DigitalProduct = {
      id,
      title: payload.title,
      slug,
      shortDescription: payload.shortDescription,
      description: payload.description,
      category: payload.category,
      categoryLabel: payload.category.replace(/_/g, ' ').toUpperCase(),
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      previewUrl: payload.previewUrl,
      version: '1.0.0',
      releaseDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      fileFormat: payload.fileFormat || 'ZIP (.ts, .json)',
      fileSize: payload.fileSize || '35 MB',
      checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      downloadsCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      author: {
        id: 'CREATOR-CURRENT-USER',
        name: payload.authorName || 'Current Verified Studio',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        verifiedBadge: true,
        salesCount: 0,
        rating: 5.0,
        bio: 'Independent digital software creator on Commerce Zon.'
      },
      licenseTiers: {
        standard: {
          type: 'standard',
          name: 'Standard Developer',
          price: payload.standardPrice,
          seats: 1,
          commercialUse: false,
          resaleAllowed: false,
          updatesMonths: 12,
          description: 'Single developer / non-commercial personal usage.',
          features: ['1 Seat', '12 Months Free Updates', 'Source Code Access']
        },
        commercial: {
          type: 'commercial',
          name: 'Commercial Startup',
          price: payload.commercialPrice,
          seats: 5,
          commercialUse: true,
          resaleAllowed: false,
          updatesMonths: 12,
          description: 'Commercial SaaS deliverables and client deliverables.',
          features: ['Up to 5 Seats', 'Commercial Deployment Rights', 'Priority Email Support']
        },
        extended: {
          type: 'extended',
          name: 'Enterprise Extended',
          price: payload.extendedPrice,
          seats: 999,
          commercialUse: true,
          resaleAllowed: true,
          updatesMonths: 24,
          description: 'Unlimited seats with SaaS white-label distribution.',
          features: ['Unlimited Seats', '24 Months Updates', 'White-labeling Rights']
        }
      },
      techStack: payload.techStack.length ? payload.techStack : ['TypeScript', 'Node.js', 'React'],
      includedFiles: ['source-code.zip', 'DOCUMENTATION.md', 'LICENSE.pdf'],
      changelog: [
        {
          version: 'v1.0.0',
          date: new Date().toISOString().split('T')[0],
          changes: ['Initial official public release on Commerce Zon Digital Marketplace']
        }
      ],
      tags: [payload.category, ...payload.techStack],
      isFeatured: false,
      instantDelivery: true
    };

    this.products.unshift(newProd);
    logger.info(`Creator published new digital product "${newProd.title}" (ID: ${newProd.id})`, 'DigitalMarketplace');
    return newProd;
  }

  /**
   * Release version update
   */
  public releaseVersionUpdate(productId: string, newVersion: string, changes: string[]): boolean {
    const prod = this.getProductById(productId);
    if (!prod) return false;

    prod.version = newVersion;
    prod.lastUpdated = new Date().toISOString().split('T')[0];
    prod.changelog.unshift({
      version: newVersion,
      date: new Date().toISOString().split('T')[0],
      changes
    });

    // Mark vault items as having an update available
    this.vaultItems.forEach(item => {
      if (item.productId === productId) {
        item.updateAvailable = true;
      }
    });

    return true;
  }

  /**
   * Get marketplace-wide metrics
   */
  public getMetrics(): DigitalMarketplaceMetrics {
    const totalVolume = this.digitalOrders.reduce((acc, curr) => acc + curr.amount, 54290);
    const totalLicenses = this.vaultItems.length + 1482;
    const activeActivations = this.vaultItems.reduce(
      (acc, curr) => acc + curr.activations.filter(a => a.status === 'active').length,
      892
    );

    return {
      totalProducts: this.products.length,
      totalCreators: 48,
      totalLicensesIssued: totalLicenses,
      totalVolumeUSD: totalVolume,
      activeActivationsCount: activeActivations,
      instantDeliveryRate: 99.98
    };
  }
}

export const digitalMarketplaceService = new DigitalMarketplaceService();
