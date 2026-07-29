import React, { useState } from 'react';
import { MOCK_AUDIT_LOGS_SECURITY } from '../../data/mockSecurityFraud';
import { AuditLogSecurity } from '../../types/securityFraud';
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
  Server,
  Activity,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AuditLogsMonitoringView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogSecurity[]>(MOCK_AUDIT_LOGS_SECURITY);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const filteredLogs = logs.filter(
    (l) =>
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ipAddress.includes(searchQuery) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportLogs = (fmt: string) => {
    setNotification(`Exporting ${filteredLogs.length} security audit log records as .${fmt.toUpperCase()} file...`);
    setTimeout(() => setNotification(null), 3500);
  };

  const systemServices = [
    { name: 'OAuth 2.0 & JWT Auth Gateway', health: '100% Operational', latency: '12ms', status: 'Healthy' },
    { name: 'PostgreSQL Primary Cluster (us-east-1)', health: 'Replication Lag: 8ms', latency: '4ms', status: 'Healthy' },
    { name: 'ClickHouse OLAP Telemetry Engine', health: 'Query Rate: 4,200 qps', latency: '18ms', status: 'Healthy' },
    { name: 'Stripe Payment Webhook Receiver', health: 'HMAC Validated', latency: '22ms', status: 'Healthy' },
    { name: 'Redis Distributed Session Lock Engine', health: 'Cache Hit: 99.6%', latency: '1ms', status: 'Healthy' },
    { name: 'Kafka High-Throughput Event Queue', health: 'Offset Lag: 0 msgs', latency: '6ms', status: 'Healthy' },
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* System Health Monitoring Grid */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          Real-Time Security & System Infrastructure Telemetry
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {systemServices.map((srv) => (
            <div key={srv.name} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-200 text-xs">{srv.name}</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded font-bold font-mono">
                  {srv.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{srv.health}</p>
              <span className="text-[10px] text-amber-400 font-mono">Latency: {srv.latency}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Immutable Security Audit Trail & Event Logs
            </h3>
            <p className="text-xs text-slate-400">
              SOC-2 compliant cryptographically hashed ledger recording all IAM, payment, and admin actions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user, IP, action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:border-amber-500 outline-none w-60 font-mono"
              />
            </div>

            <div className="flex space-x-1.5">
              <button
                onClick={() => handleExportLogs('csv')}
                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleExportLogs('json')}
                className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Log ID</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action Executed</th>
                <th className="py-2.5 px-3">IP & Location</th>
                <th className="py-2.5 px-3">Auth Scheme</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 text-amber-400 font-bold">{log.id}</td>
                  <td className="py-2.5 px-3 text-slate-200 font-bold">
                    {log.user} <span className="text-[10px] text-slate-400">({log.role})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-sans">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {log.ipAddress} <span className="text-[10px] text-slate-500">({log.location})</span>
                  </td>
                  <td className="py-2.5 px-3 text-purple-300">{log.authMethod}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
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
