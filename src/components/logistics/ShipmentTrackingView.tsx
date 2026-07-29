import React, { useState } from 'react';
import { Shipment, ShipmentStatus } from '../../types/logistics';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Truck,
  MapPin,
  Building,
  User,
  ShieldAlert,
  Globe,
} from 'lucide-react';

interface ShipmentTrackingViewProps {
  shipments: Shipment[];
}

export const ShipmentTrackingView: React.FC<ShipmentTrackingViewProps> = ({ shipments }) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.shipmentId || 'SHP-1001');
  const [searchQuery, setSearchQuery] = useState('');

  const currentShipment = shipments.find((s) => s.shipmentId === selectedShipmentId) || shipments[0];

  const filteredShipments = shipments.filter(
    (s) =>
      s.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>REAL-TIME MULTI-CARRIER SHIPMENT TRACKING TELEMETRY</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">End-to-End Tracking Timeline, Milestone Scans & Route Status</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track origin pickups, sorting hub processing, air/ground transit, customs duty clearances & last-mile driver arrival
          </p>
        </div>

        <div className="relative font-mono text-xs w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Shipment / Tracking #"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Shipment Selector List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Active Consignment Stream ({filteredShipments.length})
          </h3>

          <div className="space-y-2">
            {filteredShipments.map((s) => {
              const isSelected = s.shipmentId === currentShipment?.shipmentId;

              return (
                <button
                  key={s.shipmentId}
                  onClick={() => setSelectedShipmentId(s.shipmentId)}
                  className={`w-full p-3.5 rounded-xl border text-left transition space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-950 border-emerald-500 text-white font-bold'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-emerald-400">{s.shipmentId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        s.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : s.status === 'FAILED_ATTEMPT'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {s.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-300 font-sans truncate">{s.recipientName} ({s.destinationCountry})</div>
                  <div className="text-[9px] text-slate-500 truncate">{s.trackingNumber} • {s.carrierName}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tracking Details & Visual Timeline */}
        {currentShipment && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 lg:col-span-2 font-sans">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4 font-mono">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-white">{currentShipment.shipmentId}</span>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                    {currentShipment.trackingNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Carrier: {currentShipment.carrierName} • Speed: {currentShipment.shippingMethod}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block uppercase">Estimated Delivery</span>
                <strong className="text-emerald-400 font-mono text-sm">{currentShipment.estimatedDeliveryDate}</strong>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div className="space-y-4 font-mono">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                Consignment Milestone Timeline
              </h4>

              <div className="space-y-3 relative border-l-2 border-slate-800 ml-4 pl-6 pt-1">
                {currentShipment.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="relative space-y-1 pb-2">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        step.completed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'bg-slate-950 border-slate-700'
                      }`}
                    >
                      {step.completed && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-black ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{step.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-sans flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{step.location}</span>
                    </div>

                    {step.notes && (
                      <div className="mt-1 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-[10px] font-mono">
                        ⚠️ Exception: {step.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
