import React, { useState } from 'react';
import { Product } from '../../types/domain';
import {
  Columns,
  Check,
  X,
  Star,
  ShieldCheck,
  Truck,
  Plus,
  Trash2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface ProductComparisonMatrixProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductComparisonMatrix: React.FC<ProductComparisonMatrixProps> = ({
  products,
  onAddToCart,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    products.slice(0, 3).map((p) => p.id)
  );

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

  const handleToggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length < 4) setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <Columns className="w-5 h-5 text-[#febd69]" />
            <span>Side-by-Side Product Comparison Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Compare specs, prices, warranties, return policies, ratings and seller tiers (Up to 4 products)
          </p>
        </div>

        {/* Product selector pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => handleToggleProduct(p.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                selectedIds.includes(p.id)
                  ? 'bg-[#febd69] text-slate-950 font-black shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="truncate max-w-[100px]">{p.title}</span>
              {selectedIds.includes(p.id) && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-slate-800">
          <thead>
            <tr className="bg-slate-950 text-slate-300 font-bold">
              <th className="p-4 w-48 bg-slate-950/80 sticky left-0 z-10">Spec Attribute</th>
              {selectedProducts.map((p) => (
                <th key={p.id} className="p-4 min-w-[220px]">
                  <div className="space-y-2">
                    <div className="h-28 bg-slate-900 border border-slate-800 rounded-xl p-2 flex items-center justify-center">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="font-bold text-white line-clamp-2">{p.title}</div>
                    <button
                      onClick={() => onAddToCart(p)}
                      className="w-full py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-black rounded-lg text-xs"
                    >
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {/* Price */}
            <tr>
              <td className="p-4 font-bold text-amber-300 bg-slate-950/80 sticky left-0">Regular Price</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 font-mono font-extrabold text-white text-sm">
                  ${p.price.amount.toFixed(2)}
                </td>
              ))}
            </tr>

            {/* Brand & Manufacturer */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/80 sticky left-0">Brand / Maker</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-slate-200">
                  {p.brand || 'Apex Enterprise'} ({p.manufacturer || 'Apex Corp'})
                </td>
              ))}
            </tr>

            {/* Customer Rating */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/80 sticky left-0">Customer Rating</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 font-bold text-amber-400 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{p.rating} / 5.0 ({p.reviewCount} reviews)</span>
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/80 sticky left-0">Warranty</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 text-emerald-400 font-semibold">
                  {p.warranty || '3-Year Enterprise Warranty'}
                </td>
              ))}
            </tr>

            {/* Return Policy */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/80 sticky left-0">Return Policy</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4">
                  {p.returnPolicy || '30-Day Money-Back Guarantee'}
                </td>
              ))}
            </tr>

            {/* Seller & Shipping */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/80 sticky left-0">Seller Tier</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded uppercase text-[10px]">
                    {p.merchant.tier} VENDOR
                  </span>
                </td>
              ))}
            </tr>

            {/* Technical Specs */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/80 sticky left-0">Technical Specs</td>
              {selectedProducts.map((p) => (
                <td key={p.id} className="p-4 space-y-1">
                  {Object.entries(p.technicalSpecs || {}).map(([k, v]) => (
                    <div key={k} className="text-[11px]">
                      <span className="font-bold text-slate-400">{k}: </span>
                      <span className="text-slate-200">{v}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
