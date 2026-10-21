import React, { useState, useEffect } from 'react';
import { Product } from '../../types/domain';
import { RecommendationItem } from '../../types/recommendations';
import { recommendationClient } from '../../services/recommendationClient';
import {
  Sparkles,
  SlidersHorizontal,
  Star,
  Check,
  ShoppingCart,
  Info,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { PersonalizationPreferencesModal } from './PersonalizationPreferencesModal';

interface RecommendedForYouSectionProps {
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const RecommendedForYouSection: React.FC<RecommendedForYouSectionProps> = ({
  onAddToCart,
  onSelectProduct,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [activeExplainId, setActiveExplainId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedCategory]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await recommendationClient.getRecommendedForYou(undefined, 6);
      if (res && res.recommendations) {
        setRecommendations(res.recommendations);
        if (res.explanation) setExplanation(res.explanation);
      }
    } catch (err) {
      console.warn('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: RecommendationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item.product);
    recommendationClient.trackInteraction(item.product, 'cart_add');
    setAddedId(item.product.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  const handleCardClick = (item: RecommendationItem) => {
    recommendationClient.trackInteraction(item.product, 'view');
    onSelectProduct(item.product);
  };

  const filteredItems = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter((r) => r.product.category === selectedCategory);

  return (
    <section className="space-y-4 font-sans">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#131921] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-[#febd69] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>AI PERSONALIZED</span>
            </span>
            <span className="text-xs text-amber-300 font-bold flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-Signal Discovery Engine</span>
            </span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Recommended for Your Organization</span>
          </h2>

          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {explanation ||
              'Personalized using your browsing interactions, category affinity weights, and hardware specifications.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#febd69]" />
            <span>Tune Interests</span>
          </button>

          <button
            onClick={fetchRecommendations}
            title="Refresh recommendations"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#febd69]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Recommended Products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 animate-pulse h-80"
            >
              <div className="h-40 bg-slate-800 rounded-xl" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
              <div className="h-8 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#febd69] mx-auto opacity-60" />
          <h3 className="text-sm font-bold text-white">No personalized recommendations yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Interact with products or tune your enterprise interests to receive custom hardware recommendations.
          </p>
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="px-4 py-2 bg-[#febd69] text-slate-950 font-black rounded-xl text-xs"
          >
            Select Your Interests
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const { product } = item;
            const isExplaining = activeExplainId === product.id;
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(item)}
                className="group relative bg-slate-900 border border-slate-800 hover:border-[#febd69]/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-[#febd69]/5 cursor-pointer"
              >
                {/* Top Badge & Match Score Bar */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>{item.score}% Match</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveExplainId(isExplaining ? null : product.id);
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Why was this recommended?"
                    >
                      <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#febd69]" />
                    </button>
                  </div>

                  {/* Why this item was recommended popover */}
                  {isExplaining && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-slate-950 border border-amber-500/40 rounded-xl space-y-1.5 text-[11px] animate-in fade-in zoom-in-95 duration-150 z-20 shadow-xl"
                    >
                      <div className="font-bold text-[#febd69] flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Why Commerce Zon Recommended This:</span>
                      </div>
                      <p className="text-slate-300 leading-snug">{item.reason}</p>
                      {item.matchSignals.matchingTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.matchSignals.matchingTags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-slate-800 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Image */}
                <div className="relative h-44 bg-slate-950 rounded-xl p-3 flex items-center justify-center overflow-hidden mb-3 border border-slate-800/60">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.badge && (
                    <div className="absolute bottom-2 left-2 bg-[#131921]/90 backdrop-blur-sm border border-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.badge}
                    </div>
                  )}
                </div>

                {/* Info Block */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize text-slate-400 font-semibold">{product.category}</span>
                    <span className="text-amber-400/90 font-medium truncate max-w-[120px]">
                      {product.merchant.name}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs leading-snug line-clamp-2 group-hover:text-[#febd69] transition-colors">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1.5 text-[11px]">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-white font-mono">{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="pt-1 flex items-baseline justify-between">
                    <div className="text-lg font-black text-white font-mono">
                      ${product.price.amount.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {product.totalStock > 0 ? `In Stock (${product.totalStock})` : 'Order on Demand'}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-3 border-t border-slate-800/80 mt-3">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(item, e)}
                    className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] active:scale-[0.98] text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preferences Modal */}
      <PersonalizationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesUpdated={fetchRecommendations}
      />
    </section>
  );
};
