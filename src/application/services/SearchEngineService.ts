import { Product } from '../../types/domain';
import {
  SearchQueryParams,
  SearchResponse,
  SearchResultItem,
  SearchRankingWeights,
  DEFAULT_SEARCH_WEIGHTS,
  AutocompleteResponse,
  AutocompleteSuggestion,
  SearchAnalyticsSummary,
  SearchAnalyticsQueryLog,
  SearchFacets,
  SearchSortOption,
  AISearchIntentResult,
} from '../../types/search';
import { productService } from './ProductService';
import { RedisCacheManager } from '../../infrastructure/cache/RedisCacheManager';
import { logger } from '../../infrastructure/logging/Logger';
import { GoogleGenAI } from '@google/genai';
import { appConfig } from '../../infrastructure/config/appConfig';
import { eventBus } from '../../lib/eventBus';

export class SearchEngineService {
  private static instance: SearchEngineService;
  private rankingWeights: SearchRankingWeights = { ...DEFAULT_SEARCH_WEIGHTS };

  // Analytics storage (in-memory for runtime enterprise analytics)
  private queryLogs: SearchAnalyticsQueryLog[] = [];
  private queryFrequencyMap: Map<string, number> = new Map();
  private filterUsageMap: Map<string, number> = new Map();
  private maxLogsRetained = 200;

  // AI Client cache
  private aiClient: GoogleGenAI | null = null;

  private constructor() {
    eventBus.subscribe('*', (event) => {
      if (
        event.domain === 'CATALOG' ||
        event.domain === 'INVENTORY' ||
        event.eventType.startsWith('PRODUCT_')
      ) {
        this.invalidateCache();
      }
    });
  }

  public static getInstance(): SearchEngineService {
    if (!SearchEngineService.instance) {
      SearchEngineService.instance = new SearchEngineService();
    }
    return SearchEngineService.instance;
  }

  /**
   * Configure ranking strategy weights
   */
  public setRankingWeights(weights: Partial<SearchRankingWeights>): void {
    this.rankingWeights = { ...this.rankingWeights, ...weights };
    this.invalidateCache();
  }

  public getRankingWeights(): SearchRankingWeights {
    return { ...this.rankingWeights };
  }

