import React, { useState } from 'react';
import { SupplierRecord, SupplierStatus } from '../../types/dropshipping';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  FileText,
  Building2,
  Search,
  Filter,
  Sliders,
  DollarSign,
  UserCheck,
} from 'lucide-react';

interface AdminSupplierVerificationProps {
  suppliers: SupplierRecord[];
  onUpdateStatus: (supplierId: string, status: SupplierStatus, commissionOverride?: number, rating?: number) => void;
}

export const AdminSupplierVerification: React.FC<AdminSupplierVerificationProps> = ({
  suppliers,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierRecord | null>(suppliers[0] || null);

  const [editCommission, setEditCommission] = useState<number>(10);
  const [editRating, setEditRating] = useState<number>(4.8);

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (supId: string) => {
    onUpdateStatus(supId, 'APPROVED', editCommission, editRating);
    alert(`Supplier ${supId} APPROVED! Active on marketplace dropship network.`);
  };

  const handleReject = (supId: string) => {
    onUpdateStatus(supId, 'REJECTED');
    alert(`Supplier ${supId} REJECTED.`);
  };

  const handleSuspend = (supId: string) => {
    onUpdateStatus(supId, 'SUSPENDED');
    alert(`Supplier ${supId} SUSPENDED.`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ADMIN GOVERNANCE & SUPPLIER AUDIT BOARD</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Supplier Verification & Compliance Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review KYC corporate filings, set individual commission splits, assign performance trust ratings & suspend non-compliant vendors
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Pending Review</span>
            <span className="text-amber-400 font-extrabold text-sm font-mono">
              {suppliers.filter((s) => s.status === 'PENDING_VERIFICATION').length} Suppliers
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by supplier name, ID or email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#febd69]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="APPROVED">Approved</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Split View: Supplier Roster + Verification Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left List Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden lg:col-span-1">
          <div className="p-4 bg-slate-950 border-b border-slate-800 font-black text-white text-xs uppercase tracking-wider">
            Suppliers List ({filteredSuppliers.length})
          </div>

          <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
            {filteredSuppliers.map((sup) => {
              const isSelected = selectedSupplier?.id === sup.id;
              return (
                <div
                  key={sup.id}
                  onClick={() => {
                    setSelectedSupplier(sup);
                    setEditCommission(sup.commissionOverridePct || 10);
                    setEditRating(sup.ratingScore || 4.5);
                  }}
                  className={`p-4 cursor-pointer transition space-y-2 ${
                    isSelected ? 'bg-slate-800/80 border-l-4 border-[#febd69]' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-extrabold text-white">{sup.businessName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{sup.id} • {sup.country}</div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        sup.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sup.status === 'PENDING_VERIFICATION'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {sup.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                    <span>Products: {sup.totalProductsCount} SKUs</span>
                    <span>Rating: <strong className="text-[#febd69]">★ {sup.ratingScore || 'N/A'}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Inspection Column */}
        {selectedSupplier ? (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-black text-white">{selectedSupplier.businessName}</h3>
                  <span className="font-mono text-xs text-[#febd69]">({selectedSupplier.id})</span>
                </div>
                <p className="text-slate-400 text-xs mt-0.5">
                  Contact: {selectedSupplier.contactPerson} • {selectedSupplier.email} • {selectedSupplier.phone}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(selectedSupplier.id)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Supplier</span>
                </button>

                <button
                  onClick={() => handleSuspend(selectedSupplier.id)}
                  className="px-3.5 py-2 bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:bg-amber-600/50 font-bold rounded-xl transition flex items-center space-x-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Suspend</span>
                </button>

                <button
                  onClick={() => handleReject(selectedSupplier.id)}
                  className="px-3.5 py-2 bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:bg-rose-600/50 font-bold rounded-xl transition flex items-center space-x-1"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            {/* Business & Tax Verification Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Reg Number</span>
                <span className="font-bold text-white text-xs">{selectedSupplier.businessRegistrationNumber || 'US-DEL-8829104'}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Tax ID / VAT ID</span>
                <span className="font-bold text-emerald-400 text-xs">{selectedSupplier.taxId || 'US-99-8239102'}</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Primary Country</span>
                <span className="font-bold text-white text-xs">{selectedSupplier.country}</span>
              </div>
            </div>

            {/* KYC Filings */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Uploaded KYC Filings & Documents ({selectedSupplier.kycDocuments.length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSupplier.kycDocuments.map((doc) => (
                  <div key={doc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white text-xs block">{doc.documentName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{doc.documentType} • Uploaded {doc.uploadedAt}</span>
                    </div>

                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Commission & Trust Score Configuration */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#febd69]" />
                <span>Commission Rate & Trust Rating Override</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                    Marketplace Commission Fee (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={editCommission}
                      onChange={(e) => setEditCommission(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold focus:outline-none focus:border-[#febd69]"
                    />
                    <span className="absolute right-3 top-3 text-slate-400 font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Default marketplace baseline is 10.0%.</span>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">
                    Assigned Supplier Trust Rating (1.0 - 5.0 Stars)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editRating}
                    onChange={(e) => setEditRating(parseFloat(e.target.value) || 5.0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-[#febd69] font-mono font-black focus:outline-none focus:border-[#febd69]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Controls placement priority in seller import catalogues.</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl shadow-xl text-center text-slate-500 lg:col-span-2">
            Select a supplier from the list to review KYC documents and update verification status.
          </div>
        )}
      </div>
    </div>
  );
};
