export type ProductType = 'PHYSICAL' | 'DIGITAL' | 'SERVICE' | 'SUBSCRIPTION' | 'GIFT_CARD';

export type ProductLifecycleStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'PUBLISHED'
  | 'HIDDEN'
  | 'ARCHIVED'
  | 'OUT_OF_STOCK'
  | 'DISCONTINUED';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: CategoryNode[];
  description?: string;
  imageUrl?: string;
  iconName?: string;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured: boolean;
  isHidden: boolean;
  productCount: number;
}

export interface BrandProfile {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl?: string;
  description: string;
  websiteUrl?: string;
  isVerified: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  productCount: number;
  rating: number;
}

export interface AttributeDefinition {
  id: string;
  name: string;
  code: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTISELECT' | 'BOOLEAN';
  options?: string[];
  isFilterable: boolean;
  isSearchable: boolean;
  isVariantAttribute: boolean;
}

export interface ProductAttributeValue {
  attributeId: string;
  attributeName: string;
  code: string;
  value: string | number | boolean | string[];
}

export interface ProductVariantItem {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  attributes: Record<string, string>; // e.g. { color: 'Titanium', size: '1TB' }
  price: number;
  salePrice?: number;
  stockQuantity: number;
  weightKg?: number;
  imageUrl?: string;
}

export interface BulkPriceTier {
  minQuantity: number;
  pricePerUnit: number;
}

export interface MarketplacePricing {
  regularPrice: number;
  salePrice?: number;
  costPrice?: number;
  wholesalePrice?: number;
  bulkTiers?: BulkPriceTier[];
  scheduledSaleStart?: string;
  scheduledSaleEnd?: string;
  dynamicPricingStrategy?: 'COMPETITOR_MATCH' | 'DEMAND_SURGE' | 'LIQUIDATION';
}

export interface WarehouseStockEntry {
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  availableStock: number;
  reservedStock: number;
  incomingStock: number;
  damagedStock: number;
  returnedStock: number;
  reorderPoint: number;
}

export interface StockTransferRequest {
  id: string;
  sku: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  requestedAt: string;
}

export interface ProductMediaGallery {
  images: string[];
  mainImageUrl: string;
  zoomImageUrls?: string[];
  videoUrl?: string;
  view360Urls?: string[];
  documentUrls?: { name: string; url: string }[];
}

export interface ReviewItem {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  moderationStatus: 'APPROVED' | 'PENDING' | 'REJECTED_ABUSE';
  sellerReply?: {
    storeName: string;
    comment: string;
    repliedAt: string;
  };
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  items: {
    productId: string;
    addedAt: string;
    targetPriceAlert?: number;
  }[];
  createdAt: string;
}

export interface ComparisonMatrixItem {
  attributeName: string;
  valuesByProductId: Record<string, string>;
}

export interface RecommendationSet {
  productId: string;
  frequentlyBoughtTogether: string[]; // product IDs
  similarProducts: string[];
  trendingInCategory: string[];
  aiPersonalizedScore: number; // 0-100
}

export interface EnterpriseProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  barcode?: string;
  productType: ProductType;
  lifecycleStatus: ProductLifecycleStatus;
  brand: BrandProfile;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  media: ProductMediaGallery;
  pricing: MarketplacePricing;
  attributes: ProductAttributeValue[];
  variants: ProductVariantItem[];
  inventory: {
    totalAvailable: number;
    totalReserved: number;
    totalIncoming: number;
    warehouses: WarehouseStockEntry[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  reviewsSummary: {
    averageRating: number;
    totalReviews: number;
    verifiedPurchaseCount: number;
  };
  tags: string[];
  merchantId: string;
  merchantName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImportBatchResult {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: { row: number; sku: string; reason: string }[];
  importedProducts: EnterpriseProduct[];
}
