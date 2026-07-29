export type AiTabType = 
  | 'dashboard'
  | 'search'
  | 'recommendations'
  | 'personalization'
  | 'ranking'
  | 'assistant'
  | 'comparison'
  | 'reviews'
  | 'fraud'
  | 'forecasting'
  | 'pricing'
  | 'marketing'
  | 'seller_insights'
  | 'analytics_admin';

export interface AiSystemMetrics {
  totalSearchRequests: number;
  totalRecommendationRequests: number;
  avgAiResponseTimeMs: number;
  searchSuccessRatePct: number;
  clickThroughRatePct: number;
  conversionRatePct: number;
  personalizationScorePct: number;
  recommendationAccuracyPct: number;
  aiModelHealthPct: number;
  userEngagementScore: number;
  aiGeneratedRevenueUsd: number;
  trendingSearches: string[];
}

export interface TimeSeriesUsage {
  timeLabel: string;
  searchRequests: number;
  recommendationRequests: number;
  conversionRate: number;
  aiRevenue: number;
}

export interface ProductSearchResult {
  id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  verifiedReviewsCount: number;
  sellerName: string;
  sellerRating: number;
  imageUrl: string;
  relevanceScore: number; // 0 - 100
  aiMatchReason: string;
  deliverySpeedDays: number;
  inStockCount: number;
  semanticTags: string[];
  conversionRatePct: number;
  satisfactionScorePct: number;
}

export interface SearchQueryAnalysis {
  originalQuery: string;
  correctedQuery?: string;
  detectedIntent: string;
  extractedAttributes: {
    category?: string;
    maxPrice?: number;
    color?: string;
    targetUser?: string;
    brand?: string;
  };
  language: string;
  suggestedQueries: string[];
}

export interface PersonalizedCustomerProfile {
  id: string;
  name: string;
  avatar: string;
  personaTitle: string;
  favoriteCategories: string[];
  favoriteBrands: string[];
  browsingHistory: string[];
  searchHistory: string[];
  purchaseHistory: string[];
  wishlist: string[];
  cartActivity: string[];
  deviceType: 'Desktop (macOS)' | 'Mobile (iOS App)' | 'Tablet (Android)';
  country: string;
  language: string;
  vectorEmbeddingsSummary: string;
}

export interface SmartRecommendationSection {
  id: string;
  title: string;
  subtitle: string;
  products: ProductSearchResult[];
}

export interface RankingWeights {
  relevance: number; // 0 - 100
  rating: number;
  verifiedReviews: number;
  sellerPerformance: number;
  popularity: number;
  inventoryAvailability: number;
  deliverySpeed: number;
  conversionRate: number;
  customerSatisfaction: number;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  recommendedProducts?: ProductSearchResult[];
  actionButtons?: { label: string; actionQuery: string }[];
  language?: string;
  needsHumanHandover?: boolean;
}

export interface ComparisonProductSpec {
  productId: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  sellerRating: number;
  deliveryDays: number;
  warranty: string;
  keySpecs: Record<string, string>;
  imageUrl: string;
}

export interface AiComparisonSummary {
  verdict: string;
  bestOverallProductId: string;
  bestValueProductId: string;
  featureMatrix: { featureName: string; values: Record<string, string> }[];
  prosCons: Record<string, { pros: string[]; cons: string[] }>;
}

export interface ReviewSentimentAnalysis {
  productId: string;
  productTitle: string;
  totalReviews: number;
  positiveSentimentPct: number;
  neutralSentimentPct: number;
  negativeSentimentPct: number;
  fakeReviewRiskPct: number;
  spamCount: number;
  duplicateCount: number;
  frequentlyMentionedFeatures: { feature: string; sentiment: 'positive' | 'negative' | 'neutral'; count: number }[];
  commonComplaints: string[];
  aiReviewSummary: string;
}

export interface FraudAlertItem {
  id: string;
  entityType: 'Buyer' | 'Seller' | 'Review' | 'Payment' | 'Account' | 'Coupon' | 'Return';
  entityName: string;
  fraudType: 'Fake Reviews' | 'Bot Activity' | 'Suspicious Payments' | 'Review Manipulation' | 'Return Fraud' | 'Coupon Abuse';
  riskScore: number; // 0 - 100
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectedAt: string;
  details: string;
  status: 'Open' | 'Investigating' | 'Mitigated' | 'Dismissed';
}

export interface DemandForecastItem {
  productId: string;
  productTitle: string;
  category: string;
  currentStock: number;
  predicted30DayDemand: number;
  stockoutRiskDate: string;
  fastSellingStatus: 'Fast Seller' | 'Steady' | 'Slow Seller';
  recommendedReorderQty: number;
  seasonalTrendFactor: string;
}

export interface PricingCompetitorItem {
  productId: string;
  productTitle: string;
  currentPrice: number;
  competitorMinPrice: number;
  competitorMaxPrice: number;
  competitorAvgPrice: number;
  recommendedDynamicPrice: number;
  predictedMarginPct: number;
  demandSurgeMultiplier: number;
  priceRuleApplied: string;
}

export interface AiMarketingOpportunity {
  id: string;
  customerGroup: string;
  campaignType: 'Cross-Sell' | 'Upsell' | 'Personalized Coupon' | 'Abandoned Cart Push' | 'Category Email';
  title: string;
  suggestedDiscount: string;
  recommendedProduct: string;
  estimatedRevenueImpactUsd: number;
  conversionProbabilityPct: number;
  status: 'Active' | 'Draft' | 'Scheduled';
}

export interface SellerAiInsight {
  sellerId: string;
  sellerName: string;
  topPerformingProduct: string;
  underperformingProduct: string;
  recommendedPriceAdjustments: string;
  inventoryAlert: string;
  salesForecastNextMonthUsd: number;
  customerSatisfactionTrend: string;
}

export interface AiAdminModelConfig {
  modelName: string;
  provider: 'Google Gemini' | 'Elasticsearch' | 'pgvector' | 'Local PyTorch';
  status: 'Active' | 'Standby' | 'Degraded';
  enabled: boolean;
  latencyMs: number;
  lastTrainedAt: string;
}

export interface AiAuditLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  modelUsed: string;
  latencyMs: number;
  status: 'Success' | 'Warning' | 'Error';
  details: string;
}
