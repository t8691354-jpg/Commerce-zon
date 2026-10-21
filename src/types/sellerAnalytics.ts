import { EntityId, Money, OrderStatus, ProductCategory } from './domain';

/**
 * Part 13: Seller Intelligence, Product Performance & Marketplace Analytics Types
 */

export type AnalyticsDateRangePreset =
  | 'today'
  | '7d'
  | '30d'
  | 'this_month'
  | 'last_month'
  | 'custom';

export interface DateRangeFilter {
  preset: AnalyticsDateRangePreset;
  startDate: string; // ISO 8601 or YYYY-MM-DD
  endDate: string;   // ISO 8601 or YYYY-MM-DD
  label: string;
}

export interface SellerSummaryMetrics {
  merchantId: string;
  merchantName: string;
  merchantTier: string;
  currency: string;
  reportingPeriod: string;
  startDate: string;
  endDate: string;
  
  // Sales & Orders
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  unitsSold: number;
  totalProductsListed: number;
  activeListingsCount: number;
  
  // Financials
  grossSales: number;           // Total value of ordered items (excluding cancelled)
  netSales: number;             // Gross sales minus commissions, refunds, platform fees
  averageOrderValue: number;    // Gross sales / completed+active orders
  
  // Deductions & Adjustments
  commissionDeducted: number;   // Marketplace commission fee
  platformFees: number;         // Listing or subscription fees
  refundTotal: number;          // Total amount refunded to buyers
  refundOrdersCount: number;    // Count of refunded orders/items
  taxesCollected: number;       // Estimated tax collected
  shippingCollected: number;    // Shipping revenue
  
  // Performance Ratios
  cancellationRatePct: number;  // (Cancelled orders / Total orders) * 100
  refundRatePct: number;        // (Refunded orders / Total orders) * 100
  takeRatePct: number;          // (Commission + Platform fees / Gross sales) * 100
  
  // Comparative trends vs previous period
  previousPeriod?: {
    grossSales: number;
    netSales: number;
    totalOrders: number;
    unitsSold: number;
    growthPct: number;
  };
}

export interface SalesTrendDataPoint {
  date: string;               // YYYY-MM-DD
  formattedDate: string;      // e.g. "Jul 21"
  grossSales: number;
  netSales: number;
  ordersCount: number;
  unitsSold: number;
  refundsAmount: number;
}

export type StockStatusType =
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'REORDER_RECOMMENDED';

export interface ProductPerformanceMetric {
  productId: EntityId;
  productTitle: string;
  sku: string;
  category: ProductCategory;
  unitPrice: number;
  currency: string;
  currentStock: number;
  stockStatus: StockStatusType;
  imageUrl?: string;
  
  // Funnel & Attribution Metrics
  views: number;
  searchImpressions: number;
  recommendationImpressions: number;
  clicks: number;
  addToCartCount: number;
  
  // Sales & Revenue
  unitsSold: number;
  grossRevenue: number;
  netRevenue: number;
  ordersCount: number;
  
  // Rates & Indicators
  conversionRatePct: number;      // (Attributable purchases / eligible views) * 100
  clickThroughRatePct: number;    // (Clicks / Impressions) * 100
  cartConversionRatePct: number;  // (Purchases / Add-to-cart) * 100
  refundUnits: number;
  refundRatePct: number;          // (Refund units / Units sold) * 100
  
  // Inventory Health
  averageDailySales: number;
  daysOfInventoryRunway: number;  // Stock / daily sales (999 if no sales)
  velocityRating: 'FAST' | 'MODERATE' | 'SLOW' | 'STAGNANT';
}

export type SellerInsightType =
  | 'STOCKOUT_RISK'
  | 'SLOW_MOVING'
  | 'HIGH_DEMAND'
  | 'CONVERSION_OPPORTUNITY'
  | 'HIGH_REFUND_RATE'
  | 'PRICE_OPTIMIZATION'
  | 'HEALTH_WARNING';

export type InsightSeverity = 'critical' | 'warning' | 'info' | 'positive';

export interface SellerInventoryInsight {
  id: string;
  type: SellerInsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  recommendation: string;
  productId?: EntityId;
  productTitle?: string;
  currentStock?: number;
  recommendedReplenishmentUnits?: number;
  estimatedDaysUntilStockout?: number;
  actionLabel?: string;
  actionUrl?: string;
}

export interface SellerRecentOrderSummary {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  itemsCount: number;
  sellerGrossTotal: number;
  sellerNetTotal: number;
  currency: string;
  status: OrderStatus;
  fulfillmentStatus: string;
  items: {
    productId: string;
    productTitle: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface SellerAnalyticsReport {
  merchantId: string;
  merchantName: string;
  currency: string;
  dateRange: DateRangeFilter;
  summary: SellerSummaryMetrics;
  salesTrends: SalesTrendDataPoint[];
  productPerformance: ProductPerformanceMetric[];
  inventoryInsights: SellerInventoryInsight[];
  topProducts: ProductPerformanceMetric[];
  recentOrders: SellerRecentOrderSummary[];
  categoryDistribution: {
    category: string;
    revenue: number;
    units: number;
    productCount: number;
  }[];
}

export interface MarketplaceWideAnalytics {
  reportingPeriod: string;
  platformGMV: number;
  platformNetRevenue: number;
  totalMarketplaceOrders: number;
  activeSellersCount: number;
  activeProductsListed: number;
  averageTakeRatePct: number;
  totalRefundsAmount: number;
  totalTaxesCollected: number;
  topPerformingSellers: {
    merchantId: string;
    merchantName: string;
    tier: string;
    grossSales: number;
    netSales: number;
    ordersCount: number;
    unitsSold: number;
    commissionPaid: number;
    rating: number;
  }[];
  categoryRevenueBreakdown: {
    category: string;
    revenue: number;
    percentage: number;
    ordersCount: number;
  }[];
}

export interface AnalyticsEventTrackRequest {
  eventType: 'view' | 'search_impression' | 'rec_impression' | 'click' | 'add_to_cart';
  productId: string;
  merchantId?: string;
  source?: 'catalog' | 'search' | 'recommendation' | 'direct' | 'cart';
  sessionId?: string;
  searchQuery?: string;
  metadata?: Record<string, any>;
}
