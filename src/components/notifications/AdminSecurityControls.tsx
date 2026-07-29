import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Key, Server, Settings, AlertTriangle, RefreshCw, Save, Zap, CheckCircle2, Sliders
} from 'lucide-react';
import { ChannelControlConfig } from '../../types/notifications';

interface Props {
  channels: ChannelControlConfig[];
  onToggleChannel: (channelId: string) => void;
  onUpdateChannelLimit: (channelId: string, limit: number) => void;
}

export const AdminSecurityControls: React.FC<Props> = ({ channels, onToggleChannel, onUpdateChannelLimit }) => {
  const [maxRetries, setMaxRetries] = useState<number>(3);
  const [backoffMultiplier, setBackoffMultiplier] = useState<number>(2.0);
  const [rateLimitThrottling, setRateLimitThrottling] = useState<number>(1000);
  const [jwtRefreshEnabled, setJwtRefreshEnabled] = useState<boolean>(true);
  const [e2eEncryptionActive, setE2eEncryptionActive] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Administrator Infrastructure & Security Control Console</h2>
            <p className="text-xs text-slate-400">Gateway provider status, rate limits, retry rules, JWT auth & E2EE encryption policies</p>
          </div>
        </div>

        <button
          onClick={() => alert('Infrastructure & Security configuration persisted to cloud vault!')}
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center space-x-1.5 shadow"
        >
          <Save className="w-4 h-4" />
          <span>Save Config</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Channel Provider Toggles & Rate Limits */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Server className="w-4 h-4 text-amber-400" />
            <span>Channel Delivery Providers & Throughput Limits</span>
          </h3>

          <div className="space-y-3">
            {channels.map((ch) => (
              <div key={ch.id} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{ch.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                      {ch.provider}
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ch.enabled}
                      onChange={() => onToggleChannel(ch.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Daily Limit</span>
                    <input
                      type="number"
                      value={ch.dailyLimit}
                      onChange={(e) => onUpdateChannelLimit(ch.id, Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono mt-0.5"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Sent Today</span>
                    <div className="text-xs font-mono font-bold text-sky-400 mt-1">{ch.dailySentToday.toLocaleString()}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Throughput</span>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-1">{ch.throughputPerSec} / sec</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security, Auth & Retry Rules */}
        <div className="lg:col-span-5 space-y-6">
          {/* Queue & Retry Mechanics */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Retry Rules & Exponential Backoff</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Retry Attempts Before DLQ</label>
                <select
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value={1}>1 Attempt</option>
                  <option value={3}>3 Attempts (Recommended)</option>
                  <option value={5}>5 Attempts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Exponential Backoff Multiplier</label>
                <select
                  value={backoffMultiplier}
                  onChange={(e) => setBackoffMultiplier(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value={1.5}>1.5x Linear Backoff</option>
                  <option value={2.0}>2.0x Exponential Backoff (Standard)</option>
                  <option value={3.0}>3.0x Aggressive Backoff</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security & Token Architecture */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Authentication & Encryption Policies</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">JWT Refresh Token Rotation</div>
                  <div className="text-[10px] text-slate-400">Strict WebSocket session validation</div>
                </div>
                <input
                  type="checkbox"
                  checked={jwtRefreshEnabled}
                  onChange={(e) => setJwtRefreshEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">End-to-End Payload Encryption</div>
                  <div className="text-[10px] text-slate-400">AES-256 at-rest & TLS 1.3 in-transit</div>
                </div>
                <input
                  type="checkbox"
                  checked={e2eEncryptionActive}
                  onChange={(e) => setE2eEncryptionActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400">Active Security Compliance:</div>
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SOC2 Type II • HIPAA Email • GDPR Opt-Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
