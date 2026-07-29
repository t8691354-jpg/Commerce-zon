import React, { useState } from 'react';
import { FBAPickingTask, PickingStrategy } from '../../types/fba';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Sliders,
  Layers,
  MapPin,
  Play,
  Check,
} from 'lucide-react';

interface PickingSystemViewProps {
  pickingTasks: FBAPickingTask[];
  onCompletePickTask: (taskId: string) => void;
}

export const PickingSystemView: React.FC<PickingSystemViewProps> = ({
  pickingTasks,
  onCompletePickTask,
}) => {
  const [selectedStrategyFilter, setSelectedStrategyFilter] = useState<string>('ALL');

  const filteredTasks = pickingTasks.filter(
    (t) => selectedStrategyFilter === 'ALL' || t.pickingStrategy === selectedStrategyFilter
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <PackageCheck className="w-4 h-4 text-[#febd69]" />
            <span>ROBOTICS & HUMAN OPTIMIZED PICKING SYSTEM</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Single, Batch, Wave & Zone Picking Algorithms</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic route optimization guides warehouse pickers along shortest physical path vectors with optical barcode verification
          </p>
        </div>

        {/* Strategy Selector */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-400">Strategy Filter:</span>
          <select
            value={selectedStrategyFilter}
            onChange={(e) => setSelectedStrategyFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
          >
            <option value="ALL">All Strategies</option>
            <option value="SINGLE_ORDER">Single Order Picking</option>
            <option value="BATCH_PICKING">Batch Picking</option>
            <option value="WAVE_PICKING">Wave Picking</option>
            <option value="ZONE_PICKING">Zone Picking</option>
          </select>
        </div>
      </div>

      {/* Picking Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {filteredTasks.map((task) => (
          <div key={task.taskId} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-black text-[#febd69]">{task.taskId}</span>
                <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded text-[9px] font-bold block w-fit mt-0.5">
                  {task.pickingStrategy.replace('_', ' ')}
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                  task.status === 'COMPLETED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {task.status}
              </span>
            </div>

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Picker: <strong className="text-white">{task.pickerName}</strong></span>
              <span>Warehouse: <strong className="text-emerald-400">{task.warehouseCode}</strong></span>
            </div>

            {/* Item Picking List */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Pick Line Items ({task.totalItemsCount})</span>
              {task.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] border-b border-slate-900 pb-1 last:border-0">
                  <div>
                    <span className="text-white font-bold block">{it.productTitle}</span>
                    <span className="text-slate-400 text-[9px]">Location: <strong className="text-amber-300">{it.location}</strong></span>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-400 font-extrabold">{it.qtyPicked} / {it.qtyRequired} Picked</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action */}
            <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-[10px]">
              <span className="text-slate-500">Started: {task.startedAt}</span>

              {task.status !== 'COMPLETED' ? (
                <button
                  onClick={() => onCompletePickTask(task.taskId)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Wave Picked</span>
                </button>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed at {task.completedAt}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
