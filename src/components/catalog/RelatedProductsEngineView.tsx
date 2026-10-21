import React, { useState, useEffect } from 'react';
import { Product } from '../../types/domain';
import { Sparkles, ShoppingCart, Plus, Check, Star, ArrowRight, Layers, Cpu, Sliders } from 'lucide-react';
import { ProductDetailRecommendations } from '../recommendations/ProductDetailRecommendations';
import { recommendationClient } from '../../services/recommendationClient';
import { PersonalizationPreferencesModal } from '../recommendations/PersonalizationPreferencesModal';

interface RelatedProductsEngineViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const RelatedProductsEngineView: React.FC<RelatedProductsEngineViewProps> = ({
  products,
  onAddToCart,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'prod-01');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-[#febd69] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>PART 12 DISCOVERY</span>
            </span>
            <span className="text-xs text-amber-300 font-bold">Collaborative Filtering & Vector Affinity Engine</span>
          </div>
          <h2 className="text-xl font-black text-white">
            Related Products, Bundling & Complementary Engine
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulate recommendation affinity graphs across any catalog equipment. Inspect real-time bundled add-ons, co-viewing session graphs, and departmental alternatives.
          </p>
        </div>

        <button
          onClick={() => setIsPreferencesOpen(true)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0"
        >
          <Sliders className="w-4 h-4 text-[#febd69]" />
          <span>Tune Personalization</span>
        </button>
      </div>

      {/* Target Product Selector Dropdown */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-white">
          <Layers className="w-4 h-4 text-[#febd69]" />
          <span>Evaluate Recommendation Affinity Graph for Product:</span>
        </div>

        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#febd69] w-full sm:w-auto max-w-md font-semibold"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              [{p.category.toUpperCase()}] {p.title} (${p.price.amount.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {/* Active Evaluation Card */}
      {selectedProduct && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center justify-center shrink-0">
                <img
                  src={selectedProduct.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedProduct.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{selectedProduct.category}</span>
                <h3 className="text-base font-extrabold text-white">{selectedProduct.title}</h3>
                <div className="text-xs text-slate-400">
                  SKU: <span className="font-mono text-slate-300">{selectedProduct.sku}</span> • Sold by{' '}
                  <span className="text-white font-medium">{selectedProduct.merchant.name}</span>
                </div>
              </div>
            </div>

            <div className="text-right sm:text-right shrink-0">
              <div className="text-xl font-black text-white font-mono">${selectedProduct.price.amount.toFixed(2)}</div>
              <span className="text-[10px] text-emerald-400 font-bold">In Stock ({selectedProduct.totalStock} units)</span>
            </div>
          </div>

          {/* Dynamic Recommendations Engine Component */}
          <ProductDetailRecommendations
            product={selectedProduct}
            onAddToCart={onAddToCart}
            onSelectProduct={(p) => setSelectedProductId(p.id)}
          />
        </div>
      )}

      {/* Preferences Modal */}
      <PersonalizationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesUpdated={() => {}}
      />
    </div>
  );
};
