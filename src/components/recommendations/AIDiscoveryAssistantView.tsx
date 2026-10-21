import React, { useState, useEffect } from 'react';
import { Product } from '../../types/domain';
import { RecommendationItem, RecommendationType } from '../../types/recommendations';
import { recommendationClient } from '../../services/recommendationClient';
import {
  Sparkles,
  Bot,
  Send,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Star,
  ShoppingCart,
  RefreshCw,
  HelpCircle,
  Tag,
} from 'lucide-react';
import { PersonalizationPreferencesModal } from './PersonalizationPreferencesModal';

interface AIDiscoveryAssistantViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const SAMPLE_PROMPTS = [
  'I need an automated warehouse packaging cell with collaborative robotics and accessories.',
  'Looking for high-throughput AI inference server hardware with low latency cables under $6,000.',
  'Need a rugged mobile workstation with 14-in-1 dock for field engineering CAD simulation.',
  'What accessories do you recommend for precision 3D metrology and laser scanning?',
];

export const AIDiscoveryAssistantView: React.FC<AIDiscoveryAssistantViewProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const [prompt, setPrompt] = useState('');
  const [budgetMax, setBudgetMax] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [extractedInterests, setExtractedInterests] = useState<string[]>([]);
  const [matchedItems, setMatchedItems] = useState<RecommendationItem[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number>(0);

  // Tab for testing different algorithms
  const [selectedAlgoTab, setSelectedAlgoTab] = useState<'ai' | 'popular' | 'new' | 'similar'>('ai');
  const [popularItems, setPopularItems] = useState<RecommendationItem[]>([]);
  const [newArrivalItems, setNewArrivalItems] = useState<RecommendationItem[]>([]);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    loadCatalogHeuristics();
  }, []);

  const loadCatalogHeuristics = async () => {
    try {
      const [popRes, newRes] = await Promise.all([
        recommendationClient.getPopularProducts(4),
        recommendationClient.getNewArrivals(4),
      ]);
      if (popRes?.recommendations) setPopularItems(popRes.recommendations);
      if (newRes?.recommendations) setNewArrivalItems(newRes.recommendations);
    } catch (e) {
      console.warn('Failed to load heuristics', e);
    }
  };

  const handleRunAIMatch = async (overridePrompt?: string) => {
    const textToRun = overridePrompt || prompt;
    if (!textToRun.trim()) return;

    setLoading(true);
    try {
      const res = await recommendationClient.getAIMatchedRecommendations({
        prompt: textToRun,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        limit: 4,
      });

      setMatchedItems(res.recommendations || []);
      setAiReasoning(res.aiReasoning || '');
      setExtractedInterests(res.extractedInterests || []);
      setUsedFallback(res.usedFallback);
      setLatencyMs(res.latencyMs);
    } catch (err) {
      console.error('Error running AI match:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    recommendationClient.trackInteraction(product, 'cart_add');
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#131921] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-[#febd69] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest flex items-center space-x-1">
                <Bot className="w-3.5 h-3.5" />
                <span>PART 12 AI ENGINE</span>
              </span>
              <span className="text-xs text-amber-300 font-bold flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5" />
                <span>Gemini 3.8 Flash & Deterministic Heuristics</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Discovery & Smart Recommendation Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore Commerce Zon’s intelligent product discovery engine. State your procurement requirements in natural language or inspect multi-signal recommendation graphs with transparent scoring.
            </p>
          </div>

          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="px-4 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center space-x-2 shrink-0"
          >
            <Sliders className="w-4 h-4" />
            <span>Tune Personalization</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedAlgoTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
            selectedAlgoTab === 'ai'
              ? 'bg-[#febd69] text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Interactive AI Hardware Matchmaker</span>
        </button>

        <button
          onClick={() => setSelectedAlgoTab('popular')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
            selectedAlgoTab === 'popular'
              ? 'bg-[#febd69] text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Trending Best Sellers ({popularItems.length})</span>
        </button>

        <button
          onClick={() => setSelectedAlgoTab('new')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
            selectedAlgoTab === 'new'
              ? 'bg-[#febd69] text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>New Catalog Arrivals ({newArrivalItems.length})</span>
        </button>
      </div>

      {/* TAB 1: AI HARDWARE MATCHMAKER */}
      {selectedAlgoTab === 'ai' && (
        <div className="space-y-6">
          {/* Natural Language Input Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Bot className="w-4 h-4 text-[#febd69]" />
                <span>Describe Your Hardware Requirements or Technical Challenge:</span>
              </label>
              <span className="text-[11px] text-slate-400">Strictly resolves to real catalog items</span>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                placeholder="e.g. I need an industrial robotics workstation and high-speed optics for automated factory quality control with a $15k budget..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#febd69] leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Max Budget ($):</span>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-32 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRunAIMatch()}
                  disabled={loading || !prompt.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#febd69] hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Reasoning with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Run AI Recommendation Match</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick sample prompt buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-[#febd69]" />
                <span>Or try a sample procurement prompt:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(p);
                      handleRunAIMatch(p);
                    }}
                    className="text-left text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg px-3 py-1.5 transition"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Result Display */}
          {aiReasoning && (
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-white">AI Recommendation Synthesis</h3>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-mono">
                  <span className={`px-2 py-0.5 rounded ${usedFallback ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'}`}>
                    {usedFallback ? 'Heuristic Rule Fallback' : 'Gemini AI Verified'}
                  </span>
                  {latencyMs > 0 && <span className="text-slate-500">{latencyMs}ms</span>}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                {aiReasoning}
              </p>

              {extractedInterests.length > 0 && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-semibold">Extracted Requirements:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedInterests.map((interest, i) => (
                      <span
                        key={i}
                        className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Real Catalog Items */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Verified Matches from Active Inventory ({matchedItems.length}):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {matchedItems.map((item) => {
                    const { product: prod } = item;
                    const isAdded = addedId === prod.id;

                    return (
                      <div
                        key={prod.id}
                        onClick={() => onSelectProduct(prod)}
                        className="bg-slate-950 border border-slate-800 hover:border-[#febd69]/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 cursor-pointer transition shadow group"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded">
                            {item.score}% Match
                          </span>
                          <span className="text-slate-500 font-mono">Stock: {prod.totalStock}</span>
                        </div>

                        <div className="h-32 bg-slate-900 rounded-xl p-2 flex items-center justify-center">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                            alt={prod.title}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] text-amber-400 font-semibold capitalize">{prod.category}</div>
                          <div className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#febd69] transition">
                            {prod.title}
                          </div>
                          <div className="text-xs font-mono font-extrabold text-white">
                            ${prod.price.amount.toFixed(2)}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(prod, e)}
                          className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1"
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-900" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Transparent Scoring Matrix Explanation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Cpu className="w-4 h-4 text-[#febd69]" />
              <span>Transparent Multi-Signal Ranking Algorithm & Scoring Breakdown</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Commerce Zon’s Part 12 engine ranks catalog items deterministically using weighted signals to avoid opaque hallucinations:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Category Match</div>
                <div className="text-base font-black text-amber-300 font-mono">+35 Pts</div>
                <div className="text-[9px] text-slate-500">Department Alignment</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Tag Overlap</div>
                <div className="text-base font-black text-emerald-400 font-mono">+30 Pts</div>
                <div className="text-[9px] text-slate-500">Spec & Keyword Match</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Price Proximity</div>
                <div className="text-base font-black text-sky-400 font-mono">+15 Pts</div>
                <div className="text-[9px] text-slate-500">Budget Range Parity</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Brand Affinity</div>
                <div className="text-base font-black text-indigo-400 font-mono">+15 Pts</div>
                <div className="text-[9px] text-slate-500">Vendor Loyalty</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Rating & Review</div>
                <div className="text-base font-black text-fuchsia-400 font-mono">+20 Pts</div>
                <div className="text-[9px] text-slate-500">Social Proof Boost</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Stock Availability</div>
                <div className="text-base font-black text-teal-400 font-mono">+5 Pts</div>
                <div className="text-[9px] text-slate-500">Warehouse Readiness</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: POPULAR BEST SELLERS */}
      {selectedAlgoTab === 'popular' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ranked by verified buyer reviews and total platform volume</span>
            <span className="font-mono text-amber-300">Catalog-Derived</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularItems.map((item) => (
              <div
                key={item.product.id}
                onClick={() => onSelectProduct(item.product)}
                className="bg-slate-900 border border-slate-800 hover:border-[#febd69]/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 cursor-pointer transition shadow"
              >
                <div className="h-32 bg-slate-950 rounded-xl p-2 flex items-center justify-center">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="bg-[#febd69] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                  <div className="text-xs font-bold text-white line-clamp-1">{item.product.title}</div>
                  <div className="text-xs font-mono font-extrabold text-white">${item.product.price.amount.toFixed(2)}</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(item.product, e)}
                  className="w-full py-1.5 bg-[#ffd814] text-slate-950 font-bold text-xs rounded-xl"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NEW ARRIVALS */}
      {selectedAlgoTab === 'new' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Freshly onboarded enterprise equipment across all categories</span>
            <span className="font-mono text-emerald-400">Recency Metric</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newArrivalItems.map((item) => (
              <div
                key={item.product.id}
                onClick={() => onSelectProduct(item.product)}
                className="bg-slate-900 border border-slate-800 hover:border-[#febd69]/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 cursor-pointer transition shadow"
              >
                <div className="h-32 bg-slate-950 rounded-xl p-2 flex items-center justify-center">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <span className="bg-sky-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                  <div className="text-xs font-bold text-white line-clamp-1">{item.product.title}</div>
                  <div className="text-xs font-mono font-extrabold text-white">${item.product.price.amount.toFixed(2)}</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(item.product, e)}
                  className="w-full py-1.5 bg-[#ffd814] text-slate-950 font-bold text-xs rounded-xl"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <PersonalizationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesUpdated={loadCatalogHeuristics}
      />
    </div>
  );
};
