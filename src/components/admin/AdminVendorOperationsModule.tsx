import React, { useState, useEffect } from 'react';
import {
  Store,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Check,
  Ban,
  ExternalLink,
  Building2,
  Package,
  Layers,
  ChevronRight,
  UserCheck,
  Award,
  Sparkles,
  X,
} from 'lucide-react';
import { SellerApplication, SellerApplicationStatus, SellerStoreProfile } from '../../types/sellerCenter';
import { sellerCenterClient } from '../../services/sellerCenterClient';
import { MerchantTier, Product } from '../../types/domain';

export const AdminVendorOperationsModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'merchants' | 'moderation'>('applications');
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [stores, setStores] = useState<SellerStoreProfile[]>([]);
  const [productsForModeration, setProductsForModeration] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<any>({
    pendingApplications: 0,
    approvedApplications: 0,
    changesRequested: 0,
    rejectedApplications: 0,
    activeStores: 0,
    suspendedStores: 0,
    totalStores: 0,
    pendingProductModeration: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [appFilter, setAppFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Application for Review Modal
  const [selectedAppModal, setSelectedAppModal] = useState<SellerApplication | null>(null);
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [requestedChangesInput, setRequestedChangesInput] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<MerchantTier>('verified');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, storeList, prodList, statMetrics] = await Promise.all([
        sellerCenterClient.listApplications(),
        sellerCenterClient.listStores(),
        sellerCenterClient.getSellerProducts('merch-01'), // sample merchant or all
        sellerCenterClient.getVendorOperationsMetrics(),
      ]);

      setApplications(apps);
      setStores(storeList);
      setProductsForModeration(prodList);
      setMetrics(statMetrics);
    } catch (err) {
      console.error('Failed to load admin vendor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Review Decision Submit
  const handleReviewDecision = async (decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES') => {
    if (!selectedAppModal) return;

    const changes = requestedChangesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await sellerCenterClient.reviewApplication(selectedAppModal.id, decision, {
        notes: decisionNotes,
        rejectionReason: decision === 'REJECT' ? rejectionReason : undefined,
        requestedChanges: decision === 'REQUEST_CHANGES' ? changes : undefined,
        tier: selectedTier,
      });

      showToast(`Application #${selectedAppModal.id} marked as ${decision}!`);
      setSelectedAppModal(null);
      setDecisionNotes('');
      setRejectionReason('');
      setRequestedChangesInput('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to process decision');
    }
  };

  // Handle Suspend / Reinstate Store
  const handleToggleStoreStatus = async (store: SellerStoreProfile) => {
    const isCurrentlyActive = store.status === 'ACTIVE';
    const newStatus = isCurrentlyActive ? 'SUSPENDED' : 'ACTIVE';
    let reason: string | undefined = undefined;

    if (isCurrentlyActive) {
      const promptReason = prompt(`Provide reason for suspending store "${store.name}":`, 'Policy violation: Unresponsive to customer RMA inquiries.');
      if (!promptReason) return;
      reason = promptReason;
    }

    try {
      await sellerCenterClient.setStoreStatus(store.merchantId, newStatus, reason);
      setStores((prev) =>
        prev.map((s) => (s.merchantId === store.merchantId ? { ...s, status: newStatus, suspensionReason: reason } : s))
      );
      showToast(`Store "${store.name}" set to ${newStatus}!`);
    } catch (err: any) {
      alert(err.message || 'Failed to update store status');
    }
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesFilter =
      appFilter === 'all' ||
      (appFilter === 'pending' && (app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW')) ||
      (appFilter === 'changes' && app.status === 'CHANGES_REQUESTED') ||
      (appFilter === 'approved' && app.status === 'APPROVED') ||
      (appFilter === 'rejected' && app.status === 'REJECTED');

    const matchesSearch =
      app.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.business.businessName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#febd69] uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#febd69]" />
            <span>Marketplace Admin Panel</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono">Part 14 Multi-Seller Operations</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Vendor Operations, KYC Approvals & Store Moderation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate merchant onboarding dossiers, manage brand tiers, moderate new catalog submissions, and audit store standings
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#febd69]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-amber-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Review</span>
          <p className="text-2xl font-black text-[#febd69] font-mono">{metrics.pendingApplications}</p>
          <p className="text-[10px] text-amber-300">Awaiting KYC & Compliance Audit</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-emerald-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active Merchant Stores</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{metrics.activeStores}</p>
          <p className="text-[10px] text-emerald-300">100% Verified Partners</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-rose-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Suspended Stores</span>
          <p className="text-2xl font-black text-rose-400 font-mono">{metrics.suspendedStores}</p>
          <p className="text-[10px] text-slate-400">Listings Restricted</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-blue-500/40 transition">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Revisions Requested</span>
          <p className="text-2xl font-black text-blue-400 font-mono">{metrics.changesRequested}</p>
          <p className="text-[10px] text-blue-300">Awaiting Seller Updates</p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center space-x-2 bg-slate-900 p-1.5 border border-slate-800 rounded-xl w-fit text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`px-4 py-2 rounded-lg transition ${
            activeSubTab === 'applications' ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-300 hover:text-white'
          }`}
        >
          Seller Applications Queue ({applications.length})
        </button>
        <button
          onClick={() => setActiveSubTab('merchants')}
          className={`px-4 py-2 rounded-lg transition ${
            activeSubTab === 'merchants' ? 'bg-[#febd69] text-slate-950 font-black' : 'text-slate-300 hover:text-white'
          }`}
        >
          Merchant Stores Directory ({stores.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: SELLER APPLICATION REVIEW QUEUE */}
      {/* ========================================================================= */}
      {activeSubTab === 'applications' && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-[#febd69]" />
              <h3 className="text-base font-bold text-white">Merchant Onboarding Dossiers</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search store or applicant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#febd69] w-52"
                />
              </div>

              <select
                value={appFilter}
                onChange={(e) => setAppFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Review</option>
                <option value="changes">Changes Requested</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-3">Store & Applicant</th>
                  <th className="py-3 px-3">Business Entity & Country</th>
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3">Submitted Date</th>
                  <th className="py-3 px-3 text-center">Review Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white text-xs">{app.storeName}</div>
                        <div className="text-[10px] text-slate-400">
                          Applicant: <span className="text-slate-200">{app.applicantName}</span> • Slug: <span className="font-mono text-[#febd69]">{app.storeSlug}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <div className="font-semibold text-white">{app.business.businessName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Reg: {app.business.registrationNumber} • {app.business.country}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-amber-300">{app.plan}</span>
                      </td>

                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : app.status === 'CHANGES_REQUESTED'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : app.status === 'REJECTED'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppModal(app);
                            setDecisionNotes(app.reviewNotes || '');
                            setRejectionReason(app.rejectionReason || '');
                            setRequestedChangesInput(app.requestedChanges ? app.requestedChanges.join('\n') : '');
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-[#febd69] hover:text-slate-950 text-slate-200 font-bold rounded-lg text-xs transition"
                        >
                          Review Dossier
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MERCHANT STORES DIRECTORY & MODERATION */}
      {/* ========================================================================= */}
      {activeSubTab === 'merchants' && (
        <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5 text-[#febd69]" />
              <h3 className="text-base font-bold text-white">Marketplace Verified Merchants Directory</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{stores.length} Registered Stores</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-3">Merchant Name & Code</th>
                  <th className="py-3 px-3">Brand Tier</th>
                  <th className="py-3 px-3">Contact & Location</th>
                  <th className="py-3 px-3 text-center">Visibility</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {stores.map((s) => (
                  <tr key={s.merchantId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Code: <span className="text-[#febd69]">{s.code}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={s.tier}
                        onChange={async (e) => {
                          const newTier = e.target.value as MerchantTier;
                          await sellerCenterClient.setStoreTier(s.merchantId, newTier);
                          setStores((prev) =>
                            prev.map((item) => (item.merchantId === s.merchantId ? { ...item, tier: newTier } : item))
                          );
                          showToast(`Updated tier to ${newTier} for ${s.name}`);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold focus:outline-none"
                      >
                        <option value="standard">Standard</option>
                        <option value="verified">Verified</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="flagship">Flagship Prime</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <div>{s.contactEmail}</div>
                      <div className="text-[10px] text-slate-400">
                        {s.city}, {s.country}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-[11px]">
                      <span className="text-slate-300">{s.visibility}</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleStoreStatus(s)}
                        className={`px-3 py-1 font-bold text-xs rounded-lg transition ${
                          s.status === 'ACTIVE'
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Suspend Store' : 'Reinstate Store'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPLICATION REVIEW DOSSIER */}
      {/* ========================================================================= */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#febd69]" />
                <span>Reviewing Seller Application: {selectedAppModal.storeName}</span>
              </h3>
              <button onClick={() => setSelectedAppModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Applicant Name</span>
                <strong className="text-white">{selectedAppModal.applicantName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Plan Chosen</span>
                <strong className="text-[#febd69] font-mono">{selectedAppModal.plan} ($36/mo)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Business Legal Name</span>
                <strong className="text-white">{selectedAppModal.business.businessName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Entity Type / Reg #</span>
                <span className="text-slate-300 font-mono">{selectedAppModal.business.businessType} • {selectedAppModal.business.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Email & Phone</span>
                <span className="text-slate-300 font-mono">{selectedAppModal.business.businessEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Location</span>
                <span className="text-slate-300">{selectedAppModal.business.city}, {selectedAppModal.business.country}</span>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
              <div>
                <span className="text-slate-400 font-semibold block">Shipping Policy:</span>
                <p className="text-slate-300">{selectedAppModal.policies.shippingPolicy}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Return Policy:</span>
                <p className="text-slate-300">{selectedAppModal.policies.returnPolicy}</p>
              </div>
            </div>

            {/* Decision Controls */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Grant Merchant Brand Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="verified">Verified Merchant Partner</option>
                  <option value="enterprise">Enterprise Tier</option>
                  <option value="flagship">Flagship Prime Tier</option>
                  <option value="standard">Standard Tier</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Administrative Audit Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes recorded in application history..."
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Requested Action Items (If Requesting Changes)</label>
                <textarea
                  rows={2}
                  placeholder="Enter items, one per line..."
                  value={requestedChangesInput}
                  onChange={(e) => setRequestedChangesInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-rose-300">Rejection Reason (If Rejecting Application)</label>
                <input
                  type="text"
                  placeholder="Detailed justification required for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedAppModal(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Close
                </button>

                <button
                  onClick={() => handleReviewDecision('REQUEST_CHANGES')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
                >
                  Request Changes
                </button>

                <button
                  onClick={() => handleReviewDecision('REJECT')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition"
                >
                  Reject Application
                </button>

                <button
                  onClick={() => handleReviewDecision('APPROVE')}
                  className="px-5 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl transition shadow-lg"
                >
                  Approve & Open Store
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
