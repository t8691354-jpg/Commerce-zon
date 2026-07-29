import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Download,
  ShieldAlert,
  Cpu,
  CreditCard,
  User,
  Mail,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  FileCode,
  CheckCircle2,
} from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  category: 'User Logs' | 'Admin Logs' | 'Security Logs' | 'Payment Logs' | 'API Logs' | 'AI Logs' | 'Email Logs' | 'SMS Logs' | 'Error Logs';
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  actor: string;
  action: string;
  ipAddress: string;
  details: string;
}

export const CentralLogsCenter: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-8801',
      timestamp: '2026-07-28 06:42:12 UTC',
      category: 'AI Logs',
      level: 'INFO',
      actor: 'Gemini 2.5 Flash Orchestrator',
      action: 'VECTOR_INDEX_RERANK',
      ipAddress: '10.240.0.12',
      details: 'Neural search re-ranked top 24 query results for query "wireless noise canceling headphones". Latency: 18ms.',
    },
    {
      id: 'log-8802',
      timestamp: '2026-07-28 06:38:05 UTC',
      category: 'Security Logs',
      level: 'WARN',
      actor: 'AI Fraud Shield (Module 19)',
      action: 'VELOCITY_ANOMALY_BLOCKED',
      ipAddress: '198.51.100.44',
      details: 'High-frequency payment attempt blocked from IP 198.51.100.44. Risk score: 94/100.',
    },
    {
      id: 'log-8803',
      timestamp: '2026-07-28 06:30:00 UTC',
      category: 'Payment Logs',
      level: 'INFO',
      actor: 'Stripe Gateway Proxy',
      action: 'SETTLEMENT_DISPATCHED',
      ipAddress: '10.240.4.88',
      details: 'Batch payout $48,290.10 dispatched to merchant bank account chase_comm_882.',
    },
    {
      id: 'log-8804',
      timestamp: '2026-07-28 06:15:22 UTC',
      category: 'Admin Logs',
      level: 'INFO',
      actor: 'superadmin@commercezone.com',
      action: 'FEATURE_FLAG_UPDATED',
      ipAddress: '172.16.0.4',
      details: 'Updated feature flag "fba_cross_docking_v2" from BETA to PRODUCTION.',
    },
    {
      id: 'log-8805',
      timestamp: '2026-07-28 05:50:11 UTC',
      category: 'Error Logs',
      level: 'ERROR',
      actor: 'Inventory Sync Service',
      action: 'WAREHOUSE_TIMEOUT_RETRY',
      ipAddress: '10.240.2.14',
      details: 'Warehouse US-WEST-2 API connection timed out after 5000ms. Retrying attempt 2/3.',
    },
    {
      id: 'log-8806',
      timestamp: '2026-07-28 05:20:44 UTC',
      category: 'User Logs',
      level: 'INFO',
      actor: 'buyer_9921@domain.com',
      action: 'MFA_AUTH_SUCCESS',
      ipAddress: '203.0.113.12',
      details: 'User authenticated successfully using WebAuthn / TOTP MFA token.',
    },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLevel, setActiveLevel] = useState<string>('All');
  const [query, setQuery] = useState<string>('');

  const categories = [
    'All',
    'User Logs',
    'Admin Logs',
    'Security Logs',
    'Payment Logs',
    'API Logs',
    'AI Logs',
    'Email Logs',
    'Error Logs',
  ];

  const levels = ['All', 'INFO', 'WARN', 'ERROR', 'FATAL'];

  const filtered = logs.filter((log) => {
    if (activeCategory !== 'All' && log.category !== activeCategory) return false;
    if (activeLevel !== 'All' && log.level !== activeLevel) return false;
    if (!query) return true;
    return (
      log.actor.toLowerCase().includes(query.toLowerCase()) ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.details.toLowerCase().includes(query.toLowerCase()) ||
      log.ipAddress.includes(query)
    );
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'FATAL':
      case 'ERROR':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'WARN':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <Terminal className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Central Telemetry & Audit Logs Center</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Immutable event stream • Real-time security, AI, API & system audit log observer
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono transition flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Stream Live</span>
          </button>

          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-amber-500/10">
            <Download className="w-4 h-4" />
            <span>Export CSV Audit</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search logs by actor, action, IP or details..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Level:</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition border ${
                  activeLevel === lvl
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition ${
                activeCategory === cat
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Level</th>
                <th className="p-4">Category</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${getLevelBadge(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-bold whitespace-nowrap">{log.category}</td>
                  <td className="p-4 text-amber-400 font-bold whitespace-nowrap">{log.actor}</td>
                  <td className="p-4 text-slate-200 font-bold whitespace-nowrap">{log.action}</td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">{log.ipAddress}</td>
                  <td className="p-4 text-slate-300 max-w-md truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
