import {
  EnterpriseProduct,
  MarketplacePricing,
  ProductVariantItem,
  WarehouseStockEntry,
  ProductLifecycleStatus,
  ReviewItem,
  ImportBatchResult
} from './MarketplaceTypes';

export class MarketplaceDomainService {
  /**
   * Calculates the effective unit price for a given quantity based on pricing rules,
   * sale schedules, and volume bulk discount tiers.
   */
  public static calculateEffectivePrice(pricing: MarketplacePricing, quantity: number = 1): number {
    const now = new Date().toISOString();
    let basePrice = pricing.regularPrice;

    // Check if scheduled sale is active
    if (pricing.salePrice && pricing.salePrice > 0) {
      const isStartValid = !pricing.scheduledSaleStart || pricing.scheduledSaleStart <= now;
      const isEndValid = !pricing.scheduledSaleEnd || pricing.scheduledSaleEnd >= now;
      if (isStartValid && isEndValid) {
        basePrice = pricing.salePrice;
      }
    }

    // Check bulk pricing tier discounts
    if (pricing.bulkTiers && pricing.bulkTiers.length > 0) {
      const sortedTiers = [...pricing.bulkTiers].sort((a, b) => b.minQuantity - a.minQuantity);
      for (const tier of sortedTiers) {
        if (quantity >= tier.minQuantity) {
          basePrice = Math.min(basePrice, tier.pricePerUnit);
          break;
        }
      }
    }

    return Number(basePrice.toFixed(2));
  }

  /**
   * Validates if enough stock is available across warehouses and calculates allocation.
   */
  public static allocateStock(
    warehouses: WarehouseStockEntry[],
    requestedQuantity: number
  ): { success: boolean; allocations: { warehouseId: string; allocatedQuantity: number }[]; totalAvailable: number } {
    const totalAvailable = warehouses.reduce((sum, w) => sum + Math.max(0, w.availableStock - w.reservedStock), 0);

    if (totalAvailable < requestedQuantity) {
      return { success: false, allocations: [], totalAvailable };
    }

    let remainingToAllocate = requestedQuantity;
    const allocations: { warehouseId: string; allocatedQuantity: number }[] = [];

    // Allocate from highest available stock warehouse first (Warehouse priority rule)
    const sortedWarehouses = [...warehouses].sort((a, b) => (b.availableStock - b.reservedStock) - (a.availableStock - a.reservedStock));

    for (const wh of sortedWarehouses) {
      if (remainingToAllocate <= 0) break;
      const netAvailable = Math.max(0, wh.availableStock - wh.reservedStock);
      if (netAvailable <= 0) continue;

      const take = Math.min(netAvailable, remainingToAllocate);
      allocations.push({ warehouseId: wh.warehouseId, allocatedQuantity: take });
      remainingToAllocate -= take;
    }

    return {
      success: remainingToAllocate === 0,
      allocations,
      totalAvailable,
    };
  }

