import React, { useState } from 'react';
import { 
  Search, Mic, Image, Sparkles, Filter, CheckCircle2, ArrowRight, Volume2, Globe, Laptop, Smartphone, AlertCircle, RefreshCw, Star, Truck, ShieldCheck
} from 'lucide-react';
import { ProductSearchResult, SearchQueryAnalysis } from '../../types/aiEngine';
import { MOCK_PRODUCTS } from '../../data/mockAiEngineData';

export const AiSearchEngineView: React.FC = () => {
  const [query, setQuery] = useState('Best gaming laptop under my budget');
  const [selectedLang, setSelectedLang] = useState<string>('en-US');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [imageSearchFile, setImageSearchFile] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [queryAnalysis, setQueryAnalysis] = useState<SearchQueryAnalysis>({
    originalQuery: 'Best gaming laptop under my budget',
    correctedQuery: undefined,
    detectedIntent: 'High-end gaming laptop purchase with RTX GPU preference',
    extractedAttributes: {
      category: 'Laptops & Computers',
      maxPrice: 3500,
      targetUser: 'Gamer / Power User',
      brand: 'ASUS ROG'
    },
    language: 'English (en-US)',
    suggestedQueries: [
      'RTX 4090 Gaming Laptops',
      'Asus ROG Strix Scar 18 Specs',
      'Gaming Laptops with 240Hz Nebula Display'
    ]
  });

  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>(MOCK_PRODUCTS);

  const sampleQueries = [
    'Best gaming laptop under my budget',
    'Running shoes for beginners',
    'Black wireless headphones',
    'Curved OLED gaming monitor 240Hz',
    'laptp with rtx4090' // intentional typo
  ];

  const handleExecuteSearch = (searchStr: string) => {
    setIsSearching(true);
    setQuery(searchStr);

    setTimeout(() => {
      let corrected: string | undefined = undefined;
      let intent = 'Specific product discovery';

      if (searchStr.includes('laptp')) {
        corrected = searchStr.replace('laptp', 'laptop');
      }

      if (searchStr.toLowerCase().includes('laptop') || searchStr.toLowerCase().includes('budget')) {
        intent = 'High-end laptop search intent with budget constraint';
        setSearchResults([MOCK_PRODUCTS[0], MOCK_PRODUCTS[3], MOCK_PRODUCTS[5]]);
      } else if (searchStr.toLowerCase().includes('shoes') || searchStr.toLowerCase().includes('running')) {
        intent = 'Athletic footwear & beginner running gear intent';
        setSearchResults([MOCK_PRODUCTS[2]]);
      } else if (searchStr.toLowerCase().includes('headphones') || searchStr.toLowerCase().includes('wireless')) {
        intent = 'Noise-cancelling audio headset intent';
        setSearchResults([MOCK_PRODUCTS[1], MOCK_PRODUCTS[4]]);
      } else {
        setSearchResults(MOCK_PRODUCTS);
      }

      setQueryAnalysis({
        originalQuery: searchStr,
        correctedQuery: corrected,
        detectedIntent: intent,
        extractedAttributes: {
          category: searchStr.includes('shoe') ? 'Footwear' : searchStr.includes('headphone') ? 'Audio' : 'Laptops',
          maxPrice: searchStr.includes('budget') ? 3500 : 5000,
          targetUser: 'Primary Shopper'
        },
        language: selectedLang,
        suggestedQueries: [
          `${searchStr} reviews & ratings`,
          `${searchStr} top sellers 2026`,
          `${searchStr} fast delivery prime`
        ]
      });

      setIsSearching(false);
    }, 600);
  };

  const handleSimulateVoice = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      handleExecuteSearch('Black wireless headphones');
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImageSearchFile(evt.target?.result as string);
        handleExecuteSearch('Sony WH-1000XM5 Wireless Noise Cancelling Headphones');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Search Input Bar */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Multimodal & Natural Language Search Engine</h2>
              <p className="text-xs text-slate-400">Semantic vector embeddings, typo autocorrect & query intent extraction</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-bold focus:outline-none"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Spanish (Español)</option>
              <option value="ja-JP">Japanese (日本語)</option>
              <option value="de-DE">German (Deutsch)</option>
              <option value="fr-FR">French (Français)</option>
            </select>
          </div>
        </div>

        {/* Main Search Bar Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-amber-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch(query)}
            placeholder="Search with natural language e.g. 'Best gaming laptop under my budget'..."
            className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 rounded-xl pl-12 pr-32 py-3.5 text-sm text-white font-semibold focus:outline-none transition shadow-inner"
          />

          <div className="absolute right-3 flex items-center space-x-2">
            {/* Voice Search Button */}
            <button
              onClick={handleSimulateVoice}
              className={`p-2 rounded-lg border transition ${
                isRecordingVoice
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
              title="Voice Search Architecture"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Image Search Button */}
            <label 
              className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 cursor-pointer"
              title="Image Visual Query Search"
            >
              <Image className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            <button
              onClick={() => handleExecuteSearch(query)}
              disabled={isSearching}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition shadow flex items-center space-x-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSearching ? 'Searching...' : 'AI Search'}</span>
            </button>
          </div>
        </div>

        {/* Suggested Quick Natural Language Queries */}
        <div className="flex items-center space-x-2 overflow-x-auto text-xs pt-1">
          <span className="text-slate-400 font-bold whitespace-nowrap">Try Prompts:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleExecuteSearch(q)}
              className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-amber-300 whitespace-nowrap transition text-[11px]"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Query Understanding & Semantic Extraction Card */}
      {queryAnalysis && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Vector Intent & Query Parsing Analysis</span>
            </h3>

            {queryAnalysis.correctedQuery && (
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Typo Auto-Corrected to: "{queryAnalysis.correctedQuery}"
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold mb-1">Detected Intent</span>
              <p className="text-white font-bold">{queryAnalysis.detectedIntent}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold mb-1">Extracted Attributes</span>
              <div className="flex flex-wrap gap-1">
                {Object.entries(queryAnalysis.extractedAttributes).map(([k, v]) => (
                  <span key={k} className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 text-[10px] font-mono">
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold mb-1">Semantic Query Expansion</span>
              <div className="flex flex-wrap gap-1">
                {queryAnalysis.suggestedQueries.map((sq, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px]">
                    {sq}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Results Grid with Relevance Scores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>AI Ranked Results</span>
            <span className="text-xs font-mono text-amber-400">({searchResults.length} Products Found)</span>
          </h3>

          <span className="text-xs text-slate-400 font-mono">Ranked by Vector Similarity + Conversion Rate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((prod) => (
            <div 
              key={prod.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="relative h-44 rounded-lg overflow-hidden bg-slate-950">
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-950/90 text-amber-400 font-mono font-black text-xs border border-amber-500/40 shadow">
                    Match: {prod.relevanceScore}%
                  </div>

                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>{prod.deliverySpeedDays === 1 ? '1-Day Prime' : '2-Day Shipping'}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{prod.brand} • {prod.category}</div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{prod.title}</h4>
                </div>

                {/* AI Match Explanation Pill */}
                <div className="p-2 bg-slate-950 rounded-lg border border-purple-500/30 text-[11px] text-purple-200 space-y-0.5">
                  <span className="font-bold text-purple-400 block text-[10px] uppercase">AI Match Reason</span>
                  <p className="line-clamp-2">{prod.aiMatchReason}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-base font-black text-white font-mono">${prod.price.toFixed(2)}</div>
                    {prod.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through font-mono">${prod.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-[10px] text-slate-400">({prod.reviewCount})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Sold by {prod.sellerName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">In Stock: <strong className="text-emerald-400 font-mono">{prod.inStockCount}</strong></span>
                <button
                  onClick={() => alert(`Added ${prod.title} to Cart!`)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
