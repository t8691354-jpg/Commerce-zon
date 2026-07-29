import React, { useState } from 'react';
import { FBAStaffMember, FBARole } from '../../types/fba';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Plus,
  Clock,
  Award,
  Warehouse,
} from 'lucide-react';

interface WarehouseStaffManagementViewProps {
  staffList: FBAStaffMember[];
  onAddStaffMember: (newStaff: FBAStaffMember) => void;
}

export const WarehouseStaffManagementView: React.FC<WarehouseStaffManagementViewProps> = ({
  staffList,
  onAddStaffMember,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<FBARole>('PICKER');
  const [whCode, setWhCode] = useState('EWR4');
  const [shiftHours, setShiftHours] = useState('06:00 - 14:30 EST');

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffId = `STF-${Math.floor(100 + Math.random() * 900)}`;

    const newStaff: FBAStaffMember = {
      staffId,
      name: name || 'New Warehouse Operator',
      email: email || 'operator@fba-warehouses.com',
      role,
      assignedWarehouseCode: whCode,
      pickingAccuracyPct: 99.8,
      packingAccuracyPct: 99.7,
      shiftHours,
      status: 'ACTIVE_ON_SHIFT',
    };

    onAddStaffMember(newStaff);
    setShowModal(false);
    alert(`Staff Member ${newStaff.name} assigned as ${role} at warehouse ${whCode}!`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Users className="w-4 h-4 text-sky-400" />
            <span>WAREHOUSE STAFF ROLES & SLA PRODUCTIVITY ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Role-Based Access Control & Picker / Packer SLA Accuracy</h2>
          <p className="text-xs text-slate-400 mt-1">
            Assign duties (Warehouse Manager, Picker, Packer, Inspector, Shipping Coordinator) with individual accuracy tracking & shift roster
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl transition flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Staff Member</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-mono">
        {staffList.map((stf) => (
          <div key={stf.staffId} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="font-extrabold text-white text-sm block">{stf.name}</span>
                <span className="text-slate-500 text-[10px]">{stf.email}</span>
              </div>

              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[9px] font-bold uppercase">
                {stf.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div>Role: <strong className="text-[#febd69]">{stf.role.replace('_', ' ')}</strong></div>
              <div>Warehouse Hub: <strong className="text-emerald-400">{stf.assignedWarehouseCode}</strong></div>
              <div>Shift Hours: <span className="text-slate-400">{stf.shiftHours}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800 text-[10px]">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[8px] uppercase block">Pick SLA Accuracy</span>
                <strong className="text-emerald-400 font-extrabold">{stf.pickingAccuracyPct}%</strong>
              </div>

              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[8px] uppercase block">Pack SLA Accuracy</span>
                <strong className="text-sky-400 font-extrabold">{stf.packingAccuracyPct}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl text-xs font-sans">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#febd69]" />
              <span>Assign New Warehouse Staff Roster</span>
            </h3>

            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Staff Member Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="marcus@fba-warehouses.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Assigned Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as FBARole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
                    <option value="PICKER">Picker Operator</option>
                    <option value="PACKER">Packer Operator</option>
                    <option value="INVENTORY_CONTROLLER">Inventory Controller</option>
                    <option value="QUALITY_INSPECTOR">Quality Inspector</option>
                    <option value="SHIPPING_COORDINATOR">Shipping Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Warehouse Assignment</label>
                  <select
                    value={whCode}
                    onChange={(e) => setWhCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="EWR4">EWR4 (Newark)</option>
                    <option value="ONT8">ONT8 (Inland Empire)</option>
                    <option value="BFI4">BFI4 (Seattle)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Shift Hours Roster</label>
                <input
                  type="text"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-black rounded-xl"
                >
                  Assign Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