  /**
   * Validates product lifecycle transition constraints.
   */
  public static canTransitionLifecycle(
    currentStatus: ProductLifecycleStatus,
    targetStatus: ProductLifecycleStatus
  ): { allowed: boolean; reason?: string } {
    if (currentStatus === targetStatus) return { allowed: true };

    const validTransitions: Record<ProductLifecycleStatus, ProductLifecycleStatus[]> = {
      DRAFT: ['PENDING_APPROVAL', 'ARCHIVED'],
      PENDING_APPROVAL: ['PUBLISHED', 'DRAFT', 'REJECTED' as any],
      PUBLISHED: ['HIDDEN', 'OUT_OF_STOCK', 'DISCONTINUED', 'ARCHIVED'],
      HIDDEN: ['PUBLISHED', 'ARCHIVED'],
      OUT_OF_STOCK: ['PUBLISHED', 'DISCONTINUED', 'ARCHIVED'],
      DISCONTINUED: ['ARCHIVED'],
      ARCHIVED: ['DRAFT'],
    };

    const allowedTargets = validTransitions[currentStatus] || [];
    if (allowedTargets.includes(targetStatus)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Cannot transition product status from ${currentStatus} to ${targetStatus}`,
    };
  }

  /**
   * Moderates incoming review text against AI toxicity / spam heuristics.
   */
  public static moderateReview(comment: string, title: string): { status: 'APPROVED' | 'PENDING' | 'REJECTED_ABUSE'; reason?: string } {
    const text = `${title} ${comment}`.toLowerCase();
    const bannedKeywords = ['scam', 'fake', 'hack', 'crypto', 'whatsapp', 'casino', 'telegram', 'buy followers'];

    for (const kw of bannedKeywords) {
      if (text.includes(kw)) {
        return { status: 'REJECTED_ABUSE', reason: `Contained suspicious phrase: "${kw}"` };
      }
    }

    if (comment.length < 5) {
      return { status: 'PENDING', reason: 'Review comment too short, queued for manual inspection' };
    }

    return { status: 'APPROVED' };
  }

  /**
   * Generates a variant matrix combination from attribute option maps.
   */
  public static generateVariantMatrix(
    baseSku: string,
    basePrice: number,
    optionsMap: Record<string, string[]>
  ): ProductVariantItem[] {
    const keys = Object.keys(optionsMap);
    if (keys.length === 0) return [];

    let combinations: Record<string, string>[] = [{}];

    for (const key of keys) {
      const values = optionsMap[key];
      const next: Record<string, string>[] = [];
      for (const combo of combinations) {
        for (const val of values) {
          next.push({ ...combo, [key]: val });
        }
      }
      combinations = next;
    }

    return combinations.map((combo, idx) => {
      const attrSuffix = Object.values(combo).join('-').toUpperCase().replace(/\s+/g, '');
      const sku = `${baseSku}-${attrSuffix}`;
      const name = Object.entries(combo).map(([k, v]) => `${k}: ${v}`).join(' / ');

      return {
        id: `var-${Date.now()}-${idx}`,
        sku,
        name,
        attributes: combo,
        price: basePrice,
        stockQuantity: 50,
      };
    });
  }

  /**
   * Validates and parses raw CSV/JSON records for bulk import.
   */
  public static parseAndValidateImport(rawRows: any[]): ImportBatchResult {
    const errors: { row: number; sku: string; reason: string }[] = [];
    const importedProducts: EnterpriseProduct[] = [];

    rawRows.forEach((row, idx) => {
      const rowNum = idx + 1;
      const sku = row.sku || `SKU-UNKNOWN-${rowNum}`;

      if (!row.title || typeof row.title !== 'string' || row.title.trim().length === 0) {
        errors.push({ row: rowNum, sku, reason: 'Missing or invalid title' });
        return;
      }

      if (!row.price || isNaN(Number(row.price)) || Number(row.price) <= 0) {
        errors.push({ row: rowNum, sku, reason: 'Invalid or missing price' });
        return;
      }

      const prod: EnterpriseProduct = {
        id: `prod-import-${Date.now()}-${idx}`,
        title: row.title,
        slug: (row.title as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku,
        productType: (row.productType as any) || 'PHYSICAL',
        lifecycleStatus: 'PUBLISHED',
        brand: {
          id: 'brand-gen',
          name: row.brand || 'Generic Enterprise Brand',
          slug: (row.brand || 'generic').toLowerCase(),
          logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
          description: 'Enterprise brand profile',
          isVerified: true,
          isFeatured: false,
          productCount: 1,
          rating: 4.8,
        },
        categoryId: row.categoryId || 'cat-electronics',
        categoryName: row.categoryName || 'Electronics',
        shortDescription: row.shortDescription || row.title,
        fullDescription: row.description || row.title,
        media: {
          images: row.images ? row.images.split(',') : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'],
          mainImageUrl: row.images ? row.images.split(',')[0] : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600',
        },
        pricing: {
          regularPrice: Number(row.price),
          salePrice: row.salePrice ? Number(row.salePrice) : undefined,
        },
        attributes: [],
        variants: [],
        inventory: {
          totalAvailable: Number(row.stock || 100),
          totalReserved: 0,
          totalIncoming: 0,
          warehouses: [
            {
              warehouseId: 'wh-01',
              warehouseCode: 'WH-US-EAST',
              warehouseName: 'New York Metro Fulfillment Hub',
              availableStock: Number(row.stock || 100),
              reservedStock: 0,
              incomingStock: 0,
              damagedStock: 0,
              returnedStock: 0,
              reorderPoint: 10,
            },
          ],
        },
        seo: {
          metaTitle: row.title,
          metaDescription: row.shortDescription || row.title,
          keywords: (row.tags || 'marketplace,product').split(','),
        },
        reviewsSummary: {
          averageRating: 5.0,
          totalReviews: 1,
          verifiedPurchaseCount: 1,
        },
        tags: (row.tags || 'enterprise,import').split(','),
        merchantId: 'merch-01',
        merchantName: 'Apex Robotics & Industrial',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      importedProducts.push(prod);
    });

    return {
      totalProcessed: rawRows.length,
      successCount: importedProducts.length,
      errorCount: errors.length,
      errors,
      importedProducts,
    };
  }
}
