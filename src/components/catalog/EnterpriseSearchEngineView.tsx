import React, { useState } from 'react';
import { Product } from '../../types/domain';
import { MOCK_SYNONYM_DICTIONARY, MOCK_SEARCH_SUGGESTIONS } from '../../data/catalogMockData';
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
} from 'lucide-react';

interface EnterpriseSearchEngineViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const EnterpriseSearchEngineView: React.FC<EnterpriseSearchEngineViewProps> = ({
  products,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiMode, setIsAiMode] = useState(true);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Multi-Faceted Filters
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [primeOnly, setPrimeOnly] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  // Search Architecture State
  const [typoCorrection, setTypoCorrection] = useState<string | null>(null);
  const [matchedSynonyms, setMatchedSynonyms] = useState<string[]>([]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);

    // Typo Correction Simulator
    if (val.toLowerCase().includes('titn') || val.toLowerCase().includes('tatn')) {
      setTypoCorrection('Titan Workstation');
    } else if (val.toLowerCase().includes('cobt') || val.toLowerCase().includes('robt')) {
      setTypoCorrection('Autonomous Cobot');
    } else {
      setTypoCorrection(null);
    }

    // Synonym Matching
    const foundSyn = MOCK_SYNONYM_DICTIONARY.find((s) =>
      val.toLowerCase().includes(s.term.toLowerCase())
    );
    if (foundSyn) {
      setMatchedSynonyms(foundSyn.synonyms);
    } else {
      setMatchedSynonyms([]);
    }
  };

  const handleVoiceSearch = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      handleSearchChange('Titan Workstation X9 64GB');
    }, 2500);
  };

  const handleImageSearch = () => {
    setIsUploadingImage(true);
    setTimeout(() => {
      setIsUploadingImage(false);
      handleSearchChange('Cobot Arm');
    }, 2000);
  };

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesKeyword =
      !term ||
      p.title.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      (p.brand && p.brand.toLowerCase().includes(term)) ||
      p.tags.some((t) => t.toLowerCase().includes(term));

    const matchesPrice = p.price.amount >= minPrice && p.price.amount <= maxPrice;
    const matchesRating = p.rating >= minRating;
    const matchesStock = !inStockOnly || p.totalStock > 0;
    const matchesBrand =
      selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));

    return matchesKeyword && matchesPrice && matchesRating && matchesStock && matchesBrand;
  });

  const availableBrands = Array.from(
    new Set(products.map((p) => p.brand || 'Apex Enterprise'))
  );

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-black text-white flex items-center space-x-2">
              <Search className="w-5 h-5 text-[#febd69]" />
              <span>Elasticsearch Enterprise Vector & Hybrid Search Engine</span>
            </h2>
            <p className="text-xs text-slate-400">
              Sub-millisecond query execution, AI Intent Matching, Voice Search & Computer Vision
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAiMode(!isAiMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                isAiMode
                  ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAiMode ? 'Vector Semantic AI ON' : 'Keyword Only'}</span>
            </button>
          </div>
        </div>

        {/* Big Search Input Bar */}
        <div className="relative">
          <div className="flex items-center bg-slate-950 border-2 border-amber-500/50 focus-within:border-[#febd69] rounded-2xl px-4 py-3 shadow-2xl transition">
            <Search className="w-5 h-5 text-[#febd69] mr-3 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search millions of products by SKU, GTIN, Brand, Specification..."
              className="bg-transparent text-white font-bold text-sm focus:outline-none w-full"
            />

            {/* Voice & Image Search Buttons */}
            <div className="flex items-center space-x-2 ml-2">
              <button
                onClick={handleVoiceSearch}
                title="Voice Search"
                className={`p-2 rounded-xl transition ${
                  isRecordingVoice ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                onClick={handleImageSearch}
                title="Image Visual Search"
                className={`p-2 rounded-xl transition ${
                  isUploadingImage ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice / Image Processing Alert */}
          {isRecordingVoice && (
            <div className="mt-2 p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center space-x-2">
              <Mic className="w-4 h-4 animate-bounce text-rose-400" />
              <span>Listening to Voice Command... Speak your product prompt.</span>
            </div>
          )}

          {isUploadingImage && (
            <div className="mt-2 p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center space-x-2">
              <Camera className="w-4 h-4 animate-pulse text-amber-400" />
              <span>Extracting visual embeddings & matching catalog images...</span>
            </div>
          )}

          {/* Typo Correction Bar */}
          {typoCorrection && (
            <div className="mt-2 p-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span>Did you mean: </span>
                <button
                  onClick={() => handleSearchChange(typoCorrection)}
                  className="font-bold text-[#febd69] underline ml-1"
                >
                  {typoCorrection}
                </button>
                ?
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Elasticsearch Levenshtein Distance = 1</span>
            </div>
          )}

          {/* Synonym Suggestions */}
          {matchedSynonyms.length > 0 && (
            <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="font-bold text-amber-300">Synonyms Expansion:</span>
              {matchedSynonyms.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchChange(s)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Faceted Filter Matrix */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-5 shadow-xl h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#febd69]" />
              <span>Multi-Faceted Filters</span>
            </h3>

            <button
              onClick={() => {
                setMinPrice(0);
                setMaxPrice(20000);
                setMinRating(0);
                setSelectedBrands([]);
                setInStockOnly(false);
                setPrimeOnly(false);
              }}
              className="text-[10px] text-amber-400 hover:underline font-bold"
            >
              Reset All
            </button>
          </div>

          {/* Price Slider */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">Price Range ($)</label>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
            <input
              type="range"
              min={0}
              max={20000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <label className="text-xs font-bold text-slate-300 block">Customer Rating</label>
            <div className="space-y-1 text-xs">
              {[4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={`w-full p-1.5 rounded-lg text-left flex items-center justify-between transition ${
                    minRating === stars ? 'bg-amber-500/20 border border-amber-500/40' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < stars ? 'fill-amber-400' : 'text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-300 font-bold">& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Selection */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <label className="text-xs font-bold text-slate-300 block">Brands</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {availableBrands.map((b) => (
                <label key={b} className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedBrands([...selectedBrands, b]);
                      else setSelectedBrands(selectedBrands.filter((x) => x !== b));
                    }}
                    className="accent-amber-500 rounded"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fulfillment Perks */}
          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer text-slate-200">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span className="font-bold">In Stock Only</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-sky-300">
              <input
                type="checkbox"
                checked={primeOnly}
                onChange={(e) => setPrimeOnly(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span className="font-bold flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Prime 1-Day Express Only</span>
              </span>
            </label>
          </div>
        </div>

        {/* Right Side Search Results */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div>
              Showing <strong className="text-white">{filteredProducts.length}</strong> vector search results
            </div>

            <div className="text-[10px] text-emerald-400 font-bold">
              Elasticsearch Latency: 12ms
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500 transition shadow-lg space-y-3"
              >
                <div className="space-y-2">
                  <div className="h-36 bg-slate-950 rounded-xl p-2 flex items-center justify-center">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 uppercase">{p.category}</div>

                  <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug">{p.title}</h4>

                  <div className="flex items-center space-x-1 text-xs">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-amber-400">{p.rating}</span>
                  </div>

                  <div className="text-base font-extrabold text-white font-mono">
                    ${p.price.amount.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(p)}
                  className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black text-xs rounded-xl shadow transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