  /**
   * Normalize search query: trim, lowercase, collapse multiple whitespaces
   */
  public normalizeQuery(rawQuery?: string): string {
    if (!rawQuery) return '';
    return rawQuery
      .trim()
      .toLowerCase()
      .replace(/[\t\r\n]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * Main Search Execution Method
   */
  public async executeSearch(params: SearchQueryParams): Promise<SearchResponse> {
    const startTime = performance.now();

    // 1. Validate and sanitize parameters
    const query = this.normalizeQuery(params.q);
    const category = params.category && params.category !== 'all' ? params.category.trim() : undefined;
    
    // Normalize brand (string or array)
    let brands: string[] | undefined;
    if (params.brand) {
      if (Array.isArray(params.brand)) {
        brands = params.brand.map((b) => b.trim()).filter(Boolean);
      } else if (typeof params.brand === 'string') {
        brands = params.brand.split(',').map((b) => b.trim()).filter(Boolean);
      }
    }

    let minPrice = params.minPrice !== undefined ? Number(params.minPrice) : undefined;
    let maxPrice = params.maxPrice !== undefined ? Number(params.maxPrice) : undefined;

    // Validate price range consistency
    if (minPrice !== undefined && isNaN(minPrice)) minPrice = undefined;
    if (maxPrice !== undefined && isNaN(maxPrice)) maxPrice = undefined;
    if (minPrice !== undefined && minPrice < 0) minPrice = 0;
    if (maxPrice !== undefined && maxPrice < 0) maxPrice = undefined;

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      // Swap to preserve consistency rather than crashing
      const tmp = minPrice;
      minPrice = maxPrice;
      maxPrice = tmp;
    }

    const minRating = params.minRating !== undefined && !isNaN(Number(params.minRating))
      ? Math.max(1, Math.min(5, Number(params.minRating)))
      : undefined;

    const inStock = params.inStock === true || String(params.inStock) === 'true';

    const sortBy: SearchSortOption = params.sortBy || 'relevance';
    const page = Math.max(1, parseInt(String(params.page || 1), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(params.limit || 12), 10) || 12));

    // 2. Check Cache
    const cacheKey = `search:${JSON.stringify({ query, category, brands, minPrice, maxPrice, minRating, inStock, sortBy, page, limit })}`;
    const cached = RedisCacheManager.get<SearchResponse>(cacheKey);
    if (cached) {
      const execTime = Number((performance.now() - startTime).toFixed(2));
      return {
        ...cached,
        executionTimeMs: execTime,
      };
    }

    // 3. Retrieve all products from repository
    const allProducts = await productService.getAllProducts();

    // 4. Calculate relevance scores and filter by text matching
    const scoredResults: SearchResultItem[] = [];

    for (const prod of allProducts) {
      const match = this.evaluateProductRelevance(prod, query);
      // If query is provided, only include if score > 0; otherwise score is baseline
      if (!query || match.relevanceScore > 0) {
        scoredResults.push(match);
      }
    }

    // 5. Apply attribute and facet filters
    let filteredResults = scoredResults.filter((item) => {
      const prod = item.product;

      // Category filter
      if (category) {
        const prodCat = (prod.category || '').toLowerCase();
        const targetCat = category.toLowerCase();
        if (prodCat !== targetCat && !prodCat.includes(targetCat)) {
          return false;
        }
      }

      // Brand filter
      if (brands && brands.length > 0) {
        const prodBrand = (prod.brand || prod.merchant?.name || '').toLowerCase();
        const matchesBrand = brands.some((b) => prodBrand.includes(b.toLowerCase()));
        if (!matchesBrand) return false;
      }

      // Price filter
      const price = prod.price?.amount ?? 0;
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;

      // Rating filter
      if (minRating !== undefined) {
        const rating = prod.rating ?? 0;
        if (rating < minRating) return false;
      }

      // In stock filter
      if (inStock) {
        const stock = prod.totalStock ?? 0;
        if (stock <= 0) return false;
      }

      return true;
    });

    // 6. Compute Facets over the current filtered product universe (or all if empty)
    const facets = this.computeFacets(allProducts, filteredResults.map((r) => r.product));

    // 7. Sort Results (Deterministic & Non-Mutating)
    filteredResults = this.sortResults(filteredResults, sortBy);

    // 8. Pagination Slicing
    const totalItems = filteredResults.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const validPage = Math.min(page, totalPages);
    const startIndex = (validPage - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalItems);
    const paginatedItems = totalItems > 0 ? filteredResults.slice(startIndex, endIndex) : [];

    const pagination = {
      page: validPage,
      limit,
      totalItems,
      totalPages,
      hasNext: validPage < totalPages,
      hasPrev: validPage > 1,
      startIndex: totalItems > 0 ? startIndex + 1 : 0,
      endIndex,
    };

    // 9. Typo / "Did you mean?" suggestions check
    let didYouMean: string | null = null;
    if (query && totalItems === 0) {
      didYouMean = this.generateDidYouMeanSuggestion(query, allProducts);
    }

    const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

    const response: SearchResponse = {
      products: paginatedItems.map((item) => item.product),
      resultItems: paginatedItems,
      pagination,
      total: totalItems,
      activeFilters: {
        query: query || undefined,
        category,
        brand: brands,
        minPrice,
        maxPrice,
        minRating,
        inStock: inStock ? true : undefined,
      },
      appliedSorting: sortBy,
      facets,
      executionTimeMs,
      didYouMean,
    };

    // 10. Record Analytics
    this.recordAnalytics(query, totalItems, executionTimeMs, response.activeFilters);

    // 11. Cache response for 60 seconds
    RedisCacheManager.set(cacheKey, response, 60000, ['search_engine']);

    return response;
  }

