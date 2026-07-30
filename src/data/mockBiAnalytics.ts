import {
  ExecutiveKpi,
  RevenueTrendPoint,
  CategoryRevenue,
  GeographicSales,
  CustomerSegment,
  SellerBiMetrics,
  AffiliateBiMetrics,
  ProductBiMetrics,
  InventoryBiMetrics,
  OrderBiMetrics,
  FinancialBiMetrics,
  MarketingBiMetrics,
  LogisticsBiMetrics,
  AiPredictiveBi,
  FraudRiskBi,
  RealtimeMonitoringMetric,
  CustomReportConfig,
  SecurityAuditLogBi,
} from '../types/biAnalytics';

export const MOCK_EXECUTIVE_KPIS: ExecutiveKpi[] = [
  {
    id: 'kpi-gmv',
    label: 'Gross Merchandise Value (GMV)',
    value: '$1,482,930,400',
    changePct: +18.4,
    isPositive: true,
    category: 'financial',
    target: '$1.5B',
    sparkline: [1200, 1250, 1310, 1380, 1420, 1450, 1482],
    description: 'Total dollar value of all goods sold across all seller channels',
  },
  {
    id: 'kpi-rev',
    label: 'Marketplace Revenue',
    value: '$222,439,560',
    changePct: +21.2,
    isPositive: true,
    category: 'financial',
    target: '$210M',
    sparkline: [180, 192, 198, 205, 212, 218, 222],
    description: '15% blended fee revenue (referral, FBA, ad platform, subscriptions)',
  },
  {
    id: 'kpi-profit',
    label: 'Net Profit',
    value: '$64,810,200',
    changePct: +14.7,
    isPositive: true,
    category: 'financial',
    target: '$60M',
    sparkline: [48, 52, 55, 58, 61, 63, 64.8],
    description: 'Net bottom line profit after all cloud, logistics & operational expenses',
  },
  {
    id: 'kpi-opcost',
    label: 'Operating Costs',
    value: '$157,629,360',
    changePct: -3.2,
    isPositive: true,
    category: 'financial',
    target: '$160M',
    sparkline: [168, 165, 163, 161, 159, 158, 157.6],
    description: 'Fulfillment operations, cloud infrastructure, customer service & staff',
  },
  {
    id: 'kpi-buyers',
    label: 'Active Buyers',
    value: '14,820,500',
    changePct: +12.8,
    isPositive: true,
    category: 'growth',
    target: '15.0M',
    sparkline: [11.2, 12.0, 12.8, 13.5, 14.0, 14.5, 14.82],
    description: 'Unique verified buyers who transacted within the trailing 30 days',
  },
  {
    id: 'kpi-sellers',
    label: 'Active Sellers',
    value: '184,200',
    changePct: +8.5,
    isPositive: true,
    category: 'growth',
    target: '180K',
    sparkline: [150, 158, 165, 172, 178, 181, 184.2],
    description: 'Third-party merchants actively listing and fulfilling inventory',
  },
  {
    id: 'kpi-affiliates',
    label: 'Active Affiliates',
    value: '42,910',
    changePct: +15.1,
    isPositive: true,
    category: 'growth',
    target: '40K',
    sparkline: [31, 33, 35, 38, 40, 41.5, 42.9],
    description: 'Associate publishers and influencers driving referral sales',
  },
  {
    id: 'kpi-orders',
    label: 'Total Orders',
    value: '18,420,900',
    changePct: +19.6,
    isPositive: true,
    category: 'operations',
    target: '18.0M',
    sparkline: [13.5, 14.2, 15.1, 16.2, 17.0, 17.8, 18.42],
    description: 'Completed purchase checkouts across web, mobile and voice assistant',
  },
  {
    id: 'kpi-aov',
    label: 'Average Order Value (AOV)',
    value: '$80.50',
    changePct: -0.8,
    isPositive: false,
    category: 'operations',
    target: '$82.00',
    sparkline: [82.5, 82.1, 81.8, 81.2, 80.9, 80.7, 80.5],
    description: 'Average basket size per single checkout order',
  },
  {
    id: 'kpi-clv',
    label: 'Customer Lifetime Value (CLV)',
    value: '$648.20',
    changePct: +9.4,
    isPositive: true,
    category: 'customers',
    target: '$620.00',
    sparkline: [560, 575, 590, 610, 625, 638, 648.2],
    description: '36-month discounted cash flow value per active buyer',
  },
  {
    id: 'kpi-cac',
    label: 'Customer Acquisition Cost (CAC)',
    value: '$18.40',
    changePct: -5.2,
    isPositive: true,
    category: 'customers',
    target: '$20.00',
    sparkline: [22.0, 21.1, 20.2, 19.5, 19.0, 18.6, 18.4],
    description: 'Blended marketing spend per newly converted customer',
  },
  {
    id: 'kpi-conv',
    label: 'Conversion Rate',
    value: '4.82%',
    changePct: +0.45,
    isPositive: true,
    category: 'operations',
    target: '4.50%',
    sparkline: [4.1, 4.25, 4.4, 4.55, 4.68, 4.75, 4.82],
    description: 'Sessions resulting in completed purchase transactions',
  },
  {
    id: 'kpi-repeat',
    label: 'Repeat Purchase Rate',
    value: '68.4%',
    changePct: +3.1,
    isPositive: true,
    category: 'customers',
    target: '65.0%',
    sparkline: [61.2, 62.8, 64.0, 65.5, 66.8, 67.5, 68.4],
    description: 'Percentage of buyers with 2+ completed orders within 90 days',
  },
  {
    id: 'kpi-abandon',
    label: 'Cart Abandonment Rate',
    value: '22.1%',
    changePct: -2.4,
    isPositive: true,
    category: 'operations',
    target: '24.0%',
    sparkline: [27.5, 26.1, 25.0, 24.2, 23.5, 22.8, 22.1],
    description: 'Percentage of active carts abandoned prior to final payment',
  },
  {
    id: 'kpi-refund',
    label: 'Refund Rate',
    value: '2.14%',
    changePct: -0.3,
    isPositive: true,
    category: 'operations',
    target: '2.50%',
    sparkline: [2.8, 2.65, 2.5, 2.4, 2.3, 2.2, 2.14],
    description: 'Total order value refunded due to cancellations or discrepancies',
  },
  {
    id: 'kpi-return',
    label: 'Return Rate',
    value: '3.85%',
    changePct: -0.15,
    isPositive: true,
    category: 'operations',
    target: '4.00%',
    sparkline: [4.4, 4.25, 4.1, 4.0, 3.95, 3.9, 3.85],
    description: 'Physical inventory units returned to FBA/merchant warehouses',
  },
];

