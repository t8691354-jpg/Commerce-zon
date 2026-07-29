import React, { useState } from 'react';
import { MOCK_TAXONOMY_CATEGORIES } from '../../data/mockSuperAdmin';
import { TaxonomyCategory } from '../../types/superAdmin';
import { Layers, FolderTree, Plus, Edit, Trash2, CheckCircle2, Tag, Percent } from 'lucide-react';

export const CategoryTaxonomyEngineView: React.FC = () => {
  const [categories, setCategories] = useState<TaxonomyCategory[]>(MOCK_TAXONOMY_CATEGORIES);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddCategory = () => {
    const newCat: TaxonomyCategory = {
      id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
      name: 'New Department Category',
      slug: 'new-department',
      subcategoriesCount: 0,
      productsCount: 0,
      commissionTierPct: 10.0,
      isFeatured: false,
      status: 'Active',
    };
    setCategories([newCat, ...categories]);
    setNotification('New taxonomy department category added to catalog schema.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-400" />
              Category & Taxonomy Hierarchy Engine
            </h3>
            <p className="text-xs text-slate-400">
              Manage multi-level category taxonomy, attributes, search filter schemas & commission tiers
            </p>
          </div>

          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Main Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{cat.id}</span>
                  <h4 className="font-bold text-slate-100 text-sm">{cat.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">slug: /{cat.slug}</p>
                </div>
                {cat.isFeatured && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] rounded font-bold">
                    Featured
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div>Subcategories: <span className="text-slate-200 font-bold">{cat.subcategoriesCount}</span></div>
                <div>Products: <span className="text-emerald-400 font-bold">{cat.productsCount.toLocaleString()}</span></div>
                <div>Commission Rate: <span className="text-amber-400 font-bold">{cat.commissionTierPct}%</span></div>
                <div>Status: <span className="text-emerald-400 font-bold">{cat.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
