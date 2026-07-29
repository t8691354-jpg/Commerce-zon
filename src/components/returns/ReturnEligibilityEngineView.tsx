import React, { useState } from 'react';
import { MOCK_CATEGORY_POLICIES } from '../../data/returnsMockData';
import { ShieldCheck, AlertTriangle, Clock, Calendar, CheckCircle, XCircle, Calculator, Sliders } from 'lucide-react';

export const ReturnEligibilityEngineView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(MOCK_CATEGORY_POLICIES[0].category);
  const [purchaseDaysAgo, setPurchaseDaysAgo] = useState(10);
  const [itemPriceUSD, setItemPriceUSD] = useState(150);
  const [buyerFraudScore, setBuyerFraudScore] = useState(15);
  const [productCondition, setProductCondition] = useState<'UNOPENED' | 'OPENED_DEFECTIVE' | 'OPENED_CHANGED_MIND' | 'DAMAGED_BY_BUYER'>('OPENED_DEFECTIVE');

  const policy = MOCK_CATEGORY_POLICIES.find((p) => p.category === selectedCategory) || MOCK_CATEGORY_POLICIES[0];

  const daysRemaining = policy.returnWindowDays - purchaseDaysAgo;
  const isWithinWindow = policy.isReturnable && daysRemaining >= 0;
  const isHighFraudRisk = buyerFraudScore > 60;
  const isDamagedByBuyer = productCondition === 'DAMAGED_BY_BUYER';

  const isEligible = isWithinWindow && !isHighFraudRisk && !isDamagedByBuyer;

  const isAutoApprovalEligible =
    isEligible &&
    policy.allowAutoApproval &&
    itemPriceUSD <= policy.autoApprovalMaxUSD &&
    buyerFraudScore < 30;

  const estimatedRestockingFee = isEligible ? (itemPriceUSD * policy.restockingFeePercent) / 100 : 0;
  const netEstimatedRefund = isEligible ? itemPriceUSD - estimatedRestockingFee : 0;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-[#febd69]" />
            <span>Automated Return Eligibility Evaluation Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time policy validation matching category return windows, purchase age, fraud risk scoring, and condition metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-mono">
            Rules Version: 2026.4.1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Evaluation Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-5">
          <h3 className="text-xs font-bold text-[#febd69] uppercase tracking-wider flex items-center space-x-1.5">
            <Sliders className="w-4 h-4" />
            <span>Simulate Order Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                {MOCK_CATEGORY_POLICIES.map((p) => (
                  <option key={p.category} value={p.category}>
                    {p.category} ({p.returnWindowDays} Days Window)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Days Elapsed Since Delivery</label>
              <input
                type="number"
                min={0}
                max={90}
                value={purchaseDaysAgo}
                onChange={(e) => setPurchaseDaysAgo(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Item Purchase Value ($ USD)</label>
              <input
                type="number"
                min={1}
                value={itemPriceUSD}
                onChange={(e) => setItemPriceUSD(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Buyer Fraud Risk Score (0 - 100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={buyerFraudScore}
                onChange={(e) => setBuyerFraudScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Condition & Claim</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'UNOPENED', label: 'Unopened / Sealed' },
                { id: 'OPENED_DEFECTIVE', label: 'Opened / Defective' },
                { id: 'OPENED_CHANGED_MIND', label: 'Opened / Changed Mind' },
                { id: 'DAMAGED_BY_BUYER', label: 'Buyer Damaged / Used' },
              ].map((cond) => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => setProductCondition(cond.id as any)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition ${
                    productCondition === cond.id
                      ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          {/* Policy Matrix Specs */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-300">Category Policy Standard Rules ({policy.category})</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block">Return Window</span>
                <span className="font-mono text-white font-bold">{policy.returnWindowDays} Days</span>
              </div>
              <div>
                <span className="text-slate-500 block">Restocking Fee</span>
                <span className="font-mono text-white font-bold">{policy.restockingFeePercent}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Auto-Approve Cap</span>
                <span className="font-mono text-white font-bold">${policy.autoApprovalMaxUSD}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Inspection Req.</span>
                <span className="font-mono text-white font-bold">{policy.requiresInspection ? 'YES' : 'NO'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Realtime Evaluation Result Box */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Verdict</h3>

            <div
              className={`p-4 rounded-xl border flex items-center space-x-3 ${
                isEligible
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {isEligible ? (
                <CheckCircle className="w-8 h-8 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 flex-shrink-0" />
              )}
              <div>
                <div className="text-base font-black uppercase">
                  {isEligible ? 'RETURN ELIGIBLE' : 'RETURN INELIGIBLE'}
                </div>
                <div className="text-[11px] text-slate-300">
                  {isEligible
                    ? 'All marketplace safety & time constraints met.'
                    : isDamagedByBuyer
                    ? 'Ineligible: Product damage caused post-delivery.'
                    : isHighFraudRisk
                    ? 'Ineligible: Buyer account risk score exceeds limit.'
                    : 'Ineligible: Order delivered past return policy window.'}
                </div>
              </div>
            </div>

            {/* Sub Status Checks */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800/80 rounded-lg">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Return Window Remaining</span>
                </span>
                <span className={`font-mono font-bold ${daysRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {daysRemaining >= 0 ? `${daysRemaining} Days Left` : `Expired (${Math.abs(daysRemaining)} days late)`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800/80 rounded-lg">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Auto-Approval Routing</span>
                </span>
                <span
                  className={`font-mono font-bold ${
                    isAutoApprovalEligible ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                >
                  {isAutoApprovalEligible ? 'INSTANT APPROVAL' : 'MANUAL SELLER REVIEW'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800/80 rounded-lg">
                <span className="text-slate-400">Restocking Fee Deduction</span>
                <span className="font-mono text-slate-200 font-bold">-${estimatedRestockingFee.toFixed(2)} ({policy.restockingFeePercent}%)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-[#febd69]/30 rounded-lg">
                <span className="text-white font-bold">Estimated Net Refund</span>
                <span className="font-mono text-lg text-[#febd69] font-black">${netEstimatedRefund.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Rule Decision ID: <span className="font-mono text-slate-400">RUL-EVAL-9021-X</span>
          </div>
        </div>
      </div>
    </div>
  );
};
