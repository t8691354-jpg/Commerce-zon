import React, { useState } from 'react';
import { DeliveryRouteStop } from '../../types/logistics';
import { MOCK_ROUTE_STOPS } from '../../data/logisticsMockData';
import { Navigation, MapPin, CheckCircle2, Clock, Truck, Zap, Activity } from 'lucide-react';

export const RouteOptimizationView: React.FC = () => {
  const [stops, setStops] = useState<DeliveryRouteStop[]>(MOCK_ROUTE_STOPS);

  const handleOptimize = () => {
    // Reorder stops by distance/traffic
    const optimized = [...stops].sort((a, b) => a.distanceKm - b.distanceKm);
    setStops(
      optimized.map((st, i) => ({
        ...st,
        stopOrder: i + 1,
      }))
    );
    alert('AI Route Optimization Algorithm Complete! Sequence reordered to minimize travel time & fuel consumption.');
  };

  const handleMarkStopComplete = (stopOrder: number) => {
    setStops(
      stops.map((s) => (s.stopOrder === stopOrder ? { ...s, isCompleted: true } : s))
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Navigation className="w-4 h-4 text-[#febd69]" />
            <span>AI-READY LAST-MILE DELIVERY ROUTE OPTIMIZATION</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Intelligent Multi-Stop Route Sequencing & Traffic Telemetry</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic TSP (Travelling Salesperson) pathing, live traffic congestion rerouting & driver turn-by-turn dispatch
          </p>
        </div>

        <button
          onClick={handleOptimize}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-2 shadow-lg"
        >
          <Zap className="w-4 h-4" />
          <span>Execute AI Route Re-Sequence</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-mono">
        {/* Stops Sequence Roster */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Optimized Delivery Sequence (Driver Van AMZ-882)</span>
            <span className="text-emerald-400 text-[10px]">Distance Saved: -14.2 km</span>
          </h3>

          <div className="space-y-3">
            {stops.map((st) => (
              <div
                key={st.stopOrder}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                  st.isCompleted
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-slate-900 border border-slate-800 text-[#febd69] font-black rounded-lg flex items-center justify-center flex-shrink-0">
                    #{st.stopOrder}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <strong className="text-white text-xs">{st.recipientName}</strong>
                      <span className="text-slate-400 text-[10px]">({st.shipmentId})</span>
                    </div>

                    <p className="text-slate-300 text-[11px] font-sans flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#febd69] inline flex-shrink-0" />
                      <span>{st.address}</span>
                    </p>

                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 pt-1">
                      <span>Est Arrival: {st.estimatedArrival}</span>
                      <span>•</span>
                      <span>Distance: {st.distanceKm} km</span>
                      <span>•</span>
                      <span
                        className={
                          st.trafficStatus === 'CLEAR'
                            ? 'text-emerald-400 font-bold'
                            : st.trafficStatus === 'HEAVY'
                            ? 'text-rose-400 font-bold'
                            : 'text-amber-400 font-bold'
                        }
                      >
                        Traffic: {st.trafficStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {!st.isCompleted && (
                  <button
                    onClick={() => handleMarkStopComplete(st.stopOrder)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px] flex-shrink-0"
                  >
                    Complete Stop
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Route Stats & Efficiency */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Route Telemetry Metrics
          </h3>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Total Route Distance:</span>
              <strong className="text-white">9.1 km</strong>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Fuel Consumption Est:</span>
              <strong className="text-emerald-400">1.2 Liters (EV Van)</strong>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Driver Turn-by-Turn GPS:</span>
              <strong className="text-sky-300">Live Lock</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
