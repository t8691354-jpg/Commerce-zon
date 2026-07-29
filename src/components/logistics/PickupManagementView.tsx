import React, { useState } from 'react';
import { PickupRequest } from '../../types/logistics';
import { Truck, Calendar, Clock, MapPin, Plus, CheckCircle2, User, ShieldCheck } from 'lucide-react';

interface PickupManagementViewProps {
  pickups: PickupRequest[];
  onRequestPickup: (pickup: PickupRequest) => void;
  onUpdatePickupStatus: (id: string, status: PickupRequest['status']) => void;
}

export const PickupManagementView: React.FC<PickupManagementViewProps> = ({
  pickups,
  onRequestPickup,
  onUpdatePickupStatus,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [sellerName, setSellerName] = useState('');
  const [address, setAddress] = useState('');
  const [pkgCount, setPkgCount] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !address) return;

    const newPickup: PickupRequest = {
      id: `PU-${Math.floor(9900 + Math.random() * 90)}`,
      sellerOrWarehouseName: sellerName,
      locationAddress: address,
      scheduledDate: new Date().toISOString().substring(0, 10),
      timeSlot: '09:00 AM - 12:00 PM',
      driverName: 'Carlos Ramirez',
      vehicleReg: 'AMZ-VAN-882',
      status: 'SCHEDULED',
      packageCount: pkgCount,
      totalWeightKg: pkgCount * 2.5,
    };

    onRequestPickup(newPickup);
    setShowModal(false);
    setSellerName('');
    setAddress('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#febd69]" />
            <span>SELLER & WAREHOUSE PICKUP SCHEDULING</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Schedule First-Mile Warehouse Courier Pickups</h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch dedicated Amazon Logistics freight trucks & vans to seller facilities and fulfillment docks
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl text-xs transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Request Freight Pickup</span>
        </button>
      </div>

      {/* Pickups Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Scheduled Courier Pickup Dispatch Roster ({pickups.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">Pickup ID</th>
                <th className="py-3 px-3">Seller / Warehouse Location</th>
                <th className="py-3 px-3">Schedule Date & Slot</th>
                <th className="py-3 px-3">Driver & Van</th>
                <th className="py-3 px-3">Package Cargo</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {pickups.map((p) => (
                <tr key={p.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3.5 px-3 font-bold text-white">{p.id}</td>
                  <td className="py-3.5 px-3 space-y-0.5">
                    <strong className="text-slate-200 block text-xs">{p.sellerOrWarehouseName}</strong>
                    <span className="text-[10px] text-slate-400 block">{p.locationAddress}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-slate-300 block">{p.scheduledDate}</span>
                    <span className="text-slate-500 text-[10px] block">{p.timeSlot}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-sky-300 block font-bold">{p.driverName || 'Unassigned'}</span>
                    <span className="text-slate-500 text-[10px] block">{p.vehicleReg}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-emerald-400 font-bold block">{p.packageCount} pkgs</span>
                    <span className="text-slate-500 text-[10px] block">{p.totalWeightKg} kg</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                        p.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : p.status === 'SCHEDULED'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    {p.status !== 'COMPLETED' && (
                      <button
                        onClick={() => onUpdatePickupStatus(p.id, 'COMPLETED')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[9px]"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pickup Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 font-sans">
            <h3 className="text-base font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Request Courier Freight Pickup
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Seller / Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Audio Direct Warehouse"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Pickup Dock Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 Freight Way, Dock #2, Chicago, IL"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Package Count</label>
                <input
                  type="number"
                  required
                  value={pkgCount}
                  onChange={(e) => setPkgCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#febd69] text-slate-950 font-black rounded-xl"
                >
                  Dispatch Pickup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
