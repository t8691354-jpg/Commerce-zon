import React, { useState } from 'react';
import { ReturnRequestRecord, ExchangeRequestRecord } from '../../types/oms';
import {
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Warehouse,
  Wallet,
  FileText,
  Search,
  Eye,
} from 'lucide-react';

interface ReturnsAndExchangesHubProps {
  returns: ReturnRequestRecord[];
  exchanges: ExchangeRequestRecord[];
  onApproveReturn: (returnId: string) => void;
  onRejectReturn: (returnId: string) => void;
  onInspectWarehouse: (returnId: string, note: string) => void;
  onProcessRefund: (returnId: string) => void;
}

export const ReturnsAndExchangesHub: React.FC<ReturnsAndExchangesHubProps> = ({
  returns,
  exchanges,
  onApproveReturn,
  onRejectReturn,
  onInspectWarehouse,
  onProcessRefund,
}) => {
  const [activeTab, setActiveTab] = useState<'RETURNS' | 'EXCHANGES'>('RETURNS');
  const [inspectionNote, setInspectionNote] = useState('');
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-pink-400" />
            <span>RMA & REPLACEMENT CONTROL CENTER</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Returns, Exchanges & Instant Wallet Refunds</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated return merchandise authorization (RMA), warehouse inspection logs, and instant buyer wallet credits
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('RETURNS')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeTab === 'RETURNS'
                ? 'bg-pink-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Returns Portal ({returns.length})
          </button>
          <button
            onClick={() => setActiveTab('EXCHANGES')}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              activeTab === 'EXCHANGES'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Exchanges Portal ({exchanges.length})
          </button>
        </div>
      </div>

      {/* Returns View */}
      {activeTab === 'RETURNS' && (
        <div className="space-y-4">
          {returns.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 space-y-2">
              <RotateCcw className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="text-sm font-bold text-slate-300">No return requests pending</h3>
              <p className="text-xs text-slate-500">All customer return claims have been processed.</p>
            </div>
          ) : (
            returns.map((ret) => (
              <div
                key={ret.id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-white text-xs">{ret.id}</span>
                      <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-[10px] font-bold rounded uppercase">
                        {ret.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-bold mt-1">
                      {ret.customerName} • <span className="text-slate-400">Order: {ret.orderId}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">Claimed Refund Amount</div>
                    <div className="text-base font-black text-pink-400">${ret.refundAmount.amount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Product & Reason Details</div>
                    <div className="font-bold text-white">{ret.productTitle}</div>
                    <div className="text-amber-400 font-semibold">Reason: {ret.reason}</div>
                    <div className="text-slate-300 italic">"{ret.comment}"</div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Proof Media & Inspection Note</div>
                    {ret.mediaUrls.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <img
                          src={ret.mediaUrls[0]}
                          alt="Return Proof"
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-800"
                        />
                        <span className="text-[11px] text-sky-400 font-bold">1 Buyer Image Attached</span>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[11px]">No buyer media attached</div>
                    )}

                    {ret.warehouseInspectionNote && (
                      <div className="text-emerald-400 font-mono text-[11px] pt-1">
                        Inspection: {ret.warehouseInspectionNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800 text-xs">
                  {ret.status === 'REQUESTED' && (
                    <>
                      <button
                        onClick={() => onApproveReturn(ret.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Return Request</span>
                      </button>
                      <button
                        onClick={() => onRejectReturn(ret.id)}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Request</span>
                      </button>
                    </>
                  )}

                  {ret.status === 'APPROVED' && (
                    <button
                      onClick={() => setActiveInspectionId(ret.id)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center space-x-1"
                    >
                      <Warehouse className="w-3.5 h-3.5" />
                      <span>Log Warehouse Receipt & Inspection</span>
                    </button>
                  )}

                  {(ret.status === 'APPROVED' || ret.status === 'INSPECTED') && (
                    <button
                      onClick={() => onProcessRefund(ret.id)}
                      className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Release Instant Wallet Refund</span>
                    </button>
                  )}
                </div>

                {/* Inspection Input Modal Inline */}
                {activeInspectionId === ret.id && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-2">
                    <label className="block text-xs text-amber-300 font-bold">
                      Enter Warehouse Inspection Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Received package intact in original box. Re-sealing for restocking..."
                      value={inspectionNote}
                      onChange={(e) => setInspectionNote(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setActiveInspectionId(null)}
                        className="px-3 py-1 bg-slate-800 text-slate-300 font-bold rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          onInspectWarehouse(ret.id, inspectionNote || 'Inspected and approved');
                          setActiveInspectionId(null);
                          setInspectionNote('');
                        }}
                        className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        Save Inspection Log
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Exchanges View */}
      {activeTab === 'EXCHANGES' && (
        <div className="space-y-4">
          {exchanges.map((exc) => (
            <div key={exc.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-mono font-bold text-white">{exc.id}</span>
                  <span className="ml-2 text-slate-400">Customer: {exc.customerName}</span>
                </div>
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded">
                  {exc.status}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div>Original Item: <strong className="text-white">{exc.productId} ({exc.originalSku})</strong></div>
                <div>Requested Replacement: <strong className="text-purple-300">{exc.requestedVariantName} ({exc.requestedSku})</strong></div>
                <div className="text-slate-400 italic">"{exc.comment}"</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
