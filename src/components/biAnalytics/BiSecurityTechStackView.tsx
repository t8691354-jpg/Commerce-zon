import React from 'react';
import { MOCK_SECURITY_AUDIT_LOGS } from '../../data/mockBiAnalytics';
import { ShieldCheck, Cpu, Lock, Key, Server, Database, Activity, FileCheck, CheckCircle2 } from 'lucide-react';

export const BiSecurityTechStackView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Tech Stack Visual Architecture Matrix */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            Enterprise Analytics & BI Technical Infrastructure Stack
          </h3>
          <p className="text-xs text-slate-400">High-throughput microservices architecture handling billions of marketplace telemetry events</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold font-sans">Backend & API Layer</span>
            <p className="text-slate-200 font-bold text-sm">Python FastAPI</p>
            <p className="text-slate-400 text-[11px]">Async ASGI engine with automatic OpenAPI documentation & Pydantic validation</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-blue-400 font-bold font-sans">Analytics & Storage</span>
            <p className="text-slate-200 font-bold text-sm">ClickHouse + Spark</p>
            <p className="text-slate-400 text-[11px]">Apache Spark event streaming + ClickHouse columnar OLAP store for instant queries</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold font-sans">Primary DB & Caching</span>
            <p className="text-slate-200 font-bold text-sm">PostgreSQL + Redis</p>
            <p className="text-slate-400 text-[11px]">ACID relational data, Redis distributed caching & Elasticsearch full-text search</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-purple-400 font-bold font-sans">Auth & Security</span>
            <p className="text-slate-200 font-bold text-sm">JWT + 2FA + RBAC</p>
            <p className="text-slate-400 text-[11px]">HMAC-SHA256 signed JWTs, Refresh Token rotation, TOTP 2FA, Audit Logs</p>
          </div>
        </div>
      </div>

      {/* Security Audit Logs */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Immutable Security & Compliance Audit Log Feed
          </span>
          <span className="text-xs font-mono text-slate-400">SOC-2 Type II Compliant Audit Trail</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action Executed</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Auth Scheme</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_SECURITY_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 text-amber-400 font-bold">{log.id}</td>
                  <td className="py-2.5 px-3 text-slate-200 font-bold">
                    {log.user} <span className="text-[10px] text-slate-400">({log.role})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.ipAddress}</td>
                  <td className="py-2.5 px-3 text-blue-400">{log.authMethod}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {log.status}
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
