import { Product } from './domain';

/**
 * Enterprise Search Engine Domain Types
 * Part 11: Advanced Search & Intelligent Product Discovery Engine
 */

export interface SearchRankingWeights {
  exactName: number;        // e.g. 100
  namePrefix: number;       // e.g. 70
  nameKeyword: number;      // e.g. 45
  skuMatch: number;         // e.g. 60
  brandMatch: number;       // e.g. 35
  categoryMatch: number;    // e.g. 30
  tagMatch: number;         // e.g. 25
  descriptionMatch: number; // e.g. 15
  ratingWeight: number;     // e.g. 8 (rating normalized)
  popularityWeight: number; // e.g. 8 (views/sales normalized)
}

export const DEFAULT_SEARCH_WEIGHTS: SearchRankingWeights = {
  exactName: 100,
  namePrefix: 70,
  nameKeyword: 45,
  skuMatch: 60,
  brandMatch: 35,
  categoryMatch: 30,
  tagMatch: 25,
  descriptionMatch: 15,
  ratingWeight: 8,
  popularityWeight: 8,
};

export type SearchSortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'popularity'
  | 'highest_rated';

export interface SearchQueryParams {
  q?: string;
  category?: string;
  brand?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: SearchSortOption;
  page?: number;
  limit?: number;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  startIndex: number;
  endIndex: number;
}

export interface SearchFacetItem {
  name: string;
  count: number;
  selected?: boolean;
}

export interface SearchFacets {
  categories: SearchFacetItem[];
  brands: SearchFacetItem[];
  priceRange: {
    min: number;
    max: number;
  };
  ratings: {
    rating: number;
    count: number;
  }[];
  inStockCount: number;
  outOfStockCount: number;
}

export interface SearchResultItem {
  product: Product;
  relevanceScore: number;
  matchedFields: string[];
  snippet?: string;
}

export interface SearchResponse {
  products: Product[];
  resultItems: SearchResultItem[];
  pagination: PaginationMetadata;
  total: number;
  activeFilters: {
    query?: string;
    category?: string;
    brand?: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
  };
  appliedSorting: SearchSortOption;
  facets: SearchFacets;
  executionTimeMs: number;
  didYouMean?: string | null;
  aiAssisted?: boolean;
  aiExplanation?: string | null;
}

export interface AutocompleteSuggestion {
  id: string;
  type: 'product' | 'brand' | 'category' | 'keyword';
  title: string;
  subtitle?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  badge?: string;
}

export interface AutocompleteResponse {
  query: string;
  suggestions: AutocompleteSuggestion[];
  totalMatches: number;
  executionTimeMs: number;
}

export interface SearchAnalyticsQueryLog {
  id: string;
  query: string;
  timestamp: string;
  resultsCount: number;
  executionTimeMs: number;
  filters?: Record<string, any>;
  userId?: string;
  ipAddress?: string;
}

export interface SearchAnalyticsSummary {
  totalSearches: number;
  zeroResultSearchesCount: number;
  averageLatencyMs: number;
  topQueries: { query: string; count: number }[];
  zeroResultQueries: { query: string; timestamp: string; resultsCount: number }[];
  filterUsage: { filterName: string; count: number }[];
  recentSearches: SearchAnalyticsQueryLog[];
}

export interface AISearchIntentResult {
  originalQuery: string;
  extractedKeywords: string;
  suggestedCategory?: string;
  suggestedBrand?: string;
  suggestedMaxPrice?: number;
  suggestedMinRating?: number;
  suggestedInStock?: boolean;
  reasoning: string;
  confidence: number;
}
