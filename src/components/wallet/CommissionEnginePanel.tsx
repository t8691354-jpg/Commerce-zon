import React, { useState } from 'react';
import { CommissionRule } from '../../types/paymentWalletArchitecture';
import { Percent, Plus, ShieldCheck, CheckCircle2, Calculator, Layers, Trash2 } from 'lucide-react';

interface CommissionEnginePanelProps {
  rules: CommissionRule[];
  onAddRule: (rule: Omit<CommissionRule, 'id' | 'updatedAt'>) => void;
  onToggleRule: (id: string) => void;
  currencySymbol: string;
  currencyRate: number;
}

export const CommissionEnginePanel: React.FC<CommissionEnginePanelProps> = ({
  rules,
  onAddRule,
  onToggleRule,
  currencySymbol,
  currencyRate,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [targetType, setTargetType] = useState<'GLOBAL' | 'CATEGORY' | 'PRODUCT' | 'VENDOR'>('CATEGORY');
  const [targetValue, setTargetValue] = useState('');
  const [percentage, setPercentage] = useState<number>(7.5);
  const [flatFee, setFlatFee] = useState<number>(0.30);

  // Commission Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcCat, setCalcCat] = useState<string>('robotics');
  const [calcVendor, setCalcVendor] = useState<string>('merch-[#1]');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    onAddRule({
      name: ruleName,
      targetType,
      targetValue: targetValue.trim() || undefined,
      percentage,
      flatFee,
      isActive: true,
    });

    setShowAddModal(false);
    setRuleName('');
    setTargetValue('');
  };

  // Precedence evaluation logic
  const resolveRuleForSim = () => {
    let active = rules.find((r) => r.isActive && r.targetType === 'GLOBAL') || {
      name: 'Global Default',
      percentage: 8.5,
      flatFee: 0.30,
    };

    if (calcCat) {
      const c = rules.find((r) => r.isActive && r.targetType === 'CATEGORY' && r.targetValue?.toLowerCase() === calcCat.toLowerCase());
      if (c) active = c;
    }

    if (calcVendor) {
      const v = rules.find((r) => r.isActive && r.targetType === 'VENDOR' && r.targetValue === calcVendor);
      if (v) active = v;
    }

    const comm = Math.min(calcAmount, Math.round(((calcAmount * active.percentage) / 100 + active.flatFee) * 100) / 100);
    const net = Math.max(0, calcAmount - comm);

    return { active, comm, net };
  };

  const simResult = resolveRuleForSim();

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Banner */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 rounded-xl font-bold">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Multi-Tiered Commission Engine</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-mono">Hierarchy: Vendor &gt; Product &gt; Category &gt; Global</span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">Marketplace Take-Rate & Fee Governance</h2>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Commission Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rules Registry Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Active Commission Rules ({rules.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Precedence Evaluated Live</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Rule Name</th>
                  <th className="py-2.5 px-3">Target Scope</th>
                  <th className="py-2.5 px-3">Target Match</th>
                  <th className="py-2.5 px-3">Commission %</th>
                  <th className="py-2.5 px-3">Flat Fee</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-white font-sans">{rule.name}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          rule.targetType === 'VENDOR'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : rule.targetType === 'PRODUCT'
                            ? 'bg-sky-950 text-sky-300 border border-sky-800'
                            : rule.targetType === 'CATEGORY'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {rule.targetType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{rule.targetValue || 'Global Default'}</td>
                    <td className="py-3 px-3 text-emerald-400 font-extrabold">{rule.percentage.toFixed(1)}%</td>
                    <td className="py-3 px-3 text-slate-300">${rule.flatFee.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onToggleRule(rule.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          rule.isActive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {rule.isActive ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-Time Commission Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black text-white flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Commission Simulator</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-400">Order Gross Amount ({currencySymbol})</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono font-bold outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="font-bold text-slate-400">Product Category</label>
              <select
                value={calcCat}
                onChange={(e) => setCalcCat(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-bold outline-none"
              >
                <option value="robotics">Robotics & Automation</option>
                <option value="electronics">Electronics & Computing</option>
                <option value="industrial">Industrial Metrology</option>
                <option value="fashion">Fashion & Apparel</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-400">Merchant / Vendor ID</label>
              <input
                type="text"
                value={calcVendor}
                onChange={(e) => setCalcVendor(e.target.value)}
                placeholder="e.g. merch-01"
                className="w-full mt-1 bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono outline-none"
              />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Applied Rule:</span>
                <span className="text-emerald-400 font-bold">{simResult.active.name}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Platform Take-Rate:</span>
                <span className="text-amber-400 font-bold">
                  {currencySymbol}{(simResult.comm * currencyRate).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-xs pt-1 border-t border-slate-800">
                <span>Net Seller Payout:</span>
                <span className="text-emerald-400">
                  {currencySymbol}{(simResult.net * currencyRate).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add Rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-[#131921] border border-[#37475a] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">Add New Commission Rule</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Machinery Tier"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400">Target Type Scope</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 outline-none"
                >
                  <option value="CATEGORY">Category Specific</option>
                  <option value="VENDOR">Vendor / Merchant Specific</option>
                  <option value="PRODUCT">Product SKU Specific</option>
                  <option value="GLOBAL">Global Default</option>
                </select>
              </div>

              {targetType !== 'GLOBAL' && (
                <div>
                  <label className="font-bold text-slate-400">Target Value Match</label>
                  <input
                    type="text"
                    required
                    placeholder={targetType === 'CATEGORY' ? 'e.g. robotics' : 'e.g. merch-01'}
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-400">Percentage %</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={percentage}
                    onChange={(e) => setPercentage(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 font-mono">Flat Fee ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={flatFee}
                    onChange={(e) => setFlatFee(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-1/2 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-emerald-500 text-slate-950 font-black rounded-xl"
              >
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
