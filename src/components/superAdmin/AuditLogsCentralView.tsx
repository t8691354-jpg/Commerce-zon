import React, { useState } from 'react';
import { MOCK_CENTRAL_AUDIT_LOGS } from '../../data/mockSuperAdmin';
import { CentralAuditLog } from '../../types/superAdmin';
import { ShieldCheck, Search, Download, Filter, FileText } from 'lucide-react';

export const AuditLogsCentralView: React.FC = () => {
  const [logs] = useState<CentralAuditLog[]>(MOCK_CENTRAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.targetModule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Centralized Immutable System Audit Trail
            </h3>
            <p className="text-xs text-slate-400">
              Cryptographically verifiable log ledger recording all Super Admin, System & Security modifications
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-amber-500 outline-none w-64 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">Log ID</th>
                <th className="py-3 px-3">Actor & Role</th>
                <th className="py-3 px-3">Action Details</th>
                <th className="py-3 px-3">Target Module</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-amber-400 font-bold">{log.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-sans font-bold text-slate-200">{log.actor}</div>
                    <div className="text-[10px] text-slate-500">{log.role}</div>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{log.action}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">
                      {log.targetModule}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{log.ipAddress}</td>
                  <td className="py-3 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : log.severity === 'WARN'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