export const MOCK_REVENUE_TRENDS: RevenueTrendPoint[] = [
  { date: '2026-01', gmv: 110000000, revenue: 16500000, netProfit: 4620000, operatingCosts: 11880000, ordersCount: 1366000 },
  { date: '2026-02', gmv: 118000000, revenue: 17700000, netProfit: 4956000, operatingCosts: 12744000, ordersCount: 1465000 },
  { date: '2026-03', gmv: 125000000, revenue: 18750000, netProfit: 5250000, operatingCosts: 13500000, ordersCount: 1552000 },
  { date: '2026-04', gmv: 132000000, revenue: 19800000, netProfit: 5544000, operatingCosts: 14256000, ordersCount: 1639000 },
  { date: '2026-05', gmv: 145000000, revenue: 21750000, netProfit: 6090000, operatingCosts: 15660000, ordersCount: 1801000 },
  { date: '2026-06', gmv: 158000000, revenue: 23700000, netProfit: 6636000, operatingCosts: 17064000, ordersCount: 1962000 },
  { date: '2026-07', gmv: 172000000, revenue: 25800000, netProfit: 7224000, operatingCosts: 18576000, ordersCount: 2136000 },
];

export const MOCK_CATEGORY_REVENUE: CategoryRevenue[] = [
  { category: 'Consumer Electronics', revenue: 420500000, orders: 3820000, sharePct: 28.3, growthPct: +22.4 },
  { category: 'Home & Kitchen', revenue: 295800000, orders: 4120000, sharePct: 19.9, growthPct: +16.1 },
  { category: 'Apparel & Fashion', revenue: 248100000, orders: 3950000, sharePct: 16.7, growthPct: +14.8 },
  { category: 'Beauty & Personal Care', revenue: 185400000, orders: 2840000, sharePct: 12.5, growthPct: +28.9 },
  { category: 'Books & Media', revenue: 124600000, orders: 1980000, sharePct: 8.4, growthPct: +5.2 },
  { category: 'Toys & Video Games', revenue: 112000000, orders: 1210000, sharePct: 7.5, growthPct: +19.3 },
  { category: 'Automotive & Tools', revenue: 96530400, orders: 500900, sharePct: 6.7, growthPct: +11.0 },
];

