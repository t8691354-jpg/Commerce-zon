import React, { useState } from 'react';
import { SlaPolicy } from '../../types/support';
import { MOCK_SLA_POLICIES } from '../../data/supportMockData';
import {
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  BellRing,
  RotateCcw,
} from 'lucide-react';

export const SlaPolicyManagerView: React.FC = () => {
  const [policies, setPolicies] = useState<SlaPolicy[]>(MOCK_SLA_POLICIES);

  const handleUpdateTarget = (
    policyId: string,
    field: 'firstResponseTargetMinutes' | 'resolutionTargetHours',
    value: number
  ) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.policyId === policyId) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Service Level Agreement (SLA) & Escalation Matrix</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure automated response timers, resolution target deadlines, and VIP buyer escalation rules.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/30">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300 font-bold">Overall SLA Compliance: 98.4%</span>
        </div>
      </div>

      {/* SLA Policy Target Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policies.map((p) => (
          <div key={p.policyId} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span
                className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded ${
                  p.priority === 'URGENT_CRITICAL'
                    ? 'bg-rose-500 text-slate-950'
                    : p.priority === 'HIGH'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {p.priority}
              </span>
              <span className="font-mono text-[10px] text-slate-500">{p.policyId}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  First Response Target (Minutes)
                </label>
                <input
                  type="number"
                  value={p.firstResponseTargetMinutes}
                  onChange={(e) =>
                    handleUpdateTarget(p.policyId, 'firstResponseTargetMinutes', Number(e.target.value))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Resolution Deadline Target (Hours)
                </label>
                <input
                  type="number"
                  value={p.resolutionTargetHours}
                  onChange={(e) =>
                    handleUpdateTarget(p.policyId, 'resolutionTargetHours', Number(e.target.value))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Auto-Escalate After:</span>
                  <span className="text-amber-400 font-bold">{p.autoEscalateAfterHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Prime VIP Multiplier:</span>
                  <span className="text-cyan-400 font-bold">{p.vipCustomerMultiplier}x Speed</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SLA Breach Early Warning Feed */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Live SLA Breach Prevention & Breach Alerts</span>
        </h3>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-[#febd69] font-bold">TCK-90124 (Order Package Misplacement)</span>
            <span className="text-emerald-400 font-bold">14 minutes remaining until First Response SLA</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Ticket assigned to Senior CX Agent Sarah Jenkins. Automatic supervisor notification arming at T-05m.
          </p>
        </div>
      </div>
    </div>
  );
};
