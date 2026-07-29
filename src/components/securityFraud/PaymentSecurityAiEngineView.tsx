import React, { useState } from 'react';
import { MOCK_API_SECURITY_METRICS } from '../../data/mockSecurityFraud';
import { CreditCard, Bot, ShieldCheck, Cpu, Sliders, CheckCircle2, Zap, AlertTriangle, Lock } from 'lucide-react';

export const PaymentSecurityAiEngineView: React.FC = () => {
  const [riskLevel, setRiskLevel] = useState<'Standard' | 'Strict' | 'Paranoid'>('Strict');
  const [velocityCheckSeconds, setVelocityCheckSeconds] = useState(30);
  const [cardTestingBlockPct, setCardTestingBlockPct] = useState(99.8);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const handleApplyRules = () => {
    setActionMsg(`AI Risk Model Updated: Security level set to "${riskLevel}". Card testing block precision at ${cardTestingBlockPct}%.`);
    setTimeout(() => setActionMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {actionMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 p-6 rounded-2xl border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
              <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                AI Adaptive Payment & Behavioral Anomaly Engine
              </h3>
              <p className="text-xs text-purple-200">
                Machine learning classifier detecting card testing, duplicate payments, chargeback fraud & ATO in real time
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-bold self-start sm:self-auto">
            Neural Model v4.2 Active
          </span>
        </div>

        {/* Dynamic Controls */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Sliders className="w-4 h-4" />
            <span>Risk-Based Adaptive Authentication Threshold Controls:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium block">Fraud Strictness Mode</label>
              <div className="flex space-x-1.5">
                {(['Standard', 'Strict', 'Paranoid'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setRiskLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 ${
                      riskLevel === lvl
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Velocity Check Window:</span>
                <span className="text-amber-400 font-mono font-bold">{velocityCheckSeconds}s</span>
              </label>
              <input
                type="range"
                min="10"
                max="120"
                value={velocityCheckSeconds}
                onChange={(e) => setVelocityCheckSeconds(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleApplyRules}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition shadow flex items-center justify-center space-x-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Apply AI Guard Rules</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <CreditCard className="w-5 h-5" />
            <h4>Duplicate & Tamper Protection</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Idempotency keys enforced on every POST /checkout call. Cryptographic HMAC token signatures prevent client-side parameter tampering.
          </p>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
            0 Duplicate Charges Detected
          </span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <Lock className="w-5 h-5" />
            <h4>Card Testing Defense</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            BIN velocity limits & device fingerprinting instantly drop high-frequency small dollar authorization attempts before reaching payment gateways.
          </p>
          <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block">
            42 BIN Attackers Throttled (24h)
          </span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
            <Cpu className="w-5 h-5" />
            <h4>Account Takeover (ATO) Prevention</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Behavioral biometric analytics detect sudden IP, browser, or geography jumps, triggering step-up TOTP MFA before allowing payout changes.
          </p>
          <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 inline-block">
            Adaptive MFA Challenges Active
          </span>
        </div>
      </div>
    </div>
  );
};