export const MOCK_GEOGRAPHIC_SALES: GeographicSales[] = [
  { country: 'United States', city: 'Seattle', revenue: 485200000, orders: 5920000, buyers: 4200000, topCategory: 'Consumer Electronics' },
  { country: 'United States', city: 'New York', revenue: 312800000, orders: 3810000, buyers: 2850000, topCategory: 'Apparel & Fashion' },
  { country: 'Germany', city: 'Berlin', revenue: 184500000, orders: 2100000, buyers: 1650000, topCategory: 'Home & Kitchen' },
  { country: 'United Kingdom', city: 'London', revenue: 168200000, orders: 1940000, buyers: 1480000, topCategory: 'Beauty & Personal Care' },
  { country: 'Japan', city: 'Tokyo', revenue: 142100000, orders: 1720000, buyers: 1320000, topCategory: 'Toys & Video Games' },
  { country: 'Canada', city: 'Toronto', revenue: 98400000, orders: 1210000, buyers: 910000, topCategory: 'Books & Media' },
  { country: 'France', city: 'Paris', revenue: 91730400, orders: 1120900, buyers: 860500, topCategory: 'Apparel & Fashion' },
];

export const MOCK_CUSTOMER_SEGMENTS: CustomerSegment[] = [
  { segmentName: 'Prime Power Buyers (VIP)', customerCount: 3820000, avgClv: 1480, retentionRatePct: 94.2, churnRatePct: 1.8, avgBasketSize: 142, purchaseFrequency: 3.4 },
  { segmentName: 'Loyal Household Shoppers', customerCount: 5120000, avgClv: 820, retentionRatePct: 81.5, churnRatePct: 3.2, avgBasketSize: 88, purchaseFrequency: 2.1 },
  { segmentName: 'Bargain & Deal Seekers', customerCount: 3950000, avgClv: 340, retentionRatePct: 62.4, churnRatePct: 8.5, avgBasketSize: 45, purchaseFrequency: 1.2 },
  { segmentName: 'Occasional / At-Risk', customerCount: 1930500, avgClv: 180, retentionRatePct: 38.1, churnRatePct: 18.9, avgBasketSize: 32, purchaseFrequency: 0.4 },
];

export const MOCK_SELLER_METRICS: SellerBiMetrics[] = [
  { sellerId: 'SEL-1001', sellerName: 'AnkerDirect Official', tier: 'Brand Owner', revenue: 42800000, profitabilityPct: 24.5, orderVolume: 512000, cancellationRatePct: 0.12, returnRatePct: 1.45, customerRating: 4.88, inventoryHealthScore: 98.2, fulfilmentEfficiencyPct: 99.4 },
  { sellerId: 'SEL-1002', sellerName: 'UGREEN Global Store', tier: 'Brand Owner', revenue: 31200000, profitabilityPct: 22.1, orderVolume: 392000, cancellationRatePct: 0.18, returnRatePct: 1.82, customerRating: 4.82, inventoryHealthScore: 95.8, fulfilmentEfficiencyPct: 98.7 },
  { sellerId: 'SEL-1003', sellerName: 'Aukey Technology Merchant', tier: 'Professional', revenue: 18500000, profitabilityPct: 19.4, orderVolume: 241000, cancellationRatePct: 0.42, returnRatePct: 2.10, customerRating: 4.65, inventoryHealthScore: 91.2, fulfilmentEfficiencyPct: 96.2 },
  { sellerId: 'SEL-1004', sellerName: 'Baseus Supply Co.', tier: 'Professional', revenue: 14200000, profitabilityPct: 18.0, orderVolume: 189000, cancellationRatePct: 0.55, returnRatePct: 2.85, customerRating: 4.58, inventoryHealthScore: 88.5, fulfilmentEfficiencyPct: 94.8 },
  { sellerId: 'SEL-1005', sellerName: 'Nordic Artisan Home', tier: 'Individual', revenue: 2400000, profitabilityPct: 31.2, orderVolume: 18500, cancellationRatePct: 1.12, returnRatePct: 3.10, customerRating: 4.72, inventoryHealthScore: 82.0, fulfilmentEfficiencyPct: 91.5 },
];

