import React from 'react';
import { ComprehensiveMasterOrder, ShipmentTrackingLog } from '../../types/oms';
import { Truck, MapPin, CheckCircle2, Clock, Calendar, ShieldCheck, Plane, Box } from 'lucide-react';

interface ShipmentTrackingEngineViewProps {
  order: ComprehensiveMasterOrder | null;
  onClose?: () => void;
}

const TRACKING_STAGES = [
  { id: 'CREATED', label: '1. Label Created', desc: 'Package registered at fulfillment hub' },
  { id: 'PICKED_UP', label: '2. Picked Up', desc: 'Scanned into Prime courier van' },
  { id: 'IN_TRANSIT', label: '3. In Transit', desc: 'Freight haul between regional hubs' },
  { id: 'LOCAL_DISTRIBUTION_CENTER', label: '4. Local Hub', desc: 'Arrived at destination sort center' },
  { id: 'OUT_FOR_DELIVERY', label: '5. Out for Delivery', desc: 'On final-mile delivery van' },
  { id: 'DELIVERED', label: '6. Delivered', desc: 'Package signed & handed over' },
];

export const ShipmentTrackingEngineView: React.FC<ShipmentTrackingEngineViewProps> = ({ order, onClose }) => {
  if (!order) return null;

  // Determine active stage index based on tracking logs or order status
  const currentStageIndex = order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 5 : 2;

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-sky-400" />
            <span>AMAZON LOGISTICS REAL-TIME RADAR</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Shipment Tracking: {order.trackingNumber}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Order <strong className="text-white font-mono">{order.orderNumber}</strong> • Carrier:{' '}
            <strong className="text-sky-300">Amazon Logistics Prime Express</strong>
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-right">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Delivery</div>
          <div className="text-sm font-black text-emerald-400 font-mono">{order.estimatedDeliveryDate}</div>
        </div>
      </div>

      {/* Visual Stepper Bar */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Package Transit Progress</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {TRACKING_STAGES.map((stg, idx) => {
            const isCompleted = currentStageIndex >= idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={stg.id}
                className={`p-3 rounded-xl border text-center space-y-1 transition ${
                  isCurrent
                    ? 'bg-sky-500/20 border-sky-500 text-white shadow-lg'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                <div
                  className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-mono text-xs font-black ${
                    isCurrent
                      ? 'bg-sky-400 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted && !isCurrent ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="text-xs font-bold leading-tight">{stg.label}</div>
                <div className="text-[9px] text-slate-400 leading-none">{stg.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Live Location Map Banner */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Current Courier Geo-Coordinates: <strong className="text-white font-mono">37.3382° N, 121.8863° W (San Jose, CA)</strong></span>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded font-mono animate-pulse">
            LIVE GPS FEED ACTIVE
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 h-28 rounded-xl flex items-center justify-center text-center p-4 relative">
          <div className="space-y-1 z-10">
            <Plane className="w-8 h-8 mx-auto text-sky-400 animate-bounce" />
            <div className="text-xs font-bold text-white">In Transit via Amazon Regional Freight Van #882</div>
            <div className="text-[10px] text-slate-400 font-mono">Next Destination: San Jose Final-Mile Sorting Facility</div>
          </div>
        </div>
      </div>

      {/* Courier Log History */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">Detailed Tracking Event History</h3>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          {order.trackingLogs.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-4">No detailed tracking logs available.</div>
          ) : (
            order.trackingLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between border-b border-slate-800/80 pb-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-sky-500/20 text-sky-300 text-[9px] rounded font-mono font-bold">
                      {log.stage}
                    </span>
                    <span>{log.description}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{log.location} • Carrier: {log.carrier}</div>
                </div>

                <div className="text-right font-mono text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
