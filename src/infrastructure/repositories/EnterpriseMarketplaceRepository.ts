import {
  EnterpriseProduct,
  CategoryNode,
  BrandProfile,
  ReviewItem,
  Wishlist,
  RecommendationSet,
  StockTransferRequest,
  AttributeDefinition
} from '../../domain/marketplace/MarketplaceTypes';
import { RedisCacheManager } from '../cache/RedisCacheManager';
import { logger } from '../logging/Logger';

export class EnterpriseMarketplaceRepository {
  private static instance: EnterpriseMarketplaceRepository;

  private products: Map<string, EnterpriseProduct> = new Map();
  private categories: CategoryNode[] = [];
  private brands: Map<string, BrandProfile> = new Map();
  private reviews: Map<string, ReviewItem[]> = new Map(); // productId -> ReviewItem[]
  private wishlists: Map<string, Wishlist[]> = new Map(); // userId -> Wishlist[]
  private stockTransfers: StockTransferRequest[] = [];
  private attributes: AttributeDefinition[] = [];

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): EnterpriseMarketplaceRepository {
    if (!EnterpriseMarketplaceRepository.instance) {
      EnterpriseMarketplaceRepository.instance = new EnterpriseMarketplaceRepository();
    }
    return EnterpriseMarketplaceRepository.instance;
  }

  private seedInitialData() {
    // 1. Seed Categories
    this.categories = [
      {
        id: 'cat-computing',
        name: 'Enterprise Computing & Workstations',
        slug: 'enterprise-computing',
        isFeatured: true,
        isHidden: false,
        productCount: 42,
        iconName: 'Laptop',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        metaTitle: 'Enterprise Workstations & Servers',
        metaDescription: 'High performance computing hardware for enterprise environments.',
        children: [
          {
            id: 'cat-laptops',
            name: 'AI Heavy Workstation Laptops',
            slug: 'workstation-laptops',
            parentId: 'cat-computing',
            isFeatured: true,
            isHidden: false,
            productCount: 18,
            iconName: 'Cpu',
          },
          {
            id: 'cat-servers',
            name: 'Rack Servers & Edge Nodes',
            slug: 'rack-servers',
            parentId: 'cat-computing',
            isFeatured: false,
            isHidden: false,
            productCount: 24,
            iconName: 'Server',
          },
        ],
      },
      {
        id: 'cat-robotics',
        name: 'Industrial Robotics & Automation',
        slug: 'industrial-robotics',
        isFeatured: true,
        isHidden: false,
        productCount: 29,
        iconName: 'Bot',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500',
        metaTitle: 'Autonomous Industrial Robotics',
        metaDescription: 'Precision cobots and automated material handling.',
      },
      {
        id: 'cat-digital-services',
        name: 'SaaS Subscriptions & Licenses',
        slug: 'digital-subscriptions',
        isFeatured: true,
        isHidden: false,
        productCount: 15,
        iconName: 'Key',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
        metaTitle: 'Digital Enterprise Services',
        metaDescription: 'Cloud licenses, AI gateway API subscriptions, and digital assets.',
      },
      {
        id: 'cat-gift-cards',
        name: 'Enterprise Procurement Gift Cards',
        slug: 'enterprise-gift-cards',
        isFeatured: false,
        isHidden: false,
        productCount: 5,
        iconName: 'CreditCard',
      },
    ];

    // 2. Seed Brands
    const brandApex: BrandProfile = {
      id: 'brand-01',
      name: 'Apex Robotics',
      slug: 'apex-robotics',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      description: 'Leader in autonomous industrial cobots and logistics precision hardware.',
      isVerified: true,
      isFeatured: true,
      productCount: 12,
      rating: 4.9,
    };

    const brandCyber: BrandProfile = {
      id: 'brand-02',
      name: 'CyberTech Systems',
      slug: 'cybertech-systems',
      logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
      description: 'Architecting next-generation AI-accelerated enterprise compute stations.',
      isVerified: true,
      isFeatured: true,
      productCount: 24,
      rating: 4.8,
    };

    this.brands.set(brandApex.id, brandApex);
    this.brands.set(brandCyber.id, brandCyber);

    // 3. Seed Products across all 5 types
    const prod1: EnterpriseProduct = {
      id: 'prod-01',
      title: 'Titan Workstation X9 Heavy Duty Laptop',
      slug: 'titan-workstation-x9-heavy-duty-laptop',
      sku: 'TW-X9-64GB-2TB',
      barcode: '8801928374102',
      productType: 'PHYSICAL',
      lifecycleStatus: 'PUBLISHED',
      brand: brandCyber,
      categoryId: 'cat-laptops',
      categoryName: 'AI Heavy Workstation Laptops',
      shortDescription: 'Ultra-performance enterprise workstation with 64GB RAM, 2TB NVMe SSD, and discrete AI accelerator GPU.',
      fullDescription: 'Designed for extreme engineering workloads, machine learning acceleration, and CAD rendering. Features vapor chamber cooling and military-grade chassis.',
      media: {
        mainImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        ],
        zoomImageUrls: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600'],
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        documentUrls: [
          { name: 'Technical Datasheet.pdf', url: 'https://example.com/specs.pdf' },
          { name: 'Warranty & Compliance Guide.pdf', url: 'https://example.com/warranty.pdf' },
        ],
      },
      pricing: {
        regularPrice: 2899.99,
        salePrice: 2699.99,
        costPrice: 1950.0,
        wholesalePrice: 2400.0,
        bulkTiers: [
          { minQuantity: 5, pricePerUnit: 2550.0 },
          { minQuantity: 20, pricePerUnit: 2350.0 },
        ],
        scheduledSaleStart: '2026-01-01T00:00:00Z',
        scheduledSaleEnd: '2026-12-31T23:59:59Z',
        dynamicPricingStrategy: 'COMPETITOR_MATCH',
      },
      attributes: [
        { attributeId: 'attr-ram', attributeName: 'RAM Memory', code: 'ram', value: '64GB DDR5' },
        { attributeId: 'attr-storage', attributeName: 'Storage', code: 'storage', value: '2TB NVMe PCIe 4.0' },
        { attributeId: 'attr-gpu', attributeName: 'GPU Accelerator', code: 'gpu', value: 'NVIDIA RTX 4090 Ada 16GB' },
      ],
      variants: [
        {
          id: 'var-tw9-1',
          sku: 'TW-X9-64GB-2TB-BLK',
          name: '64GB RAM / 2TB SSD / Stealth Black',
          attributes: { color: 'Stealth Black', ram: '64GB', storage: '2TB' },
          price: 2699.99,
          stockQuantity: 45,
          weightKg: 2.8,
          imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        },
        {
          id: 'var-tw9-2',
          sku: 'TW-X9-128GB-4TB-SLV',
          name: '128GB RAM / 4TB SSD / Titanium Silver',
          attributes: { color: 'Titanium Silver', ram: '128GB', storage: '4TB' },
          price: 3499.99,
          stockQuantity: 20,
          weightKg: 2.9,
          imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        },
      ],
      inventory: {
        totalAvailable: 65,
        totalReserved: 5,
        totalIncoming: 50,
        warehouses: [
          {
            warehouseId: 'wh-01',
            warehouseCode: 'WH-US-EAST',
            warehouseName: 'New York Metro Fulfillment Hub',
            availableStock: 40,
            reservedStock: 3,
            incomingStock: 30,
            damagedStock: 1,
            returnedStock: 0,
            reorderPoint: 10,
          },
          {
            warehouseId: 'wh-02',
            warehouseCode: 'WH-US-WEST',
            warehouseName: 'Silicon Valley Logistics Hub',
            availableStock: 25,
            reservedStock: 2,
            incomingStock: 20,
            damagedStock: 0,
            returnedStock: 1,
            reorderPoint: 10,
          },
        ],
      },
      seo: {
        metaTitle: 'Titan Workstation X9 | Enterprise AI Heavy Duty Laptop',
        metaDescription: 'Buy Titan Workstation X9 with 64GB RAM, 2TB SSD and RTX 4090 AI accelerator. Fast enterprise dispatch.',
        keywords: ['laptop', 'workstation', 'ai', 'cybertech', 'titan x9'],
      },
      reviewsSummary: {
        averageRating: 4.9,
        totalReviews: 128,
        verifiedPurchaseCount: 112,
      },
      tags: ['laptop', 'workstation', 'ai-accelerated', 'enterprise', 'heavy-duty'],
      merchantId: 'merch-02',
      merchantName: 'CyberTech Enterprise Solutions',
      createdAt: '2025-01-15T08:00:00Z',
      updatedAt: '2026-07-29T12:00:00Z',
    };

    const prod2: EnterpriseProduct = {
      id: 'prod-02',
      title: 'ApexCobot V5 Autonomous Logistics Robot Arm',
      slug: 'apexcobot-v5-autonomous-logistics-robot-arm',
      sku: 'AC-V5-6AXIS-10KG',
      barcode: '8801928374199',
      productType: 'PHYSICAL',
      lifecycleStatus: 'PUBLISHED',
      brand: brandApex,
      categoryId: 'cat-robotics',
      categoryName: 'Industrial Robotics & Automation',
      shortDescription: '6-axis precision articulated collaborative arm with optical AI Vision guidance and 10kg payload capacity.',
      fullDescription: 'Engineered for high-speed automated picking, packing, and precision sorting in high-volume warehouses.',
      media: {
        mainImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        images: [
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
        ],
      },
      pricing: {
        regularPrice: 14500.0,
        salePrice: 13900.0,
        wholesalePrice: 12500.0,
        bulkTiers: [{ minQuantity: 3, pricePerUnit: 13000.0 }],
      },
      attributes: [
        { attributeId: 'attr-payload', attributeName: 'Payload Capacity', code: 'payload', value: '10 kg' },
        { attributeId: 'attr-reach', attributeName: 'Reach Radius', code: 'reach', value: '1300 mm' },
      ],
      variants: [],
      inventory: {
        totalAvailable: 12,
        totalReserved: 1,
        totalIncoming: 5,
        warehouses: [
          {
            warehouseId: 'wh-01',
            warehouseCode: 'WH-US-EAST',
            warehouseName: 'New York Metro Fulfillment Hub',
            availableStock: 12,
            reservedStock: 1,
            incomingStock: 5,
            damagedStock: 0,
            returnedStock: 0,
            reorderPoint: 2,
          },
        ],
      },
      seo: {
        metaTitle: 'ApexCobot V5 | Industrial Collaborative Robot Arm',
        metaDescription: '6-axis cobot with 10kg payload and optical AI vision for enterprise picking automation.',
        keywords: ['robotics', 'cobot', 'warehouse automation', 'apexcobot'],
      },
      reviewsSummary: {
        averageRating: 4.8,
        totalReviews: 45,
        verifiedPurchaseCount: 40,
      },
      tags: ['robotics', 'cobot', 'automation', 'industrial'],
      merchantId: 'merch-01',
      merchantName: 'Apex Robotics & Industrial',
      createdAt: '2025-02-10T10:00:00Z',
      updatedAt: '2026-07-29T10:00:00Z',
    };

    const prod3: EnterpriseProduct = {
      id: 'prod-03',
      title: 'Enterprise AI Gateway API Enterprise Subscription License (1M Credits)',
      slug: 'enterprise-ai-gateway-api-subscription-1m-credits',
      sku: 'DIG-AI-GATEWAY-1M',
      productType: 'SUBSCRIPTION',
      lifecycleStatus: 'PUBLISHED',
      brand: brandCyber,
      categoryId: 'cat-digital-services',
      categoryName: 'SaaS Subscriptions & Licenses',
      shortDescription: 'Monthly SaaS API key granting access to multi-tenant Gemini 2.5 Flash, Claude 3.5 & GPT-4o proxy endpoints with load balancing.',
      fullDescription: 'Includes dedicated rate limit tier (10,000 RPM), zero-retention data privacy SLA, and 24/7 priority enterprise support.',
      media: {
        mainImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
      },
      pricing: {
        regularPrice: 499.0,
        salePrice: 449.0,
        wholesalePrice: 399.0,
      },
      attributes: [
        { attributeId: 'attr-credits', attributeName: 'API Credits', code: 'credits', value: '1,000,000 Tokens' },
        { attributeId: 'attr-sla', attributeName: 'Uptime SLA', code: 'sla', value: '99.99%' },
      ],
      variants: [],
      inventory: {
        totalAvailable: 999999,
        totalReserved: 0,
        totalIncoming: 0,
        warehouses: [],
      },
      seo: {
        metaTitle: 'Enterprise AI Gateway SaaS License | 1M Tokens',
        metaDescription: 'Instant digital key for Enterprise AI Gateway API proxy load balancer.',
        keywords: ['api', 'ai gateway', 'subscription', 'saas'],
      },
      reviewsSummary: {
        averageRating: 5.0,
        totalReviews: 89,
        verifiedPurchaseCount: 85,
      },
      tags: ['digital', 'saas', 'api', 'subscription', 'ai'],
      merchantId: 'merch-02',
      merchantName: 'CyberTech Enterprise Solutions',
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2026-07-29T11:00:00Z',
    };

    const prod4: EnterpriseProduct = {
      id: 'prod-04',
      title: 'Commerce Zon $1,000 Corporate Procurement Gift Card',
      slug: 'commerce-zon-1000-corporate-procurement-gift-card',
      sku: 'GFT-CORP-1000USD',
      productType: 'GIFT_CARD',
      lifecycleStatus: 'PUBLISHED',
      brand: brandCyber,
      categoryId: 'cat-gift-cards',
      categoryName: 'Enterprise Procurement Gift Cards',
      shortDescription: 'Digital gift card code redeemable across all Commerce Zon hardware, software, and warehouse services.',
      fullDescription: 'No expiration date. Transferable between corporate accounts and wallet balances with audit log trail.',
      media: {
        mainImageUrl: 'https://images.unsplash.com/photo-1556742049-0a670f4a45e7?w=800',
        images: ['https://images.unsplash.com/photo-1556742049-0a670f4a45e7?w=800'],
      },
      pricing: {
        regularPrice: 1000.0,
      },
      attributes: [
        { attributeId: 'attr-denom', attributeName: 'Denomination', code: 'denom', value: '$1,000.00 USD' },
      ],
      variants: [],
      inventory: {
        totalAvailable: 10000,
        totalReserved: 0,
        totalIncoming: 0,
        warehouses: [],
      },
      seo: {
        metaTitle: 'Commerce Zon $1,000 Corporate Gift Card',
        metaDescription: 'Corporate procurement gift card redeemable across all marketplace sellers.',
        keywords: ['gift card', 'procurement', 'corporate'],
      },
      reviewsSummary: {
        averageRating: 5.0,
        totalReviews: 14,
        verifiedPurchaseCount: 14,
      },
      tags: ['gift-card', 'procurement', 'digital'],
      merchantId: 'merch-02',
      merchantName: 'CyberTech Enterprise Solutions',
      createdAt: '2025-04-01T00:00:00Z',
      updatedAt: '2026-07-29T09:00:00Z',
    };

    this.products.set(prod1.id, prod1);
    this.products.set(prod2.id, prod2);
    this.products.set(prod3.id, prod3);
    this.products.set(prod4.id, prod4);

    // Seed Reviews
    this.reviews.set('prod-01', [
      {
        id: 'rev-101',
        productId: 'prod-01',
        authorName: 'Dr. Sarah Lin (Chief Scientist)',
        rating: 5,
        title: 'Outstanding Machine Learning Performance',
        comment: 'We deployed 10 of these Titan X9 workstations to our robotics vision team. The GPU training times dropped by 40% compared to last year generation.',
        isVerifiedPurchase: true,
        helpfulVotes: 24,
        moderationStatus: 'APPROVED',
        sellerReply: {
          storeName: 'CyberTech Enterprise Solutions',
          comment: 'Thank you Dr. Lin! Glad the RTX 4090 Ada accelerator is delivering exceptional ML throughput.',
          repliedAt: '2026-06-15T10:00:00Z',
        },
        createdAt: '2026-06-14T14:30:00Z',
      },
      {
        id: 'rev-102',
        productId: 'prod-01',
        authorName: 'Marcus Vance (DevOps Lead)',
        rating: 5,
        title: 'Solid build quality and vapor cooling',
        comment: 'Runs full Docker Kubernetes cluster local simulations without thermal throttling under sustained 100% CPU load.',
        isVerifiedPurchase: true,
        helpfulVotes: 18,
        moderationStatus: 'APPROVED',
        createdAt: '2026-07-02T09:15:00Z',
      },
    ]);

    // Seed Wishlist
    this.wishlists.set('usr-demo', [
      {
        id: 'wsh-01',
        userId: 'usr-demo',
        name: 'Enterprise AI Infrastructure Procurement',
        isPublic: true,
        items: [
          { productId: 'prod-01', addedAt: '2026-07-20T10:00:00Z', targetPriceAlert: 2600.0 },
          { productId: 'prod-03', addedAt: '2026-07-22T15:00:00Z' },
        ],
        createdAt: '2026-07-20T10:00:00Z',
      },
    ]);
  }

  // Repository Methods with Redis Cache Layer
  public async getProducts(): Promise<EnterpriseProduct[]> {
    const cacheKey = 'marketplace:products:all';
    const cached = RedisCacheManager.get<EnterpriseProduct[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const list = Array.from(this.products.values());
    RedisCacheManager.set(cacheKey, list, 60);
    return list;
  }

  public async getProductById(id: string): Promise<EnterpriseProduct | null> {
    const cacheKey = `marketplace:product:${id}`;
    const cached = RedisCacheManager.get<EnterpriseProduct>(cacheKey);
    if (cached) {
      return cached;
    }

    const prod = this.products.get(id) || null;
    if (prod) {
      RedisCacheManager.set(cacheKey, prod, 120);
    }
    return prod;
  }

  public async saveProduct(prod: EnterpriseProduct): Promise<EnterpriseProduct> {
    prod.updatedAt = new Date().toISOString();
    this.products.set(prod.id, prod);

    // Invalidate caches
    RedisCacheManager.delete('marketplace:products:all');
    RedisCacheManager.delete(`marketplace:product:${prod.id}`);

    logger.info(`Product saved successfully: ${prod.title} (${prod.sku})`, 'EnterpriseMarketplaceRepository');
    return prod;
  }

  public async getCategories(): Promise<CategoryNode[]> {
    const cacheKey = 'marketplace:categories:all';
    const cached = RedisCacheManager.get<CategoryNode[]>(cacheKey);
    if (cached) return cached;

    RedisCacheManager.set(cacheKey, this.categories, 300);
    return this.categories;
  }

  public async saveCategories(cats: CategoryNode[]): Promise<CategoryNode[]> {
    this.categories = cats;
    RedisCacheManager.delete('marketplace:categories:all');
    return this.categories;
  }

  public async getBrands(): Promise<BrandProfile[]> {
    const cacheKey = 'marketplace:brands:all';
    const cached = RedisCacheManager.get<BrandProfile[]>(cacheKey);
    if (cached) return cached;

    const list = Array.from(this.brands.values());
    RedisCacheManager.set(cacheKey, list, 300);
    return list;
  }

  public async getReviewsByProductId(productId: string): Promise<ReviewItem[]> {
    return this.reviews.get(productId) || [];
  }

  public async addReview(review: ReviewItem): Promise<ReviewItem> {
    const list = this.reviews.get(review.productId) || [];
    list.unshift(review);
    this.reviews.set(review.productId, list);

    // Recalculate rating summary
    const prod = this.products.get(review.productId);
    if (prod) {
      const total = list.length;
      const sum = list.reduce((acc, r) => acc + r.rating, 0);
      prod.reviewsSummary.averageRating = Number((sum / total).toFixed(1));
      prod.reviewsSummary.totalReviews = total;
      prod.reviewsSummary.verifiedPurchaseCount = list.filter((r) => r.isVerifiedPurchase).length;
      await this.saveProduct(prod);
    }

    return review;
  }

  public async getWishlists(userId: string): Promise<Wishlist[]> {
    return this.wishlists.get(userId) || [];
  }

  public async saveWishlist(wishlist: Wishlist): Promise<Wishlist> {
    const userLists = this.wishlists.get(wishlist.userId) || [];
    const idx = userLists.findIndex((w) => w.id === wishlist.id);
    if (idx >= 0) {
      userLists[idx] = wishlist;
    } else {
      userLists.push(wishlist);
    }
    this.wishlists.set(wishlist.userId, userLists);
    return wishlist;
  }

  public async getRecommendations(productId: string): Promise<RecommendationSet> {
    const all = Array.from(this.products.values());
    const target = this.products.get(productId);

    const otherIds = all.filter((p) => p.id !== productId).map((p) => p.id);

    return {
      productId,
      frequentlyBoughtTogether: otherIds.slice(0, 2),
      similarProducts: otherIds.filter((id) => {
        const p = this.products.get(id);
        return p && target && p.categoryId === target.categoryId;
      }),
      trendingInCategory: otherIds.slice(0, 3),
      aiPersonalizedScore: 94.5,
    };
  }

  public async createStockTransfer(request: Omit<StockTransferRequest, 'id' | 'requestedAt'>): Promise<StockTransferRequest> {
    const req: StockTransferRequest = {
      ...request,
      id: `stf-${Date.now()}`,
      requestedAt: new Date().toISOString(),
    };
    this.stockTransfers.unshift(req);
    return req;
  }

  public async getStockTransfers(): Promise<StockTransferRequest[]> {
    return this.stockTransfers;
  }
}
