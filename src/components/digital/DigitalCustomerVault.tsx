import React, { useState, useEffect } from 'react';
import {
  Folder,
  Download,
  Key,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  Clock,
  Server,
  Trash2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode,
  Sparkles
} from 'lucide-react';
import { DigitalVaultItem } from '../../domain/digital/DigitalProductTypes';
import { digitalMarketplaceClient } from '../../services/digitalMarketplaceClient';

interface DigitalCustomerVaultProps {
  onBrowseCatalog: () => void;
  onOpenLicenseChecker: () => void;
}

export const DigitalCustomerVault: React.FC<DigitalCustomerVaultProps> = ({
  onBrowseCatalog,
  onOpenLicenseChecker
}) => {
  const [items, setItems] = useState<DigitalVaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // New activation form state
  const [targetItemForActivation, setTargetItemForActivation] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState('');
  const [activating, setActivating] = useState(false);
  const [activationFeedback, setActivationFeedback] = useState<string | null>(null);

  const fetchVault = async () => {
    setLoading(true);
    try {
      const res = await digitalMarketplaceClient.getVault();
      setItems(res.items);
      if (res.items.length > 0 && !expandedItemId) {
        setExpandedItemId(res.items[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const handleCopyKey = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleRefreshToken = async (vaultItemId: string) => {
    try {
      const res = await digitalMarketplaceClient.refreshToken(vaultItemId);
      if (res.success) {
        setItems(prev =>
          prev.map(item =>
            item.id === vaultItemId
              ? {
                  ...item,
                  downloadToken: res.token,
                  downloadTokenExpiresAt: res.expiresAt,
                  downloadAttemptsRemaining: 10
                }
              : item
          )
        );
      }
    } catch (err: any) {
      alert(`Token refresh error: ${err.message}`);
    }
  };

  const handleRevokeSeat = async (vaultItemId: string, activationId: string) => {
    if (!confirm('Revoke activation for this domain? It will immediately release the seat.')) return;
    try {
      const res = await digitalMarketplaceClient.revokeActivation(vaultItemId, activationId);
      if (res.success) {
        setItems(prev =>
          prev.map(item => {
            if (item.id === vaultItemId) {
              return {
                ...item,
                activations: item.activations.map(a => (a.id === activationId ? { ...a, status: 'revoked' } : a))
              };
            }
            return item;
          })
        );
      }
    } catch (err: any) {
      alert(`Failed to revoke seat: ${err.message}`);
    }
  };

  const handleActivateNewSeat = async (item: DigitalVaultItem) => {
    if (!newDomain.trim()) return;
    setActivating(true);
    setActivationFeedback(null);

    try {
      const res = await digitalMarketplaceClient.activateLicense(item.licenseKey, newDomain.trim());
      if (res.success) {
        setActivationFeedback(`Activated: ${res.message}`);
        setNewDomain('');
        await fetchVault();
      } else {
        setActivationFeedback(`Failed: ${res.message}`);
      }
    } catch (err: any) {
      setActivationFeedback(`Error: ${err.message}`);
    } finally {
      setActivating(false);
    }
  };

  const filteredItems = items.filter(
    item =>
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.licenseTierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
            <Folder className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Customer Software Locker
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Encrypted Vault
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
              My Digital Purchases & Licenses
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Access your signed asset downloads, cryptographic license keys, seat allocations, and SHA-256 integrity verification hashes.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenLicenseChecker}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>License Validator</span>
          </button>
          <button
            onClick={onBrowseCatalog}
            className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse More Assets</span>
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your purchased software by title, license key or tier..."
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <span>Total Licenses: <strong className="text-white">{items.length}</strong></span>
          <span>•</span>
          <span>Active Seats Bound: <strong className="text-emerald-400">{items.reduce((acc, i) => acc + i.activations.filter(a => a.status === 'active').length, 0)}</strong></span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400 mb-2" />
          <span className="text-xs font-mono">Decrypting customer vault items...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <Folder className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Digital Items in Vault</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {searchQuery
              ? 'No matching purchases found. Try clearing your search filter.'
              : 'You have not purchased any digital software or assets yet. Browse the catalog for instant downloads!'}
          </p>
          <button
            onClick={onBrowseCatalog}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition inline-flex items-center space-x-1"
          >
            <span>Explore Digital Marketplace</span>
          </button>
        </div>
      ) : (
        /* Items List */
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;
            const activeSeats = item.activations.filter(a => a.status === 'active');
            const seatsLeft = Math.max(0, item.maxActivations - activeSeats.length);

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition"
              >
                {/* Main Card Bar */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.productThumbnail}
                      alt={item.productTitle}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          {item.licenseTierName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {item.currentVersion}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                          {item.fileFormat} • {item.fileSize}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {item.productTitle}
                      </h3>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2 font-mono">
                        <span>Order #{item.orderId}</span>
                        <span>•</span>
                        <span>Purchased: {new Date(item.purchasedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Key */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* License Key Quick Display */}
                    <div className="p-2 px-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between space-x-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-mono text-slate-500">License Key</span>
                        <span className="text-xs font-mono font-bold text-white tracking-wider">
                          {item.licenseKey}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyKey(item.licenseKey)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                        title="Copy License Key"
                      >
                        {copiedKey === item.licenseKey ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Download Package Button */}
                    <button
                      onClick={() => {
                        alert(`Starting instant download for "${item.productTitle}" (${item.fileFormat}). Token: ${item.downloadToken.slice(0, 14)}...`);
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center justify-center space-x-1.5 shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download ({item.fileSize})</span>
                    </button>

                    {/* Toggle Details */}
                    <button
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition"
                      title={isExpanded ? 'Collapse License Details' : 'Expand License Details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Activations, Checksum, Token Refresh */}
                {isExpanded && (
                  <div className="p-5 bg-slate-950/60 border-t border-slate-800 space-y-5">
                    {/* Security & Checksum Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Checksum Card */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>SHA-256 Integrity Checksum</span>
                          </span>
                          <button
                            onClick={() => handleCopyHash(item.checksumSha256)}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono flex items-center space-x-1"
                          >
                            <span>{copiedHash === item.checksumSha256 ? 'Copied' : 'Copy Hash'}</span>
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="p-2 rounded-lg bg-black/50 font-mono text-[11px] text-slate-300 break-all select-all">
                          {item.checksumSha256}
                        </div>
                      </div>

                      {/* Download Token Validity */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Signed Download Token</span>
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            {item.downloadAttemptsRemaining} downloads left
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            Expires: {new Date(item.downloadTokenExpiresAt).toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleRefreshToken(item.id)}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                            title="Regenerate token if expired"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Refresh Token</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Seat Allocations & Activations Manager */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Server className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">
                            Domain & Machine Seats ({activeSeats.length}/{item.maxActivations} Used)
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {seatsLeft} seat(s) available for activation
                        </span>
                      </div>

                      {/* Active Seats List */}
                      {item.activations.length === 0 ? (
                        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500">
                          No domains or machines bound yet. Bind a production or staging URL below.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.activations.map(act => (
                            <div
                              key={act.id}
                              className={`p-3 rounded-xl border flex items-center justify-between ${
                                act.status === 'active'
                                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                                  : 'bg-slate-950 border-slate-900 text-slate-500 opacity-60'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-mono text-xs font-bold text-white">{act.domainOrDeviceId}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {act.status === 'active' ? `Activated: ${new Date(act.activatedAt).toLocaleDateString()}` : 'Seat Revoked'}
                                </span>
                              </div>
                              {act.status === 'active' && (
                                <button
                                  onClick={() => handleRevokeSeat(item.id, act.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                                  title="Revoke / Deactivate this seat"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add new domain activation bar */}
                      {targetItemForActivation === item.id ? (
                        <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2">
                          <label className="text-[11px] font-bold text-white block">
                            Bind Domain / Hardware ID:
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={newDomain}
                              onChange={(e) => setNewDomain(e.target.value)}
                              placeholder="e.g. api.mysite.com or mac-serial-09"
                              className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-400"
                            />
                            <button
                              type="button"
                              onClick={() => handleActivateNewSeat(item)}
                              disabled={activating}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1"
                            >
                              {activating && <RefreshCw className="w-3 h-3 animate-spin" />}
                              <span>Confirm Seat</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTargetItemForActivation(null);
                                setNewDomain('');
                                setActivationFeedback(null);
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 text-slate-400 hover:text-white text-xs rounded-lg transition"
                            >
                              Cancel
                            </button>
                          </div>
                          {activationFeedback && (
                            <div className="text-[11px] font-mono text-indigo-300">
                              {activationFeedback}
                            </div>
                          )}
                        </div>
                      ) : (
                        seatsLeft > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setTargetItemForActivation(item.id);
                              setActivationFeedback(null);
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                          >
                            <span>+ Bind New Domain / Machine to this License ({seatsLeft} seats left)</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
