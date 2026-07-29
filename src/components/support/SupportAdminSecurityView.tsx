import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Sliders,
  CheckCircle2,
  Server,
  Key,
  Layers,
  AlertOctagon,
} from 'lucide-react';

export const SupportAdminSecurityView: React.FC = () => {
  const [jwtExpiry, setJwtExpiry] = useState('24 Hours');
  const [rateLimitRpm, setRateLimitRpm] = useState(120);
  const [e2eEncrypted, setE2eEncrypted] = useState(true);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>Support System Security, RBAC & Admin Governance</span>
          </h2>
          <p className="text-xs text-slate-400">
            JWT Token Refresh Controls, Role-Based Access Control (RBAC), Rate Limiting & AES-256 Encryption.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300 font-bold">AES-256 & TLS 1.3 Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Parameters Form */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-[#febd69]" />
            <span>Authentication & API Rate Limiting</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">JWT Auth Access Token TTL</label>
              <select
                value={jwtExpiry}
                onChange={(e) => setJwtExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#febd69]"
              >
                <option value="1 Hour">1 Hour (High Security)</option>
                <option value="8 Hours">8 Hours (Standard Shift)</option>
                <option value="24 Hours">24 Hours (Default)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                API Rate Limit Threshold (Requests / Minute)
              </label>
              <input
                type="number"
                value={rateLimitRpm}
                onChange={(e) => setRateLimitRpm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-white block">End-to-End Encryption (E2EE)</span>
                <span className="text-[10px] text-slate-400">Encrypt support message payloads before database write.</span>
              </div>
              <input
                type="checkbox"
                checked={e2eEncrypted}
                onChange={(e) => setE2eEncrypted(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* RBAC Matrix Overview */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Role-Based Access Control (RBAC) Matrix</span>
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-white font-bold">Customer (Buyer / Seller)</span>
              <span className="text-slate-400 text-[10px]">Create & View Own Tickets</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-white font-bold">Support Agent (Tier 1 & 2)</span>
              <span className="text-emerald-400 text-[10px]">Resolve, Reassign, Internal Notes</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-white font-bold">Support Supervisor / Admin</span>
              <span className="text-[#febd69] text-[10px]">Full Audit Logs, SLAs, Agent Roster</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