export const MOCK_AFFILIATE_METRICS: AffiliateBiMetrics[] = [
  { affiliateId: 'AFF-901', affiliateName: 'Wirecutter Tech Reviews', totalClicks: 4250000, uniqueVisitors: 3120000, conversionRatePct: 6.82, commissionEarned: 1420000, affiliateRevenue: 28400000, topCampaign: 'Best USB-C Hubs 2026', referralSource: 'Editorial Blog' },
  { affiliateId: 'AFF-902', affiliateName: 'TechRadar Shopping Guide', totalClicks: 3180000, uniqueVisitors: 2450000, conversionRatePct: 5.91, commissionEarned: 980000, affiliateRevenue: 19600000, topCampaign: 'Prime Day Early Tech Deals', referralSource: 'Review Site' },
  { affiliateId: 'AFF-903', affiliateName: 'Honey Deals Browser Ext', totalClicks: 8900000, uniqueVisitors: 5400000, conversionRatePct: 4.12, commissionEarned: 1850000, affiliateRevenue: 37000000, topCampaign: 'Automatic Coupon Checkout', referralSource: 'Browser Extension' },
  { affiliateId: 'AFF-904', affiliateName: 'Linus Tech Tips Creator', totalClicks: 1820000, uniqueVisitors: 1450000, conversionRatePct: 7.24, commissionEarned: 680000, affiliateRevenue: 13600000, topCampaign: 'Ultimate Gaming Setup 2026', referralSource: 'YouTube / Social' },
];

export const MOCK_PRODUCT_METRICS: ProductBiMetrics[] = [
  { productId: 'PRD-801', title: 'Ultra Fast 65W GaN Charger 3-Port', sku: 'GAN-65W-BLK', category: 'Consumer Electronics', unitsSold: 284000, revenue: 14171600, views: 1850000, conversionRatePct: 15.35, wishlistAdditions: 42100, cartAdditions: 310000, inventoryTurnoverRate: 14.2, rating: 4.9, reviewCount: 18420, seasonalTrend: 'High' },
  { productId: 'PRD-802', title: 'Ergonomic Mesh Office Chair Pro', sku: 'CHR-ERG-900', category: 'Home & Kitchen', unitsSold: 84200, revenue: 21050000, views: 980000, conversionRatePct: 8.59, wishlistAdditions: 68900, cartAdditions: 98000, inventoryTurnoverRate: 8.4, rating: 4.7, reviewCount: 9540, seasonalTrend: 'Moderate' },
  { productId: 'PRD-803', title: 'Smart ANC Wireless Headphones V5', sku: 'AUD-ANC-50', category: 'Consumer Electronics', unitsSold: 142000, revenue: 28258000, views: 1420000, conversionRatePct: 10.00, wishlistAdditions: 89000, cartAdditions: 165000, inventoryTurnoverRate: 11.8, rating: 4.8, reviewCount: 14120, seasonalTrend: 'Peak' },
  { productId: 'PRD-804', title: 'Organic Arabica Dark Roast Coffee 2lb', sku: 'CFE-ARB-02', category: 'Beauty & Personal Care', unitsSold: 412000, revenue: 10258800, views: 1200000, conversionRatePct: 34.33, wishlistAdditions: 12000, cartAdditions: 450000, inventoryTurnoverRate: 22.5, rating: 4.8, reviewCount: 31200, seasonalTrend: 'High' },
];

