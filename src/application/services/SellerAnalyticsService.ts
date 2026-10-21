import { Product, Order, Merchant } from '../../types/domain';
import { ComprehensiveMasterOrder, RefundRecord, ReturnRequestRecord, SellerSettlementRecord } from '../../types/oms';
import {
  AnalyticsDateRangePreset,
  DateRangeFilter,
  ProductPerformanceMetric,
  SalesTrendDataPoint,
  SellerAnalyticsReport,
  SellerInventoryInsight,
  SellerRecentOrderSummary,
  SellerSummaryMetrics,
  MarketplaceWideAnalytics,
  AnalyticsEventTrackRequest,
  StockStatusType,
} from '../../types/sellerAnalytics';
import { productRepository } from '../../infrastructure/repositories/ProductRepository';
import { orderRepository } from '../../infrastructure/repositories/OrderRepository';
import { MOCK_MERCHANTS, MOCK_PRODUCTS } from '../../data/mockData';
import { MOCK_OMS_ORDERS, MOCK_REFUNDS_DATA, MOCK_RETURNS_DATA, MOCK_SETTLEMENTS_DATA } from '../../data/omsMockData';
import { logger } from '../../infrastructure/logging/Logger';

interface TrackedInteraction {
  id: string;
  eventType: 'view' | 'search_impression' | 'rec_impression' | 'click' | 'add_to_cart';
  productId: string;
  merchantId?: string;
  source?: string;
  sessionId: string;
  timestamp: string;
}

export class SellerAnalyticsService {
  private eventStore: TrackedInteraction[] = [];
  private eventDedupCache = new Set<string>(); // "sessionId:eventType:productId:date"

  constructor() {
    this.seedInitialInteractionEvents();
  }

  /**
   * Seed realistic baseline interactions for catalog products to provide realistic funnels
   */
  private seedInitialInteractionEvents() {
    const products = MOCK_PRODUCTS;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Seed realistic funnel ratios across the last 30 days
    products.forEach((prod, pIdx) => {
      const baseMultiplier = (pIdx + 1) * 35;
      const viewsCount = Math.max(80, Math.round(prod.reviewCount * 12 + baseMultiplier));
      const searchImpressions = Math.round(viewsCount * 2.8);
      const recImpressions = Math.round(viewsCount * 1.4);
      const clicks = Math.round(viewsCount * 0.45);
      const addToCarts = Math.round(viewsCount * 0.18);

      for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const time = new Date(now - dayOffset * dayMs).toISOString();
        const dailyViews = Math.max(1, Math.round(viewsCount / 30 + Math.sin(dayOffset + pIdx) * 2));

        for (let i = 0; i < dailyViews; i++) {
          this.eventStore.push({
            id: `evt-${pIdx}-${dayOffset}-${i}`,
            eventType: 'view',
            productId: prod.id,
            merchantId: prod.merchant.id,
            source: i % 2 === 0 ? 'catalog' : 'search',
            sessionId: `sess-${pIdx}-${dayOffset}-${i}`,
            timestamp: time,
          });
        }
      }

      // Record impressions
      for (let i = 0; i < searchImpressions; i++) {
        const dayOffset = i % 30;
        this.eventStore.push({
          id: `imp-${pIdx}-${i}`,
          eventType: 'search_impression',
          productId: prod.id,
          merchantId: prod.merchant.id,
          source: 'search',
          sessionId: `sess-imp-${i}`,
          timestamp: new Date(now - dayOffset * dayMs).toISOString(),
        });
      }

      for (let i = 0; i < recImpressions; i++) {
        const dayOffset = i % 30;
        this.eventStore.push({
          id: `rec-${pIdx}-${i}`,
          eventType: 'rec_impression',
          productId: prod.id,
          merchantId: prod.merchant.id,
          source: 'recommendation',
          sessionId: `sess-rec-${i}`,
          timestamp: new Date(now - dayOffset * dayMs).toISOString(),
        });
      }

      for (let i = 0; i < clicks; i++) {
        const dayOffset = i % 30;
        this.eventStore.push({
          id: `clk-${pIdx}-${i}`,
          eventType: 'click',
          productId: prod.id,
          merchantId: prod.merchant.id,
          source: 'catalog',
          sessionId: `sess-clk-${i}`,
          timestamp: new Date(now - dayOffset * dayMs).toISOString(),
        });
      }

      for (let i = 0; i < addToCarts; i++) {
        const dayOffset = i % 30;
        this.eventStore.push({
          id: `atc-${pIdx}-${i}`,
          eventType: 'add_to_cart',
          productId: prod.id,
          merchantId: prod.merchant.id,
          source: 'catalog',
          sessionId: `sess-atc-${i}`,
          timestamp: new Date(now - dayOffset * dayMs).toISOString(),
        });
      }
    });

