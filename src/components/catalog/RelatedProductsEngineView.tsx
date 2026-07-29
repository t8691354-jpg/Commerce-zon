import React, { useState } from 'react';
import { Product } from '../../types/domain';
import { Sparkles, ShoppingCart, Plus, Check, Star, ArrowRight } from 'lucide-react';

interface RelatedProductsEngineViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const RelatedProductsEngineView: React.FC<RelatedProductsEngineViewProps> = ({
  products,
  onAddToCart,
}) => {
  const primaryProduct = products[0] || null;
  const secondaryProduct = products[1] || null;
  const tertiaryProduct = products[2] || null;

  const [bundleAdded, setBundleAdded] = useState(false);

  const bundleTotal = (primaryProduct?.price.amount || 0) + (secondaryProduct?.price.amount || 0);

  const handleAddBundleToCart = () => {
    if (primaryProduct) onAddToCart(primaryProduct);
    if (secondaryProduct) onAddToCart(secondaryProduct);
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
        <h2 className="text-base font-black text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#febd69]" />
          <span>AI-Powered Related Products & Bundle Recommendation Engine</span>
        </h2>
        <p className="text-xs text-slate-400">
          Collaborative Filtering, Vector Graph Affinity, and Frequently Bought Together Bundles
        </p>
      </div>

      {/* Frequently Bought Together Box */}
      {primaryProduct && secondaryProduct && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 p-6 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <span className="bg-[#febd69] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
              FREQUENTLY BOUGHT TOGETHER
            </span>
            <span className="text-xs text-amber-300 font-bold">Bundle & Save Extra 5%</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              {/* Item 1 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 w-36 text-center space-y-2">
                <img
                  src={primaryProduct.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                  alt={primaryProduct.title}
                  referrerPolicy="no-referrer"
                  className="h-20 mx-auto object-contain"
                />
                <div className="text-[11px] font-bold text-white line-clamp-1">{primaryProduct.title}</div>
                <div className="text-xs font-mono font-extrabold text-amber-300">
                  ${primaryProduct.price.amount.toFixed(2)}
                </div>
              </div>

              <div className="p-2 bg-slate-800 rounded-full text-slate-400 font-bold">
                <Plus className="w-4 h-4" />
              </div>

              {/* Item 2 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 w-36 text-center space-y-2">
                <img
                  src={secondaryProduct.images?.[0] || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80'}
                  alt={secondaryProduct.title}
                  referrerPolicy="no-referrer"
                  className="h-20 mx-auto object-contain"
                />
                <div className="text-[11px] font-bold text-white line-clamp-1">{secondaryProduct.title}</div>
                <div className="text-xs font-mono font-extrabold text-amber-300">
                  ${secondaryProduct.price.amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Bundle Checkout Box */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 w-full lg:w-72 text-center lg:text-left">
              <div className="text-xs text-slate-400">Total Price for Both:</div>
              <div className="text-2xl font-black text-white font-mono">${bundleTotal.toFixed(2)}</div>
              <button
                onClick={handleAddBundleToCart}
                className="w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
              >
                {bundleAdded ? <Check className="w-4 h-4 text-emerald-800" /> : <ShoppingCart className="w-4 h-4" />}
                <span>{bundleAdded ? 'Bundle Added to Cart!' : 'Add Both to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Products Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
          <span>Customers Also Bought</span>
          <ArrowRight className="w-4 h-4 text-[#febd69]" />
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg"
            >
              <div className="h-32 bg-slate-950 rounded-xl p-2 flex items-center justify-center">
                <img
                  src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-white text-xs line-clamp-1">{p.title}</h4>
                <div className="text-xs font-mono font-extrabold text-amber-300">
                  ${p.price.amount.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => onAddToCart(p)}
                className="w-full py-1.5 bg-slate-800 hover:bg-[#febd69] hover:text-slate-950 text-slate-200 font-bold rounded-xl text-xs transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
