import React, { useState } from 'react';
import { SettlementRecord } from '../../types/dropshipping';
import {
  DollarSign,
  Wallet,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowRightLeft,
  Building2,
} from 'lucide-react';

interface SupplierSettlementWalletViewProps {
  settlements: SettlementRecord[];
  onReleaseSettlement: (settlementId: string) => void;
}

export const SupplierSettlementWalletView: React.FC<SupplierSettlementWalletViewProps> = ({
  settlements,
  onReleaseSettlement,
}) => {
  const totalSettled = settlements.reduce((acc, s) => acc + s.supplierPayoutUSD, 0);
  const totalCommission = settlements.reduce((acc, s) => acc + s.marketplaceCommissionUSD, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>SUPPLIER FINANCIAL SETTLEMENT & WALLET SPLIT ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Automated Supplier Payout Ledger & Module 4 Wallet Integration</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial split calculating product wholesale cost, 10% marketplace take, seller profit margin & instant wallet payouts
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-400 text-[10px] uppercase block">Total Supplier Payouts</span>
            <span className="text-emerald-400 font-extrabold text-sm">${totalSettled.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Math Formula Explainer */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <ArrowRightLeft className="w-4 h-4 text-[#febd69]" />
          <span>Automated Payment Split Math Formula</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center font-mono text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] uppercase block">1. Gross Buyer Paid</span>
            <span className="text-white font-black">$119.99</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] uppercase block">2. Wholesale Supplier</span>
            <span className="text-emerald-400 font-black">$42.50</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] uppercase block">3. Marketplace Fee (10%)</span>
            <span className="text-[#febd69] font-black">$12.00</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] uppercase block">4. Seller Profit</span>
            <span className="text-sky-400 font-black">$65.49</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[9px] uppercase block">5. Wallet Status</span>
            <span className="text-emerald-300 font-bold text-[10px]">AUTO-SETTLED</span>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">
          Settlement Ledger Logs ({settlements.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Settlement ID</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Gross Sales</th>
                <th className="p-3">Marketplace Fee</th>
                <th className="p-3">Supplier Payout</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
              {settlements.map((set) => (
                <tr key={set.settlementId} className="hover:bg-slate-950/60">
                  <td className="p-3 font-bold text-white">{set.settlementId}</td>
                  <td className="p-3 text-slate-400">{set.orderId}</td>
                  <td className="p-3 font-sans font-bold text-white">{set.supplierName}</td>
                  <td className="p-3 text-white">${set.grossAmountUSD.toFixed(2)}</td>
                  <td className="p-3 text-[#febd69]">${set.marketplaceCommissionUSD.toFixed(2)}</td>
                  <td className="p-3 text-emerald-400 font-extrabold">${set.supplierPayoutUSD.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded">
                      {set.payoutStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