  /**
   * Fast Autocomplete Suggestions
   */
  public async getAutocomplete(rawQuery: string): Promise<AutocompleteResponse> {
    const startTime = performance.now();
    const query = this.normalizeQuery(rawQuery);

    if (!query) {
      return {
        query: '',
        suggestions: [],
        totalMatches: 0,
        executionTimeMs: 0,
      };
    }

    const allProducts = await productService.getAllProducts();
    const suggestions: AutocompleteSuggestion[] = [];

    // 1. Match Categories
    const categoriesSet = new Set<string>();
    for (const p of allProducts) {
      if (p.category && p.category.toLowerCase().includes(query)) {
        categoriesSet.add(p.category);
      }
    }
    for (const cat of Array.from(categoriesSet).slice(0, 3)) {
      suggestions.push({
        id: `cat-${cat}`,
        type: 'category',
        title: cat.charAt(0).toUpperCase() + cat.slice(1),
        subtitle: 'Department',
        category: cat,
      });
    }

    // 2. Match Brands
    const brandsSet = new Set<string>();
    for (const p of allProducts) {
      const brand = p.brand || p.merchant?.name;
      if (brand && brand.toLowerCase().includes(query)) {
        brandsSet.add(brand);
      }
    }
    for (const brand of Array.from(brandsSet).slice(0, 3)) {
      suggestions.push({
        id: `brand-${brand}`,
        type: 'brand',
        title: brand,
        subtitle: 'Brand',
      });
    }

    // 3. Match Products
    const matchingProducts: { prod: Product; score: number }[] = [];
    for (const p of allProducts) {
      const titleLower = p.title.toLowerCase();
      if (titleLower.includes(query) || (p.sku && p.sku.toLowerCase().includes(query))) {
        let score = 0;
        if (titleLower.startsWith(query)) score += 50;
        else score += 20;
        matchingProducts.push({ prod: p, score });
      }
    }

    matchingProducts.sort((a, b) => b.score - a.score);

    for (const item of matchingProducts.slice(0, 6)) {
      suggestions.push({
        id: item.prod.id,
        type: 'product',
        title: item.prod.title,
        subtitle: `${item.prod.category} • $${item.prod.price.amount.toFixed(2)}`,
        category: item.prod.category,
        price: item.prod.price.amount,
        imageUrl: item.prod.images?.[0],
        badge: item.prod.rating >= 4.8 ? 'Top Rated' : undefined,
      });
    }

    // 4. Match common keywords
    const keywordsSet = new Set<string>();
    for (const p of allProducts) {
      for (const t of p.tags || []) {
        if (t.toLowerCase().includes(query) && t.toLowerCase() !== query) {
          keywordsSet.add(t.toLowerCase());
        }
      }
    }
    for (const kw of Array.from(keywordsSet).slice(0, 3)) {
      suggestions.push({
        id: `kw-${kw}`,
        type: 'keyword',
        title: kw,
        subtitle: 'Search Term',
      });
    }

    const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

    return {
      query,
      suggestions: suggestions.slice(0, 10),
      totalMatches: suggestions.length,
      executionTimeMs,
    };
  }

