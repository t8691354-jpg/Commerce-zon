import React, { useState } from 'react';
import { Settings, UserCheck, Globe, MapPin, DollarSign, ShieldCheck, Check, Lock, Sliders, Store, Warehouse, ShoppingCart, Activity } from 'lucide-react';

export type CommerceZonRole = 'BUYER' | 'SELLER' | 'WAREHOUSE' | 'ADMIN';

interface CommerceZonSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: CommerceZonRole;
  onRoleChange: (role: CommerceZonRole) => void;
  currentCurrency: string;
  onCurrencyChange: (curr: string) => void;
  deliverLocation: string;
  onDeliverLocationChange: (loc: string) => void;
  primeMember: boolean;
  onTogglePrime: () => void;
}

export const CommerceZonSettingsModal: React.FC<CommerceZonSettingsModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  currentCurrency,
  onCurrencyChange,
  deliverLocation,
  onDeliverLocationChange,
  primeMember,
  onTogglePrime,
}) => {
  const [customZip, setCustomZip] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const roles = [
    {
      id: 'BUYER' as CommerceZonRole,
      title: 'Commerce Zon Customer / Prime Buyer',
      desc: 'Shop products, use 1-click Commerce Zon Pay Wallet, track orders, and request returns.',
      icon: ShoppingCart,
      color: 'text-[#febd69]',
    },
    {
      id: 'SELLER' as CommerceZonRole,
      title: 'Seller Central / Vendor Merchant',
      desc: 'List products, view sales analytics, manage merchant inventory & store profile.',
      icon: Store,
      color: 'text-amber-400',
    },
    {
      id: 'WAREHOUSE' as CommerceZonRole,
      title: 'FBA Fulfillment & Warehouse Manager',
      desc: 'Manage multi-warehouse stock allocations, transfer inventory, and monitor regional hubs.',
      icon: Warehouse,
      color: 'text-blue-400',
    },
    {
      id: 'ADMIN' as CommerceZonRole,
      title: 'System Administrator / Executive',
      desc: 'Monitor Gemini AI engine, inspect real-time event bus, and view platform roadmap.',
      icon: Activity,
      color: 'text-emerald-400',
    },
  ];

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customZip.trim()) {
      onDeliverLocationChange(customZip.trim());
      setCustomZip('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#febd69] text-slate-950 rounded-xl font-bold">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Commerce Zon Official Settings & Role Hub</h2>
              <p className="text-xs text-slate-400">Configure your account role, currency, shipping region, and Prime status.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <div className="text-xs font-extrabold uppercase text-[#febd69] tracking-wider flex items-center space-x-1">
            <UserCheck className="w-4 h-4" />
            <span>Select Active Commerce Zon Account Role</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = currentRole === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => onRoleChange(role.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-[#131921] border-[#febd69] shadow-lg ring-1 ring-[#febd69]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${role.color}`} />
                      <span className="text-xs font-black text-white">{role.title}</span>
                    </div>
                    {isSelected && (
                      <span className="p-1 bg-[#febd69] text-slate-950 rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{role.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Currency & Delivery Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
          {/* Deliver To Selector */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#febd69]" />
              <span>Deliver To Location</span>
            </div>

            <p className="text-[11px] text-slate-400">Current: <strong className="text-white">{deliverLocation}</strong></p>

            <form onSubmit={handleZipSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Zip or City (e.g. NYC 10001)"
                value={customZip}
                onChange={(e) => setCustomZip(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-lg transition"
              >
                Update
              </button>
            </form>
          </div>

          {/* Currency Selection */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Currency & Region</span>
            </div>

            <p className="text-[11px] text-slate-400">Select preferred marketplace currency:</p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'USD', label: '$ USD' },
                { code: 'PKR', label: '₨ PKR' },
                { code: 'EUR', label: '€ EUR' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onCurrencyChange(c.code)}
                  className={`py-2 rounded-lg text-xs font-bold font-mono transition border ${
                    currentCurrency === c.code
                      ? 'bg-[#febd69] text-slate-950 border-[#febd69]'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prime Membership Toggle */}
        <div className="p-4 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-blue-800/80 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-black italic text-lg text-[#00a8e1]">prime</span>
              <span className="text-xs font-bold text-white">Commerce Zon Prime Membership Status</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Enjoy free 1-day delivery, 2% Commerce Zon Pay cashback, and exclusive lightning deals.
            </p>
          </div>

          <button
            onClick={onTogglePrime}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              primeMember
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {primeMember ? 'ACTIVE MEMBER' : 'ACTIVATE PRIME'}
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold text-center">
            ✓ Settings successfully saved! Marketplace views updated.
          </div>
        )}

        {/* Footer Action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-extrabold text-xs rounded-xl transition shadow"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
