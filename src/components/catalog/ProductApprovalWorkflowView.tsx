import React, { useState } from 'react';
import { Product, ProductApprovalStatus } from '../../types/domain';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Eye,
  FileCheck2,
  Sparkles,
  Search,
  Store,
} from 'lucide-react';

interface ProductApprovalWorkflowViewProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
}

export const ProductApprovalWorkflowView: React.FC<ProductApprovalWorkflowViewProps> = ({
  products,
  onUpdateProduct,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ProductApprovalStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeRejectModalId, setActiveRejectModalId] = useState<string | null>(null);

  const handleStatusChange = (product: Product, newStatus: ProductApprovalStatus, note?: string) => {
    const updated: Product = {
      ...product,
      approvalStatus: newStatus,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProduct(updated);
    setActiveRejectModalId(null);
    setRejectionReason('');
  };

  const filteredProducts = products.filter((p) => {
    const statusMatch = selectedStatusFilter === 'ALL' || (p.approvalStatus || 'APPROVED') === selectedStatusFilter;
    const searchMatch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.merchant.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status?: ProductApprovalStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-bold">DRAFT</span>;
      case 'SUBMITTED':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold">SUBMITTED</span>;
      case 'UNDER_REVIEW':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1"><Clock className="w-3 h-3"/><span>UNDER REVIEW</span></span>;
      case 'APPROVED':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1"><CheckCircle2 className="w-3 h-3"/><span>APPROVED</span></span>;
      case 'PUBLISHED':
        return <span className="bg-green-500 text-slate-950 font-black px-2.5 py-1 rounded-md text-[10px] uppercase">LIVE ON COMMERCE_ZON</span>;
      case 'REJECTED':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1"><XCircle className="w-3 h-3"/><span>REJECTED</span></span>;
      case 'SUSPENDED':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center space-x-1"><AlertTriangle className="w-3 h-3"/><span>SUSPENDED</span></span>;
      default:
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[10px] font-bold">APPROVED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-[#febd69]" />
            <span>Product Approval & Moderation Workflow</span>
          </h2>
          <p className="text-xs text-slate-400">
            Lifecycle governance: Draft → Submitted → Under Review → Approved / Rejected → Suspended
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs w-64">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter listings or sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-white focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-bold">
        {(['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl transition ${
              selectedStatusFilter === st
                ? 'bg-[#febd69] text-slate-950 font-black shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Workflow Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Product / SKU</th>
                <th className="p-4">Vendor Merchant</th>
                <th className="p-4">Price / Stock</th>
                <th className="p-4">Workflow Status</th>
                <th className="p-4 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80'}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-contain bg-slate-950 rounded-lg border border-slate-800 p-1 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white line-clamp-1">{p.title}</div>
                        <div className="text-[10px] font-mono text-slate-400">SKU: {p.sku}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-amber-400 flex items-center space-x-1">
                      <Store className="w-3.5 h-3.5" />
                      <span>{p.merchant.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase">{p.category}</div>
                  </td>

                  <td className="p-4 font-mono">
                    <div className="font-bold text-emerald-400">${p.price.amount.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400">{p.totalStock} units available</div>
                  </td>

                  <td className="p-4">{getStatusBadge(p.approvalStatus)}</td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleStatusChange(p, 'APPROVED')}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-bold rounded-lg border border-emerald-500/30 transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => setActiveRejectModalId(p.id)}
                        className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold rounded-lg border border-rose-500/30 transition flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(p, 'SUSPENDED')}
                        className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 font-bold rounded-lg border border-purple-500/30 transition"
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {activeRejectModalId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-rose-400 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Reject Product Listing</span>
            </h3>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">Reason for Rejection</label>
              <textarea
                rows={3}
                placeholder="e.g. Missing required barcode identifiers, counterfeit brand detection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveRejectModalId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetProd = products.find((p) => p.id === activeRejectModalId);
                  if (targetProd) {
                    handleStatusChange(targetProd, 'REJECTED', rejectionReason);
                  }
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