export const MOCK_INVENTORY_METRICS: InventoryBiMetrics[] = [
  { warehouseId: 'WH-SEA-01', warehouseName: 'Seattle West Prime Hub', fastMovingItems: 14820, slowMovingItems: 840, deadStockCount: 42, overstockRiskValue: 185000, stockAccuracyPct: 99.8, capacityUtilizationPct: 88.4, forecastedReorderValue: 4200000 },
  { warehouseId: 'WH-DAL-02', warehouseName: 'Dallas Central Fulfillment', fastMovingItems: 18900, slowMovingItems: 1210, deadStockCount: 95, overstockRiskValue: 340000, stockAccuracyPct: 99.4, capacityUtilizationPct: 92.1, forecastedReorderValue: 5800000 },
  { warehouseId: 'WH-FRA-03', warehouseName: 'Frankfurt European Gateway', fastMovingItems: 12400, slowMovingItems: 680, deadStockCount: 28, overstockRiskValue: 120000, stockAccuracyPct: 99.7, capacityUtilizationPct: 82.5, forecastedReorderValue: 3100000 },
];

export const MOCK_ORDER_METRICS: OrderBiMetrics[] = [
  { status: 'DELIVERED', count: 16420000, avgProcessingTimeHours: 4.2, avgDeliveryTimeDays: 1.8, cancellationTrendPct: -0.2, refundTrendPct: -0.1, fulfilmentEfficiencyScore: 98.4 },
  { status: 'IN_TRANSIT', count: 1240000, avgProcessingTimeHours: 3.8, avgDeliveryTimeDays: 2.1, cancellationTrendPct: -0.1, refundTrendPct: 0.0, fulfilmentEfficiencyScore: 97.2 },
  { status: 'PROCESSING', count: 520000, avgProcessingTimeHours: 2.4, avgDeliveryTimeDays: 0, cancellationTrendPct: +0.1, refundTrendPct: 0.0, fulfilmentEfficiencyScore: 96.5 },
  { status: 'CANCELLED', count: 180000, avgProcessingTimeHours: 0.5, avgDeliveryTimeDays: 0, cancellationTrendPct: -0.5, refundTrendPct: 0.0, fulfilmentEfficiencyScore: 92.0 },
  { status: 'RETURNED', count: 60900, avgProcessingTimeHours: 12.0, avgDeliveryTimeDays: 3.5, cancellationTrendPct: 0.0, refundTrendPct: +0.2, fulfilmentEfficiencyScore: 94.1 },
];

export const MOCK_FINANCIAL_METRICS: FinancialBiMetrics[] = [
  { revenueType: 'Merchant Referral Fees (15% avg)', amount: 148200000, shareOfTotalPct: 66.6, growthYoyPct: +21.4 },
  { revenueType: 'FBA Fulfillment & Storage Services', amount: 42100000, shareOfTotalPct: 18.9, growthYoyPct: +18.2 },
  { revenueType: 'Sponsored Product Ad Network', amount: 21400000, shareOfTotalPct: 9.6, growthYoyPct: +34.5 },
  { revenueType: 'Prime Seller & Buyer Subscriptions', amount: 10739560, shareOfTotalPct: 4.9, growthYoyPct: +12.1 },
];

export const MOCK_MARKETING_METRICS: MarketingBiMetrics[] = [
  { campaignId: 'MKT-701', campaignName: 'Prime Summer Mega Deals 2026', type: 'Flash Sale', impressions: 48500000, clicks: 3820000, ctrPct: 7.88, conversions: 241000, conversionRatePct: 6.31, cac: 12.40, revenueGenerated: 19400000 },
  { campaignId: 'MKT-702', campaignName: 'Tech Savings VIP Coupon Wave', type: 'Coupon', impressions: 18200000, clicks: 1420000, ctrPct: 7.80, conversions: 118000, conversionRatePct: 8.31, cac: 14.10, revenueGenerated: 9800000 },
  { campaignId: 'MKT-703', campaignName: 'Personalized Abandoned Cart Push', type: 'Push Notification', impressions: 4200000, clicks: 680000, ctrPct: 16.19, conversions: 84000, conversionRatePct: 12.35, cac: 4.80, revenueGenerated: 6720000 },
  { campaignId: 'MKT-704', campaignName: 'Search Sponsored Keyword PPC', type: 'PPC Search', impressions: 92000000, clicks: 4100000, ctrPct: 4.46, conversions: 195000, conversionRatePct: 4.76, cac: 21.50, revenueGenerated: 15600000 },
];

