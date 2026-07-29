import React, { useState } from 'react';
import { MOCK_FINANCIAL_RULES } from '../../data/mockSuperAdmin';
import { FinancialFeeRule } from '../../types/superAdmin';
import { DollarSign, Percent, CreditCard, CheckCircle2, Save, Plus, Wallet, ShieldAlert } from 'lucide-react';

export const FinancialControlsCommissionView: React.FC = () => {
  const [feeRules, setFeeRules] = useState<FinancialFeeRule[]>(MOCK_FINANCIAL_RULES);
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdateRule = (id: string, newRate: number, newFlatFee: number) => {
    setFeeRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ratePct: newRate, flatFeeUsd: newFlatFee } : r))
    );
    setNotification(`Financial fee rule ${id} updated & synced to ledger calculation engine.`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-amber-400 font-bold">Standard Marketplace Commission</span>
          <p className="text-2xl font-black text-slate-100 font-mono">8.5% Avg</p>
          <span className="text-[10px] text-slate-400 font-mono">Applies to 182,000 active retail SKUs</span>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-emerald-400 font-bold">Pro Seller Subscription MRR</span>
          <p className="text-2xl font-black text-slate-100 font-mono">$39.99 / mo</p>
          <span className="text-[10px] text-slate-400 font-mono">12,400 active subscribed seller accounts</span>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-blue-400 font-bold">FBA Storage & Fulfillment Yield</span>
          <p className="text-2xl font-black text-slate-100 font-mono">$2.50 / cu.ft</p>
          <span className="text-[10px] text-slate-400 font-mono">4 Warehouses globally connected</span>
        </div>
      </div>

      {/* Fee Rules Matrix Table */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              Platform Financial Commission & Fee Engine Rules
            </h3>
            <p className="text-xs text-slate-400">
              Configure commissions, seller plans, affiliate payouts, FBA storage fees & wallet withdrawal charges
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">Rule ID</th>
                <th className="py-3 px-3">Fee Type</th>
                <th className="py-3 px-3">Variable Rate (%)</th>
                <th className="py-3 px-3">Flat Fee ($)</th>
                <th className="py-3 px-3">Applies To Target</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {feeRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-amber-400 font-bold">{rule.id}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{rule.feeType}</td>

                  <td className="py-3 px-3">
                    <input
                      type="number"
                      step="0.1"
                      value={rule.ratePct}
                      onChange={(e) =>
                        setFeeRules((prev) =>
                          prev.map((r) =>
                            r.id === rule.id ? { ...r, ratePct: parseFloat(e.target.value) || 0 } : r
                          )
                        )
                      }
                      className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 font-mono"
                    />
                    <span className="ml-1 text-slate-400">%</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={rule.flatFeeUsd}
                      onChange={(e) =>
                        setFeeRules((prev) =>
                          prev.map((r) =>
                            r.id === rule.id ? { ...r, flatFeeUsd: parseFloat(e.target.value) || 0 } : r
                          )
                        )
                      }
                      className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-100 font-mono"
                    />
                  </td>

                  <td className="py-3 px-3 text-slate-300 font-sans">{rule.appliesTo}</td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                      {rule.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleUpdateRule(rule.id, rule.ratePct, rule.flatFeeUsd)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded transition flex items-center space-x-1 ml-auto"
                    >
                      <Save className="w-3 h-3" />
                      <span>Update</span>
                    </button>
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
