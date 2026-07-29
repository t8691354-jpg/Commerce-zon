import React, { useState } from 'react';
import { Shipment, LogisticsStaffDriver } from '../../types/logistics';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  UserCheck,
  Clock,
  Camera,
  FileSignature,
} from 'lucide-react';

interface DeliveryDriverConsoleViewProps {
  drivers: LogisticsStaffDriver[];
  shipments: Shipment[];
  onUpdateShipmentStatus: (shipmentId: string, status: any) => void;
}

export const DeliveryDriverConsoleView: React.FC<DeliveryDriverConsoleViewProps> = ({
  drivers,
  shipments,
  onUpdateShipmentStatus,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0]?.driverId || 'DRV-101');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(shipments[0] || null);

  const currentDriver = drivers.find((d) => d.driverId === selectedDriverId) || drivers[0];

  const handleStartRoute = () => {
    alert(`Driver ${currentDriver.name} started route for zone ${currentDriver.currentZone}!`);
  };

  const handleMarkDelivered = (shipmentId: string) => {
    onUpdateShipmentStatus(shipmentId, 'DELIVERED');
    alert(`Shipment ${shipmentId} marked as DELIVERED by driver!`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>LAST-MILE DELIVERY FLEET DRIVER MOBILE CONSOLE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Active Driver Route Assignments, GPS Navigation & Delivery Updates</h2>
          <p className="text-xs text-slate-400 mt-1">
            Mobile interface for courier van drivers to start routes, view delivery stops, contact recipients & log proof-of-delivery signatures
          </p>
        </div>

        <button
          onClick={handleStartRoute}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Navigation className="w-4 h-4" />
          <span>Start Active Route (GPS On)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        {/* Driver Roster Selection */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Active Fleet Drivers ({drivers.length})
          </h3>

          <div className="space-y-2">
            {drivers.map((d) => (
              <button
                key={d.driverId}
                onClick={() => setSelectedDriverId(d.driverId)}
                className={`w-full p-3.5 rounded-xl border text-left transition space-y-1 ${
                  selectedDriverId === d.driverId
                    ? 'bg-slate-950 border-emerald-500 text-white font-bold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">{d.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-bold">
                    {d.status}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400">
                  Vehicle: {d.licensePlate} • Active: {d.activeShipmentCount} Stop(s)
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Driver Route Manifest */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2 font-sans">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-mono">
            <div>
              <span className="text-xs font-black text-white uppercase block">Driver Manifest: {currentDriver.name}</span>
              <span className="text-emerald-400 text-[10px]">Zone: {currentDriver.currentZone} • Vehicle: {currentDriver.licensePlate}</span>
            </div>

            <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300 text-[10px] font-mono">
              Phone: {currentDriver.phone}
            </span>
          </div>

          {/* Assigned Delivery Parcels */}
          <div className="space-y-3 font-mono text-xs">
            {shipments.map((s, idx) => (
              <div key={s.shipmentId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 font-extrabold rounded text-[10px]">
                      Stop #{idx + 1}
                    </span>
                    <span className="font-bold text-white text-xs">{s.shipmentId}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      s.status === 'DELIVERED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="text-slate-300 font-sans text-xs">{s.recipientName} ({s.recipientPhone})</div>
                <div className="text-slate-400 text-[10px] flex items-center space-x-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{s.destinationAddress}</span>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                  <a
                    href={`tel:${s.recipientPhone}`}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                  >
                    <Phone className="w-3 h-3 text-sky-400" />
                    <span>Call Customer</span>
                  </a>

                  {s.status !== 'DELIVERED' && (
                    <button
                      onClick={() => handleMarkDelivered(s.shipmentId)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 ml-auto"
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      <span>Complete Delivery (Capture POD)</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
