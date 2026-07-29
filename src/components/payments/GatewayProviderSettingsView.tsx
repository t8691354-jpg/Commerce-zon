import React, { useState } from 'react';
import { PaymentGatewayConfig, PaymentMethodSetting } from '../../types/payments';
import {
  MOCK_GATEWAY_CONFIGS,
  MOCK_PAYMENT_METHOD_SETTINGS,
} from '../../data/paymentsMockData';
import {
  Settings2,
  CheckCircle2,
  XCircle,
  KeyRound,
  ShieldCheck,
  CreditCard,
  Building2,
  Wallet,
  Globe,
  Sliders,
  DollarSign,
  Lock,
} from 'lucide-react';

export const GatewayProviderSettingsView: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(MOCK_GATEWAY_CONFIGS);
  const [methodSettings, setMethodSettings] = useState<PaymentMethodSetting[]>(MOCK_PAYMENT_METHOD_SETTINGS);

  const handleToggleGateway = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isEnabled: !g.isEnabled } : g))
    );
  };

  const handleToggleMethod = (type: string) => {
    setMethodSettings((prev) =>
      prev.map((m) => (m.type === type ? { ...m, isEnabled: !m.isEnabled } : m))
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Settings2 className="w-4 h-4 text-sky-400" />
            <span>PAYMENT PROVIDERS & METHOD ARCHITECTURE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Gateway Integration & Method Configuration</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enable or disable global payment gateways, configure merchant fees, 3D Secure rules & webhook listeners
          </p>
        </div>
      </div>

      {/* Section 1: Payment Method Master Toggles */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#febd69]" />
          <span>Active Marketplace Payment Methods ({methodSettings.filter((m) => m.isEnabled).length} Enabled)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methodSettings.map((m) => (
            <div
              key={m.type}
              className={`p-4 rounded-xl border transition flex items-start justify-between text-xs ${
                m.isEnabled
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{m.label}</span>
                  {m.requires3DSecure && (
                    <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-400 text-[9px] font-bold rounded">
                      3DS 2.0
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs">{m.description}</p>

                <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500 pt-1">
                  <span>Min: ${m.minOrderValue}</span>
                  <span>•</span>
                  <span>Max: ${m.maxOrderValue.toLocaleString()}</span>
                  <span>•</span>
                  <span>Fee: {m.surchargePct}% + ${m.surchargeFixed.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => handleToggleMethod(m.type)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                  m.isEnabled
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m.isEnabled ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Payment Providers Config Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Modular Payment Gateway Adapters ({gateways.length} Integrated)</span>
        </h3>

        <div className="space-y-3">
          {gateways.map((g) => (
            <div key={g.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-[#febd69]">
                    {g.id.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{g.name}</span>
                      {g.isTestMode && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                          TEST MODE
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Currencies: {g.supportedCurrencies.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-slate-400">Processing Fee:</span>
                    <div className="text-emerald-400 font-bold">
                      {g.transactionFeePct}% + ${g.transactionFeeFixed.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleGateway(g.id)}
                    className={`px-4 py-1.5 rounded-xl font-bold transition text-xs ${
                      g.isEnabled
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.isEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>

              {/* API Credentials Preview */}
              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#febd69]" />
                  <span>API Key Preview: <strong className="text-white">{g.apiKeyPreview || 'Internal System Secret'}</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Webhook Verification: {g.webhookSecretConfigured ? '✓ VERIFIED' : '✗ PENDING'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
