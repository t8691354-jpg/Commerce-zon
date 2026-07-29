import React, { useState } from 'react';
import { DropshipAuditLog } from '../../types/dropshipping';
import {
  Sliders,
  ShieldAlert,
  Lock,
  Terminal,
  CheckCircle2,
  Clock,
  Key,
} from 'lucide-react';

interface AdminDropshipControlsViewProps {
  auditLogs: DropshipAuditLog[];
}

export const AdminDropshipControlsView: React.FC<AdminDropshipControlsViewProps> = ({
  auditLogs,
}) => {
  const [defaultCommission, setDefaultCommission] = useState(10.0);
  const [rateLimitRps, setRateLimitRps] = useState(100);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>ADMINISTRATOR CONTROLS & SECURITY AUDIT LOGS</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Global System Rules & Security Enforcement Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure system-wide commission rates, API rate limits, JWT token policies & inspect security audit logs
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>WAF & SQL Shield Active</span>
        </div>
      </div>

      {/* Controls Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-[#febd69]" />
            <span>Marketplace Commission Rules</span>
          </h3>

          <div>
            <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
              Default Marketplace Commission Take-Rate (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={defaultCommission}
              onChange={(e) => setDefaultCommission(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold focus:outline-none focus:border-[#febd69]"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Applied automatically to all new supplier products.</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-sky-400" />
            <span>Supplier API Security & Rate Limits</span>
          </h3>

          <div>
            <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
              Supplier REST / WebSocket API Rate Limit (Req / Sec)
            </label>
            <input
              type="number"
              value={rateLimitRps}
              onChange={(e) => setRateLimitRps(parseInt(e.target.value, 10) || 100)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold focus:outline-none focus:border-[#febd69]"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Prevents DDoS and inventory spamming.</span>
          </div>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs font-mono">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#febd69]" />
          <span>System Security Audit Trail Logs ({auditLogs.length})</span>
        </h3>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-[11px]">
              <div>
                <span className="font-bold text-white">{log.actor}</span>
                <span className="text-[#febd69] ml-2">[{log.role}]</span>
                <span className="text-slate-400 ml-2">• {log.action}</span>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">{log.details}</p>
              </div>

              <div className="text-right text-[10px] text-slate-500">
                <span>IP: {log.ipAddress}</span>
                <span className="block">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
