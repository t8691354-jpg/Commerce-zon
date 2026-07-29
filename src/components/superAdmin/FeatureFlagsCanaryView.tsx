import React, { useState } from 'react';
import { MOCK_FEATURE_FLAGS } from '../../data/mockSuperAdmin';
import { FeatureFlag } from '../../types/superAdmin';
import { Sliders, ToggleLeft, ToggleRight, CheckCircle2, Globe, Users } from 'lucide-react';

export const FeatureFlagsCanaryView: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>(MOCK_FEATURE_FLAGS);
  const [notification, setNotification] = useState<string | null>(null);

  const toggleFlagStatus = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => {
        if (f.key === key) {
          const nextStatus = f.status === 'Enabled' ? 'Disabled' : 'Enabled';
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
    setNotification(`Feature flag key "${key}" rollout status modified.`);
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
              <Sliders className="w-5 h-5 text-amber-400" />
              Dynamic Feature Flags, Canary & Regional Rollouts
            </h3>
            <p className="text-xs text-slate-400">
              Control A/B testing, Canary 10% deployments, beta tester groups & instant feature kill-switches
            </p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {flags.map((flag) => (
            <div key={flag.key} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-amber-400 font-bold text-sm block">{flag.name}</span>
                  <code className="text-[10px] text-slate-500">{flag.key}</code>
                </div>

                <button
                  onClick={() => toggleFlagStatus(flag.key)}
                  className={`px-3 py-1.5 rounded-full font-bold text-xs transition border flex items-center space-x-1.5 ${
                    flag.status === 'Enabled' || flag.status.includes('Canary') || flag.status.includes('Beta')
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  <span>{flag.status}</span>
                </button>
              </div>

              <p className="font-sans text-xs text-slate-300">{flag.description}</p>

              <div className="flex justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                <span>Regions: {flag.targetRegions.join(', ')}</span>
                <span>Modified by: {flag.lastModifiedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