  /**
   * Multi-Signal Relevance Evaluation Engine
   */
  private evaluateProductRelevance(prod: Product, query: string): SearchResultItem {
    if (!query) {
      return {
        product: prod,
        relevanceScore: 10,
        matchedFields: ['all'],
      };
    }

    const titleLower = (prod.title || '').toLowerCase();
    const descLower = (prod.description || '').toLowerCase();
    const brandLower = (prod.brand || prod.merchant?.name || '').toLowerCase();
    const catLower = (prod.category || '').toLowerCase();
    const skuLower = (prod.sku || '').toLowerCase();
    const tagsLower = (prod.tags || []).map((t) => t.toLowerCase());

    let score = 0;
    const matchedFields: string[] = [];

    // 1. Exact Name Match
    if (titleLower === query) {
      score += this.rankingWeights.exactName;
      matchedFields.push('exact_title');
    }
    // 2. Name Prefix Match
    else if (titleLower.startsWith(query)) {
      score += this.rankingWeights.namePrefix;
      matchedFields.push('title_prefix');
    }
    // 3. Name Substring / Keyword Tokens
    else if (titleLower.includes(query)) {
      score += this.rankingWeights.nameKeyword * 1.5;
      matchedFields.push('title');
    }

    // Word token matching across title
    const queryTokens = query.split(' ').filter((t) => t.length > 1);
    let matchedTokenCount = 0;
    for (const token of queryTokens) {
      if (titleLower.includes(token)) {
        matchedTokenCount++;
      }
    }
    if (queryTokens.length > 0 && matchedTokenCount > 0) {
      score += (matchedTokenCount / queryTokens.length) * this.rankingWeights.nameKeyword;
      if (!matchedFields.includes('title')) matchedFields.push('title_keywords');
    }

    // 4. SKU Match
    if (skuLower.includes(query)) {
      score += this.rankingWeights.skuMatch;
      matchedFields.push('sku');
    }

    // 5. Brand Match
    if (brandLower.includes(query)) {
      score += this.rankingWeights.brandMatch;
      matchedFields.push('brand');
    }

    // 6. Category Match
    if (catLower.includes(query)) {
      score += this.rankingWeights.categoryMatch;
      matchedFields.push('category');
    }

    // 7. Tags Match
    let tagMatches = 0;
    for (const tag of tagsLower) {
      if (tag.includes(query) || query.includes(tag)) {
        tagMatches++;
      }
    }
    if (tagMatches > 0) {
      score += Math.min(tagMatches * this.rankingWeights.tagMatch, 50);
      matchedFields.push('tags');
    }

    // 8. Description Match
    if (descLower.includes(query)) {
      score += this.rankingWeights.descriptionMatch;
      matchedFields.push('description');
    }

    // Apply Quality & Popularity Signals as small positive tie-breakers if matched
    if (score > 0) {
      // Rating Signal (0 - 5 stars mapped to 0 - ratingWeight)
      const rating = prod.rating || 0;
      score += (rating / 5) * this.rankingWeights.ratingWeight;

      // Review count log scaling (e.g. up to +4)
      const reviewCount = prod.reviewCount || 0;
      if (reviewCount > 0) {
        score += Math.min(Math.log10(reviewCount + 1) * 2, 4);
      }

      // Popularity (views/salesCount or aiDemandScore)
      const demandScore = prod.aiDemandScore || prod.analyticsDetails?.salesCount || 0;
      if (demandScore > 0) {
        score += Math.min((demandScore / 100) * this.rankingWeights.popularityWeight, this.rankingWeights.popularityWeight);
      }
    }

    return {
      product: prod,
      relevanceScore: Number(score.toFixed(2)),
      matchedFields,
    };
  }

