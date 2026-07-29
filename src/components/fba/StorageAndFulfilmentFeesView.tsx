import React, { useState } from 'react';
import { FBAFeeRecord } from '../../types/fba';
import {
  DollarSign,
  Wallet,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  CreditCard,
  Building,
} from 'lucide-react';

interface StorageAndFulfilmentFeesViewProps {
  feeRecords: FBAFeeRecord[];
  onTriggerDailyStorageBilling: () => void;
}

export const StorageAndFulfilmentFeesView: React.FC<StorageAndFulfilmentFeesViewProps> = ({
  feeRecords,
  onTriggerDailyStorageBilling,
}) => {
  const totalFeesCharged = feeRecords.reduce((acc, f) => acc + f.amountUSD, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>FBA STORAGE & FULFILMENT FEE BILLING ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Automated Daily Storage, Pick/Pack & Long-Term Storage Deductions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Volumetric cubic meter rate calculation, oversized handling surcharges & automatic seller wallet debiting
          </p>
        </div>

        <button
          onClick={onTriggerDailyStorageBilling}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg font-mono"
        >
          <Receipt className="w-4 h-4" />
          <span>Execute Daily Storage Fee Run</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">Total FBA Billing Assessed</span>
          <span className="text-xl font-black text-emerald-400">${totalFeesCharged.toFixed(2)}</span>
          <span className="text-[9px] text-slate-400 block">Deducted from Seller Wallet</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">Base Cubic Rate</span>
          <span className="text-xl font-black text-white">$0.87 / m³</span>
          <span className="text-[9px] text-sky-400 block">Standard Off-Peak Rate</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">Fulfilment Pick & Pack Rate</span>
          <span className="text-xl font-black text-[#febd69]">$4.80 / Order</span>
          <span className="text-[9px] text-emerald-400 block">Includes Packaging & Labor</span>
        </div>
      </div>

      {/* Fee Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          FBA Storage & Fulfilment Fee Ledger ({feeRecords.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">Fee ID & Timestamp</th>
                <th className="py-3 px-3">Seller Account</th>
                <th className="py-3 px-3">Fee Category</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3 text-right">Wallet Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {feeRecords.map((f) => (
                <tr key={f.feeId} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-extrabold text-[#febd69] text-xs block">{f.feeId}</span>
                    <span className="text-slate-500 text-[9px]">{f.timestamp}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white block">{f.sellerName}</span>
                    <span className="text-slate-400 text-[9px]">Seller ID: {f.sellerId}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded text-[9px] font-bold">
                      {f.feeType.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-300 max-w-xs text-[11px]">
                    {f.description}
                  </td>

                  <td className="py-3.5 px-3 text-emerald-400 font-extrabold text-sm">
                    -${f.amountUSD.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[9px] font-bold inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Wallet Debited</span>
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
