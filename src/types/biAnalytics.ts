export type BiTimeframe = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';
export type ScheduledFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';

export interface ExecutiveKpi {
  id: string;
  label: string;
  value: string | number;
  changePct: number;
  isPositive: boolean;
  category: 'financial' | 'operations' | 'growth' | 'customers';
  target: string | number;
  sparkline: number[];
  description: string;
}

export interface RevenueTrendPoint {
  date: string;
  gmv: number;
  revenue: number;
  netProfit: number;
  operatingCosts: number;
  ordersCount: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  orders: number;
  sharePct: number;
  growthPct: number;
}

export interface GeographicSales {
  country: string;
  city: string;
  revenue: number;
  orders: number;
  buyers: number;
  topCategory: string;
}

export interface CustomerSegment {
  segmentName: string;
  customerCount: number;
  avgClv: number;
  retentionRatePct: number;
  churnRatePct: number;
  avgBasketSize: number;
  purchaseFrequency: number;
}

export interface SellerBiMetrics {
  sellerId: string;
  sellerName: string;
  tier: 'Individual' | 'Professional' | 'Brand Owner';
  revenue: number;
  profitabilityPct: number;
  orderVolume: number;
  cancellationRatePct: number;
  returnRatePct: number;
  customerRating: number;
  inventoryHealthScore: number;
  fulfilmentEfficiencyPct: number;
}

export interface AffiliateBiMetrics {
  affiliateId: string;
  affiliateName: string;
  totalClicks: number;
  uniqueVisitors: number;
  conversionRatePct: number;
  commissionEarned: number;
  affiliateRevenue: number;
  topCampaign: string;
  referralSource: string;
}

export interface ProductBiMetrics {
  productId: string;
  title: string;
  sku: string;
  category: string;
  unitsSold: number;
  revenue: number;
  views: number;
  conversionRatePct: number;
  wishlistAdditions: number;
  cartAdditions: number;
  inventoryTurnoverRate: number;
  rating: number;
  reviewCount: number;
  seasonalTrend: 'High' | 'Moderate' | 'Low' | 'Peak';
}

export interface InventoryBiMetrics {
  warehouseId: string;
  warehouseName: string;
  fastMovingItems: number;
  slowMovingItems: number;
  deadStockCount: number;
  overstockRiskValue: number;
  stockAccuracyPct: number;
  capacityUtilizationPct: number;
  forecastedReorderValue: number;
}

export interface OrderBiMetrics {
  status: string;
  count: number;
  avgProcessingTimeHours: number;
  avgDeliveryTimeDays: number;
  cancellationTrendPct: number;
  refundTrendPct: number;
  fulfilmentEfficiencyScore: number;
}

export interface FinancialBiMetrics {
  revenueType: string;
  amount: number;
  shareOfTotalPct: number;
  growthYoyPct: number;
}

export interface MarketingBiMetrics {
  campaignId: string;
  campaignName: string;
  type: 'Coupon' | 'Flash Sale' | 'Email' | 'Push Notification' | 'PPC Search';
  impressions: number;
  clicks: number;
  ctrPct: number;
  conversions: number;
  conversionRatePct: number;
  cac: number;
  revenueGenerated: number;
}

export interface LogisticsBiMetrics {
  carrier: string;
  shipmentVolume: number;
  deliverySuccessRatePct: number;
  avgDelayHours: number;
  returnLogisticsRatePct: number;
  shippingCostPerOrder: number;
}

export interface AiPredictiveBi {
  metricName: string;
  currentValue: number;
  predictedValue30d: number;
  confidenceScorePct: number;
  growthDriver: string;
  forecastPoints: { date: string; actual?: number; predicted: number; lowerBound: number; upperBound: number }[];
}

export interface FraudRiskBi {
  id: string;
  type: 'Payment Fraud' | 'Fake Review Bot' | 'Return Fraud' | 'Account Abuse' | 'High-Risk Seller';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  targetEntity: string;
  riskScore: number; // 0-100
  timestamp: string;
  status: 'Flagged' | 'Investigating' | 'Blocked' | 'Resolved';
  details: string;
}

export interface RealtimeMonitoringMetric {
  metric: string;
  value: number;
  unit: string;
  status: 'Optimal' | 'Warning' | 'Critical';
  changeSec: number;
}

export interface CustomReportConfig {
  id: string;
  title: string;
  dataSources: string[];
  metrics: string[];
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'heatmap' | 'funnel' | 'kpi' | 'table';
  timeframe: BiTimeframe;
  createdAt: string;
  isScheduled: boolean;
  scheduleFrequency?: ScheduledFrequency;
  recipients?: string[];
}

export interface SecurityAuditLogBi {
  id: string;
  user: string;
  role: string;
  action: string;
  ipAddress: string;
  authMethod: 'JWT+2FA' | 'JWT' | 'API Key';
  timestamp: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}