export const MOCK_LOGISTICS_METRICS: LogisticsBiMetrics[] = [
  { carrier: 'Commerce Zon Logistics (In-House)', shipmentVolume: 12400000, deliverySuccessRatePct: 99.4, avgDelayHours: 0.8, returnLogisticsRatePct: 2.1, shippingCostPerOrder: 3.80 },
  { carrier: 'FedEx Express Air & Ground', shipmentVolume: 3200000, deliverySuccessRatePct: 98.2, avgDelayHours: 1.4, returnLogisticsRatePct: 3.4, shippingCostPerOrder: 5.40 },
  { carrier: 'UPS Next-Day & Priority', shipmentVolume: 2100000, deliverySuccessRatePct: 98.7, avgDelayHours: 1.1, returnLogisticsRatePct: 2.9, shippingCostPerOrder: 5.90 },
  { carrier: 'DHL Express International', shipmentVolume: 720900, deliverySuccessRatePct: 97.5, avgDelayHours: 2.3, returnLogisticsRatePct: 4.2, shippingCostPerOrder: 8.20 },
];

export const MOCK_AI_PREDICTIVE_BI: AiPredictiveBi[] = [
  {
    metricName: 'Gross Merchandise Value (30-Day Forecast)',
    currentValue: 1482930400,
    predictedValue30d: 1620000000,
    confidenceScorePct: 96.4,
    growthDriver: 'Holiday Prime Peak + New Seller Onboarding Surge',
    forecastPoints: [
      { date: 'Week 1', actual: 340000000, predicted: 340000000, lowerBound: 335000000, upperBound: 345000000 },
      { date: 'Week 2', actual: 365000000, predicted: 365000000, lowerBound: 358000000, upperBound: 372000000 },
      { date: 'Week 3', predicted: 420000000, lowerBound: 405000000, upperBound: 435000000 },
      { date: 'Week 4', predicted: 495000000, lowerBound: 475000000, upperBound: 515000000 },
    ],
  },
  {
    metricName: 'FBA Inventory Capacity Demand',
    currentValue: 88.4,
    predictedValue30d: 96.2,
    confidenceScorePct: 94.1,
    growthDriver: 'Q3 Seasonal Restock for Fast-Moving Electronics',
    forecastPoints: [
      { date: 'Week 1', actual: 88.4, predicted: 88.4, lowerBound: 87.0, upperBound: 89.5 },
      { date: 'Week 2', actual: 90.1, predicted: 90.1, lowerBound: 89.0, upperBound: 91.2 },
      { date: 'Week 3', predicted: 93.5, lowerBound: 92.0, upperBound: 95.0 },
      { date: 'Week 4', predicted: 96.2, lowerBound: 94.5, upperBound: 98.0 },
    ],
  },
  {
    metricName: 'At-Risk Customer Churn Volume',
    currentValue: 18.9,
    predictedValue30d: 12.4,
    confidenceScorePct: 91.8,
    growthDriver: 'Automated AI Win-Back Coupons & Free Shipping Nudges',
    forecastPoints: [
      { date: 'Week 1', actual: 18.9, predicted: 18.9, lowerBound: 18.0, upperBound: 19.5 },
      { date: 'Week 2', actual: 16.5, predicted: 16.5, lowerBound: 15.8, upperBound: 17.2 },
      { date: 'Week 3', predicted: 14.1, lowerBound: 13.2, upperBound: 15.0 },
      { date: 'Week 4', predicted: 12.4, lowerBound: 11.5, upperBound: 13.5 },
    ],
  },
];

export const MOCK_FRAUD_RISK_BI: FraudRiskBi[] = [
  { id: 'FRD-101', type: 'Payment Fraud', severity: 'CRITICAL', targetEntity: 'Order #ORD-998241 (IP: 185.220.101.5)', riskScore: 96, timestamp: '2 mins ago', status: 'Blocked', details: 'Stolen card cluster detected across 12 rapid checkout attempts' },
  { id: 'FRD-102', type: 'Fake Review Bot', severity: 'HIGH', targetEntity: 'Product PRD-802 (Seller: SEL-1004)', riskScore: 88, timestamp: '14 mins ago', status: 'Flagged', details: 'Synthetic NLP generated 5-star reviews from single IP subnet' },
  { id: 'FRD-103', type: 'Return Fraud', severity: 'HIGH', targetEntity: 'Buyer: buyer_88291 (32 returns/mo)', riskScore: 84, timestamp: '42 mins ago', status: 'Investigating', details: 'Empty box return pattern detected across 3 FBA fulfillment hubs' },
  { id: 'FRD-104', type: 'Account Abuse', severity: 'MEDIUM', targetEntity: 'Affiliate AFF-903 (Self-Referrals)', riskScore: 68, timestamp: '1 hour ago', status: 'Investigating', details: 'Cookie stuffing pattern on high-margin consumer electronics' },
  { id: 'FRD-105', type: 'High-Risk Seller', severity: 'HIGH', targetEntity: 'Merchant: NewSeller_9012', riskScore: 82, timestamp: '3 hours ago', status: 'Flagged', details: 'Sudden $500k inventory listing surge without historic feedback' },
];

