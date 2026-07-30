import React, { useState } from 'react';
import { ReturnRequest, RefundMethod } from '../../types/returns';
import {
  DollarSign,
  Wallet,
  CreditCard,
  RefreshCcw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Building2,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
  onExecuteRefund: (returnId: string, amountUSD: number, method: RefundMethod) => void;
}

export const RefundManagementView: React.FC<Props> = ({ returnRequests, onExecuteRefund }) => {
  const eligibleForRefund = returnRequests.filter(
    (r) =>
      r.status === 'QUALITY_INSPECTED' ||
      r.status === 'APPROVED' ||
      r.status === 'AUTO_APPROVED' ||
      r.status === 'REFUND_PROCESSED'
  );

  const [selectedRmaId, setSelectedRmaId] = useState(eligibleForRefund[0]?.returnId || '');
  const [refundAmountUSD, setRefundAmountUSD] = useState(eligibleForRefund[0]?.item.unitPriceUSD || 100);
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('WALLET_CREDIT');
  const [notes, setNotes] = useState('Authorized full refund via automated financial settlement engine.');

  const target = eligibleForRefund.find((r) => r.returnId === selectedRmaId) || eligibleForRefund[0];

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    onExecuteRefund(target.returnId, refundAmountUSD, refundMethod);
    alert(`Refund of $${refundAmountUSD.toFixed(2)} for ${target.returnId} processed successfully! Updated Buyer & Seller Wallet Ledgers.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-[#febd69]" />
            <span>Automated Refund Processing & Wallet Ledger Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Process full or partial refunds directly to buyer payment cards, Commerce Zon Wallet credit, or store vouchers.
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg flex items-center space-x-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>Marketplace Reserve Pool: $450,000.00</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-[#febd69] uppercase tracking-wider">Refund Approval Queue</h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {eligibleForRefund.map((r) => (
              <div
                key={r.returnId}
                onClick={() => {
                  setSelectedRmaId(r.returnId);
                  setRefundAmountUSD(r.item.unitPriceUSD);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  selectedRmaId === r.returnId
                    ? 'bg-slate-800 border-[#febd69] ring-1 ring-[#febd69]/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono font-bold text-xs text-[#febd69]">{r.returnId}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    ${r.item.unitPriceUSD.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{r.item.name}</div>
                <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                  <span>{r.buyerName}</span>
                  <span className="text-amber-400 font-medium">{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Form & Double Entry Ledger Preview */}
        {target ? (
          <form onSubmit={handleProcessRefund} className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#febd69]" />
              <span>Execute Refund Settlement for RMA {target.returnId}</span>
            </h3>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Buyer Account</span>
                <span className="font-bold text-white">{target.buyerName}</span>
                <span className="text-[10px] text-slate-400 block font-mono">{target.buyerEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Seller Merchant</span>
                <span className="font-bold text-[#febd69]">{target.sellerName}</span>
                <span className="text-[10px] text-slate-400 block font-mono">ID: {target.sellerId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Order Purchase Value</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">${target.item.unitPriceUSD.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Approved Refund Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={refundAmountUSD}
                  onChange={(e) => setRefundAmountUSD(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Settlement Method</label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value as RefundMethod)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                >
                  <option value="WALLET_CREDIT">Commerce Zon Marketplace Wallet Credit (Instant)</option>
                  <option value="ORIGINAL_PAYMENT">Original Credit Card / Bank Account (3-5 Days)</option>
                  <option value="STORE_CREDIT">Store Gift Card Voucher (+5% Bonus Credit)</option>
                  <option value="PARTIAL_REFUND">Partial Refund Adjustment</option>
                </select>
              </div>
            </div>

            {/* Financial Ledger Auto-Adjustments Preview */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Double-Entry Wallet Ledger Adjustments</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">Auto-Balancing Protocol</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Buyer Wallet</div>
                  <div className="text-emerald-400 font-mono font-bold text-sm">+${refundAmountUSD.toFixed(2)}</div>
                  <div className="text-[9px] text-slate-400">CREDIT (Refund)</div>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Seller Escrow Ledger</div>
                  <div className="text-rose-400 font-mono font-bold text-sm">-${refundAmountUSD.toFixed(2)}</div>
                  <div className="text-[9px] text-slate-400">DEBIT (Return Reversal)</div>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Marketplace Fee Reversal</div>
                  <div className="text-cyan-400 font-mono font-bold text-sm">-$0.00</div>
                  <div className="text-[9px] text-slate-400">COMMISSION ADJUSTED</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Financial Settlement Remarks</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Execute Monetary Settlement & Update Wallets</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-500 text-xs">
            No return claims currently awaiting refund execution.
          </div>
        )}
      </div>
    </div>
  );
};
