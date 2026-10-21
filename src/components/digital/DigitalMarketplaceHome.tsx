import React, { useState, useEffect } from 'react';
import {
  Code,
  Search,
  Filter,
  Sparkles,
  Zap,
  Folder,
  Key,
  Download,
  Star,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  Server
} from 'lucide-react';
import { DigitalProduct, DigitalCategory, LicenseType } from '../../domain/digital/DigitalProductTypes';
import { digitalMarketplaceClient } from '../../services/digitalMarketplaceClient';
import { DigitalProductDetailModal } from './DigitalProductDetailModal';
import { DigitalCustomerVault } from './DigitalCustomerVault';
import { DigitalCreatorStudio } from './DigitalCreatorStudio';
import { DigitalLicenseCheckerModal } from './DigitalLicenseCheckerModal';

interface DigitalMarketplaceHomeProps {
  walletBalance: number;
  onSwitchToPhysical: () => void;
}

export const DigitalMarketplaceHome: React.FC<DigitalMarketplaceHomeProps> = ({
  walletBalance,
  onSwitchToPhysical
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'vault' | 'creator' | 'validator'>('catalog');
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [vaultCount, setVaultCount] = useState<number>(2);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isValidatorModalOpen, setIsValidatorModalOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await digitalMarketplaceClient.getProducts({
        category: selectedCategory,
        q: searchQuery,
        sortBy
      });
      setProducts(res.products);
    } catch (err: any) {
      console.error('Failed to load digital catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVaultCount = async () => {
    try {
      const res = await digitalMarketplaceClient.getVault();
      setVaultCount(res.count);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    fetchVaultCount();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = [
    { id: 'all', label: 'All Software' },
    { id: 'saas_boilerplates', label: 'SaaS Boilerplates' },
    { id: 'developer_tools', label: 'Developer Tools' },
    { id: 'game_assets', label: '3D & Game Assets' },
    { id: 'ui_ux_kits', label: 'UI/UX & Figma Kits' },
    { id: 'audio_music', label: 'Audio & Synth Stems' },
    { id: 'devops_scripts', label: 'DevOps & GitOps' },
    { id: 'ai_prompts', label: 'AI Prompts & Agents' },
    { id: 'ebooks_guides', label: 'E-Books & Systems' }
  ];

  const featuredProduct = products.find(p => p.isFeatured) || products[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Digital Platform Sub-Header Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-[73px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sub-tab Navigation */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('catalog')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                activeSubTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Digital Catalog</span>
            </button>

            <button
              onClick={() => setActiveSubTab('vault')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                activeSubTab === 'vault'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer Vault</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-emerald-400 font-black">
                {vaultCount}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('creator')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 ${
                activeSubTab === 'creator'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => setIsValidatorModalOpen(true)}
              className="px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1.5 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>License Validator</span>
            </button>
          </div>

          {/* Quick Switcher Back to Physical */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Mode 2 of 4: Digital Marketplace
            </span>
            <button
              onClick={onSwitchToPhysical}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#febd69] font-bold text-xs transition border border-slate-700 flex items-center space-x-1"
            >
              <span>Switch to Physical Market</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {/* Render Active Sub-View */}
        {activeSubTab === 'vault' ? (
          <DigitalCustomerVault
            onBrowseCatalog={() => setActiveSubTab('catalog')}
            onOpenLicenseChecker={() => setIsValidatorModalOpen(true)}
          />
        ) : activeSubTab === 'creator' ? (
          <DigitalCreatorStudio
            onProductCreated={() => {
              fetchProducts();
              setActiveSubTab('catalog');
            }}
          />
        ) : (
          /* Catalog View */
          <div className="space-y-8">
            {/* Hero Banner tailored for software & digital goods */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>Commerce Zon Digital Engine • Zero Shipping Friction</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Instant Software, SaaS Boilerplates & Digital Licenses
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Engineered for developers, digital creators, and high-velocity startups. Verified source code, cryptographically signed licenses, and instant customer vault delivery.
                </p>

                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Delivery Time</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">0.02 Seconds</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Licensing</span>
                    <span className="text-sm font-bold text-white font-mono">Cryptographic</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Integrity</span>
                    <span className="text-sm font-bold text-indigo-400 font-mono">SHA-256 Validated</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Shipping Cost</span>
                    <span className="text-sm font-bold text-[#febd69] font-mono">$0.00 Forever</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Product Spotlight (if available) */}
            {featuredProduct && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row gap-6 items-center">
                <img
                  src={featuredProduct.thumbnailUrl}
                  alt={featuredProduct.title}
                  className="w-full md:w-64 h-48 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Editor Spotlight
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {featuredProduct.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      v{featuredProduct.version}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{featuredProduct.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {featuredProduct.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuredProduct.techStack.map((tech, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-black font-mono text-[#febd69]">
                        From ${featuredProduct.licenseTiers.standard.price} USD
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({featuredProduct.downloadsCount.toLocaleString()} downloads)
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(featuredProduct);
                        setIsDetailModalOpen(true);
                      }}
                      className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    >
                      <span>Inspect & Get License</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search software, frameworks, boilerplates, or creators..."
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                {/* Sort selector */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400 font-mono">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Recently Updated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="p-16 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-2" />
                <span className="text-xs font-mono">Scanning digital repository...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <Code className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Digital Products Found</h3>
                <p className="text-xs text-slate-400">Try adjusting your keywords or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-indigo-500/40 hover:shadow-2xl transition flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={prod.thumbnailUrl}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-indigo-300 font-bold border border-white/10 uppercase">
                            {prod.categoryLabel}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 font-black">
                            v{prod.version}
                          </span>
                        </div>

                        {/* File Format & Size info */}
                        <div className="absolute bottom-2 left-3 text-[11px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                          {prod.fileFormat} • {prod.fileSize}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                          {prod.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {prod.shortDescription}
                        </p>

                        {/* Tech Stack Pills */}
                        <div className="flex flex-wrap gap-1">
                          {prod.techStack.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {tech}
                            </span>
                          ))}
                          {prod.techStack.length > 3 && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              +{prod.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pricing & Action */}
                    <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-slate-500 block">Starting at</span>
                        <div className="text-base font-black font-mono text-[#febd69]">
                          ${prod.licenseTiers.standard.price} USD
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {prod.previewUrl && (
                          <a
                            href={prod.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                            title="Open Live Preview"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DigitalProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        walletBalance={walletBalance}
        onVaultUpdated={() => {
          fetchVaultCount();
        }}
        onNavigateToVault={() => {
          setActiveSubTab('vault');
        }}
      />

      <DigitalLicenseCheckerModal
        isOpen={isValidatorModalOpen}
        onClose={() => setIsValidatorModalOpen(false)}
      />
    </div>
  );
};