    logger.info(`[SellerAnalytics] Initialized with ${this.eventStore.length} interaction events`, 'SellerAnalyticsService');
  }

  /**
   * Track real-time interaction events with deduplication
   */
  public recordEvent(req: AnalyticsEventTrackRequest): { success: boolean; deduplicated: boolean } {
    const sessionId = req.sessionId || 'anonymous-session';
    const dateStr = new Date().toISOString().split('T')[0];
    const dedupKey = `${sessionId}:${req.eventType}:${req.productId}:${dateStr}`;

    // For views and impressions, deduplicate within same session per day
    if (this.eventDedupCache.has(dedupKey)) {
      return { success: true, deduplicated: true };
    }

    this.eventDedupCache.add(dedupKey);
    // Keep cache bounded
    if (this.eventDedupCache.size > 20000) {
      this.eventDedupCache.clear();
    }

    this.eventStore.push({
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType: req.eventType,
      productId: req.productId,
      merchantId: req.merchantId,
      source: req.source || 'direct',
      sessionId,
      timestamp: new Date().toISOString(),
    });

    if (this.eventStore.length > 50000) {
      this.eventStore.shift();
    }

    return { success: true, deduplicated: false };
  }

  /**
   * Resolve Date Range Filter parameters into exact start and end timestamps
   */
  public resolveDateRange(
    preset: AnalyticsDateRangePreset = '7d',
    customStart?: string,
    customEnd?: string
  ): DateRangeFilter {
    const now = new Date();

    if (preset === 'custom' && customStart && customEnd) {
      const s = new Date(customStart);
      const e = new Date(customEnd);
      // Ensure inclusive end of day
      e.setHours(23, 59, 59, 999);
      s.setHours(0, 0, 0, 0);

      return {
        preset: 'custom',
        startDate: s.toISOString(),
        endDate: e.toISOString(),
        label: `Custom: ${s.toISOString().split('T')[0]} to ${e.toISOString().split('T')[0]}`,
      };
    }

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const start = new Date(now);

    switch (preset) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        return {
          preset: 'today',
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          label: `Today (${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`,
        };

      case '7d':
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return {
          preset: '7d',
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          label: 'Last 7 Days (Inclusive)',
        };

      case '30d':
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        return {
          preset: '30d',
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          label: 'Last 30 Days (Inclusive)',
        };

      case 'this_month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        return {
          preset: 'this_month',
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          label: `Current Month (${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`,
        };

      case 'last_month': {
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return {
          preset: 'last_month',
          startDate: lastMonthStart.toISOString(),
          endDate: lastMonthEnd.toISOString(),
          label: `Previous Month (${lastMonthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`,
        };
      }

      default:
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return {
          preset: '7d',
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          label: 'Last 7 Days',
        };
    }
  }

  /**
   * Main Comprehensive Seller Analytics Report Generator
   */
  public async getSellerAnalyticsReport(
    merchantId: string,
    preset: AnalyticsDateRangePreset = '7d',
    customStart?: string,
    customEnd?: string,
    currency: string = 'USD'
  ): Promise<SellerAnalyticsReport> {
    const dateRange = this.resolveDateRange(preset, customStart, customEnd);
    const rangeStartMs = new Date(dateRange.startDate).getTime();
    const rangeEndMs = new Date(dateRange.endDate).getTime();

    // 1. Fetch Merchant
    const merchant = MOCK_MERCHANTS.find((m) => m.id === merchantId) || {
      id: merchantId,
      name: `Seller ${merchantId}`,
      code: 'SELLER',
      tier: 'standard',
      rating: 4.8,
      reviewCount: 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    // 2. Fetch all products owned by this seller
    const allProducts = await productRepository.findAll();
    const sellerProducts = allProducts.filter((p) => p.merchant.id === merchantId);

    // 3. Fetch OMS Orders containing this seller's items
    const allOMSOrders = await orderRepository.findAllOMSOrders();
    const sellerOrdersInRange: ComprehensiveMasterOrder[] = [];
    const validOrdersForSeller: { order: ComprehensiveMasterOrder; items: any[] }[] = [];

    allOMSOrders.forEach((order) => {
      const orderTime = new Date(order.createdAt).getTime();
      const inRange = orderTime >= rangeStartMs && orderTime <= rangeEndMs;
      
      const merchantItems = order.items.filter((i) => i.merchantId === merchantId);
      if (merchantItems.length > 0 && inRange) {
        sellerOrdersInRange.push(order);
        if (order.status !== 'CANCELLED') {
          validOrdersForSeller.push({ order, items: merchantItems });
        }
      }
    });

    // 4. Refunds & Settlements for this merchant in date range
    const allRefunds = await orderRepository.findAllRefunds();
    const sellerRefundsInRange = allRefunds.filter((r) => {
      const refTime = new Date(r.processedAt).getTime();
      return r.sellerId === merchantId && refTime >= rangeStartMs && refTime <= rangeEndMs;
    });

    const refundTotal = sellerRefundsInRange.reduce((sum, r) => sum + r.amount.amount, 0);

    // 5. Compute Gross & Net Sales
    let grossSales = 0;
    let unitsSold = 0;
    let totalTaxCollected = 0;
    let totalShippingCollected = 0;

    validOrdersForSeller.forEach(({ order, items }) => {
      items.forEach((item) => {
        grossSales += item.totalPrice.amount;
        unitsSold += item.quantity;
      });
      totalTaxCollected += (order.taxFee?.amount || 0) * (items.length / order.items.length);
      totalShippingCollected += (order.shippingFee?.amount || 0) * (items.length / order.items.length);
    });

    grossSales = Math.round(grossSales * 100) / 100;
    totalTaxCollected = Math.round(totalTaxCollected * 100) / 100;
    totalShippingCollected = Math.round(totalShippingCollected * 100) / 100;

    // Marketplace Commission (10% standard tier, 8% flagship tier)
    const commissionRate = merchant.tier === 'flagship' ? 0.08 : merchant.tier === 'enterprise' ? 0.09 : 0.10;
    const commissionDeducted = Math.round(grossSales * commissionRate * 100) / 100;
    const platformFees = merchant.tier === 'enterprise' ? 49.99 : 0;
    const netSales = Math.max(0, Math.round((grossSales - commissionDeducted - refundTotal - platformFees) * 100) / 100);

    const completedOrdersCount = validOrdersForSeller.length;
    const cancelledOrdersCount = sellerOrdersInRange.filter((o) => o.status === 'CANCELLED').length;
    const totalOrdersCount = sellerOrdersInRange.length;

    const averageOrderValue = completedOrdersCount > 0 ? Math.round((grossSales / completedOrdersCount) * 100) / 100 : 0;
    const cancellationRatePct = totalOrdersCount > 0 ? Math.round((cancelledOrdersCount / totalOrdersCount) * 1000) / 10 : 0;
    const refundRatePct = totalOrdersCount > 0 ? Math.round((sellerRefundsInRange.length / totalOrdersCount) * 1000) / 10 : 0;
    const takeRatePct = grossSales > 0 ? Math.round(((commissionDeducted + platformFees) / grossSales) * 1000) / 10 : 0;

    // 6. Generate Daily Time-Series Sales Trend (Zero-filled)
    const salesTrends = this.buildSalesTrends(rangeStartMs, rangeEndMs, validOrdersForSeller, sellerRefundsInRange, commissionRate);

    // 7. Product Performance Metrics (Funnel, Conversions, Inventory Velocity)
    const productPerformance = this.buildProductPerformance(
      sellerProducts,
      rangeStartMs,
      rangeEndMs,
      validOrdersForSeller,
      sellerRefundsInRange,
      commissionRate,
      currency
    );

    // 8. Actionable Inventory & Performance Insights
    const inventoryInsights = this.generateSellerInsights(productPerformance, sellerProducts);

    // 9. Top Products sorted by gross revenue
    const topProducts = [...productPerformance].sort((a, b) => b.grossRevenue - a.grossRevenue).slice(0, 5);

    // 10. Recent Orders Summary
    const recentOrders = this.buildRecentOrders(validOrdersForSeller, sellerOrdersInRange, merchantId, currency);

    // 11. Category Breakdown
    const categoryDistribution = this.buildCategoryBreakdown(sellerProducts, validOrdersForSeller);

    const summary: SellerSummaryMetrics = {
      merchantId: merchant.id,
      merchantName: merchant.name,
      merchantTier: merchant.tier,
      currency,
      reportingPeriod: dateRange.label,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      totalOrders: totalOrdersCount,
      completedOrders: completedOrdersCount,
      cancelledOrders: cancelledOrdersCount,
      unitsSold,
      totalProductsListed: sellerProducts.length,
      activeListingsCount: sellerProducts.filter((p) => !p.isArchived).length,
      grossSales,
      netSales,
      averageOrderValue,
      commissionDeducted,
      platformFees,
      refundTotal: Math.round(refundTotal * 100) / 100,
      refundOrdersCount: sellerRefundsInRange.length,
      taxesCollected: totalTaxCollected,
      shippingCollected: totalShippingCollected,
      cancellationRatePct,
      refundRatePct,
      takeRatePct,
    };

    return {
      merchantId: merchant.id,
      merchantName: merchant.name,
      currency,
      dateRange,
      summary,
      salesTrends,
      productPerformance,
      inventoryInsights,
      topProducts,
      recentOrders,
      categoryDistribution,
    };
  }

  /**
   * Build Daily Sales Trend Points with zero-filling
   */
  private buildSalesTrends(
    startMs: number,
    endMs: number,
    validOrders: { order: ComprehensiveMasterOrder; items: any[] }[],
    refunds: RefundRecord[],
    commissionRate: number
  ): SalesTrendDataPoint[] {
    const dayMs = 24 * 60 * 60 * 1000;
    const daysCount = Math.max(1, Math.min(60, Math.ceil((endMs - startMs) / dayMs)));

    const trendMap = new Map<string, { grossSales: number; ordersCount: number; unitsSold: number; refundsAmount: number }>();

    // Pre-populate each day with 0
    for (let i = 0; i < daysCount; i++) {
      const curDate = new Date(startMs + i * dayMs);
      const dateKey = curDate.toISOString().split('T')[0];
      trendMap.set(dateKey, { grossSales: 0, ordersCount: 0, unitsSold: 0, refundsAmount: 0 });
    }

    // Populate valid orders
    validOrders.forEach(({ order, items }) => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const entry = trendMap.get(orderDate);
      if (entry) {
        entry.ordersCount += 1;
        items.forEach((item) => {
          entry.grossSales += item.totalPrice.amount;
          entry.unitsSold += item.quantity;
        });
      }
    });

    // Populate refunds
    refunds.forEach((r) => {
      const refDate = new Date(r.processedAt).toISOString().split('T')[0];
      const entry = trendMap.get(refDate);
      if (entry) {
        entry.refundsAmount += r.amount.amount;
      }
    });

    const result: SalesTrendDataPoint[] = [];
    trendMap.forEach((data, dateStr) => {
      const d = new Date(`${dateStr}T12:00:00Z`);
      const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const gross = Math.round(data.grossSales * 100) / 100;
      const commission = gross * commissionRate;
      const net = Math.max(0, Math.round((gross - commission - data.refundsAmount) * 100) / 100);

      result.push({
        date: dateStr,
        formattedDate,
        grossSales: gross,
        netSales: net,
        ordersCount: data.ordersCount,
        unitsSold: data.unitsSold,
        refundsAmount: Math.round(data.refundsAmount * 100) / 100,
      });
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Build Product-level Performance Table
   */
  private buildProductPerformance(
    products: Product[],
    startMs: number,
    endMs: number,
    validOrders: { order: ComprehensiveMasterOrder; items: any[] }[],
    refunds: RefundRecord[],
    commissionRate: number,
    currency: string
  ): ProductPerformanceMetric[] {
    const daysInRange = Math.max(1, (endMs - startMs) / (24 * 60 * 60 * 1000));

    // Aggregate orders by product
    const productSalesMap = new Map<string, { unitsSold: number; revenue: number; ordersCount: number }>();
    validOrders.forEach(({ order, items }) => {
      items.forEach((item) => {
        const existing = productSalesMap.get(item.productId) || { unitsSold: 0, revenue: 0, ordersCount: 0 };
        existing.unitsSold += item.quantity;
        existing.revenue += item.totalPrice.amount;
        existing.ordersCount += 1;
        productSalesMap.set(item.productId, existing);
      });
    });

    // Aggregate refunds by product
    const refundMap = new Map<string, number>();
    refunds.forEach((r) => {
      // Find matching product in returns or order items
      const match = MOCK_RETURNS_DATA.find((ret) => ret.id === r.orderId || ret.orderId === r.orderId);
      if (match && match.productId) {
        refundMap.set(match.productId, (refundMap.get(match.productId) || 0) + 1);
      }
    });

    // Filter event store by date range
    const eventsInRange = this.eventStore.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      return t >= startMs && t <= endMs;
    });

    return products.map((prod) => {
      const sales = productSalesMap.get(prod.id) || { unitsSold: 0, revenue: 0, ordersCount: 0 };
      const refundUnits = refundMap.get(prod.id) || 0;

      // Event counts for this product
      const prodEvents = eventsInRange.filter((e) => e.productId === prod.id);
      const views = Math.max(prodEvents.filter((e) => e.eventType === 'view').length, sales.ordersCount > 0 ? sales.ordersCount * 3 : 0);
      const searchImpressions = prodEvents.filter((e) => e.eventType === 'search_impression').length || views * 3;
      const recommendationImpressions = prodEvents.filter((e) => e.eventType === 'rec_impression').length || Math.round(views * 1.5);
      const clicks = prodEvents.filter((e) => e.eventType === 'click').length || Math.round(views * 0.4);
      const addToCartCount = prodEvents.filter((e) => e.eventType === 'add_to_cart').length || Math.max(sales.unitsSold, Math.round(views * 0.15));

      // Financials
      const grossRevenue = Math.round(sales.revenue * 100) / 100;
      const netRevenue = Math.max(0, Math.round((grossRevenue * (1 - commissionRate)) * 100) / 100);

      // Conversion Rates
      const conversionRatePct = views > 0 ? Math.round((sales.ordersCount / views) * 1000) / 10 : 0;
      const clickThroughRatePct = (searchImpressions + recommendationImpressions) > 0
        ? Math.round((clicks / (searchImpressions + recommendationImpressions)) * 1000) / 10
        : 0;
      const cartConversionRatePct = addToCartCount > 0
        ? Math.round((sales.ordersCount / addToCartCount) * 1000) / 10
        : 0;
      const refundRatePct = sales.unitsSold > 0 ? Math.round((refundUnits / sales.unitsSold) * 1000) / 10 : 0;

      // Inventory health & velocity
      const averageDailySales = Math.round((sales.unitsSold / daysInRange) * 100) / 100;
      const daysOfInventoryRunway = averageDailySales > 0 ? Math.round(prod.totalStock / averageDailySales) : 999;

      let stockStatus: StockStatusType = 'IN_STOCK';
      if (prod.totalStock <= 0) stockStatus = 'OUT_OF_STOCK';
      else if (prod.totalStock <= 10 || daysOfInventoryRunway <= 7) stockStatus = 'LOW_STOCK';
      else if (daysOfInventoryRunway <= 14) stockStatus = 'REORDER_RECOMMENDED';

      let velocityRating: 'FAST' | 'MODERATE' | 'SLOW' | 'STAGNANT' = 'SLOW';
      if (averageDailySales >= 2) velocityRating = 'FAST';
      else if (averageDailySales >= 0.5) velocityRating = 'MODERATE';
      else if (averageDailySales > 0) velocityRating = 'SLOW';
      else velocityRating = 'STAGNANT';

      return {
        productId: prod.id,
        productTitle: prod.title,
        sku: prod.sku,
        category: prod.category,
        unitPrice: prod.price.amount,
        currency: prod.price.currency || currency,
        currentStock: prod.totalStock,
        stockStatus,
        imageUrl: prod.images[0],
        views,
        searchImpressions,
        recommendationImpressions,
        clicks,
        addToCartCount,
        unitsSold: sales.unitsSold,
        grossRevenue,
        netRevenue,
        ordersCount: sales.ordersCount,
        conversionRatePct,
        clickThroughRatePct,
        cartConversionRatePct,
        refundUnits,
        refundRatePct,
        averageDailySales,
        daysOfInventoryRunway,
        velocityRating,
      };
    });
  }

  /**
   * Actionable Seller Insights Engine
   */
  private generateSellerInsights(
    metrics: ProductPerformanceMetric[],
    products: Product[]
  ): SellerInventoryInsight[] {
    const insights: SellerInventoryInsight[] = [];

    // 1. Stockout Risk Identification
    const stockoutRisks = metrics.filter((m) => m.currentStock > 0 && m.daysOfInventoryRunway <= 10 && m.averageDailySales > 0);
    stockoutRisks.forEach((item) => {
      const replenishment = Math.ceil(item.averageDailySales * 30);
      insights.push({
        id: `ins-stockout-${item.productId}`,
        type: 'STOCKOUT_RISK',
        severity: item.daysOfInventoryRunway <= 4 ? 'critical' : 'warning',
        title: `Stockout Risk: ${item.productTitle}`,
        description: `Current inventory (${item.currentStock} units) will deplete in approximately ${item.daysOfInventoryRunway} days at current velocity (${item.averageDailySales} units/day).`,
        recommendation: `Replenish ${replenishment} units immediately to maintain a 30-day stock buffer.`,
        productId: item.productId,
        productTitle: item.productTitle,
        currentStock: item.currentStock,
        recommendedReplenishmentUnits: replenishment,
        estimatedDaysUntilStockout: item.daysOfInventoryRunway,
        actionLabel: 'Restock via FBA Logistics',
      });
    });

    // 2. Out of Stock Warning
    const outOfStock = metrics.filter((m) => m.currentStock <= 0);
    outOfStock.forEach((item) => {
      insights.push({
        id: `ins-oos-${item.productId}`,
        type: 'STOCKOUT_RISK',
        severity: 'critical',
        title: `Out of Stock: ${item.productTitle}`,
        description: 'Listing is currently inactive for buyers because total available stock is 0 units.',
        recommendation: 'Transfer inventory into fulfillment center or update stock quantity to restore buy box.',
        productId: item.productId,
        productTitle: item.productTitle,
        currentStock: 0,
        actionLabel: 'Update Stock Matrix',
      });
    });

    // 3. High Demand / Fast Velocity
    const fastMovers = metrics.filter((m) => m.velocityRating === 'FAST' && m.currentStock > 0);
    fastMovers.forEach((item) => {
      insights.push({
        id: `ins-fast-${item.productId}`,
        type: 'HIGH_DEMAND',
        severity: 'positive',
        title: `Top Performer: ${item.productTitle}`,
        description: `Fastest-moving SKU with ${item.unitsSold} units sold and strong ${item.conversionRatePct}% conversion rate in this reporting period.`,
        recommendation: 'Consider featuring this item in Commerce Zon Sponsored Ads or creating a promotional bundle.',
        productId: item.productId,
        productTitle: item.productTitle,
        currentStock: item.currentStock,
        actionLabel: 'Boost with Sponsored Ads',
      });
    });

    // 4. Slow Moving Inventory
    const slowMovers = metrics.filter((m) => m.currentStock >= 20 && m.unitsSold === 0);
    slowMovers.forEach((item) => {
      insights.push({
        id: `ins-slow-${item.productId}`,
        type: 'SLOW_MOVING',
        severity: 'info',
        title: `Slow-Moving Stock: ${item.productTitle}`,
        description: `${item.currentStock} units in warehouse with 0 sales recorded during this date range. Holding costs accumulating.`,
        recommendation: 'Optimize keywords, run a limited-time coupon discount (e.g. 10% off), or enroll in Prime Lightning Deals.',
        productId: item.productId,
        productTitle: item.productTitle,
        currentStock: item.currentStock,
        actionLabel: 'Create Promotion / Coupon',
      });
    });

    // 5. Conversion Optimization Opportunity (High views, low conversion)
    const conversionGaps = metrics.filter((m) => m.views >= 50 && m.conversionRatePct < 2.0 && m.unitsSold <= 1);
    conversionGaps.forEach((item) => {
      insights.push({
        id: `ins-conv-${item.productId}`,
        type: 'CONVERSION_OPPORTUNITY',
        severity: 'warning',
        title: `Conversion Opportunity: ${item.productTitle}`,
        description: `High traffic (${item.views} views, ${item.clicks} clicks) but low conversion rate (${item.conversionRatePct}%). Buyers are dropping off.`,
        recommendation: 'Enhance high-resolution product imagery, clarify technical specifications, and verify competitive market pricing.',
        productId: item.productId,
        productTitle: item.productTitle,
        currentStock: item.currentStock,
        actionLabel: 'Revise Listing Content',
      });
    });

    // 6. High Refund Rate Alert
    const highReturns = metrics.filter((m) => m.refundRatePct >= 15.0 && m.unitsSold >= 2);
    highReturns.forEach((item) => {
      insights.push({
        id: `ins-refund-${item.productId}`,
        type: 'HIGH_REFUND_RATE',
        severity: 'critical',
        title: `High Return Rate (${item.refundRatePct}%): ${item.productTitle}`,
        description: `${item.refundUnits} units refunded out of ${item.unitsSold} sold. Exceeds target return threshold of 5%.`,
        recommendation: 'Inspect return reason codes. Common causes include inaccurate size/compatibility specifications or packaging transit damage.',
        productId: item.productId,
        productTitle: item.productTitle,
        currentStock: item.currentStock,
        actionLabel: 'Review Customer Feedback',
      });
    });

    return insights;
  }

  /**
   * Build Recent Orders for Seller
   */
  private buildRecentOrders(
    validOrders: { order: ComprehensiveMasterOrder; items: any[] }[],
    allSellerOrders: ComprehensiveMasterOrder[],
    merchantId: string,
    currency: string
  ): SellerRecentOrderSummary[] {
    return allSellerOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((ord) => {
        const merchantItems = ord.items.filter((i) => i.merchantId === merchantId);
        const grossTotal = merchantItems.reduce((acc, i) => acc + i.totalPrice.amount, 0);
        const netTotal = Math.round(grossTotal * 0.90 * 100) / 100;

        return {
          orderId: ord.id,
          orderNumber: ord.orderNumber,
          orderDate: ord.createdAt,
          customerName: ord.customerName,
          itemsCount: merchantItems.reduce((sum, i) => sum + i.quantity, 0),
          sellerGrossTotal: Math.round(grossTotal * 100) / 100,
          sellerNetTotal: netTotal,
          currency: ord.grandTotal?.currency || currency,
          status: ord.status as any,
          fulfillmentStatus: ord.status === 'DELIVERED' ? 'Fulfilled by Prime' : ord.status === 'IN_TRANSIT' ? 'In Transit' : 'Processing',
          items: merchantItems.map((i) => ({
            productId: i.productId,
            productTitle: i.productTitle,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.unitPrice.amount,
            totalPrice: i.totalPrice.amount,
          })),
        };
      });
  }

  /**
   * Build Category Breakdown
   */
  private buildCategoryBreakdown(
    products: Product[],
    validOrders: { order: ComprehensiveMasterOrder; items: any[] }[]
  ) {
    const map = new Map<string, { revenue: number; units: number; productCount: number }>();

    products.forEach((p) => {
      const cat = p.category || 'general';
      const existing = map.get(cat) || { revenue: 0, units: 0, productCount: 0 };
      existing.productCount += 1;
      map.set(cat, existing);
    });

    validOrders.forEach(({ items }) => {
      items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const cat = prod?.category || 'general';
        const existing = map.get(cat) || { revenue: 0, units: 0, productCount: 0 };
        existing.revenue += item.totalPrice.amount;
        existing.units += item.quantity;
        map.set(cat, existing);
      });
    });

    return Array.from(map.entries()).map(([category, val]) => ({
      category: category.toUpperCase(),
      revenue: Math.round(val.revenue * 100) / 100,
      units: val.units,
      productCount: val.productCount,
    }));
  }

  /**
   * Platform-Wide Analytics for Admin & Super Admin Intelligence
   */
  public async getMarketplaceWideAnalytics(): Promise<MarketplaceWideAnalytics> {
    const allOMS = await orderRepository.findAllOMSOrders();
    const allProducts = await productRepository.findAll();
    const allRefunds = await orderRepository.findAllRefunds();
    const merchants = MOCK_MERCHANTS;

    let platformGMV = 0;
    let totalTax = 0;
    let completedOrders = 0;

    allOMS.forEach((o) => {
      if (o.status !== 'CANCELLED') {
        platformGMV += o.grandTotal.amount;
        totalTax += o.taxFee.amount;
        completedOrders++;
      }
    });

    const totalRefundsAmount = allRefunds.reduce((sum, r) => sum + r.amount.amount, 0);
    const averageTakeRatePct = 10.0;
    const platformNetRevenue = Math.round((platformGMV * (averageTakeRatePct / 100) - totalRefundsAmount * 0.1) * 100) / 100;

    // Merchant Scorecards
    const topPerformingSellers = merchants.map((m) => {
      const mProducts = allProducts.filter((p) => p.merchant.id === m.id);
      let grossSales = 0;
      let unitsSold = 0;
      let ordersCount = 0;

      allOMS.forEach((o) => {
        if (o.status !== 'CANCELLED') {
          const mItems = o.items.filter((i) => i.merchantId === m.id);
          if (mItems.length > 0) {
            ordersCount++;
            mItems.forEach((item) => {
              grossSales += item.totalPrice.amount;
              unitsSold += item.quantity;
            });
          }
        }
      });

      const commissionPaid = Math.round(grossSales * 0.10 * 100) / 100;
      const netSales = Math.round((grossSales - commissionPaid) * 100) / 100;

      return {
        merchantId: m.id,
        merchantName: m.name,
        tier: m.tier.toUpperCase(),
        grossSales: Math.round(grossSales * 100) / 100,
        netSales,
        ordersCount,
        unitsSold,
        commissionPaid,
        rating: m.rating,
      };
    }).sort((a, b) => b.grossSales - a.grossSales);

    // Category Revenue Breakdown
    const catMap = new Map<string, { revenue: number; ordersCount: number }>();
    allOMS.forEach((o) => {
      if (o.status !== 'CANCELLED') {
        o.items.forEach((item) => {
          const prod = allProducts.find((p) => p.id === item.productId);
          const cat = prod?.category || 'general';
          const entry = catMap.get(cat) || { revenue: 0, ordersCount: 0 };
          entry.revenue += item.totalPrice.amount;
          entry.ordersCount += 1;
          catMap.set(cat, entry);
        });
      }
    });

    const categoryRevenueBreakdown = Array.from(catMap.entries()).map(([cat, val]) => ({
      category: cat.toUpperCase(),
      revenue: Math.round(val.revenue * 100) / 100,
      percentage: platformGMV > 0 ? Math.round((val.revenue / platformGMV) * 1000) / 10 : 0,
      ordersCount: val.ordersCount,
    }));

    return {
      reportingPeriod: 'All-Time Realtime Aggregation',
      platformGMV: Math.round(platformGMV * 100) / 100,
      platformNetRevenue,
      totalMarketplaceOrders: allOMS.length,
      activeSellersCount: merchants.length,
      activeProductsListed: allProducts.filter((p) => !p.isArchived).length,
      averageTakeRatePct,
      totalRefundsAmount: Math.round(totalRefundsAmount * 100) / 100,
      totalTaxesCollected: Math.round(totalTax * 100) / 100,
      topPerformingSellers,
      categoryRevenueBreakdown,
    };
  }

  /**
   * Export Reporting Data as formatted CSV
   */
  public generateCSVReport(report: SellerAnalyticsReport, exportType: 'summary' | 'products' | 'orders' = 'products'): string {
    if (exportType === 'summary') {
      const s = report.summary;
      return [
        'Metric,Value,Period,Currency',
        `"Gross Sales",${s.grossSales},"${s.reportingPeriod}",${s.currency}`,
        `"Net Sales (After Fees & Refunds)",${s.netSales},"${s.reportingPeriod}",${s.currency}`,
        `"Total Orders",${s.totalOrders},"${s.reportingPeriod}",${s.currency}`,
        `"Completed Orders",${s.completedOrders},"${s.reportingPeriod}",${s.currency}`,
        `"Cancelled Orders",${s.cancelledOrders},"${s.reportingPeriod}",${s.currency}`,
        `"Units Sold",${s.unitsSold},"${s.reportingPeriod}",${s.currency}`,
        `"Average Order Value",${s.averageOrderValue},"${s.reportingPeriod}",${s.currency}`,
        `"Marketplace Commission Deducted",${s.commissionDeducted},"${s.reportingPeriod}",${s.currency}`,
        `"Total Refunds",${s.refundTotal},"${s.reportingPeriod}",${s.currency}`,
        `"Cancellation Rate %",${s.cancellationRatePct}%,"${s.reportingPeriod}",${s.currency}`,
        `"Refund Rate %",${s.refundRatePct}%,"${s.reportingPeriod}",${s.currency}`,
      ].join('\n');
    }

    if (exportType === 'orders') {
      const headers = ['Order Number', 'Date', 'Customer', 'Items Count', 'Gross Total', 'Net Total', 'Currency', 'Status', 'Fulfillment'];
      const rows = report.recentOrders.map((o) => [
        `"${o.orderNumber}"`,
        `"${o.orderDate}"`,
        `"${o.customerName}"`,
        o.itemsCount,
        o.sellerGrossTotal,
        o.sellerNetTotal,
        `"${o.currency}"`,
        `"${o.status}"`,
        `"${o.fulfillmentStatus}"`,
      ].join(','));
      return [headers.join(','), ...rows].join('\n');
    }

    // Default: Products Performance CSV
    const headers = [
      'Product ID',
      'SKU',
      'Product Title',
      'Category',
      'Unit Price',
      'Current Stock',
      'Stock Status',
      'Views',
      'Clicks',
      'Units Sold',
      'Gross Revenue',
      'Net Revenue',
      'Conversion Rate %',
      'Refund Units',
      'Refund Rate %',
      'Days of Runway',
      'Sales Velocity',
    ];

    const rows = report.productPerformance.map((p) => [
      `"${p.productId}"`,
      `"${p.sku}"`,
      `"${p.productTitle.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.unitPrice,
      p.currentStock,
      `"${p.stockStatus}"`,
      p.views,
      p.clicks,
      p.unitsSold,
      p.grossRevenue,
      p.netRevenue,
      `${p.conversionRatePct}%`,
      p.refundUnits,
      `${p.refundRatePct}%`,
      p.daysOfInventoryRunway,
      `"${p.velocityRating}"`,
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
}

export const sellerAnalyticsService = new SellerAnalyticsService();
