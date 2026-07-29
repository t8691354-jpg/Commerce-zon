import React, { useState } from 'react';
import { MOCK_BACKGROUND_JOBS } from '../../data/mockSuperAdmin';
import { SystemBackgroundJob } from '../../types/superAdmin';
import { Activity, Cpu, Database, HardDrive, Zap, CheckCircle2, RefreshCw } from 'lucide-react';

export const SystemMonitoringJobsView: React.FC = () => {
  const [jobs] = useState<SystemBackgroundJob[]>(MOCK_BACKGROUND_JOBS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Infrastructure Resource Gauge Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>CPU Cluster Utilization</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">28.4%</p>
          <div className="w-full bg-slate-950 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '28.4%' }} />
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>RAM Memory Allocation</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">42.1 GB / 128 GB</p>
          <div className="w-full bg-slate-950 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '32.8%' }} />
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>PostgreSQL Connections</span>
            <Database className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">184 / 1,000</p>
          <div className="w-full bg-slate-950 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '18.4%' }} />
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between text-slate-400">
            <span>NVMe SSD Storage</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-slate-100">1.42 TB / 10 TB</p>
          <div className="w-full bg-slate-950 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '14.2%' }} />
          </div>
        </div>
      </div>

      {/* Background Worker Jobs & Queue Status */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Asynchronous Background Worker Jobs & Cron Queue
            </h3>
            <p className="text-xs text-slate-400">
              Monitor Redis/Celery queue tasks, Elasticsearch sync jobs, ETL pipelines & DB snapshots
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3">Job Name & Description</th>
                <th className="py-3 px-3">Queue Type</th>
                <th className="py-3 px-3">Execution Time</th>
                <th className="py-3 px-3">Last Run</th>
                <th className="py-3 px-3">Next Scheduled Run</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-amber-400 font-bold">{job.id}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-200">{job.jobName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold">
                      {job.queue}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{job.executionTimeMs}ms</td>
                  <td className="py-3 px-3 text-slate-400">{job.lastRun}</td>
                  <td className="py-3 px-3 text-slate-400">{job.nextRun}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400 animate-pulse'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
