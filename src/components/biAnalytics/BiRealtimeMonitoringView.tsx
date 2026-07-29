import React, { useState, useEffect } from 'react';
import { MOCK_REALTIME_METRICS } from '../../data/mockBiAnalytics';
import { Activity, Server, Radio, Cpu, HardDrive, Wifi, Zap, CheckCircle2 } from 'lucide-react';

export const BiRealtimeMonitoringView: React.FC = () => {
  const [metrics, setMetrics] = useState(MOCK_REALTIME_METRICS);
  const [liveLog, setLiveLog] = useState<string[]>([
    '02:34:10 - WebSocket connected to telemetry server cluster us-west-1a',
    '02:34:12 - Ingestion throughput: 14,820 events/sec via Spark Streaming',
    '02:34:15 - ClickHouse materialized views updated successfully',
  ]);

  // Simulate WebSocket pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          const delta = (Math.random() - 0.45) * (m.value * 0.02);
          const newVal = Math.max(1, Math.round((m.value + delta) * 10) / 10);
          return { ...m, value: newVal };
        })
      );

      const timestamp = new Date().toISOString().substring(11, 19);
      const randomEvents = [
        `Spark Stream consumed 1,240 order state transitions`,
        `FBA Dispatch Hub SEA-01 completed robotic parcel sorting batch`,
        `AI Search inference cluster responded in 12ms`,
        `Redis cluster cache hit ratio steady at 99.4%`,
      ];
      const nextLog = `${timestamp} - ${randomEvents[Math.floor(Math.random() * randomEvents.length)]}`;
      setLiveLog((prev) => [nextLog, ...prev.slice(0, 10)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Live Streaming Operations Telemetry</h3>
              <p className="text-xs text-slate-400">WebSocket real-time event pipeline consuming millions of marketplace interactions</p>
            </div>
          </div>
          <span className="flex items-center text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
            LIVE TELEMETRY ACTIVE
          </span>
        </div>

        {/* Realtime Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.metric} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">{m.metric}</span>
              <p className="text-2xl font-black text-amber-400 font-mono">
                {m.value.toLocaleString()} <span className="text-xs font-sans text-slate-400">{m.unit}</span>
              </p>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Status: {m.status}
              </span>
            </div>
          ))}
        </div>

        {/* Live Terminal Log Stream */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            Live Ingestion Event Stream Terminal
          </span>
          <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 h-40 overflow-y-auto space-y-1 text-emerald-400">
            {liveLog.map((log, i) => (
              <p key={i} className="text-[11px] leading-relaxed">
                &gt; {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
