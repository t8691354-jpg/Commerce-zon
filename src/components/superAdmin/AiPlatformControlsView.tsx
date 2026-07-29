import React, { useState } from 'react';
import { MOCK_AI_SERVICES } from '../../data/mockSuperAdmin';
import { AiServiceConfig } from '../../types/superAdmin';
import { Cpu, Zap, Activity, CheckCircle2, Sliders, DollarSign, RefreshCw } from 'lucide-react';

export const AiPlatformControlsView: React.FC = () => {
  const [services, setServices] = useState<AiServiceConfig[]>(MOCK_AI_SERVICES);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleServiceStatus = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.serviceId === serviceId ? { ...s, status: s.status === 'Enabled' ? 'Disabled' : 'Enabled' } : s
      )
    );
    setNotification(`AI Service ${serviceId} state toggled.`);
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
              <Cpu className="w-5 h-5 text-amber-400" />
              Gemini AI Model & Neural Engine Controls
            </h3>
            <p className="text-xs text-slate-400">
              Manage semantic search, behavioral recommendations, AI shopping assistant & real-time fraud classifier
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div key={srv.serviceId} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{srv.serviceId}</span>
                  <h4 className="font-bold text-slate-100 text-sm">{srv.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Model: {srv.model}</p>
                </div>

                <button
                  onClick={() => toggleServiceStatus(srv.serviceId)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                    srv.status === 'Enabled'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {srv.status}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div>Avg Latency: <span className="text-emerald-400 font-bold">{srv.latencyMs}ms</span></div>
                <div>Monthly Cost: <span className="text-amber-400 font-bold">${srv.monthlyCostEstimateUsd}</span></div>
                <div>Rate Limit: <span className="text-blue-400 font-bold">{srv.rateLimitPerMin}/min</span></div>
                <div>Confidence: <span className="text-purple-400 font-bold">{srv.confidenceThresholdPct}%</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
