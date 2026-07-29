import React, { useState } from 'react';
import { 
  Settings, Cpu, ShieldCheck, Activity, RefreshCw, Lock, Database, Sparkles, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import { AiAdminModelConfig, AiAuditLog } from '../../types/aiEngine';
import { MOCK_ADMIN_MODELS, MOCK_AI_AUDIT_LOGS } from '../../data/mockAiEngineData';

export const AiAnalyticsAndAdminView: React.FC = () => {
  const [models, setModels] = useState<AiAdminModelConfig[]>(MOCK_ADMIN_MODELS);
  const [logs, setLogs] = useState<AiAuditLog[]>(MOCK_AI_AUDIT_LOGS);
  const [isRetraining, setIsRetraining] = useState(false);

  const toggleModel = (modelName: string) => {
    setModels(prev => prev.map(m => m.modelName === modelName ? { ...m, enabled: !m.enabled } : m));
  };

  const handleRetrainModels = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      alert('AI Vector Embeddings & Neural Ranking Models Retrained Successfully!');
      const newLog: AiAuditLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        event: 'Manual Neural Model Retrain Triggered',
        actor: 'Admin (Alexander Wright)',
        modelUsed: 'Gemini 3.6 + pgvector',
        latencyMs: 1420,
        status: 'Success',
        details: 'Re-indexed 1.2M catalog SKUs into 2048-D Vector Database space.'
      };
      setLogs(prev => [newLog, ...prev]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Infrastructure, Model Governance & Security Controls</h2>
              <p className="text-xs text-slate-400">Manage LLM parameters, vector databases, model training triggers & security audit logs</p>
            </div>
          </div>

          <button
            onClick={handleRetrainModels}
            disabled={isRetraining}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg transition shadow flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining Vector DB...' : 'Retrain AI Models Now'}</span>
          </button>
        </div>
      </div>

      {/* Model Configurations Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>Active AI Engine Models & Services</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((mod) => (
            <div key={mod.modelName} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${mod.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  <h4 className="text-xs font-bold text-white">{mod.modelName}</h4>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mod.enabled}
                    onChange={() => toggleModel(mod.modelName)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 font-mono pt-1">
                <div>Provider: <strong className="text-slate-200 block">{mod.provider}</strong></div>
                <div>Avg Latency: <strong className="text-emerald-400 block">{mod.latencyMs} ms</strong></div>
                <div>Status: <strong className="text-amber-400 block">{mod.status}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>AI System Event & Security Audit Logs</span>
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold">{log.event}</span>
                <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
              </div>
              <p className="text-slate-300 text-[11px]">{log.details}</p>
              <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-0.5">
                <span>Actor: {log.actor}</span>
                <span>•</span>
                <span>Model: {log.modelUsed}</span>
                <span>•</span>
                <span>Latency: {log.latencyMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
