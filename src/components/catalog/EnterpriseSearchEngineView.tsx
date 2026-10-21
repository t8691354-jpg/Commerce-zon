import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../../types/domain';
import {
  SearchResponse,
  SearchSortOption,
  AutocompleteSuggestion,
  SearchAnalyticsSummary,
  SearchRankingWeights,
  DEFAULT_SEARCH_WEIGHTS,
} from '../../types/search';
import {
  Search,
  Sparkles,
  Mic,
  Camera,
  Filter,
  Star,
  Truck,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  AlertCircle,
  BarChart3,
  Sliders,
  CheckCircle2,
  Package,
  Layers,
  ChevronLeft,
  Info,
} from 'lucide-react';

interface EnterpriseSearchEngineViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export const EnterpriseSearchEngineView: React.FC<EnterpriseSearchEngineViewProps> = ({
  products,
  onAddToCart,
  initialQuery = '',
  initialCategory = 'all',
}) => {
  // Query & AI Mode
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [isAiMode, setIsAiMode] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiIntentData, setAiIntentData] = useState<{
    reasoning?: string;
    extractedKeywords?: string;
    category?: string;
    maxPrice?: number;
  } | null>(null);

  // Filters State
  const [category, setCategory] = useState<string>(initialCategory === 'all' ? '' : initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [primeOnly, setPrimeOnly] = useState<boolean>(false);

  // Sorting & Pagination
  const [sortBy, setSortBy] = useState<SearchSortOption>('relevance');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Search Results & Meta
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Autocomplete in this view
  const [localSuggestions, setLocalSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [isLocalSuggestionsOpen, setIsLocalSuggestionsOpen] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Voice & Image simulator state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Modals
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<SearchAnalyticsSummary | null>(null);
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);
  const [rankingWeights, setRankingWeights] = useState<SearchRankingWeights>({ ...DEFAULT_SEARCH_WEIGHTS });
  const [weightsSavedMessage, setWeightsSavedMessage] = useState(false);

  // Mobile Filter Drawer Toggle
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Quick feedback toast
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Fetch search results from backend API
  const performSearch = useCallback(async () => {
    setIsLoading(true);
    setSearchError(null);

    try {
      const queryParams = new URLSearchParams();
      if (searchTerm.trim()) queryParams.set('q', searchTerm.trim());
      if (category && category !== 'all') queryParams.set('category', category);
      if (selectedBrands.length > 0) queryParams.set('brand', selectedBrands.join(','));
      if (minPrice && !isNaN(Number(minPrice))) queryParams.set('minPrice', minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) queryParams.set('maxPrice', maxPrice);
      if (minRating > 0) queryParams.set('minRating', String(minRating));
      if (inStockOnly) queryParams.set('inStock', 'true');
      queryParams.set('sortBy', sortBy);
      queryParams.set('page', String(page));
      queryParams.set('limit', String(limit));

      const res = await fetch(`/api/products/search?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error(`Search failed with status ${res.status}`);
      }
      const data: SearchResponse = await res.json();
      setSearchResponse(data);
    } catch (err: any) {
      console.error('Search request failed:', err);
      setSearchError('Failed to load search results. Please verify search parameters or retry.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, category, selectedBrands, minPrice, maxPrice, minRating, inStockOnly, sortBy, page, limit]);

  // Initial and reactive search
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Reset page to 1 when filters or query change
  const handleQueryOrFilterChange = () => {
    setPage(1);
  };

  // Autocomplete fetch for local search input
  useEffect(() => {
    const q = searchTerm.trim();
    if (q.length < 1) {
      setLocalSuggestions([]);
      setIsLocalSuggestionsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search/autocomplete?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setLocalSuggestions(data.suggestions || []);
          setIsLocalSuggestionsOpen(true);
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Voice Search Simulator
  const handleVoiceSearch = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      setSearchTerm('Titan Workstation 64GB');
      handleQueryOrFilterChange();
    }, 2200);
  };

  // Image Search Simulator
  const handleImageSearch = () => {
    setIsUploadingImage(true);
    setTimeout(() => {
      setIsUploadingImage(false);
      setSearchTerm('Autonomous Cobot');
      handleQueryOrFilterChange();
    }, 2000);
  };

  // AI-Assisted Query Interpretation
  const handleAISearchSubmit = async () => {
    if (!searchTerm.trim()) return;
    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/products/search/ai-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchTerm }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiIntentData({
          reasoning: data.reasoning,
          extractedKeywords: data.extractedKeywords,
          category: data.suggestedCategory,
          maxPrice: data.suggestedMaxPrice,
        });

        // Auto-apply suggested filters
        if (data.extractedKeywords) setSearchTerm(data.extractedKeywords);
        if (data.suggestedCategory) setCategory(data.suggestedCategory);
        if (data.suggestedMaxPrice) setMaxPrice(String(data.suggestedMaxPrice));
        if (data.suggestedInStock) setInStockOnly(true);
        if (data.suggestedBrand) setSelectedBrands([data.suggestedBrand]);
        setPage(1);
      }
    } catch (err) {
      console.error('AI Intent analysis failed:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Fetch Analytics for Admin
  const handleOpenAnalytics = async () => {
    try {
      const res = await fetch('/api/search/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
        setIsAnalyticsOpen(true);
      }
    } catch (err) {
      console.error('Failed to load search analytics:', err);
    }
  };

  const handleClearAnalytics = async () => {
    try {
      await fetch('/api/search/analytics/clear', { method: 'POST' });
      const res = await fetch('/api/search/analytics');
      if (res.ok) setAnalyticsData(await res.json());
    } catch (err) {
      console.error('Failed to clear analytics:', err);
    }
  };

  // Filter Clear Helpers
  const handleClearAllFilters = () => {
    setSearchTerm('');
    setCategory('');
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setInStockOnly(false);
    setPrimeOnly(false);
    setAiIntentData(null);
    setSortBy('relevance');
    setPage(1);
  };

  const handleAddToCartWithNotify = (prod: Product) => {
    onAddToCart(prod);
    setAddedToast(`Added "${prod.title}" to your cart`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  // Count active filters
  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    (category ? 1 : 0) +
    selectedBrands.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (primeOnly ? 1 : 0);

  const availableCategories = searchResponse?.facets?.categories || [
    { name: 'computing', count: 4 },
    { name: 'robotics', count: 3 },
    { name: 'electronics', count: 5 },
    { name: 'industrial', count: 2 },
  ];

  const availableBrands = searchResponse?.facets?.brands || [
    { name: 'CyberTech Enterprise Solutions', count: 4 },
    { name: 'Apex Robotics & Industrial', count: 3 },
    { name: 'OmniGear Precision Hardware', count: 2 },
  ];

  const displayProducts = searchResponse?.products || [];
  const pagination = searchResponse?.pagination || {
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    startIndex: 0,
    endIndex: 0,
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131921] border-2 border-[#febd69] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{addedToast}</span>
        </div>
      )}

      {/* Top Banner & Search Execution Engine */}
      <div className="bg-gradient-to-r from-slate-900 via-[#131921] to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-[#febd69] text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-widest">
                PART 11 DISCOVERY ENGINE
              </span>
              <span className="text-xs text-amber-300 font-extrabold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Multi-Signal Ranking & Intelligent Query Parsing</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Advanced Search & Product Discovery</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time faceted catalog search, deterministic ranking weights, debounced autocomplete, and server-side Gemini AI natural language intent interpretation.
            </p>
          </div>

          {/* Admin Control Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleOpenAnalytics}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
              title="View Search Telemetry & Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span>Search Analytics</span>
            </button>

            <button
              onClick={() => setIsWeightsModalOpen(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
              title="Inspect or Tune Ranking Weights"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Ranking Weights</span>
            </button>
          </div>
        </div>

        {/* Primary Search Input & Modes */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full flex items-center bg-slate-950 border-2 border-slate-700 focus-within:border-[#febd69] rounded-xl px-4 py-2.5 shadow-inner transition">
              <Search className="w-5 h-5 text-[#febd69] mr-3 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleQueryOrFilterChange();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsLocalSuggestionsOpen(false);
                    if (isAiMode) {
                      handleAISearchSubmit();
                    } else {
                      performSearch();
                    }
                  }
                }}
                placeholder={
                  isAiMode
                    ? 'Natural Language Search: e.g. "high performance computing workstation under 4000"...'
                    : 'Search products by title, SKU, brand, keywords, or specifications...'
                }
                className="bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none w-full placeholder-slate-500"
              />

              {/* Clear Query Button */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setIsLocalSuggestionsOpen(false);
                    handleQueryOrFilterChange();
                  }}
                  className="p-1 text-slate-400 hover:text-white mr-2 transition"
                  title="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Voice & Image Search Simulators */}
              <div className="flex items-center space-x-1.5 border-l border-slate-800 pl-2">
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-lg transition ${
                    isRecordingVoice
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Voice Search Simulator"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleImageSearch}
                  className={`p-1.5 rounded-lg transition ${
                    isUploadingImage
                      ? 'bg-amber-500 text-slate-950 animate-bounce'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Visual Image Search Simulator"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Mode Toggle & Execute Button */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAiMode(!isAiMode)}
                className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
                  isAiMode
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Toggle Gemini AI Query Understanding Layer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiMode ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{isAiMode ? 'AI Intent ON' : 'AI Intent OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLocalSuggestionsOpen(false);
                  if (isAiMode) {
                    handleAISearchSubmit();
                  } else {
                    performSearch();
                  }
                }}
                disabled={isLoading || isAiAnalyzing}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
              >
                {isLoading || isAiAnalyzing ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Autocomplete suggestions in this view */}
          {isLocalSuggestionsOpen && localSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 sm:right-36 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 overflow-hidden text-xs divide-y divide-slate-800 max-h-72 overflow-y-auto">
              {localSuggestions.map((sug) => (
                <div
                  key={sug.id}
                  onClick={() => {
                    setSearchTerm(sug.title);
                    if (sug.type === 'category' && sug.category) {
                      setCategory(sug.category);
                    }
                    setIsLocalSuggestionsOpen(false);
                    handleQueryOrFilterChange();
                  }}
                  className="px-4 py-2.5 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition text-slate-200"
                >
                  <div className="flex items-center space-x-2.5">
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-white">{sug.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase">({sug.type})</span>
                  </div>
                  {sug.price !== undefined && (
                    <span className="font-mono text-emerald-400 font-bold">${sug.price.toFixed(2)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Intent Feedback Box */}
        {aiIntentData && (
          <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Gemini AI Search Intent Analysis</span>
              </span>
              <button
                onClick={() => setAiIntentData(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-300 text-xs italic">&quot;{aiIntentData.reasoning}&quot;</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              {aiIntentData.extractedKeywords && (
                <span className="bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700">
                  Keywords: <strong>{aiIntentData.extractedKeywords}</strong>
                </span>
              )}
              {aiIntentData.category && (
                <span className="bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700 capitalize">
                  Category: <strong>{aiIntentData.category}</strong>
                </span>
              )}
              {aiIntentData.maxPrice && (
                <span className="bg-indigo-900/60 text-indigo-200 px-2 py-0.5 rounded border border-indigo-700">
                  Max Budget: <strong>${aiIntentData.maxPrice}</strong>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Typo Suggestion Banner */}
        {searchResponse?.didYouMean && (
          <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Did you mean:</span>
              <button
                onClick={() => {
                  setSearchTerm(searchResponse.didYouMean!);
                  handleQueryOrFilterChange();
                }}
                className="font-black text-[#febd69] underline hover:text-amber-300"
              >
                {searchResponse.didYouMean}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Badges Strip */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <span className="text-slate-400 font-bold mr-1">Active Filters:</span>

          {searchTerm && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-amber-300 rounded-lg border border-slate-700">
              <span>Query: &quot;{searchTerm}&quot;</span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  handleQueryOrFilterChange();
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {category && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-sky-300 rounded-lg border border-slate-700 capitalize">
              <span>Dept: {category}</span>
              <button
                onClick={() => {
                  setCategory('');
                  handleQueryOrFilterChange();
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-emerald-300 rounded-lg border border-slate-700"
            >
              <span>Brand: {b}</span>
              <button
                onClick={() => {
                  setSelectedBrands(selectedBrands.filter((x) => x !== b));
                  handleQueryOrFilterChange();
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-purple-300 rounded-lg border border-slate-700">
              <span>
                Price: ${minPrice || '0'} - ${maxPrice || '∞'}
              </span>
              <button
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  handleQueryOrFilterChange();
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {minRating > 0 && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-amber-400 rounded-lg border border-slate-700">
              <span>{minRating}★ & Up</span>
              <button
                onClick={() => {
                  setMinRating(0);
                  handleQueryOrFilterChange();
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-emerald-400 rounded-lg border border-slate-700">
              <span>In Stock Only</span>
              <button
                onClick={() => {
                  setInStockOnly(false);
                  handleQueryOrFilterChange();
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {primeOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-800 text-sky-400 rounded-lg border border-slate-700">
              <span>Prime 1-Day</span>
              <button
                onClick={() => {
                  setPrimeOnly(false);
                  handleQueryOrFilterChange();
                }}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleClearAllFilters}
            className="ml-auto text-[11px] font-bold text-rose-400 hover:text-rose-300 underline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Main Two-Column Layout (Filters Sidebar + Results Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="px-3 py-1.5 bg-[#febd69] text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Faceted Filters ({activeFiltersCount})</span>
          </button>
          <span className="text-xs text-slate-400 font-mono">
            {pagination.totalItems} results found
          </span>
        </div>

        {/* Left Side Faceted Filter Sidebar */}
        <div
          className={`lg:col-span-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-6 ${
            isMobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-black text-white text-xs uppercase tracking-wider flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#febd69]" />
              <span>Faceted Filters</span>
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="text-[11px] text-amber-400 hover:underline font-bold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Department / Category Filter */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-extrabold uppercase text-slate-300 tracking-wider">
              Department
            </label>
            <div className="space-y-1.5 text-xs">
              <label
                onClick={() => {
                  setCategory('');
                  handleQueryOrFilterChange();
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition ${
                  !category ? 'bg-[#febd69] text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>All Departments</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </label>

              {availableCategories.map((cat) => (
                <label
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name === category ? '' : cat.name);
                    handleQueryOrFilterChange();
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition capitalize ${
                    category === cat.name
                      ? 'bg-[#febd69] text-slate-950 font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded font-mono">
                    {cat.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 tracking-wider">
                Price Range (USD)
              </label>
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    handleQueryOrFilterChange();
                  }}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Min ($)</span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    handleQueryOrFilterChange();
                  }}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-400">Max ($)</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    handleQueryOrFilterChange();
                  }}
                  placeholder="20,000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>
            </div>

            {/* Quick Price Shortcuts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Under $1,000', min: '0', max: '1000' },
                { label: '$1k - $5k', min: '1000', max: '5000' },
                { label: '$5k+', min: '5000', max: '' },
              ].map((tier) => (
                <button
                  key={tier.label}
                  type="button"
                  onClick={() => {
                    setMinPrice(tier.min);
                    setMaxPrice(tier.max);
                    handleQueryOrFilterChange();
                  }}
                  className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-medium"
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2.5 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase text-slate-300 tracking-wider">
                Brands & Vendors
              </label>
              {selectedBrands.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    handleQueryOrFilterChange();
                  }}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs max-h-44 overflow-y-auto pr-1">
              {availableBrands.map((b) => (
                <label
                  key={b.name}
                  className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, b.name]);
                        } else {
                          setSelectedBrands(selectedBrands.filter((x) => x !== b.name));
                        }
                        handleQueryOrFilterChange();
                      }}
                      className="accent-[#febd69] rounded"
                    />
                    <span className="truncate max-w-[140px]">{b.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">({b.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div className="space-y-2.5 border-t border-slate-800 pt-4">
            <label className="text-[11px] font-extrabold uppercase text-slate-300 tracking-wider">
              Customer Rating
            </label>
            <div className="space-y-1.5 text-xs">
              {[4, 3, 2].map((stars) => (
                <label
                  key={stars}
                  onClick={() => {
                    setMinRating(minRating === stars ? 0 : stars);
                    handleQueryOrFilterChange();
                  }}
                  className={`flex items-center space-x-2 p-1.5 rounded cursor-pointer transition ${
                    minRating === stars ? 'bg-amber-400/20 text-amber-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span>&amp; Up</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability & Prime Perks */}
          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
            <label className="text-[11px] font-extrabold uppercase text-slate-300 tracking-wider block mb-2">
              Availability
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  handleQueryOrFilterChange();
                }}
                className="accent-[#febd69] rounded w-4 h-4"
              />
              <span className="font-semibold">In Stock Only</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer text-sky-300 pt-1">
              <input
                type="checkbox"
                checked={primeOnly}
                onChange={(e) => {
                  setPrimeOnly(e.target.checked);
                  handleQueryOrFilterChange();
                }}
                className="accent-sky-400 rounded w-4 h-4"
              />
              <span className="font-semibold flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Prime 1-Day Delivery</span>
              </span>
            </label>
          </div>
        </div>

        {/* Right Side Search Results Workspace */}
        <div className="lg:col-span-9 space-y-4">
          {/* Header Toolbar: Results Count, Latency, Sort Selector, View Mode */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-white">
                {isLoading ? (
                  'Searching catalog...'
                ) : (
                  <>
                    Showing <strong className="text-[#febd69]">{pagination.startIndex}-{pagination.endIndex}</strong> of{' '}
                    <strong className="text-white">{pagination.totalItems}</strong> results
                  </>
                )}
              </span>

              {searchResponse && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  ⚡ {searchResponse.executionTimeMs}ms
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Sorting Selector */}
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 text-xs hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SearchSortOption);
                    setPage(1);
                  }}
                  className="bg-slate-950 border border-slate-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="relevance">Featured &amp; Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="highest_rated">Customer Rating</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center space-x-1.5 hidden sm:flex">
                <span className="text-slate-400 text-xs">Show:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-slate-950 border border-slate-700 text-white text-xs font-semibold px-2 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>

              {/* View Toggle (Grid / List) */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${
                    viewMode === 'grid' ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${
                    viewMode === 'list' ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Detailed List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading Skeleton / State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse space-y-3 h-80"
                >
                  <div className="h-40 bg-slate-800 rounded-xl"></div>
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-800 rounded mt-4"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {searchError && !isLoading && (
            <div className="p-6 bg-rose-950/30 border border-rose-500/40 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <div className="font-bold text-white text-sm">{searchError}</div>
              <button
                onClick={performSearch}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
              >
                Retry Search
              </button>
            </div>
          )}

          {/* Empty Results State */}
          {!isLoading && !searchError && displayProducts.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
              <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-[#febd69]">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-white">
                  No products matched your exact search criteria
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try checking for typos, loosening your price range or rating filter, or search for broader keywords.
                </p>
              </div>

              {/* Suggestions to try */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 mr-2">Try searching for:</span>
                <div className="inline-flex flex-wrap gap-2 justify-center mt-2">
                  {['Titan Workstation', 'Cobot Arm', 'Edge Server', 'LiDAR Scanner', 'Electronics'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => {
                        setSearchTerm(kw);
                        setCategory('');
                        setMinPrice('');
                        setMaxPrice('');
                        setMinRating(0);
                        setPage(1);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold border border-slate-700"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleClearAllFilters}
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold text-xs rounded-xl shadow transition"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Grid View Mode */}
          {!isLoading && !searchError && displayProducts.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProducts.map((p) => {
                const stock = p.totalStock ?? 10;
                const isLowStock = stock > 0 && stock <= 5;
                const isOutOfStock = stock <= 0;

                return (
                  <div
                    key={p.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-[#febd69]/60 transition shadow-lg space-y-3 group"
                  >
                    <div className="space-y-2.5">
                      {/* Image Thumbnail */}
                      <div className="h-44 bg-slate-950 rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                        <img
                          src={
                            p.images?.[0] ||
                            'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                        />
                        {/* Stock Badge */}
                        <div className="absolute top-2 left-2">
                          {isOutOfStock ? (
                            <span className="bg-rose-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="bg-amber-500/90 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                              Only {stock} Left
                            </span>
                          ) : (
                            <span className="bg-emerald-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                              In Stock
                            </span>
                          )}
                        </div>

                        {/* Prime Badge */}
                        <div className="absolute top-2 right-2">
                          <span className="bg-[#232f3e] text-[#febd69] border border-[#37475a] text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center space-x-1">
                            <Truck className="w-2.5 h-2.5 text-[#febd69]" />
                            <span>PRIME</span>
                          </span>
                        </div>
                      </div>

                      {/* Brand & Category */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span className="uppercase text-amber-400 font-bold tracking-wider truncate max-w-[120px]">
                          {p.brand || p.merchant?.name || 'Verified Vendor'}
                        </span>
                        <span className="capitalize">{p.category}</span>
                      </div>

                      {/* Product Title */}
                      <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug group-hover:text-[#febd69] transition">
                        {p.title}
                      </h4>

                      {/* Rating Stars & Count */}
                      <div className="flex items-center space-x-1.5 text-xs">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(p.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-amber-400 text-[11px]">{p.rating?.toFixed(1) || '5.0'}</span>
                        <span className="text-[10px] text-slate-500">
                          ({p.reviewCount || 42})
                        </span>
                      </div>

                      {/* Price Display */}
                      <div className="flex items-baseline space-x-2 pt-1">
                        <span className="text-lg font-black text-white font-mono">
                          ${p.price.amount.toFixed(2)}
                        </span>
                        {p.pricingDetails?.salePrice && (
                          <span className="text-xs text-slate-500 line-through font-mono">
                            ${p.pricingDetails.regularPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleAddToCartWithNotify(p)}
                        disabled={isOutOfStock}
                        className={`w-full py-2.5 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5 ${
                          isOutOfStock
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 active:scale-95'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View Mode */}
          {!isLoading && !searchError && displayProducts.length > 0 && viewMode === 'list' && (
            <div className="space-y-3">
              {displayProducts.map((p) => {
                const stock = p.totalStock ?? 10;
                const isOutOfStock = stock <= 0;

                return (
                  <div
                    key={p.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#febd69]/60 transition shadow-lg"
                  >
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="w-24 h-24 bg-slate-950 rounded-xl p-2 shrink-0 flex items-center justify-center">
                        <img
                          src={
                            p.images?.[0] ||
                            'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={p.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="space-y-1 truncate">
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="font-bold text-[#febd69] uppercase">
                            {p.brand || p.merchant?.name}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 uppercase font-mono">{p.sku}</span>
                          <span className="text-slate-500">•</span>
                          <span className="capitalize text-slate-400">{p.category}</span>
                        </div>

                        <h4 className="font-bold text-white text-sm line-clamp-1 hover:text-[#febd69]">
                          {p.title}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-1">{p.description}</p>

                        <div className="flex items-center space-x-2 text-xs pt-1">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(p.rating || 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-amber-400 text-xs">{p.rating?.toFixed(1) || '5.0'}</span>
                          <span className="text-[10px] text-slate-500">
                            ({p.reviewCount || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 gap-3">
                      <div className="text-xl font-black text-white font-mono">
                        ${p.price.amount.toFixed(2)}
                      </div>

                      <button
                        onClick={() => handleAddToCartWithNotify(p)}
                        disabled={isOutOfStock}
                        className={`px-5 py-2 font-black text-xs rounded-xl shadow transition flex items-center space-x-1.5 ${
                          isOutOfStock
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 active:scale-95'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Navigation Bar */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                Page <strong className="text-white">{pagination.page}</strong> of{' '}
                <strong className="text-white">{pagination.totalPages}</strong>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={!pagination.hasPrev}
                  className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1 text-xs font-bold transition ${
                    pagination.hasPrev
                      ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                      : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {/* Page numbers */}
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  const isActive = pNum === pagination.page;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition border ${
                        isActive
                          ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={!pagination.hasNext}
                  className={`px-3 py-1.5 rounded-lg border flex items-center space-x-1 text-xs font-bold transition ${
                    pagination.hasNext
                      ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                      : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Search Analytics Modal */}
      {isAnalyticsOpen && analyticsData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-sky-400" />
                <h3 className="font-black text-white text-base">Search Telemetry &amp; Discovery Analytics</h3>
              </div>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Snapshot Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Queries Logged</div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {analyticsData.totalSearches}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Zero-Result Searches</div>
                <div className="text-2xl font-black text-rose-400 font-mono mt-1">
                  {analyticsData.zeroResultSearchesCount}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-400">Avg Execution Latency</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {analyticsData.averageLatencyMs} ms
                </div>
              </div>
            </div>

            {/* Top Search Queries Table */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Top Searched Queries</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs">
                {analyticsData.topQueries.length === 0 ? (
                  <div className="p-3 text-slate-500 text-center">No search logs recorded yet.</div>
                ) : (
                  analyticsData.topQueries.map((t, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-slate-300">
                      <span className="font-medium text-white">&quot;{t.query}&quot;</span>
                      <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[11px] text-amber-300">
                        {t.count} times
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Zero Result Queries */}
            {analyticsData.zeroResultQueries.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-rose-400 text-xs uppercase tracking-wider">
                  Zero-Result Queries (Discovery Gaps)
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800 text-xs">
                  {analyticsData.zeroResultQueries.map((zq, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-slate-300">
                      <span className="font-medium text-rose-300">&quot;{zq.query}&quot;</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(zq.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Usage Distribution */}
            {analyticsData.filterUsage.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Popular Filter Facets</h4>
                <div className="flex flex-wrap gap-2">
                  {analyticsData.filterUsage.map((fu, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-sky-300"
                    >
                      {fu.filterName}: <strong className="text-white">{fu.count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reset / Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={handleClearAnalytics}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-bold"
              >
                Reset Analytics Logs
              </button>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Strategy Configuration Modal */}
      {isWeightsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">Configurable Ranking Strategy Weights</h3>
              </div>
              <button
                onClick={() => setIsWeightsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Commerce Zon weights prioritize textual relevance (Exact Name, SKU, Prefix, Keywords) over popularity.
            </p>

            {weightsSavedMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Weights successfully applied and search cache invalidated.</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              {[
                { key: 'exactName', label: 'Exact Title Match Weight' },
                { key: 'namePrefix', label: 'Title Prefix Match Weight' },
                { key: 'nameKeyword', label: 'Title Keyword Match Weight' },
                { key: 'skuMatch', label: 'SKU / Model Match Weight' },
                { key: 'brandMatch', label: 'Brand Match Weight' },
                { key: 'categoryMatch', label: 'Category Match Weight' },
                { key: 'tagMatch', label: 'Tags Match Weight' },
                { key: 'descriptionMatch', label: 'Description Match Weight' },
                { key: 'ratingWeight', label: 'Rating Signal Boost' },
                { key: 'popularityWeight', label: 'Popularity & Sales Boost' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-300 font-medium">{label}</span>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={rankingWeights[key as keyof SearchRankingWeights]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10) || 0;
                      setRankingWeights({ ...rankingWeights, [key]: val });
                    }}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-right text-amber-400 font-mono font-bold focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                onClick={() => {
                  setRankingWeights({ ...DEFAULT_SEARCH_WEIGHTS });
                  setWeightsSavedMessage(true);
                  setTimeout(() => setWeightsSavedMessage(false), 2500);
                }}
                className="text-xs text-slate-400 hover:text-white underline font-bold"
              >
                Reset to Defaults
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => setIsWeightsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
