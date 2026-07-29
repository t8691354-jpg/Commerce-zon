import React, { useState } from 'react';
import { ReturnRequest, ReturnStatus } from '../../types/returns';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FileText,
  Truck,
  RotateCcw,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
  onUpdateStatus: (returnId: string, status: ReturnStatus) => void;
}

export const ReturnWorkflowManagerView: React.FC<Props> = ({ returnRequests, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(returnRequests[0] || null);

  const filtered = returnRequests.filter((r) => {
    const matchesSearch =
      r.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.item.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReturnStatus) => {
    switch (status) {
      case 'AUTO_APPROVED':
      case 'APPROVED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'REFUND_PROCESSED':
      case 'EXCHANGE_DISPATCHED':
      case 'CLOSED':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'QUALITY_INSPECTED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'SHIPPED_BY_BUYER':
      case 'WAREHOUSE_RECEIVED':
      case 'LABEL_GENERATED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'REQUESTED':
      case 'SELLER_REVIEW':
      case 'ADMIN_REVIEW':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'ESCALATED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const stages: { key: ReturnStatus; label: string }[] = [
    { key: 'REQUESTED', label: '1. Claim Submitted' },
    { key: 'SELLER_REVIEW', label: '2. Seller Review' },
    { key: 'APPROVED', label: '3. Approved' },
    { key: 'LABEL_GENERATED', label: '4. Label Ready' },
    { key: 'SHIPPED_BY_BUYER', label: '5. In Transit' },
    { key: 'WAREHOUSE_RECEIVED', label: '6. FC Received' },
    { key: 'QUALITY_INSPECTED', label: '7. QA Inspected' },
    { key: 'REFUND_PROCESSED', label: '8. Refund / Exchange' },
    { key: 'CLOSED', label: '9. Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Status Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search RMA #, Order #, Customer Name, or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'REQUESTED', 'SELLER_REVIEW', 'APPROVED', 'QUALITY_INSPECTED', 'REFUND_PROCESSED', 'ESCALATED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-[#febd69] text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Return Claims List */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col max-h-[680px]">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-white">Active Return Requests ({filtered.length})</span>
            <span>Sorted by Recent</span>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-y-auto flex-1">
            {filtered.map((item) => {
              const isSelected = selectedReturn?.returnId === item.returnId;
              return (
                <div
                  key={item.returnId}
                  onClick={() => setSelectedReturn(item)}
                  className={`p-3.5 cursor-pointer transition ${
                    isSelected ? 'bg-slate-800/90 border-l-4 border-l-[#febd69]' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono font-black text-xs text-[#febd69]">{item.returnId}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white truncate">{item.item.name}</div>
                  <div className="text-[11px] text-slate-400 flex justify-between mt-1">
                    <span>{item.buyerName}</span>
                    <span className="font-mono text-emerald-400 font-bold">${item.item.unitPriceUSD.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Return Details & Lifecycle Stepper */}
        {selectedReturn ? (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-white">{selectedReturn.returnId}</span>
                  <span className="text-xs font-mono text-slate-400">({selectedReturn.orderId})</span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getStatusBadge(selectedReturn.status)}`}>
                    {selectedReturn.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Requested by <span className="text-white font-medium">{selectedReturn.buyerName}</span> for seller{' '}
                  <span className="text-[#febd69] font-medium">{selectedReturn.sellerName}</span>
                </div>
              </div>

              {/* Action State Trigger Buttons */}
              <div className="flex items-center space-x-2">
                {selectedReturn.status === 'SELLER_REVIEW' && (
                  <>
                    <button
                      onClick={() => onUpdateStatus(selectedReturn.returnId, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400"
                    >
                      Approve Return
                    </button>
                    <button
                      onClick={() => onUpdateStatus(selectedReturn.returnId, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-500/20 text-rose-300 font-bold text-xs rounded-lg hover:bg-rose-500/30 border border-rose-500/40"
                    >
                      Reject
                    </button>
                  </>
                )}

                {selectedReturn.status === 'QUALITY_INSPECTED' && (
                  <button
                    onClick={() => onUpdateStatus(selectedReturn.returnId, 'REFUND_PROCESSED')}
                    className="px-3 py-1.5 bg-[#febd69] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#f3a847]"
                  >
                    Execute Refund
                  </button>
                )}
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>RMA Lifecycle Timeline</span>
                <span className="font-mono text-[10px] text-slate-500">Created {new Date(selectedReturn.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[10px]">
                {stages.slice(0, 5).map((st) => (
                  <div
                    key={st.key}
                    className={`p-2 rounded border text-center font-bold font-mono ${
                      selectedReturn.status === st.key
                        ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Product & Claim Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-white border-b border-slate-800 pb-1">Product Details</div>
                <div className="flex items-center space-x-3 pt-1">
                  {selectedReturn.item.imageUrl && (
                    <img
                      src={selectedReturn.item.imageUrl}
                      alt={selectedReturn.item.name}
                      className="w-12 h-12 rounded object-cover border border-slate-800"
                    />
                  )}
                  <div>
                    <div className="font-bold text-slate-200">{selectedReturn.item.name}</div>
                    <div className="text-[11px] text-slate-400">SKU: {selectedReturn.item.sku}</div>
                    <div className="text-[11px] text-emerald-400 font-mono font-bold">${selectedReturn.item.unitPriceUSD.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-white border-b border-slate-800 pb-1">Claim Reason & Comments</div>
                <div className="pt-1 space-y-1">
                  <div>Reason: <span className="text-amber-400 font-bold">{selectedReturn.reason}</span></div>
                  <p className="text-slate-300 italic">"{selectedReturn.comments}"</p>
                </div>
              </div>
            </div>

            {/* Inspection & Fraud Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-white border-b border-slate-800 pb-1">Warehouse Inspection Status</div>
                {selectedReturn.inspection ? (
                  <div className="space-y-1 pt-1">
                    <div className="text-emerald-400 font-bold">Inspector: {selectedReturn.inspection.inspectorName}</div>
                    <div>Result: <span className="font-mono text-white">{selectedReturn.inspection.inspectionResult}</span></div>
                    <p className="text-slate-400">{selectedReturn.inspection.notes}</p>
                  </div>
                ) : (
                  <div className="text-slate-500 py-2">Awaiting product arrival at Fulfillment Center.</div>
                )}
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-white border-b border-slate-800 pb-1 flex justify-between">
                  <span>Fraud & Risk Assessment</span>
                  <span className="text-rose-400 font-mono font-bold">Score: {selectedReturn.fraudDetails.fraudRiskScore}/100</span>
                </div>
                {selectedReturn.fraudDetails.riskFlags.length > 0 ? (
                  <div className="space-y-1 pt-1 text-rose-300">
                    {selectedReturn.fraudDetails.riskFlags.map((flag, idx) => (
                      <div key={idx} className="flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400 flex-shrink-0" />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-emerald-400 py-2">No suspicious activity flagged. Verified buyer history.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-xl flex items-center justify-center text-slate-500 text-xs">
            Select a return request from the left column to view workflow details.
          </div>
        )}
      </div>
    </div>
  );
};
