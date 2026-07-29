import React, { useState } from 'react';
import { FBAWarehouse, TempZone, WarehouseStatus } from '../../types/fba';
import {
  Warehouse,
  Plus,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Clock,
  Thermometer,
  Boxes,
  Users,
} from 'lucide-react';

interface WarehouseManagementViewProps {
  warehouses: FBAWarehouse[];
  onAddWarehouse: (newWh: FBAWarehouse) => void;
  onUpdateWarehouseStatus: (whId: string, status: WarehouseStatus) => void;
}

export const WarehouseManagementView: React.FC<WarehouseManagementViewProps> = ({
  warehouses,
  onAddWarehouse,
  onUpdateWarehouseStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [whName, setWhName] = useState('');
  const [whCode, setWhCode] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [capacity, setCapacity] = useState(200000);
  const [tempZone, setTempZone] = useState<TempZone>('CLIMATE_CONTROLLED');
  const [staffCount, setStaffCount] = useState(250);
  const [hours, setHours] = useState('24/7 Continuous Shifts');

  const handleCreateWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    const codeUpper = whCode.toUpperCase() || `WH-${Math.floor(100 + Math.random() * 900)}`;

    const newWh: FBAWarehouse = {
      id: `WH-${codeUpper}`,
      name: whName || `Fulfilment Center (${codeUpper})`,
      code: codeUpper,
      address: {
        street: street || '100 Logistics Way',
        city: city || 'Dallas',
        state: state || 'TX',
        zipCode: zipCode || '75201',
        country,
      },
      totalCapacityCubicMeters: capacity,
      usedCapacityCubicMeters: 0,
      temperatureZone: tempZone,
      staffCount,
      operatingHours: hours,
      status: 'ACTIVE',
      utilizationPct: 0,
      activeRacksCount: Math.floor(capacity / 200),
      activeBinsCount: Math.floor(capacity / 5),
    };

    onAddWarehouse(newWh);
    setShowAddModal(false);
    alert(`Warehouse ${newWh.code} created and added to global FBA routing grid!`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Warehouse className="w-4 h-4 text-[#febd69]" />
            <span>GLOBAL FBA WAREHOUSE NETWORK & CAPACITY ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Warehouse Infrastructure & Zoning Controls</h2>
          <p className="text-xs text-slate-400 mt-1">
            Provision fulfilment centers, configure temperature zoning (Climate, Frozen, Ambient), monitor bin capacities & assign staff
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Warehouse</span>
        </button>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {warehouses.map((wh) => (
          <div key={wh.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white text-base">{wh.code}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-[#febd69] font-mono text-[10px] rounded font-bold">
                      {wh.temperatureZone}
                    </span>
                  </div>
                  <h3 className="text-xs text-slate-300 font-bold mt-0.5">{wh.name}</h3>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                    wh.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {wh.status}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{wh.address.street}, {wh.address.city}, {wh.address.state} {wh.address.zipCode}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px]">
                  <Clock className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>Operating Hours: {wh.operatingHours}</span>
                </div>
              </div>

              {/* Utilisation Bar */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Storage Capacity</span>
                  <strong className="text-emerald-400">{wh.utilizationPct}% Used</strong>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500" style={{ width: `${wh.utilizationPct}%` }} />
                </div>
                <div className="text-[9px] text-slate-500 flex justify-between pt-0.5">
                  <span>{wh.usedCapacityCubicMeters.toLocaleString()} m³ used</span>
                  <span>{wh.totalCapacityCubicMeters.toLocaleString()} m³ total</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[8px] uppercase block">Active Racks</span>
                  <strong className="text-white">{wh.activeRacksCount}</strong>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[8px] uppercase block">Storage Bins</span>
                  <strong className="text-white">{wh.activeBinsCount.toLocaleString()}</strong>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[8px] uppercase block">Staff On Duty</span>
                  <strong className="text-sky-400">{wh.staffCount}</strong>
                </div>
              </div>
            </div>

            {/* Toggle Status Actions */}
            <div className="pt-2 flex justify-end space-x-2 border-t border-slate-800">
              <button
                onClick={() =>
                  onUpdateWarehouseStatus(wh.id, wh.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE')
                }
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-[10px]"
              >
                Toggle Maintenance Mode
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Warehouse className="w-4 h-4 text-[#febd69]" />
              <span>Provision New FBA Fulfilment Center</span>
            </h3>

            <form onSubmit={handleCreateWarehouse} className="space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Warehouse Code (4-char)</label>
                  <input
                    type="text"
                    value={whCode}
                    onChange={(e) => setWhCode(e.target.value)}
                    placeholder="e.g. SFO2"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold uppercase focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Warehouse Name</label>
                  <input
                    type="text"
                    value={whName}
                    onChange={(e) => setWhName(e.target.value)}
                    placeholder="e.g. Bay Area Mega Hub (SFO2)"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Oakland"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="CA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-[#febd69]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Capacity (m³)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Temperature Zone</label>
                  <select
                    value={tempZone}
                    onChange={(e) => setTempZone(e.target.value as TempZone)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="AMBIENT">Ambient (Standard Goods)</option>
                    <option value="CLIMATE_CONTROLLED">Climate Controlled (Electronics/Cosmetics)</option>
                    <option value="REFRIGERATED">Refrigerated (32°F - 40°F)</option>
                    <option value="FROZEN">Deep Frozen (-10°F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Staff Allocations</label>
                  <input
                    type="number"
                    value={staffCount}
                    onChange={(e) => setStaffCount(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl"
                >
                  Provision & Add to Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
