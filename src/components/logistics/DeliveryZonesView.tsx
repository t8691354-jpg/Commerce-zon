import React, { useState } from 'react';
import { DeliveryZone } from '../../types/logistics';
import {
  Globe,
  Plus,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Building,
} from 'lucide-react';

interface DeliveryZonesViewProps {
  zones: DeliveryZone[];
  onAddZone: (zone: DeliveryZone) => void;
  onToggleZoneServiceable: (zoneId: string) => void;
}

export const DeliveryZonesView: React.FC<DeliveryZonesViewProps> = ({
  zones,
  onAddZone,
  onToggleZoneServiceable,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [country, setCountry] = useState('USA');
  const [regions, setRegions] = useState('TX, FL, GA');
  const [zipCodes, setZipCodes] = useState('78701-78799, 33101-33199');
  const [baseFee, setBaseFee] = useState(6.50);
  const [slaHours, setSlaHours] = useState(24);

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zoneName) return;

    const newZone: DeliveryZone = {
      zoneId: `ZONE-${country}-${Math.floor(10 + Math.random() * 90)}`,
      zoneName,
      country,
      statesOrCities: regions.split(',').map((r) => r.trim()),
      postalCodes: zipCodes.split(',').map((z) => z.trim()),
      baseDeliveryFeeUSD: baseFee,
      estimatedHours: slaHours,
      isServiceable: true,
    };

    onAddZone(newZone);
    setShowModal(false);
    setZoneName('');
    alert(`Delivery Zone ${zoneName} created and registered!`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>GLOBAL DELIVERY COVERAGE ZONES & POSTAL MATRIX</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Configure Geographical Coverage Zones, Zip Code Bounds & Base Fees</h2>
          <p className="text-xs text-slate-400 mt-1">
            Define unlimited country, state, city & postal code serviceability bounds, delivery SLA hours & localized base freight charges
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Delivery Zone</span>
        </button>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {zones.map((z) => (
          <div key={z.zoneId} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{z.zoneId}</span>
                <h3 className="text-sm font-black text-white">{z.zoneName}</h3>
              </div>

              <button
                onClick={() => onToggleZoneServiceable(z.zoneId)}
                className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase ${
                  z.isServiceable
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {z.isServiceable ? 'SERVICEABLE' : 'OFFLINE'}
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Country:</span>
                <strong className="text-white">{z.country}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Base Zone Fee:</span>
                <strong className="text-emerald-400">${z.baseDeliveryFeeUSD.toFixed(2)} USD</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase">Speed SLA:</span>
                <strong className="text-sky-300">{z.estimatedHours} Hours</strong>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Serviced Regions</span>
              <div className="flex flex-wrap gap-1">
                {z.statesOrCities.map((st, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[9px] font-bold">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Create New Delivery Zone</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. US Southern Sunbelt Corridor"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] uppercase mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] uppercase mb-1">Base Zone Fee ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={baseFee}
                    onChange={(e) => setBaseFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">States / Cities (Comma Separated)</label>
                <input
                  type="text"
                  value={regions}
                  onChange={(e) => setRegions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Postal Code Bounds</label>
                <input
                  type="text"
                  value={zipCodes}
                  onChange={(e) => setZipCodes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg mt-2"
              >
                Save Delivery Zone
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
