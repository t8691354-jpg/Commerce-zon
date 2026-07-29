import React, { useState } from 'react';
import { MOCK_INTEGRATIONS } from '../../data/mockSuperAdmin';
import { IntegrationGateway } from '../../types/superAdmin';
import { Key, Link, CheckCircle2, RefreshCw, Lock, Server } from 'lucide-react';

export const IntegrationsApiVaultView: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationGateway[]>(MOCK_INTEGRATIONS);
  const [notification, setNotification] = useState<string | null>(null);

  const handleTestConnection = (id: string, name: string) => {
    setNotification(`Ping request sent to ${name} (${id}): API Connection Healthy (Latency < 200ms).`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              API Vault & Enterprise External Service Gateways
            </h3>
            <p className="text-xs text-slate-400">
              Manage encrypted credentials for Payment Processors, Logistics APIs, Email/SMS Dispatchers & CDN Storage
            </p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {integrations.map((item) => (
            <div key={item.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-amber-400 font-bold rounded">
                    {item.category}
                  </span>
                  <span className="text-slate-100 font-bold font-sans text-sm">{item.providerName}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                  <span>Key: <code className="text-slate-200">{item.apiKeyMasked}</code></span>
                  <span>Env: <strong className="text-emerald-400">{item.environment}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <span className="text-[10px] px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full font-bold">
                  {item.status} ({item.lastPingMs}ms)
                </span>

                <button
                  onClick={() => handleTestConnection(item.id, item.providerName)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
