import React, { useState } from 'react';
import { Product } from '../../types/domain';
import { ProductCatalog } from '../ProductCatalog';
import { CategoryManagementView } from './CategoryManagementView';
import { ProductListingEditorModal } from './ProductListingEditorModal';
import { ProductApprovalWorkflowView } from './ProductApprovalWorkflowView';
import { EnterpriseSearchEngineView } from './EnterpriseSearchEngineView';
import { ProductComparisonMatrix } from './ProductComparisonMatrix';
import { RelatedProductsEngineView } from './RelatedProductsEngineView';
import { ProductReviewsQAView } from './ProductReviewsQAView';
import { ProductAnalyticsView } from './ProductAnalyticsView';
import { BulkCatalogOperationsView } from './BulkCatalogOperationsView';
import { ProductModerationShieldView } from './ProductModerationShieldView';
import { AIDiscoveryAssistantView } from '../recommendations/AIDiscoveryAssistantView';
import {
  ShoppingBag,
  FolderTree,
  Edit3,
  FileCheck2,
  Search,
  Columns,
  Sparkles,
  MessageSquare,
  TrendingUp,
  FileSpreadsheet,
  ShieldAlert,
  Plus,
  Bot,
} from 'lucide-react';

interface ProductCatalogMasterModuleProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAISearch: (prompt: string) => Promise<void>;
  aiSearching: boolean;
  aiExplanation?: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onUpdateProduct: (product: Product) => void;
}

export const ProductCatalogMasterModule: React.FC<ProductCatalogMasterModuleProps> = ({
  products,
  onAddToCart,
  onAISearch,
  aiSearching,
  aiExplanation,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onUpdateProduct,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'catalog'
    | 'discovery_ai'
    | 'search'
    | 'taxonomy'
    | 'approval'
    | 'compare'
    | 'related'
    | 'reviews'
    | 'analytics'
    | 'bulk'
    | 'moderation'
  >('catalog');

  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleOpenNewListing = () => {
    setEditingProduct(null);
    setEditorModalOpen(true);
  };

  const handleOpenEditListing = (prod: Product) => {
    setEditingProduct(prod);
    setEditorModalOpen(true);
  };

  const handleSaveProduct = (updatedProd: Product) => {
    onUpdateProduct(updatedProd);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Module Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-[#febd69] text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-widest">
                MODULE 8 ARCHITECTURE
              </span>
              <span className="text-xs text-amber-300 font-extrabold">
                Commerce Zon Level Catalog & Listing Management
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Enterprise Product Catalog & Search System
            </h1>
          </div>

          <button
            onClick={handleOpenNewListing}
            className="px-5 py-2.5 bg-gradient-to-r from-[#febd69] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product Listing</span>
          </button>
        </div>

        {/* Sub-Tab Navigation Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs font-bold border-t border-slate-800 pt-3">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'catalog'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Prime Store Catalog</span>
          </button>

          <button
            onClick={() => setActiveSubTab('discovery_ai')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'discovery_ai'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>AI Discovery & Matchmaker</span>
          </button>

          <button
            onClick={() => setActiveSubTab('search')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'search'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Elastic Vector Search</span>
          </button>

          <button
            onClick={() => setActiveSubTab('taxonomy')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'taxonomy'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories & Taxonomy</span>
          </button>

          <button
            onClick={() => setActiveSubTab('approval')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'approval'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Approval Workflow</span>
          </button>

          <button
            onClick={() => setActiveSubTab('compare')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'compare'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>Product Comparison</span>
          </button>

          <button
            onClick={() => setActiveSubTab('related')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'related'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Bundles & Related</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'reviews'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews & Q&A</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'analytics'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bulk')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'bulk'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bulk CSV Engine</span>
          </button>

          <button
            onClick={() => setActiveSubTab('moderation')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeSubTab === 'moderation'
                ? 'bg-[#febd69] text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Moderation Shield</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab View Rendering */}
      {activeSubTab === 'catalog' && (
        <ProductCatalog
          products={products}
          onAddToCart={onAddToCart}
          onAISearch={onAISearch}
          aiSearching={aiSearching}
          aiExplanation={aiExplanation}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {activeSubTab === 'discovery_ai' && (
        <AIDiscoveryAssistantView
          products={products}
          onAddToCart={onAddToCart}
          onSelectProduct={(p) => onAddToCart(p)}
        />
      )}

      {activeSubTab === 'search' && (
        <EnterpriseSearchEngineView
          products={products}
          onAddToCart={onAddToCart}
          initialQuery={searchTerm}
          initialCategory={selectedCategory}
        />
      )}

      {activeSubTab === 'taxonomy' && <CategoryManagementView />}

      {activeSubTab === 'approval' && (
        <ProductApprovalWorkflowView products={products} onUpdateProduct={onUpdateProduct} />
      )}

      {activeSubTab === 'compare' && (
        <ProductComparisonMatrix products={products} onAddToCart={onAddToCart} />
      )}

      {activeSubTab === 'related' && (
        <RelatedProductsEngineView products={products} onAddToCart={onAddToCart} />
      )}

      {activeSubTab === 'reviews' && <ProductReviewsQAView />}

      {activeSubTab === 'analytics' && <ProductAnalyticsView products={products} />}

      {activeSubTab === 'bulk' && (
        <BulkCatalogOperationsView products={products} onUpdateProduct={onUpdateProduct} />
      )}

      {activeSubTab === 'moderation' && (
        <ProductModerationShieldView products={products} onUpdateProduct={onUpdateProduct} />
      )}

      {/* Product Listing Editor Modal */}
      <ProductListingEditorModal
        product={editingProduct}
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
