import { EnterpriseMarketplaceRepository } from '../../infrastructure/repositories/EnterpriseMarketplaceRepository';
import { MarketplaceDomainService } from '../../domain/marketplace/MarketplaceDomainService';
import {
  EnterpriseProduct,
  CategoryNode,
  BrandProfile,
  ReviewItem,
  Wishlist,
  RecommendationSet,
  StockTransferRequest,
  ImportBatchResult,
  ProductLifecycleStatus,
  ProductVariantItem,
  ComparisonMatrixItem
} from '../../domain/marketplace/MarketplaceTypes';
import { logger } from '../../infrastructure/logging/Logger';

export class MarketplaceService {
  private repo = EnterpriseMarketplaceRepository.getInstance();

  public async getAllProducts(): Promise<EnterpriseProduct[]> {
    return this.repo.getProducts();
  }

  public async getProductById(id: string): Promise<EnterpriseProduct | null> {
    return this.repo.getProductById(id);
  }

  public async saveProduct(product: EnterpriseProduct): Promise<EnterpriseProduct> {
    return this.repo.saveProduct(product);
  }

  public async updateProductStatus(
    productId: string,
    targetStatus: ProductLifecycleStatus
  ): Promise<{ success: boolean; product?: EnterpriseProduct; error?: string }> {
    const prod = await this.repo.getProductById(productId);
    if (!prod) {
      return { success: false, error: 'Product not found' };
    }

    const check = MarketplaceDomainService.canTransitionLifecycle(prod.lifecycleStatus, targetStatus);
    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    prod.lifecycleStatus = targetStatus;
    const saved = await this.repo.saveProduct(prod);
    logger.info(`Product status updated: ${prod.sku} -> ${targetStatus}`, 'MarketplaceService');
    return { success: true, product: saved };
  }

  public async calculatePrice(productId: string, quantity: number): Promise<{ effectiveUnitPrice: number; totalPrice: number }> {
    const prod = await this.repo.getProductById(productId);
    if (!prod) {
      throw new Error('Product not found');
    }

    const unitPrice = MarketplaceDomainService.calculateEffectivePrice(prod.pricing, quantity);
    return {
      effectiveUnitPrice: unitPrice,
      totalPrice: Number((unitPrice * quantity).toFixed(2)),
    };
  }

  public async generateVariants(
    baseSku: string,
    basePrice: number,
    optionsMap: Record<string, string[]>
  ): Promise<ProductVariantItem[]> {
    return MarketplaceDomainService.generateVariantMatrix(baseSku, basePrice, optionsMap);
  }

  public async getCategoryHierarchy(): Promise<CategoryNode[]> {
    return this.repo.getCategories();
  }

  public async saveCategories(categories: CategoryNode[]): Promise<CategoryNode[]> {
    return this.repo.saveCategories(categories);
  }

  public async getBrandDirectory(): Promise<BrandProfile[]> {
    return this.repo.getBrands();
  }

  public async getProductReviews(productId: string): Promise<ReviewItem[]> {
    return this.repo.getReviewsByProductId(productId);
  }

  public async submitProductReview(
    productId: string,
    authorName: string,
    rating: number,
    title: string,
    comment: string
  ): Promise<{ success: boolean; review?: ReviewItem; error?: string }> {
    const modResult = MarketplaceDomainService.moderateReview(comment, title);
    if (modResult.status === 'REJECTED_ABUSE') {
      return { success: false, error: `Review rejected by AI shield: ${modResult.reason}` };
    }

    const review: ReviewItem = {
      id: `rev-${Date.now()}`,
      productId,
      authorName,
      rating,
      title,
      comment,
      isVerifiedPurchase: true,
      helpfulVotes: 0,
      moderationStatus: modResult.status,
      createdAt: new Date().toISOString(),
    };

    const saved = await this.repo.addReview(review);
    return { success: true, review: saved };
  }

  public async getUserWishlists(userId: string): Promise<Wishlist[]> {
    return this.repo.getWishlists(userId);
  }

  public async addProductToWishlist(userId: string, wishlistId: string, productId: string): Promise<Wishlist> {
    const userLists = await this.repo.getWishlists(userId);
    let list = userLists.find((w) => w.id === wishlistId);

    if (!list) {
      list = {
        id: wishlistId || `wsh-${Date.now()}`,
        userId,
        name: 'My Enterprise Wishlist',
        isPublic: false,
        items: [],
        createdAt: new Date().toISOString(),
      };
    }

    if (!list.items.some((i) => i.productId === productId)) {
      list.items.push({ productId, addedAt: new Date().toISOString() });
    }

    return this.repo.saveWishlist(list);
  }

  public async buildComparisonMatrix(productIds: string[]): Promise<ComparisonMatrixItem[]> {
    const products: EnterpriseProduct[] = [];
    for (const id of productIds) {
      const p = await this.repo.getProductById(id);
      if (p) products.push(p);
    }

    if (products.length === 0) return [];

    const matrix: ComparisonMatrixItem[] = [
      {
        attributeName: 'Product Type',
        valuesByProductId: Object.fromEntries(products.map((p) => [p.id, p.productType])),
      },
      {
        attributeName: 'Brand',
        valuesByProductId: Object.fromEntries(products.map((p) => [p.id, p.brand.name])),
      },
      {
        attributeName: 'Regular Price',
        valuesByProductId: Object.fromEntries(products.map((p) => [p.id, `$${p.pricing.regularPrice.toFixed(2)}`])),
      },
      {
        attributeName: 'Effective Unit Price',
        valuesByProductId: Object.fromEntries(
          products.map((p) => [p.id, `$${MarketplaceDomainService.calculateEffectivePrice(p.pricing, 1).toFixed(2)}`])
        ),
      },
      {
        attributeName: 'Total Available Stock',
        valuesByProductId: Object.fromEntries(products.map((p) => [p.id, `${p.inventory.totalAvailable} units`])),
      },
      {
        attributeName: 'Average Rating',
        valuesByProductId: Object.fromEntries(products.map((p) => [p.id, `${p.reviewsSummary.averageRating} / 5.0 (${p.reviewsSummary.totalReviews} reviews)`])),
      },
    ];

    // Collect unique dynamic attribute names
    const attrNames = new Set<string>();
    products.forEach((p) => p.attributes.forEach((a) => attrNames.add(a.attributeName)));

    attrNames.forEach((name) => {
      matrix.push({
        attributeName: name,
        valuesByProductId: Object.fromEntries(
          products.map((p) => {
            const attr = p.attributes.find((a) => a.attributeName === name);
            return [p.id, attr ? String(attr.value) : 'N/A'];
          })
        ),
      });
    });

    return matrix;
  }

  public async getProductRecommendations(productId: string): Promise<RecommendationSet> {
    return this.repo.getRecommendations(productId);
  }

  public async initiateStockTransfer(
    sku: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number
  ): Promise<StockTransferRequest> {
    return this.repo.createStockTransfer({
      sku,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      status: 'IN_TRANSIT',
    });
  }

  public async processBatchImport(rawRows: any[]): Promise<ImportBatchResult> {
    const result = MarketplaceDomainService.parseAndValidateImport(rawRows);
    for (const prod of result.importedProducts) {
      await this.repo.saveProduct(prod);
    }
    logger.info(`Processed batch import: ${result.successCount} succeeded, ${result.errorCount} failed`, 'MarketplaceService');
    return result;
  }
}