  /**
   * Facet Computation
   */
  private computeFacets(allProducts: Product[], filteredProducts: Product[]): SearchFacets {
    const categoryCountMap = new Map<string, number>();
    const brandCountMap = new Map<string, number>();
    const ratingCountMap = new Map<number, number>([
      [4, 0],
      [3, 0],
      [2, 0],
      [1, 0],
    ]);

    let minPrice = Infinity;
    let maxPrice = 0;
    let inStockCount = 0;
    let outOfStockCount = 0;

    const sourceProducts = filteredProducts.length > 0 ? filteredProducts : allProducts;

    for (const p of sourceProducts) {
      // Category
      if (p.category) {
        const cat = p.category;
        categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + 1);
      }

      // Brand
      const brand = p.brand || p.merchant?.name;
      if (brand) {
        brandCountMap.set(brand, (brandCountMap.get(brand) || 0) + 1);
      }

      // Price
      const price = p.price?.amount || 0;
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;

      // Ratings
      const r = Math.floor(p.rating || 0);
      if (r >= 4) ratingCountMap.set(4, (ratingCountMap.get(4) || 0) + 1);
      if (r >= 3) ratingCountMap.set(3, (ratingCountMap.get(3) || 0) + 1);
      if (r >= 2) ratingCountMap.set(2, (ratingCountMap.get(2) || 0) + 1);
      if (r >= 1) ratingCountMap.set(1, (ratingCountMap.get(1) || 0) + 1);

      // Stock
      if ((p.totalStock || 0) > 0) {
        inStockCount++;
      } else {
        outOfStockCount++;
      }
    }

    if (minPrice === Infinity) minPrice = 0;

