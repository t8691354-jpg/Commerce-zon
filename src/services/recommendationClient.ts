import { Product } from '../types/domain';
import {
  RecommendationResponse,
  RecommendationItem,
  UserPersonalizationProfile,
  AIMatchRequest,
  AIMatchResponse,
} from '../types/recommendations';

const GUEST_STORAGE_KEY = 'cz_guest_personalization_v1';
const RECENTLY_VIEWED_KEY = 'cz_recently_viewed_products_v1';

export interface LocalGuestState {
  userId: string;
  recentlyViewedIds: string[];
  explicitInterests: string[];
}

export class RecommendationClient {
  private static instance: RecommendationClient;
  private currentUserId: string = 'usr-03';

  private constructor() {
    this.initGuestId();
  }

  public static getInstance(): RecommendationClient {
    if (!RecommendationClient.instance) {
      RecommendationClient.instance = new RecommendationClient();
    }
    return RecommendationClient.instance;
  }

  private initGuestId(): string {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.userId) return parsed.userId;
      }
      const newGuestId = `guest-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(
        GUEST_STORAGE_KEY,
        JSON.stringify({
          userId: newGuestId,
          recentlyViewedIds: [],
          explicitInterests: ['High-Performance Computing', 'Robotics & Automation'],
        })
      );
      return newGuestId;
    } catch {
      return 'guest-anon';
    }
  }

  public getActiveUserId(): string {
    return this.currentUserId;
  }

  public setUserId(id: string): void {
    this.currentUserId = id;
  }

  public getLocalRecentlyViewedIds(): string[] {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public saveLocalRecentlyViewedId(productId: string): void {
    try {
      const current = this.getLocalRecentlyViewedIds();
      const updated = [productId, ...current.filter((id) => id !== productId)].slice(0, 15);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  public clearLocalRecentlyViewed(): void {
    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }
  }

  // API Call: Recommended For You
  public async getRecommendedForYou(
    interests?: string[],
    limit: number = 6
  ): Promise<RecommendationResponse> {
    try {
      const params = new URLSearchParams({
        userId: this.currentUserId,
        limit: String(limit),
      });
      if (interests && interests.length > 0) {
        params.append('interests', interests.join(','));
      }
      const res = await fetch(`/api/recommendations/for-you?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to fetch for-you recommendations, using fallback:', err);
    }
    return {
      recommendations: [],
      type: 'recommended_for_you',
      source: 'catalog_fallback',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: Similar Products
  public async getSimilarProducts(productId: string, limit: number = 4): Promise<RecommendationResponse> {
    try {
      const res = await fetch(`/api/recommendations/similar/${productId}?limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch similar products:', err);
    }
    return {
      recommendations: [],
      type: 'similar_products',
      source: 'catalog_fallback',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: Frequently Viewed Together
  public async getFrequentlyViewedTogether(
    productId: string,
    limit: number = 3
  ): Promise<RecommendationResponse> {
    try {
      const res = await fetch(`/api/recommendations/frequently-viewed-together/${productId}?limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch frequently viewed together:', err);
    }
    return {
      recommendations: [],
      type: 'frequently_viewed_together',
      source: 'catalog_fallback',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: Frequently Bought Together
  public async getFrequentlyBoughtTogether(
    productId: string,
    limit: number = 2
  ): Promise<RecommendationResponse> {
    try {
      const res = await fetch(`/api/recommendations/frequently-bought-together/${productId}?limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch bought together:', err);
    }
    return {
      recommendations: [],
      type: 'frequently_bought_together',
      source: 'catalog_fallback',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: Complementary Products
  public async getComplementaryProducts(
    productIds: string[],
    limit: number = 4
  ): Promise<RecommendationResponse> {
    try {
      const query = productIds.join(',');
      const res = await fetch(`/api/recommendations/complementary?productIds=${encodeURIComponent(query)}&limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch complementary products:', err);
    }
    return {
      recommendations: [],
      type: 'complementary',
      source: 'catalog_fallback',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: Popular Products
  public async getPopularProducts(limit: number = 6, category?: string): Promise<RecommendationResponse> {
    try {
      const catParam = category && category !== 'all' ? `&category=${category}` : '';
      const res = await fetch(`/api/recommendations/popular?limit=${limit}${catParam}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch popular products:', err);
    }
    return {
      recommendations: [],
      type: 'popular_trending',
      source: 'catalog_fallback',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: New Arrivals
  public async getNewArrivals(limit: number = 6, category?: string): Promise<RecommendationResponse> {
    try {
      const catParam = category && category !== 'all' ? `&category=${category}` : '';
      const res = await fetch(`/api/recommendations/new-arrivals?limit=${limit}${catParam}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch new arrivals:', err);
    }
    return {
      recommendations: [],
      type: 'new_arrivals',
      source: 'catalog_fallback',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: Recently Viewed Products Resolver
  public async getRecentlyViewed(productIds: string[]): Promise<RecommendationResponse> {
    try {
      if (productIds.length === 0) {
        return {
          recommendations: [],
          type: 'recently_viewed',
          source: 'personalized',
          total: 0,
          computationTimeMs: 0,
        };
      }
      const res = await fetch(`/api/recommendations/recently-viewed?productIds=${encodeURIComponent(productIds.join(','))}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch recently viewed:', err);
    }
    return {
      recommendations: [],
      type: 'recently_viewed',
      source: 'personalized',
      total: 0,
      computationTimeMs: 0,
    };
  }

  // API Call: AI Match
  public async getAIMatchedRecommendations(request: AIMatchRequest): Promise<AIMatchResponse> {
    try {
      const res = await fetch('/api/recommendations/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to execute AI match:', err);
    }
    return {
      recommendations: [],
      aiReasoning: 'Unable to reach AI service; displaying standard catalog discovery.',
      extractedInterests: [],
      usedFallback: true,
      latencyMs: 0,
    };
  }

  // Track Interaction (Product view, click, cart add, etc.)
  public async trackInteraction(
    product: Product,
    interactionType: 'view' | 'click' | 'cart_add' | 'purchase' | 'wishlist'
  ): Promise<void> {
    if (interactionType === 'view') {
      this.saveLocalRecentlyViewedId(product.id);
    }

    try {
      await fetch('/api/personalization/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.currentUserId,
          productId: product.id,
          interactionType,
          category: product.category,
          brand: product.merchant.name,
          tags: product.tags,
        }),
      });
    } catch (err) {
      // Non-blocking interaction recording
    }
  }

  // Profile & Interests
  public async getUserProfile(): Promise<UserPersonalizationProfile | null> {
    try {
      const res = await fetch(`/api/personalization/profile/${this.currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        return data.profile;
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
    return null;
  }

  public async updateExplicitInterests(interests: string[]): Promise<void> {
    try {
      await fetch('/api/personalization/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.currentUserId,
          interests,
        }),
      });
    } catch (err) {
      console.warn('Failed to update explicit interests:', err);
    }
  }

  public async clearHistory(): Promise<void> {
    this.clearLocalRecentlyViewed();
    try {
      await fetch('/api/personalization/clear-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: this.currentUserId }),
      });
    } catch (err) {
      console.warn('Failed to clear history on server:', err);
    }
  }
}

export const recommendationClient = RecommendationClient.getInstance();
