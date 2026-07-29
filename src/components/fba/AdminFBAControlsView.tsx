import React, { useState } from 'react';
import { FBAEnrollmentRequest } from '../../types/fba';
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  DollarSign,
  UserCheck,
  Lock,
  Key,
  Shield,
  FileCode,
} from 'lucide-react';

interface AdminFBAControlsViewProps {
  enrollments: FBAEnrollmentRequest[];
  onApproveEnrollment: (sellerId: string) => void;
  onRejectEnrollment: (sellerId: string) => void;
}

export const AdminFBAControlsView: React.FC<AdminFBAControlsViewProps> = ({
  enrollments,
  onApproveEnrollment,
  onRejectEnrollment,
}) => {
  const [baseStorageRate, setBaseStorageRate] = useState(0.87);
  const [pickPackRate, setPickPackRate] = useState(4.80);
  const [longTermSurcharge, setLongTermSurcharge] = useState(6.90);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`FBA Global Storage & Fulfilment Rates Updated!\nBase Storage: $${baseStorageRate}/m³\nPick/Pack: $${pickPackRate}/order\nLong-Term Surcharge: $${longTermSurcharge}/unit`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-[#febd69]" />
            <span>ADMINISTRATOR FBA GLOBAL GOVERNANCE & RATE ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Configure Fee Rates, Approve Seller Enrollments & Enforce Security Policies</h2>
          <p className="text-xs text-slate-400 mt-1">
            Global administrative overrides for daily cubic storage fees, pick & pack order charges, seller onboarding & JWT/2FA security parameters
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-lg font-bold">
            SuperAdmin Auth Level 1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Global Storage & Fulfilment Rate Config */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Configure Global FBA Fee Schedule</span>
          </h3>

          <form onSubmit={handleSaveRates} className="space-y-3">
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Base Daily Storage Rate ($ / m³ / Day)</label>
              <input
                type="number"
                step="0.01"
                value={baseStorageRate}
                onChange={(e) => setBaseStorageRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Standard Pick & Pack Order Fee ($ / Order)</label>
              <input
                type="number"
                step="0.01"
                value={pickPackRate}
                onChange={(e) => setPickPackRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Long-Term Storage Surcharge (&gt;365 Days Stored)</label>
              <input
                type="number"
                step="0.01"
                value={longTermSurcharge}
                onChange={(e) => setLongTermSurcharge(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition shadow-lg"
            >
              Update Global Fee Schedule
            </button>
          </form>
        </div>

        {/* Pending Seller FBA Applications */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-mono">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Seller FBA Enrollment Approvals</span>
            </span>
            <span className="text-amber-400 text-[10px]">
              {enrollments.filter((e) => e.status === 'PENDING_APPROVAL').length} Pending
            </span>
          </h3>

          <div className="space-y-3 text-xs">
            {enrollments.map((e) => (
              <div key={e.sellerId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{e.businessName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      e.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {e.status}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <div>Seller ID: <strong className="text-slate-200">{e.sellerId}</strong></div>
                  <div>Tax ID / EIN: <strong className="text-slate-200">{e.taxId}</strong></div>
                  <div>Monthly Est: <strong className="text-emerald-400">{e.monthlyVolumeEstUnits.toLocaleString()} units</strong></div>
                </div>

                {e.status === 'PENDING_APPROVAL' && (
                  <div className="flex space-x-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onApproveEnrollment(e.sellerId)}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                    >
                      Approve Application
                    </button>
                    <button
                      onClick={() => onRejectEnrollment(e.sellerId)}
                      className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[10px]"
                    >
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Security Controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Lock className="w-4 h-4 text-purple-400" />
          <span>FBA System Security Policies & Access Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">JWT Authentication</span>
            <span className="text-emerald-400 font-bold block">RS256 Signed Tokens</span>
            <span className="text-[9px] text-slate-400 block">15-Min Access Token Expiry</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">Two-Factor Auth (2FA)</span>
            <span className="text-emerald-400 font-bold block">Enforced for Admin Roles</span>
            <span className="text-[9px] text-slate-400 block">TOTP Authenticator Apps</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">API Rate Limiting</span>
            <span className="text-sky-400 font-bold block">10,000 Req / Min</span>
            <span className="text-[9px] text-slate-400 block">DDoS Mitigation Layer</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase block">SQL & XSS Protection</span>
            <span className="text-purple-300 font-bold block">Parameterized Queries</span>
            <span className="text-[9px] text-slate-400 block">Content Security Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