    return {
      categories: Array.from(categoryCountMap.entries()).map(([name, count]) => ({ name, count })),
      brands: Array.from(brandCountMap.entries()).map(([name, count]) => ({ name, count })),
      priceRange: {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
      },
      ratings: [
        { rating: 4, count: ratingCountMap.get(4) || 0 },
        { rating: 3, count: ratingCountMap.get(3) || 0 },
        { rating: 2, count: ratingCountMap.get(2) || 0 },
        { rating: 1, count: ratingCountMap.get(1) || 0 },
      ],
      inStockCount,
      outOfStockCount,
    };
  }

  /**
   * Deterministic Non-Mutating Sorting
   */
  private sortResults(items: SearchResultItem[], sortBy: SearchSortOption): SearchResultItem[] {
    const list = [...items];

    switch (sortBy) {
      case 'price_asc':
        return list.sort((a, b) => {
          const diff = (a.product.price?.amount || 0) - (b.product.price?.amount || 0);
          return diff !== 0 ? diff : a.product.id.localeCompare(b.product.id);
        });

      case 'price_desc':
        return list.sort((a, b) => {
          const diff = (b.product.price?.amount || 0) - (a.product.price?.amount || 0);
          return diff !== 0 ? diff : a.product.id.localeCompare(b.product.id);
        });

      case 'newest':
        return list.sort((a, b) => {
          const timeA = new Date(a.product.createdAt || 0).getTime();
          const timeB = new Date(b.product.createdAt || 0).getTime();
          const diff = timeB - timeA;
          return diff !== 0 ? diff : a.product.id.localeCompare(b.product.id);
        });

      case 'highest_rated':
        return list.sort((a, b) => {
          const ratingDiff = (b.product.rating || 0) - (a.product.rating || 0);
          if (ratingDiff !== 0) return ratingDiff;
          const reviewsDiff = (b.product.reviewCount || 0) - (a.product.reviewCount || 0);
          return reviewsDiff !== 0 ? reviewsDiff : a.product.id.localeCompare(b.product.id);
        });

      case 'popularity':
        return list.sort((a, b) => {
          const popA = a.product.aiDemandScore || a.product.analyticsDetails?.salesCount || 0;
          const popB = b.product.aiDemandScore || b.product.analyticsDetails?.salesCount || 0;
          const diff = popB - popA;
          return diff !== 0 ? diff : a.product.id.localeCompare(b.product.id);
        });

      case 'relevance':
      default:
        return list.sort((a, b) => {
          const scoreDiff = b.relevanceScore - a.relevanceScore;
          if (scoreDiff !== 0) return scoreDiff;
          return a.product.id.localeCompare(b.product.id);
        });
    }
  }

  /**
   * Typo / Did You Mean Generator
   */
  private generateDidYouMeanSuggestion(query: string, products: Product[]): string | null {
    if (query.length < 3) return null;

    const candidateWords = new Set<string>();
    for (const p of products) {
      p.title.split(/\s+/).forEach((w) => {
        const clean = w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (clean.length >= 3) candidateWords.add(clean);
      });
      if (p.brand) candidateWords.add(p.brand.toLowerCase());
      if (p.category) candidateWords.add(p.category.toLowerCase());
    }

    let closestWord: string | null = null;
    let minDistance = 3; // Max tolerance 2 edits

    for (const candidate of candidateWords) {
      const dist = this.levenshteinDistance(query, candidate);
      if (dist < minDistance && dist > 0) {
        minDistance = dist;
        closestWord = candidate;
      }
    }

    return closestWord;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Optional Gemini AI Natural Language Query Parser
   */
  public async parseAIQueryIntent(prompt: string): Promise<AISearchIntentResult> {
    const rawQuery = this.normalizeQuery(prompt);

    // Initialize Gemini AI Client if API key is present
    if (!this.aiClient && process.env.GEMINI_API_KEY) {
      this.aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    }

    if (!this.aiClient) {
      // Graceful rule-based extraction fallback
      return this.fallbackParseQueryIntent(rawQuery);
    }

    try {
      const response = await this.aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an enterprise marketplace search intelligence engine for Commerce Zon.
Analyze this user search query and extract structured search criteria:
Query: "${prompt}"

Valid Categories in Marketplace: ["computing", "robotics", "electronics", "industrial"]
Valid Brands: ["Apex Robotics", "CyberTech Systems", "OmniGear"]

Extract the following JSON fields:
1. "extractedKeywords": The core product noun or search phrase (e.g. "laptop", "robotic arm", "scanner").
2. "suggestedCategory": One of the valid categories or null if ambiguous.
3. "suggestedBrand": Brand name if mentioned or null.
4. "suggestedMaxPrice": Max budget number if specified (e.g. 3000), else null.
5. "suggestedMinRating": Minimum rating number if specified (e.g. 4), else null.
6. "suggestedInStock": Boolean if user explicitly asked for available/in-stock, else null.
7. "reasoning": 1 sentence explaining the intent translation.

Return ONLY valid JSON matching this schema:
{
  "extractedKeywords": "...",
  "suggestedCategory": null,
  "suggestedBrand": null,
  "suggestedMaxPrice": null,
  "suggestedMinRating": null,
  "suggestedInStock": null,
  "reasoning": "..."
}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        originalQuery: prompt,
        extractedKeywords: parsed.extractedKeywords || rawQuery,
        suggestedCategory: parsed.suggestedCategory || undefined,
        suggestedBrand: parsed.suggestedBrand || undefined,
        suggestedMaxPrice: typeof parsed.suggestedMaxPrice === 'number' ? parsed.suggestedMaxPrice : undefined,
        suggestedMinRating: typeof parsed.suggestedMinRating === 'number' ? parsed.suggestedMinRating : undefined,
        suggestedInStock: typeof parsed.suggestedInStock === 'boolean' ? parsed.suggestedInStock : undefined,
        reasoning: parsed.reasoning || `Gemini extracted search intent for "${prompt}"`,
        confidence: 0.95,
      };
    } catch (err) {
      logger.warn('Gemini query parse failed, falling back to rule engine', 'SearchEngineService', { error: String(err) });
      return this.fallbackParseQueryIntent(rawQuery);
    }
  }

  private fallbackParseQueryIntent(rawQuery: string): AISearchIntentResult {
    let category: string | undefined;
    let maxPrice: number | undefined;
    let minRating: number | undefined;
    let inStock: boolean | undefined;

    // Detect under/below price regex: "under 5000", "< 3000", "below $2500"
    const priceMatch = rawQuery.match(/(?:under|below|<|\$)\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i);
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
    }

    // Category detection
    if (rawQuery.includes('laptop') || rawQuery.includes('computer') || rawQuery.includes('workstation')) {
      category = 'computing';
    } else if (rawQuery.includes('robot') || rawQuery.includes('cobot') || rawQuery.includes('arm')) {
      category = 'robotics';
    } else if (rawQuery.includes('sensor') || rawQuery.includes('lidar') || rawQuery.includes('scanner') || rawQuery.includes('industrial')) {
      category = 'industrial';
    }

    // In stock detection
    if (rawQuery.includes('in stock') || rawQuery.includes('available now')) {
      inStock = true;
    }

    // Clean keywords (remove "under 5000", etc.)
    let cleanKeywords = rawQuery
      .replace(/(?:under|below|<|\$)\s*\d+/gi, '')
      .replace(/\b(in stock|available now|cheap|affordable|best)\b/gi, '')
      .trim();

    return {
      originalQuery: rawQuery,
      extractedKeywords: cleanKeywords || rawQuery,
      suggestedCategory: category,
      suggestedMaxPrice: maxPrice,
      suggestedMinRating: minRating,
      suggestedInStock: inStock,
      reasoning: 'Parsed via deterministic query understanding rule engine.',
      confidence: 0.85,
    };
  }

  /**
   * Analytics & Logging
   */
  private recordAnalytics(
    query: string,
    resultsCount: number,
    executionTimeMs: number,
    filters?: Record<string, any>
  ): void {
    if (!query) return;

    // Record frequency
    const currentCount = this.queryFrequencyMap.get(query) || 0;
    this.queryFrequencyMap.set(query, currentCount + 1);

    // Record filter usage
    if (filters) {
      for (const [key, val] of Object.entries(filters)) {
        if (val !== undefined && key !== 'query') {
          const filterName = `${key}:${Array.isArray(val) ? val.join(',') : val}`;
          this.filterUsageMap.set(filterName, (this.filterUsageMap.get(filterName) || 0) + 1);
        }
      }
    }

    // Record log entry
    const entry: SearchAnalyticsQueryLog = {
      id: `sq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      query,
      timestamp: new Date().toISOString(),
      resultsCount,
      executionTimeMs,
      filters,
    };

    this.queryLogs.unshift(entry);
    if (this.queryLogs.length > this.maxLogsRetained) {
      this.queryLogs.pop();
    }
  }

  /**
   * Get Search Analytics for Admin
   */
  public getAnalyticsSummary(): SearchAnalyticsSummary {
    const totalSearches = this.queryLogs.length;
    const zeroResults = this.queryLogs.filter((l) => l.resultsCount === 0);

    const totalLatency = this.queryLogs.reduce((acc, l) => acc + l.executionTimeMs, 0);
    const avgLatency = totalSearches > 0 ? Number((totalLatency / totalSearches).toFixed(2)) : 0;

    // Top queries
    const topQueries = Array.from(this.queryFrequencyMap.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Filter usage
    const filterUsage = Array.from(this.filterUsageMap.entries())
      .map(([filterName, count]) => ({ filterName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Zero result queries
    const zeroResultQueries = zeroResults.slice(0, 10).map((l) => ({
      query: l.query,
      timestamp: l.timestamp,
      resultsCount: l.resultsCount,
    }));

    return {
      totalSearches,
      zeroResultSearchesCount: zeroResults.length,
      averageLatencyMs: avgLatency,
      topQueries,
      zeroResultQueries,
      filterUsage,
      recentSearches: this.queryLogs.slice(0, 15),
    };
  }

  /**
   * Clear Analytics
   */
  public clearAnalytics(): void {
    this.queryLogs = [];
    this.queryFrequencyMap.clear();
    this.filterUsageMap.clear();
  }

  /**
   * Invalidate Search Cache
   */
  public invalidateCache(): void {
    RedisCacheManager.invalidateTag('search_engine');
    logger.debug('Search engine cache invalidated', 'SearchEngineService');
  }
}

export const searchEngineService = SearchEngineService.getInstance();