export const MOCK_REALTIME_METRICS: RealtimeMonitoringMetric[] = [
  { metric: 'Active Online Shoppers', value: 248920, unit: 'users', status: 'Optimal', changeSec: +142 },
  { metric: 'Live Orders Per Minute', value: 4820, unit: 'orders/min', status: 'Optimal', changeSec: +35 },
  { metric: 'Payment Gateway Latency', value: 142, unit: 'ms', status: 'Optimal', changeSec: -8 },
  { metric: 'FBA Robotic Dispatch', value: 18420, unit: 'parcels/hr', status: 'Optimal', changeSec: +410 },
  { metric: 'AI Recommendation Inferences', value: 89400, unit: 'req/sec', status: 'Optimal', changeSec: +1200 },
  { metric: 'Server CPU Cluster Load', value: 42.1, unit: '%', status: 'Optimal', changeSec: -0.4 },
  { metric: 'Redis Cache Hit Ratio', value: 99.4, unit: '%', status: 'Optimal', changeSec: +0.1 },
];

export const MOCK_CUSTOM_REPORTS: CustomReportConfig[] = [
  { id: 'RPT-001', title: 'Q3 Executive GMV & Margin Breakdown', dataSources: ['Sales', 'Financial'], metrics: ['GMV', 'Marketplace Revenue', 'Net Profit'], chartType: 'area', timeframe: '90d', createdAt: '2026-07-01', isScheduled: true, scheduleFrequency: 'monthly', recipients: ['executive-team@commercezon.com'] },
  { id: 'RPT-002', title: 'FBA Inventory Turnover & Overstock Audit', dataSources: ['Inventory', 'Logistics'], metrics: ['Inventory Turnover', 'Dead Stock', 'Warehouse Capacity'], chartType: 'bar', timeframe: '30d', createdAt: '2026-07-15', isScheduled: true, scheduleFrequency: 'weekly', recipients: ['fba-ops@commercezon.com'] },
  { id: 'RPT-003', title: 'Top 100 Seller Compliance & Return Rates', dataSources: ['Sellers', 'Orders'], metrics: ['Order Volume', 'Return Rate', 'Customer Rating'], chartType: 'table', timeframe: '30d', createdAt: '2026-07-20', isScheduled: false },
];

export const MOCK_SECURITY_AUDIT_LOGS: SecurityAuditLogBi[] = [
  { id: 'LOG-3001', user: 'admin_alex', role: 'Super Admin', action: 'Exported Executive Financial Report (PDF)', ipAddress: '10.240.0.12', authMethod: 'JWT+2FA', timestamp: '2026-07-28 02:30:12', status: 'SUCCESS' },
  { id: 'LOG-3002', user: 'analyst_sarah', role: 'BI Engineer', action: 'Executed Custom Spark Query on ClickHouse Engine', ipAddress: '10.240.4.88', authMethod: 'JWT+2FA', timestamp: '2026-07-28 02:24:45', status: 'SUCCESS' },
  { id: 'LOG-3003', user: 'fraud_ops_bot', role: 'Automated Security Service', action: 'Blocked Suspected Stolen Card Checkout (Order #ORD-998241)', ipAddress: '185.220.101.5', authMethod: 'API Key', timestamp: '2026-07-28 02:32:10', status: 'FLAGGED' },
  { id: 'LOG-3004', user: 'vendor_rep_09', role: 'Seller Central Analyst', action: 'Attempted Unrestricted Customer PII Export', ipAddress: '172.16.89.44', authMethod: 'JWT', timestamp: '2026-07-28 01:15:00', status: 'DENIED' },
];
