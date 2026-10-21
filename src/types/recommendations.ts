import { Product, ProductCategory } from './domain';

/**
 * Enterprise Recommendation & Personalization Engine Domain Types
 * Part 12: AI-Powered Recommendations & Personalization Engine
 */

export type RecommendationType =
  | 'recommended_for_you'
  | 'similar_products'
  | 'frequently_viewed_together'
  | 'frequently_bought_together'
  | 'category_popular'
  | 'popular_trending'
  | 'recently_viewed'
  | 'new_arrivals'
  | 'complementary'
  | 'ai_matched';

export type RecommendationAlgorithm =
  | 'collaborative_filtering'
  | 'content_similarity'
  | 'affinity_graph'
  | 'frequently_bundled'
  | 'gemini_ai_reasoning'
  | 'popularity_heuristic'
  | 'recency_heuristic'
  | 'fallback_catalog';

export interface RecommendationMatchSignals {
  categoryMatch: boolean;
  tagOverlapCount: number;
  matchingTags: string[];
  priceProximityPct: number;
  userAffinityScore: number;
  popularityBoost: number;
  ratingScore: number;
  aiConfidence?: number;
}

export interface RecommendationItem {
  product: Product;
  score: number; // 0 - 100 normalized score
  recommendationType: RecommendationType;
  algorithm: RecommendationAlgorithm;
  reason: string;
  badge?: string;
  matchSignals: RecommendationMatchSignals;
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
  type: RecommendationType;
  source: 'personalized' | 'catalog_fallback' | 'gemini_ai_enhanced';
  total: number;
  contextProductId?: string;
  explanation?: string;
  aiEnhanced?: boolean;
  computationTimeMs: number;
}

export interface UserPersonalizationProfile {
  userId: string;
  isGuest: boolean;
  recentlyViewedIds: string[];
  categoryAffinities: Record<string, number>; // category -> interaction score/count
  brandAffinities: Record<string, number>;
  tagAffinities: Record<string, number>;
  explicitInterests: string[];
  preferredPriceRange?: {
    min?: number;
    max?: number;
  };
  purchasedProductIds: string[];
  cartProductIds: string[];
  lastActiveTimestamp: string;
}

export interface PersonalizationInteractionEvent {
  userId: string;
  productId: string;
  interactionType: 'view' | 'click' | 'cart_add' | 'purchase' | 'wishlist';
  category?: ProductCategory | string;
  brand?: string;
  tags?: string[];
  timestamp: string;
}

export interface AIMatchRequest {
  prompt?: string;
  interests?: string[];
  currentProductId?: string;
  cartProductIds?: string[];
  category?: string;
  budgetMax?: number;
  limit?: number;
}

export interface AIMatchResponse {
  recommendations: RecommendationItem[];
  aiReasoning: string;
  extractedInterests: string[];
  usedFallback: boolean;
  latencyMs: number;
}
