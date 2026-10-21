import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Download,
  Key,
  ExternalLink,
  Code,
  FileText,
  Clock,
  Layers,
  Star,
  Sparkles,
  Zap,
  Copy,
  Wallet,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Volume2
} from 'lucide-react';
import { DigitalProduct, LicenseType } from '../../domain/digital/DigitalProductTypes';
import { digitalMarketplaceClient } from '../../services/digitalMarketplaceClient';

interface DigitalProductDetailModalProps {
  product: DigitalProduct | null;
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onVaultUpdated?: () => void;
  onNavigateToVault?: () => void;
}

export const DigitalProductDetailModal: React.FC<DigitalProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  walletBalance,
  onVaultUpdated,
  onNavigateToVault
}) => {
  const [selectedTier, setSelectedTier] = useState<LicenseType>('standard');
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'preview' | 'changelog'>('overview');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CARD'>('WALLET');

  // Checkout states
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Audio preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !product) return null;

  const currentTierInfo = product.licenseTiers[selectedTier];
  const canAffordWithWallet = walletBalance >= currentTierInfo.price;

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const res = await digitalMarketplaceClient.checkout({
        productId: product.id,
        licenseType: selectedTier,
        paymentMethod,
        buyerId: 'prime-customer-01',
        buyerEmail: 'customer@commercezon.dev'
      });

      if (res.success) {
        setOrderResult(res);
        if (onVaultUpdated) onVaultUpdated();
      }
    } catch (err: any) {
      setCheckoutError(err.message || 'Digital checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleCopy = (text: string, type: 'key' | 'hash') => {
    navigator.clipboard?.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-start space-x-3.5">
            <img
              src={product.thumbnailUrl}
              alt={product.title}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase font-bold">
                  {product.categoryLabel}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Instant Delivery: 0s
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  v{product.version}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                {product.title}
              </h2>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center space-x-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating.toFixed(2)}</span>
                  <span className="text-slate-500 font-normal">({product.reviewsCount} verified reviews)</span>
                </span>
                <span>•</span>
                <span>{product.downloadsCount.toLocaleString()} active downloads</span>
                <span>•</span>
                <span>By {product.author.name}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Tabs */}
        {orderResult ? (
          /* Instant Delivery Success Receipt */
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <div>
                <h3 className="text-lg font-black text-white">Digital Fulfillment Completed!</h3>
                <p className="text-xs text-emerald-300 mt-0.5 font-mono">
                  Order #{orderResult.order.orderId} • Instant Cryptographic License Issued
                </p>
              </div>
            </div>

            {/* License & Download Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Your Master Cryptographic License Key
                </span>
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-indigo-300 tracking-wider">
                    {orderResult.order.licenseKey}
                  </span>
                  <button
                    onClick={() => handleCopy(orderResult.order.licenseKey, 'key')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition flex items-center space-x-1"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">License Tier</span>
                  <span className="text-xs font-bold text-white uppercase">{orderResult.order.licenseType}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">File Format</span>
                  <span className="text-xs font-bold text-white">{product.fileFormat}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">Package Size</span>
                  <span className="text-xs font-bold text-white">{product.fileSize}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    alert(`Initiating download for ${product.title} (${product.fileFormat}) via token: ${orderResult.order.downloadToken}`);
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Package Now ({product.fileSize})</span>
                </button>
                {onNavigateToVault && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToVault();
                    }}
                    className="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
                  >
                    <span>View in My Software Locker</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Standard Product View & Tier Selector */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* License Tier Selection Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase font-bold text-slate-300 tracking-wider">
                  Select License Tier
                </label>
                <span className="text-[11px] text-indigo-400 font-mono">
                  100% Cryptographic Verification Included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['standard', 'commercial', 'extended'] as LicenseType[]).map((tierKey) => {
                  const tier = product.licenseTiers[tierKey];
                  const isSelected = selectedTier === tierKey;

                  return (
                    <div
                      key={tierKey}
                      onClick={() => setSelectedTier(tierKey)}
                      className={`p-4 rounded-xl border cursor-pointer transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {tierKey === 'commercial' && (
                        <span className="absolute -top-2.5 right-3 text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500 text-white shadow-sm">
                          Most Popular
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{tier.name}</span>
                          <span className="text-base font-black font-mono text-[#febd69]">
                            ${tier.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {tier.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1">
                        <div className="text-[10px] font-mono text-slate-300 flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{tier.seats === 999 ? 'Unlimited' : `${tier.seats}`} Developer Seat(s)</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-300 flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{tier.updatesMonths} Months Free Updates</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Overview & Specs
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'files'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Included Files ({product.includedFiles.length})
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Live Preview Sandbox</span>
              </button>
              <button
                onClick={() => setActiveTab('changelog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'changelog'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Changelog History
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                    Technologies & Frameworks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features of Selected Tier */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                    Included with {currentTierInfo.name}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTierInfo.features.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Included Files & Integrity Checksum */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SHA-256 Checksum</span>
                    </span>
                    <button
                      onClick={() => handleCopy(product.checksumSha256, 'hash')}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center space-x-1"
                    >
                      <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 break-all select-all">
                    {product.checksumSha256}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">
                    Package Hierarchy ({product.fileFormat} • {product.fileSize})
                  </span>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
                    {product.includedFiles.map((file, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Live Preview Sandbox */}
            {activeTab === 'preview' && (
              <div className="space-y-4">
                {product.codeSnippetPreview ? (
                  <div>
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-t-xl border border-b-0 border-slate-800 font-mono text-[11px] text-slate-400">
                      <span>{product.codeSnippetPreview.filename}</span>
                      <span className="uppercase text-indigo-400">{product.codeSnippetPreview.language}</span>
                    </div>
                    <pre className="p-4 bg-black/90 border border-slate-800 rounded-b-xl overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed">
                      <code>{product.codeSnippetPreview.code}</code>
                    </pre>
                  </div>
                ) : product.audioPreviewUrl ? (
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
                    <Volume2 className="w-10 h-10 text-indigo-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Audio Stem Preview</h4>
                    <p className="text-xs text-slate-400">24-bit 48kHz lossless analog preview</p>
                    <audio controls className="w-full max-w-md mx-auto pt-2">
                      <source src={product.audioPreviewUrl} type="audio/mpeg" />
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <ExternalLink className="w-8 h-8 text-indigo-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Interactive Sandbox & Documentation</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Explore live components, Storybook documentation, and production examples.
                    </p>
                    {product.previewUrl && (
                      <a
                        href={product.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
                      >
                        <span>Launch Live Sandbox</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Changelog */}
            {activeTab === 'changelog' && (
              <div className="space-y-4">
                {product.changelog.map((entry, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-400">{entry.version}</span>
                      <span className="text-[11px] font-mono text-slate-500">{entry.date}</span>
                    </div>
                    <ul className="space-y-1">
                      {entry.changes.map((c, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Checkout Error */}
            {checkoutError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer / Checkout Action Bar */}
        {!orderResult && (
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Payment Method Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold mr-1">Pay With:</span>
              <button
                type="button"
                onClick={() => setPaymentMethod('WALLET')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border ${
                  paymentMethod === 'WALLET'
                    ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wallet (${walletBalance.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border ${
                  paymentMethod === 'CARD'
                    ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>
            </div>

            {/* Total & Checkout Button */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Due</span>
                <span className="text-xl font-black font-mono text-[#febd69]">
                  ${currentTierInfo.price} USD
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkingOut || (paymentMethod === 'WALLET' && !canAffordWithWallet)}
                className="px-6 py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl flex items-center space-x-2 disabled:opacity-50"
              >
                {checkingOut ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-current" />
                )}
                <span>Authorize & Fulfill Instantly</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
