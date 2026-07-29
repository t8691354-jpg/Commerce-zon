import React, { useState } from 'react';
import { MOCK_CATEGORY_POLICIES } from '../../data/returnsMockData';
import { CategoryReturnPolicy } from '../../types/returns';
import {
  Sliders,
  CheckCircle2,
  Save,
  Lock,
  Plus,
} from 'lucide-react';

export const ReturnPolicyAdminView: React.FC = () => {
  const [policies, setPolicies] = useState<CategoryReturnPolicy[]>(MOCK_CATEGORY_POLICIES);

  const handleUpdatePolicy = (
    category: string,
    field: keyof CategoryReturnPolicy,
    value: any
  ) => {
    setPolicies((prev) =>
      prev.map((p) => (p.category === category ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveAll = () => {
    alert('Return policies saved successfully across all marketplace categories!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#febd69]" />
            <span>Marketplace Category Return Policy & Rules Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure category return windows, auto-approval caps, restocking fees, and mandatory inspection requirements.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Policy Rules</span>
        </button>
      </div>

      {/* Policies Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs text-white">
          Active Category Rules Matrix
        </div>

        <div className="divide-y divide-slate-800">
          {policies.map((p) => (
            <div key={p.category} className="p-5 space-y-4 hover:bg-slate-800/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-sm text-[#febd69]">{p.category}</span>

                <div className="flex items-center space-x-3 text-xs">
                  <label className="flex items-center space-x-1.5 text-slate-300">
                    <input
                      type="checkbox"
                      checked={p.isReturnable}
                      onChange={(e) => handleUpdatePolicy(p.category, 'isReturnable', e.target.checked)}
                      className="rounded accent-[#febd69]"
                    />
                    <span>Returnable</span>
                  </label>

                  <label className="flex items-center space-x-1.5 text-slate-300">
                    <input
                      type="checkbox"
                      checked={p.requiresInspection}
                      onChange={(e) => handleUpdatePolicy(p.category, 'requiresInspection', e.target.checked)}
                      className="rounded accent-[#febd69]"
                    />
                    <span>Requires QA Inspection</span>
                  </label>

                  <label className="flex items-center space-x-1.5 text-slate-300">
                    <input
                      type="checkbox"
                      checked={p.allowAutoApproval}
                      onChange={(e) => handleUpdatePolicy(p.category, 'allowAutoApproval', e.target.checked)}
                      className="rounded accent-[#febd69]"
                    />
                    <span>Auto Approval Enabled</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Return Window (Days)</label>
                  <input
                    type="number"
                    value={p.returnWindowDays}
                    onChange={(e) => handleUpdatePolicy(p.category, 'returnWindowDays', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Restocking Fee (%)</label>
                  <input
                    type="number"
                    value={p.restockingFeePercent}
                    onChange={(e) => handleUpdatePolicy(p.category, 'restockingFeePercent', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Auto Approval Max Cap ($ USD)</label>
                  <input
                    type="number"
                    value={p.autoApprovalMaxUSD}
                    onChange={(e) => handleUpdatePolicy(p.category, 'autoApprovalMaxUSD', Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
