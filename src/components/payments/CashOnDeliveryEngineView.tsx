import React, { useState } from 'react';
import { CODRuleSetting } from '../../types/payments';
import { MOCK_COD_RULES } from '../../data/paymentsMockData';
import {
  Banknote,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sliders,
  Lock,
  Globe,
  Smartphone,
} from 'lucide-react';

export const CashOnDeliveryEngineView: React.FC = () => {
  const [codRules, setCodRules] = useState<CODRuleSetting>(MOCK_COD_RULES);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span>CASH ON DELIVERY (COD) ELIGIBILITY & RISK RULES</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Cash on Delivery Management Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure COD order caps, courier collection fees, SMS OTP verification requirements & risk geography filters
          </p>
        </div>

        <button
          onClick={() => setCodRules((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
          className={`px-5 py-2.5 rounded-xl font-black text-xs transition shadow-lg ${
            codRules.isEnabled
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-rose-600 text-white hover:bg-rose-500'
          }`}
        >
          {codRules.isEnabled ? '✓ COD ENGINE ENABLED' : '✕ COD ENGINE DISABLED'}
        </button>
      </div>

      {/* Rules Config Panel */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#febd69]" />
          <span>Risk & Collection Rules Parameter Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-300">Max Order Value Cap (USD):</label>
            <input
              type="number"
              value={codRules.maxOrderLimitUSD}
              onChange={(e) => setCodRules({ ...codRules, maxOrderLimitUSD: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">Orders exceeding this limit cannot select Cash on Delivery.</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-300">Fixed COD Courier Surcharge Fee (USD):</label>
            <input
              type="number"
              value={codRules.codFeeUSD}
              onChange={(e) => setCodRules({ ...codRules, codFeeUSD: parseFloat(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-emerald-400 font-mono font-bold focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">Surcharge added to order for cash collection & courier liability.</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-300">Minimum Buyer Trust Score (0-100):</label>
            <input
              type="number"
              value={codRules.minCustomerTrustScore}
              onChange={(e) => setCodRules({ ...codRules, minCustomerTrustScore: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[#febd69] font-mono font-bold focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block">Blocks new/unverified accounts with high risk history.</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>Mandatory SMS / Phone OTP Verification for COD Checkout</span>
            </span>
            <p className="text-slate-400 text-[11px]">Requires customer to enter a 6-digit SMS code before COD order creation.</p>
          </div>

          <button
            onClick={() => setCodRules({ ...codRules, verificationOTPRequired: !codRules.verificationOTPRequired })}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              codRules.verificationOTPRequired
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {codRules.verificationOTPRequired ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>
    </div>
  );
};
