import React, { useState } from 'react';
import { CategoryNode } from '../../types/domain';
import { MOCK_CATEGORY_TREE } from '../../data/catalogMockData';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Combine,
  ArrowUpDown,
  Check,
  X,
  Search,
  FolderTree,
  Tag,
  Building2,
  Sparkles,
} from 'lucide-react';

export const CategoryManagementView: React.FC = () => {
  const [categories, setCategories] = useState<CategoryNode[]>(MOCK_CATEGORY_TREE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatModal, setSelectedCatModal] = useState<CategoryNode | null>(null);
  const [showCreateCatModal, setShowCreateCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newSubcatInput, setNewSubcatInput] = useState('');
  const [newCollectionInput, setNewCollectionInput] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleHide = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isHidden: !c.isHidden } : c))
    );
    showToast('Category visibility toggled.');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted from taxonomy.');
  };

  const handleCreateCategorySubmit = () => {
    if (!newCatName.trim()) return;
    const newCat: CategoryNode = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatSlug || newCatName.toLowerCase().replace(/\s+/g, '-'),
      subcategories: newSubcatInput
        ? newSubcatInput.split(',').map((s, i) => ({
            id: `sub-${Date.now()}-${i}`,
            name: s.trim(),
            slug: s.trim().toLowerCase().replace(/\s+/g, '-'),
          }))
        : [],
      collections: newCollectionInput ? newCollectionInput.split(',').map((c) => c.trim()) : [],
      productCount: 0,
      isHidden: false,
      displayOrder: categories.length + 1,
    };

    setCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setNewCatSlug('');
    setNewSubcatInput('');
    setNewCollectionInput('');
    setShowCreateCatModal(false);
    showToast(`New Category "${newCat.name}" added to Taxonomy!`);
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#febd69] text-slate-950 font-black px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce text-xs">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <FolderTree className="w-5 h-5 text-[#febd69]" />
            <span>Multi-Level Taxonomy & Category Architecture</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage unlimited Departments, Categories, Subcategories, Brands & Collections
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs w-64">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search taxonomy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none w-full"
            />
          </div>

          <button
            onClick={() => setShowCreateCatModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#febd69] to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Category</span>
          </button>
        </div>
      </div>

      {/* Category Tree Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className={`bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-xl relative transition duration-200 ${
              cat.isHidden ? 'border-rose-500/40 opacity-75' : 'border-slate-800 hover:border-amber-500/40'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] rounded uppercase font-bold">
                    Order #{cat.displayOrder}
                  </span>
                  {cat.isHidden && (
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-bold rounded">
                      HIDDEN
                    </span>
                  )}
                </div>
                <h3 className="text-base font-black text-white mt-1">{cat.name}</h3>
                <div className="text-[11px] font-mono text-slate-400">slug: /{cat.slug}</div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleToggleHide(cat.id)}
                  title="Toggle Visibility"
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  {cat.isHidden ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  title="Delete Category"
                  className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subcategories List */}
            <div className="space-y-2 border-t border-slate-800/80 pt-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center justify-between">
                <span>Subcategories ({cat.subcategories.length})</span>
                <Tag className="w-3.5 h-3.5 text-amber-400" />
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-200">{sub.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">/{sub.slug}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collections Badges */}
            <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Featured Collections</div>
              <div className="flex flex-wrap gap-1.5">
                {cat.collections.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-semibold rounded-md border border-slate-700"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Metrics */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Active Listings:</span>
              <span className="font-black text-amber-300">{cat.productCount} items</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      {showCreateCatModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateCatModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-white flex items-center space-x-2">
              <FolderTree className="w-5 h-5 text-[#febd69]" />
              <span>Add New Taxonomy Node</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Smart Home Robotics"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">URL Slug (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. smart-home-robotics"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Subcategories (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vacuum Bots, Window Cleaners, Mop Drones"
                  value={newSubcatInput}
                  onChange={(e) => setNewSubcatInput(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Collections (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Top Rated 2026, Prime Exclusive"
                  value={newCollectionInput}
                  onChange={(e) => setNewCollectionInput(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateCatModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategorySubmit}
                className="px-5 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
