import React from 'react';
import { MasterPhase } from '../types/domain';
import { CheckCircle2, Clock, Circle, Map, Layers, Code, Server, ShieldCheck, Database, ArrowRight } from 'lucide-react';

interface RoadmapViewProps {
  roadmap: MasterPhase[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap }) => {
  return (
    <div className="space-y-8">
      {/* Governance Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Map className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>Enterprise Platform Master Roadmap</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                  Task 1.1.1 Complete
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Phase & Milestone Governance • Methodical Task Execution Policy
              </p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 font-mono">
            <span>Status: </span>
            <span className="text-emerald-400 font-bold">Phase 1 Milestone 1.1 In Progress</span>
          </div>
        </div>

        {/* Development Directive Policy Banner */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-indigo-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Incremental Execution Policy</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            As directed: Authentication is intentionally excluded until core platform stability is achieved. Every task is built, tested, and documented sequentially.
          </p>
        </div>
      </div>

      {/* Hexagonal Architecture & Clean DDD Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">Hexagonal Architecture & Domain-Driven Design (DDD)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="font-bold text-blue-400 flex items-center space-x-1">
              <Code className="w-4 h-4" />
              <span>Domain Core Layer</span>
            </div>
            <p className="text-slate-400">Strict TypeScript Interfaces: Product, Merchant, Warehouse, Order, AuditLog</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="font-bold text-indigo-400 flex items-center space-x-1">
              <Server className="w-4 h-4" />
              <span>Application Adapters</span>
            </div>
            <p className="text-slate-400">Express + Vite REST server, Gemini AI Adapters, Audit Event Bus</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="font-bold text-sky-400 flex items-center space-x-1">
              <Database className="w-4 h-4" />
              <span>Repository Ports</span>
            </div>
            <p className="text-slate-400">Multi-warehouse stock allocation & order persistence abstraction</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Audit</span>
            </div>
            <p className="text-slate-400">Structured audit log manager for transaction tracking</p>
          </div>
        </div>
      </div>

      {/* Roadmap Tree Visualization */}
      <div className="space-y-6">
        {roadmap.map((phase) => (
          <div key={phase.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-0.5 rounded">
                  {phase.code}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{phase.title}</h3>
                <p className="text-xs text-slate-400">{phase.description}</p>
              </div>
            </div>

            <div className="space-y-4 pl-2 sm:pl-4">
              {phase.milestones.map((milestone) => (
                <div key={milestone.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-indigo-300 font-bold">
                      {milestone.code}: {milestone.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{milestone.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    {milestone.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition ${
                          task.status === 'completed'
                            ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                            : task.status === 'in_progress'
                            ? 'bg-blue-950/40 border-blue-800/80 text-blue-200'
                            : 'bg-slate-900/60 border-slate-800/60 text-slate-400'
                        }`}
                      >
                        <div className="flex items-start space-x-2.5">
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : task.status === 'in_progress' ? (
                            <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 animate-spin" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-mono font-bold mr-2">{task.code}:</span>
                            <span className="font-semibold text-white">{task.title}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{task.description}</p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center space-x-2 font-mono text-[11px]">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase ${
                              task.status === 'completed'
                                ? 'bg-emerald-900 text-emerald-300'
                                : task.status === 'in_progress'
                                ? 'bg-blue-900 text-blue-300'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {task.status.replace('_', ' ')}
                          </span>
                          {task.completedAt && (
                            <span className="text-slate-500">Done: {task.completedAt}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
