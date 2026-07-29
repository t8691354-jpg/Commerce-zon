import React, { useState } from 'react';
import { MOCK_DISASTER_RECOVERY } from '../../data/mockSecurityFraud';
import { DisasterRecoveryStatus } from '../../types/securityFraud';
import { Database, Server, RefreshCw, CheckCircle2, ShieldCheck, Zap, HardDrive, AlertTriangle } from 'lucide-react';

export const DisasterRecoveryView: React.FC = () => {
  const [drServices, setDrServices] = useState<DisasterRecoveryStatus[]>(MOCK_DISASTER_RECOVERY);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSimulatingFailover, setIsSimulatingFailover] = useState(false);

  const handleTriggerSnapshot = () => {
    setNotification('Initiating zero-downtime multi-region database snapshot across us-east-1 and us-west-2...');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTestFailover = () => {
    setIsSimulatingFailover(true);
    setNotification('Simulating automated failover sequence to secondary region us-west-2...');
    setTimeout(() => {
      setIsSimulatingFailover(false);
      setNotification('Disaster Recovery Failover Simulation Complete: RTO < 12 seconds, RPO = 0 ms. All services healthy.');
      setTimeout(() => setNotification(null), 4000);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* DR Banner & Action Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 rounded-2xl border border-blue-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-300">
              <Database className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Disaster Recovery & Business Continuity Infrastructure
              </h3>
              <p className="text-xs text-blue-200">
                Multi-Region Active-Active PostgreSQL, Redis & ClickHouse Replication with Automated PITR
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriggerSnapshot}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-2"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Snapshot Databases</span>
            </button>

            <button
              onClick={handleTestFailover}
              disabled={isSimulatingFailover}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulatingFailover ? 'animate-spin' : ''}`} />
              <span>{isSimulatingFailover ? 'Testing Failover...' : 'Test Automated Failover'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Region Database Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drServices.map((srv) => (
          <div key={srv.service} className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-100 text-sm">{srv.service}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Primary: {srv.regionPrimary}</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                {srv.status}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Secondary Replica Region:</span>
                <span className="text-amber-400 font-bold">{srv.regionSecondary}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Replication Lag:</span>
                <span className="text-emerald-400 font-bold">{srv.replicationLagMs} ms</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Point-In-Time Recovery (PITR):</span>
                <span className="text-blue-400 font-bold">{srv.pitrWindowHours} Hours Window</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
              <span>Last Snapshot: {srv.lastBackupTime}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Failover Ready
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
