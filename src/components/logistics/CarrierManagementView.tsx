import React, { useState } from 'react';
import { ShippingCarrier, CarrierServiceLevel } from '../../types/logistics';
import {
  Truck,
  Plus,
  CheckCircle2,
  XCircle,
  Globe,
  Sliders,
  DollarSign,
  ShieldCheck,
  Edit2,
  Trash2,
} from 'lucide-react';

interface CarrierManagementViewProps {
  carriers: ShippingCarrier[];
  onAddCarrier: (carrier: ShippingCarrier) => void;
  onToggleCarrier: (carrierId: string) => void;
}

export const CarrierManagementView: React.FC<CarrierManagementViewProps> = ({
  carriers,
  onAddCarrier,
  onToggleCarrier,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [supportedCountries, setSupportedCountries] = useState('USA, CAN, GBR, DEU');
  const [avgSpeed, setAvgSpeed] = useState('1 - 2 Days');

  const handleCreateCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newCarrier: ShippingCarrier = {
      id: `CARRIER-${code.toUpperCase()}`,
      name,
      code: code.toUpperCase(),
      contactEmail,
      contactPhone,
      supportedCountries: supportedCountries.split(',').map((c) => c.trim()),
      supportedRegions: ['Global Express Network'],
      avgDeliverySpeedDays: avgSpeed,
      serviceLevels: ['OVERNIGHT', 'EXPEDITED', 'STANDARD'],
      basePricingRate: 1.10,
      isActive: true,
    };

    onAddCarrier(newCarrier);
    setShowAddModal(false);
    setName('');
    setCode('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#febd69]" />
            <span>SHIPPING CARRIER & PARTNER MANAGEMENT</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Global Transportation Carriers & Logistics Partners</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure shipping providers, API gateways, service speed levels, country coverage & contractual base rate multipliers
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shipping Carrier</span>
        </button>
      </div>

      {/* Carriers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        {carriers.map((c) => (
          <div
            key={c.id}
            className={`p-6 rounded-2xl border transition shadow-xl space-y-4 ${
              c.isActive ? 'bg-slate-900 border-slate-800' : 'bg-slate-950 border-rose-900/40 opacity-75'
            }`}
          >
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-white text-base">{c.name}</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-[#febd69] text-[9px] font-bold rounded">
                    {c.code}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Contact: <span className="text-slate-200">{c.contactEmail}</span> • {c.contactPhone}
                </div>
              </div>

              <button
                onClick={() => onToggleCarrier(c.id)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                  c.isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {c.isActive ? 'Active' : 'Suspended'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 uppercase block">Delivery Speed</span>
                <strong className="text-white">{c.avgDeliverySpeedDays}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-500 uppercase block">Rate Multiplier</span>
                <strong className="text-emerald-400">{c.basePricingRate}x Base</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] text-slate-500 uppercase block">Supported Countries & Regions</span>
              <div className="flex flex-wrap gap-1">
                {c.supportedCountries.map((country) => (
                  <span key={country} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded text-[9px] text-sky-300">
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <span className="text-[9px] text-slate-500 uppercase block">Carrier Service Levels</span>
              <div className="flex flex-wrap gap-1">
                {c.serviceLevels.map((lvl) => (
                  <span key={lvl} className="px-2 py-0.5 bg-slate-800 rounded text-[8px] text-slate-300 font-bold">
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Carrier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Add New Logistics Carrier
            </h3>

            <form onSubmit={handleCreateCarrier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Carrier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mail Special Delivery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Carrier Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RM-UK"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Contact Email</label>
                <input
                  type="email"
                  placeholder="dispatch@carrier.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+1-800-555-0199"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl"
                >
                  Save Carrier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
