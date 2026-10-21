import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  TrendingUp,
  PackageCheck,
  DollarSign,
  Download,
  Code,
  Tag,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  GitCommit,
  ExternalLink,
  Layers
} from 'lucide-react';
import { DigitalProduct, DigitalCategory } from '../../domain/digital/DigitalProductTypes';
import { digitalMarketplaceClient } from '../../services/digitalMarketplaceClient';

interface DigitalCreatorStudioProps {
  onProductCreated?: () => void;
}

export const DigitalCreatorStudio: React.FC<DigitalCreatorStudioProps> = ({
  onProductCreated
}) => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Version update form
  const [newVersion, setNewVersion] = useState('');
  const [changeLogsText, setChangeLogsText] = useState('');
  const [versionSubmitting, setVersionSubmitting] = useState(false);
  const [versionFeedback, setVersionFeedback] = useState<string | null>(null);

  // New product form
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'saas_boilerplates' as DigitalCategory,
    fileFormat: 'ZIP (.ts, .json, .docker)',
    fileSize: '45 MB',
    standardPrice: 49,
    commercialPrice: 149,
    extendedPrice: 399,
    techStack: 'TypeScript, React, Node.js',
    authorName: 'OmniCore Software Labs',
    previewUrl: 'https://preview.mycompany.io'
  });
  const [publishSubmitting, setPublishSubmitting] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await digitalMarketplaceClient.getProducts();
      setProducts(res.products);
      if (res.products.length > 0 && !selectedProductId) {
        setSelectedProductId(res.products[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishSubmitting(true);
    setPublishError(null);
    setPublishSuccess(null);

    try {
      const stackArray = formData.techStack.split(',').map(s => s.trim()).filter(Boolean);
      const res = await digitalMarketplaceClient.publishProduct({
        ...formData,
        techStack: stackArray
      });

      if (res.success) {
        setPublishSuccess(`Successfully published "${res.product.title}" to Commerce Zon Digital Marketplace!`);
        await fetchProducts();
        if (onProductCreated) onProductCreated();
        setTimeout(() => {
          setIsPublishModalOpen(false);
          setPublishSuccess(null);
        }, 1500);
      }
    } catch (err: any) {
      setPublishError(err.message || 'Failed to publish product');
    } finally {
      setPublishSubmitting(false);
    }
  };

  const handleVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !newVersion.trim()) return;

    setVersionSubmitting(true);
    setVersionFeedback(null);

    try {
      const changes = changeLogsText
        .split('\n')
        .map(l => l.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);

      const res = await digitalMarketplaceClient.releaseVersion(
        selectedProductId,
        newVersion.trim(),
        changes.length ? changes : ['Maintenance and security updates']
      );

      if (res.success) {
        setVersionFeedback(`Version ${newVersion} published successfully! Vault customers notified.`);
        await fetchProducts();
        setTimeout(() => {
          setIsVersionModalOpen(false);
          setVersionFeedback(null);
          setNewVersion('');
          setChangeLogsText('');
        }, 1500);
      }
    } catch (err: any) {
      setVersionFeedback(`Error: ${err.message}`);
    } finally {
      setVersionSubmitting(false);
    }
  };

  // Metrics calculation
  const totalDownloads = products.reduce((acc, p) => acc + p.downloadsCount, 0);
  const totalEstimatedEarnings = products.reduce(
    (acc, p) => acc + p.downloadsCount * p.licenseTiers.standard.price,
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Creator & Developer Studio
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                0% Physical Overhead
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
              Digital Software & Asset Publishing Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Publish developer tools, SaaS boilerplates, 3D assets and audio suites. Manage automated licensing, version releases, and changelogs.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsVersionModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700"
          >
            <GitCommit className="w-4 h-4 text-indigo-400" />
            <span>Release Update</span>
          </button>
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 rounded-xl text-xs font-bold transition shadow-lg flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publish New Asset</span>
          </button>
        </div>
      </div>

      {/* Creator Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Live Products</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono">{products.length}</div>
          <span className="text-[11px] text-emerald-400 mt-0.5 block font-medium">100% Instant Delivery Ready</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Downloads</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono">{totalDownloads.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Across all tiers</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Gross Volume</span>
            <DollarSign className="w-4 h-4 text-[#febd69]" />
          </div>
          <div className="text-2xl font-black text-[#febd69] mt-1 font-mono">${totalEstimatedEarnings.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Automated Escrow Released</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Active License Seats</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 font-mono">1,420+</div>
          <span className="text-[11px] text-purple-400 mt-0.5 block font-medium">Verified Domain Bindings</span>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase font-bold text-white tracking-wider flex items-center space-x-2">
            <span>Published Software & Assets</span>
            <span className="text-[10px] text-slate-400 font-normal">({products.length} Items)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Instant Crypto-License Engine Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Standard</th>
                <th className="py-3 px-4">Commercial</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={p.thumbnailUrl} alt={p.title} className="w-9 h-9 rounded-lg object-cover border border-slate-800" />
                      <div>
                        <div className="font-bold text-white max-w-xs truncate">{p.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{p.fileFormat} • {p.fileSize}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {p.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                    {p.version}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    ${p.licenseTiers.standard.price}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#febd69]">
                    ${p.licenseTiers.commercial.price}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {p.downloadsCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-400 font-bold">
                    ★ {p.rating.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setIsVersionModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-mono transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish New Product Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Plus className="w-5 h-5 text-[#febd69]" />
                <h3 className="text-base font-bold text-white">Publish New Digital Asset</h3>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {publishError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {publishError}
                </div>
              )}
              {publishSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{publishSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. HyperScale - Distributed Go Microservices Boilerplate"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#febd69]"
                  >
                    <option value="saas_boilerplates">SaaS Boilerplates & Starter Kits</option>
                    <option value="developer_tools">Developer Tools & SDKs</option>
                    <option value="game_assets">3D Models & Game Assets</option>
                    <option value="ui_ux_kits">UI/UX Kits & Design Systems</option>
                    <option value="audio_music">Audio, SFX & Synth Presets</option>
                    <option value="ebooks_guides">E-Books & Engineering Guides</option>
                    <option value="ai_prompts">AI Prompts & Agent Systems</option>
                    <option value="devops_scripts">DevOps & Cloud Scripts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">File Format</label>
                  <input
                    type="text"
                    value={formData.fileFormat}
                    onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                    placeholder="e.g. ZIP (.ts, .docker, .json)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Short Description (Catalog hook)</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="High-performance, battle-tested boilerplate for scaling multi-tenant web apps..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Technical Description & Specs</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe architecture, included directories, dependencies, and setup guide..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#febd69]"
                />
              </div>

              {/* Pricing Tiers */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  License Tier Pricing ($ USD)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Standard (1 Seat)</label>
                    <input
                      type="number"
                      min={5}
                      required
                      value={formData.standardPrice}
                      onChange={(e) => setFormData({ ...formData, standardPrice: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Commercial (5 Seats)</label>
                    <input
                      type="number"
                      min={10}
                      required
                      value={formData.commercialPrice}
                      onChange={(e) => setFormData({ ...formData, commercialPrice: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Enterprise (Unlimited)</label>
                    <input
                      type="number"
                      min={20}
                      required
                      value={formData.extendedPrice}
                      onChange={(e) => setFormData({ ...formData, extendedPrice: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="React, TypeScript, Docker, Go"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Live Demo / Docs URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.previewUrl}
                    onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                    placeholder="https://preview.mycompany.io"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishSubmitting}
                  className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  {publishSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Asset Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Release Version Update Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitCommit className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Release Product Version Update</h3>
              </div>
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVersionSubmit} className="p-6 space-y-4">
              {versionFeedback && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs">
                  {versionFeedback}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Target Product</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} (Current: {p.version})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">New Version Tag</label>
                <input
                  type="text"
                  required
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="e.g. v2.5.0 or v1.1.2"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Changelog Bullet Points (One per line)</label>
                <textarea
                  rows={4}
                  required
                  value={changeLogsText}
                  onChange={(e) => setChangeLogsText(e.target.value)}
                  placeholder="• Fixed memory leak in websocket reconnection&#10;• Upgraded core dependencies to latest stable&#10;• Added zero-latency caching layer"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={versionSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                >
                  {versionSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Broadcast Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
