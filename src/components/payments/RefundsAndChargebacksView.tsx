import React, { useState } from 'react';
import { RefundTransactionRecord, ChargebackRecord } from '../../types/payments';
import { MOCK_REFUNDS, MOCK_CHARGEBACKS } from '../../data/paymentsMockData';
import {
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  DollarSign,
  Clock,
  Send,
} from 'lucide-react';

export const RefundsAndChargebacksView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REFUNDS' | 'CHARGEBACKS'>('REFUNDS');
  const [refunds, setRefunds] = useState<RefundTransactionRecord[]>(MOCK_REFUNDS);
  const [chargebacks, setChargebacks] = useState<ChargebackRecord[]>(MOCK_CHARGEBACKS);

  // New refund form state
  const [newRefund, setNewRefund] = useState({
    transactionId: 'TX-2026-9901',
    orderId: 'ord-1001',
    customerName: 'Sarah Jenkins',
    amountUSD: 150.00,
    refundType: 'WALLET' as const,
    reason: 'Customer requested partial shipping fee refund',
  });

  const handleIssueNewRefund = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RefundTransactionRecord = {
      refundId: `REF-2026-${Math.floor(100 + Math.random() * 900)}`,
      transactionId: newRefund.transactionId,
      orderId: newRefund.orderId,
      customerId: 'cust-901',
      customerName: newRefund.customerName,
      refundType: newRefund.refundType,
      amountUSD: newRefund.amountUSD,
      reason: newRefund.reason,
      status: 'PROCESSED',
      buyerWalletCredited: true,
      sellerWalletDebited: true,
      marketplaceFeeAdjusted: true,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };

    setRefunds([created, ...refunds]);
    alert(`Refund ${created.refundId} processed successfully! Buyer Wallet credited with $${created.amountUSD.toFixed(2)} USD.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>REFUND ENGINE & CHARGEBACK DISPUTE MANAGEMENT</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Refunds & Chargeback Resolution Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Issue full/partial refunds to digital wallet or original card, submit chargeback evidence packets & prevent lost disputes
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('REFUNDS')}
            className={`px-4 py-2 rounded-lg font-black transition ${
              activeTab === 'REFUNDS'
                ? 'bg-[#febd69] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Refund Engine
          </button>
          <button
            onClick={() => setActiveTab('CHARGEBACKS')}
            className={`px-4 py-2 rounded-lg font-black transition ${
              activeTab === 'CHARGEBACKS'
                ? 'bg-[#febd69] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chargeback Claims ({chargebacks.length})
          </button>
        </div>
      </div>

      {activeTab === 'REFUNDS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Issue Refund Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Issue Immediate Refund</span>
            </h3>

            <form onSubmit={handleIssueNewRefund} className="space-y-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Transaction ID / Order Ref:</label>
                <input
                  type="text"
                  value={newRefund.transactionId}
                  onChange={(e) => setNewRefund({ ...newRefund, transactionId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Customer Name:</label>
                <input
                  type="text"
                  value={newRefund.customerName}
                  onChange={(e) => setNewRefund({ ...newRefund, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Refund Amount (USD):</label>
                <input
                  type="number"
                  value={newRefund.amountUSD}
                  onChange={(e) => setNewRefund({ ...newRefund, amountUSD: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-mono font-bold focus:outline-none text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Refund Destination Channel:</label>
                <select
                  value={newRefund.refundType}
                  onChange={(e) => setNewRefund({ ...newRefund, refundType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  <option value="WALLET">Commerce Zone Pay Digital Wallet (Instant)</option>
                  <option value="ORIGINAL_PAYMENT_METHOD">Original Card / Bank Gateway Method</option>
                  <option value="STORE_CREDIT">Store Credit Voucher</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Refund Reason / Audit Note:</label>
                <textarea
                  value={newRefund.reason}
                  onChange={(e) => setNewRefund({ ...newRefund, reason: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Execute Ledger Refund & Update Wallet</span>
              </button>
            </form>
          </div>

          {/* Refund History Stream */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Processed Refund Stream</h3>

            <div className="space-y-3">
              {refunds.map((ref) => (
                <div key={ref.refundId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#febd69]">{ref.refundId}</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded">
                      {ref.status}
                    </span>
                  </div>

                  <div className="text-white font-bold font-sans">{ref.customerName}</div>
                  <div className="text-[11px] text-slate-400">Reason: {ref.reason}</div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-900 pt-2">
                    <span>Dest: {ref.refundType}</span>
                    <span className="text-emerald-400 font-bold text-sm">${ref.amountUSD.toFixed(2)} USD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Chargeback Dispute Hub */
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Active Bank Chargeback Claims & Evidence Evidence Portal</span>
          </h3>

          <div className="space-y-4">
            {chargebacks.map((cb) => (
              <div key={cb.chargebackId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-bold text-white text-sm">{cb.chargebackId}</span>
                    <span className="text-slate-400 text-xs ml-2 font-mono">Tx: {cb.transactionId}</span>
                  </div>

                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-black rounded-xl text-[10px]">
                    {cb.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px]">Dispute Amount:</span>
                    <div className="text-rose-400 font-bold text-sm">${cb.disputeAmountUSD.toFixed(2)} USD</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Reason Code:</span>
                    <div className="text-white font-bold">{cb.reasonCode}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Bank Deadline:</span>
                    <div className="text-amber-300 font-bold">{cb.dueDate}</div>
                  </div>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-300 text-[10px] uppercase">Evidence Packet Submitted:</span>
                  <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                    {cb.evidenceSubmitted.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
