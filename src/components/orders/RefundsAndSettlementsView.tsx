import React from 'react';
import { RefundRecord, SellerSettlementRecord } from '../../types/oms';
import { DollarSign, Wallet, Building2, CheckCircle2, Clock, FileSpreadsheet, ShieldAlert } from 'lucide-react';

interface RefundsAndSettlementsViewProps {
  refunds: RefundRecord[];
  settlements: SellerSettlementRecord[];
  onTriggerSettlement: (settlementId: string) => void;
}

export const RefundsAndSettlementsView: React.FC<RefundsAndSettlementsViewProps> = ({
  refunds,
  settlements,
  onTriggerSettlement,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>FINANCIAL LEDGER & SETTLEMENT ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Refund Automation & Seller Payout Settlements</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time ledger audit trail calculating gross sales, marketplace commission deductions (8-15%), shipping fees, and automated wallet transfers
          </p>
        </div>
      </div>

      {/* Grid: Left Refunds, Right Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Refunds Ledger */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Wallet className="w-4 h-4 text-pink-400" />
            <span>Refund Transactions Audit Log ({refunds.length})</span>
          </h3>

          <div className="space-y-3">
            {refunds.map((ref) => (
              <div key={ref.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white">{ref.id}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                    {ref.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span>Order: <strong className="text-white">{ref.orderId}</strong></span>
                  <span className="text-sm font-black text-pink-400 font-mono">${ref.amount.amount.toFixed(2)}</span>
                </div>

                <div className="text-[10px] text-slate-400">Reason: {ref.reason}</div>

                <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-mono pt-1">
                  <span>✓ Buyer Wallet Credited</span>
                  <span>•</span>
                  <span>✓ Seller Wallet Debited</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Seller Settlements Table */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-[#febd69]" />
            <span>Seller Settlement Statement Calculations</span>
          </h3>

          <div className="space-y-4">
            {settlements.map((stl) => (
              <div key={stl.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-bold text-white text-sm">{stl.sellerName}</span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Order: {stl.orderId} | Sub-Order: {stl.subOrderId}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-black rounded-xl uppercase ${
                      stl.status === 'SETTLED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {stl.status}
                  </span>
                </div>

                {/* Mathematical Ledger Formula */}
                <div className="space-y-1.5 font-mono text-slate-300">
                  <div className="flex justify-between">
                    <span>Gross Product Revenue:</span>
                    <span className="text-white">${stl.grossProductRevenue.amount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-rose-400">
                    <span>- Marketplace Commission ({stl.marketplaceCommissionRatePct}%):</span>
                    <span>-${stl.commissionAmount.amount.toFixed(2)}</span>
                  </div>

                  {stl.subscriptionCharge.amount > 0 && (
                    <div className="flex justify-between text-rose-400">
                      <span>- Pro Seller Subscription Charge:</span>
                      <span>-${stl.subscriptionCharge.amount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Sales Tax Collected:</span>
                    <span>+${stl.taxAmount.amount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-emerald-400 border-t border-slate-800 pt-2 font-bold text-sm">
                    <span>Net Settled to Seller Wallet:</span>
                    <span>${stl.netSettlementAmount.amount.toFixed(2)}</span>
                  </div>
                </div>

                {stl.status === 'PENDING' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onTriggerSettlement(stl.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
                    >
                      Process & Settle Wallet Payout
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
