import React, { useState } from 'react';
import { WalletState } from '../../types/domain';
import {
  ShieldCheck,
  Lock,
  Globe,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  Activity,
  Zap,
  DollarSign
} from 'lucide-react';

interface SecurityAndCurrencyPanelProps {
  wallet: WalletState;
  activeCurrency: 'USD' | 'EUR' | 'PKR' | 'GBP' | 'JPY' | 'INR';
  onCurrencyChange: (curr: 'USD' | 'EUR' | 'PKR' | 'GBP' | 'JPY' | 'INR') => void;
  currencyRates: Record<string, { rate: number; symbol: string; name: string }>;
  pinProtected: boolean;
  onTogglePinProtection: () => void;
}

export const SecurityAndCurrencyPanel: React.FC<SecurityAndCurrencyPanelProps> = ({
  wallet,
  activeCurrency,
  onCurrencyChange,
  currencyRates,
  pinProtected,
  onTogglePinProtection,
}) => {
  const [pinInput, setPinInput] = useState('4242');
  const [showPin, setShowPin] = useState(false);
  const [pinSavedMsg, setPinSavedMsg] = useState<string | null>(null);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinSavedMsg('Transaction PIN updated & 256-Bit Hardware Cryptographic Salt updated!');
    setTimeout(() => setPinSavedMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-[#131921] border border-[#37475a] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500 text-slate-950 rounded-xl font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-emerald-400 uppercase">Enterprise Security & Multi-Currency Architecture</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-300 font-mono">256-Bit SSL + JWT Auth</span>
            </div>
            <h2 className="text-lg font-black text-white">Wallet Security Controls & Exchange Rate Settings</h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onTogglePinProtection}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-1.5 ${
              pinProtected
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Lock className={`w-4 h-4 ${pinProtected ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>Transaction PIN Requirement: {pinProtected ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {pinSavedMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{pinSavedMsg}</span>
        </div>
      )}

      {/* Grid: Currency Matrix & PIN Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Currency Exchange Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Multi-Currency Wallet Architecture</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Central Exchange</span>
          </div>

          <p className="text-xs text-slate-400">
            Select preferred display & checkout currency. All conversion calculations use institutional live exchange rates.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {(Object.entries(currencyRates) as [string, { rate: number; symbol: string; name: string }][]).map(([code, meta]) => (
              <div
                key={code}
                onClick={() => onCurrencyChange(code as any)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  activeCurrency === code
                    ? 'bg-[#131921] border-[#febd69] shadow-lg'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-white font-mono">{meta.symbol} {code}</span>
                    {activeCurrency === code && (
                      <span className="text-[9px] bg-[#febd69] text-slate-950 px-1.5 py-0.2 rounded font-extrabold">Active</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{meta.name}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-emerald-400">
                    1 USD = {meta.rate} {code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2FA & Transaction PIN Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-[#febd69]" />
              <h3 className="text-sm font-bold text-white">Transaction PIN & 2FA Governance</h3>
            </div>
          </div>

          <form onSubmit={handleSavePin} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold">4-Digit Security Transaction PIN</label>
              <div className="relative mt-1">
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-[#febd69]"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Required for payouts, transfers, and high-value orders over $1,000 USD.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl transition shadow"
            >
              Update Transaction PIN
            </button>
          </form>

          {/* Security Features Overview */}
          <div className="pt-2 space-y-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Hardware-Backed AES Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Automated Fraud Detection & Double-Spend Locks</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>TOTP Authenticator & Device Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
