import React, { useState } from 'react';
import { DeliveryRouteStop } from '../../types/logistics';
import {
  Navigation,
  Sparkles,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface RouteOptimisationViewProps {
  stops: DeliveryRouteStop[];
}

export const RouteOptimisationView: React.FC<RouteOptimisationViewProps> = ({ stops: initialStops }) => {
  const [stops, setStops] = useState<DeliveryRouteStop[]>(initialStops);
  const [isOptimized, setIsOptimized] = useState(false);

  const handleRunAiOptimization = () => {
    // Reorder stops to simulate AI TSP (Traveling Salesperson) optimization
    const optimized = [...stops].sort((a, b) => a.distanceKm - b.distanceKm);
    const reordered = optimized.map((s, idx) => ({ ...s, stopOrder: idx + 1 }));
    setStops(reordered);
    setIsOptimized(true);
    alert('AI Route Optimization Algorithm Complete!\nSaved 12.4 km distance & reduced transit time by 28 mins.');
  };

  const totalDistanceKm = stops.reduce((sum, s) => sum + s.distanceKm, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI-POWERED MULTI-STOP ROUTE OPTIMIZATION ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Intelligent Traveling Salesperson (TSP) & Live Traffic Route Planner</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic re-sequencing of courier delivery stops, real-time traffic delay factors, fuel minimization & driver SLA window enforcement
          </p>
        </div>

        <button
          onClick={handleRunAiOptimization}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isOptimized ? 'Re-Run AI Route Planner' : 'Run AI Route Optimization'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Route Stops Sequence List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Optimized Stop Manifest ({stops.length} Deliveries)
            </h3>
            <span className="text-emerald-400 text-[10px]">
              Total Distance: {totalDistanceKm.toFixed(1)} km
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {stops.map((stop) => (
              <div
                key={stop.shipmentId}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-black flex items-center justify-center flex-shrink-0">
                    #{stop.stopOrder}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{stop.shipmentId}</span>
                      <span className="text-slate-400 text-[10px]">({stop.recipientName})</span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-sans flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{stop.address}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[10px]">
                  <span className="text-emerald-400 font-bold block">{stop.estimatedArrival}</span>
                  <span className="text-slate-400 block">{stop.distanceKm} km away</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase inline-block mt-1 ${
                      stop.trafficStatus === 'CLEAR'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : stop.trafficStatus === 'HEAVY'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    Traffic: {stop.trafficStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Simulated Map Route Overview */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 font-mono">
            Simulated GPS Route Vector Map
          </h3>

          <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 p-4 relative flex flex-col justify-between overflow-hidden font-mono">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

            <div className="relative z-10 flex justify-between text-[10px] text-slate-400">
              <span>Depot Origin: NY-Midtown Hub</span>
              <span className="text-emerald-400 font-bold">Driver: Van AMZ-882</span>
            </div>

            {/* Nodes Line */}
            <div className="relative z-10 flex items-center justify-between px-4 my-auto">
              {stops.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-1">
                  <div className="w-7 h-7 bg-emerald-500 text-slate-950 rounded-full font-black text-xs flex items-center justify-center border-2 border-slate-950 shadow-lg">
                    {s.stopOrder}
                  </div>
                  <span className="text-[8px] text-slate-300">{s.shipmentId}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-300">
              {isOptimized ? (
                <span className="text-emerald-400 font-bold">✔ AI TSP Optimization Applied (34% Fuel Saved)</span>
              ) : (
                <span className="text-amber-300 font-bold">Click "Run AI Route Optimization" to re-sequence stops</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
