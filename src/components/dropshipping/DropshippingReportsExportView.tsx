import React, { useState } from 'react';
import { FileText, Download, BarChart3, ShieldCheck } from 'lucide-react';

export const DropshippingReportsExportView: React.FC = () => {
  const [reportType, setReportType] = useState('SUPPLIER_PERFORMANCE');

  const handleDownload = (fmt: 'CSV' | 'PDF' | 'EXCEL') => {
    alert(`Generating & Downloading ${reportType} Report in ${fmt} format...`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>ENTERPRISE DROPSHIPPING REPORTS & EXPORT ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Marketplace Financial & Supply Chain Analytics Reports</h2>
          <p className="text-xs text-slate-400 mt-1">
            Reconciled supplier audit reports, inventory valuation ledgers, order streams & marketplace commission statements
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownload('CSV')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleDownload('PDF')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 border border-slate-700"
          >
            <Download className="w-4 h-4 text-rose-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Reports Selector Grid */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-[#febd69]" />
          <span>Select Reconciled Report Type</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'SUPPLIER_PERFORMANCE', label: 'Supplier Quality & SLA Scorecard', desc: 'On-time delivery %, cancellation rates & stock accuracy' },
            { id: 'INVENTORY_AUDIT', label: 'Warehouse Stock Valuation', desc: 'Physical stock levels, reserved stock locks & low inventory alerts' },
            { id: 'ORDER_STREAM', label: 'Order Routing & Fulfilment Log', desc: 'Complete breakdown of routed orders, carriers & tracking numbers' },
            { id: 'REVENUE_COMMISSION', label: 'Marketplace Take & Commission Split', desc: 'Wholesale costs, seller profit margins & 10% marketplace fees' },
            { id: 'SETTLEMENT_LEDGER', label: 'Supplier Wallet Payouts', desc: 'Settled funds, held risk reserves & instant wallet transactions' },
          ].map((rep) => (
            <div
              key={rep.id}
              onClick={() => setReportType(rep.id)}
              className={`p-4 rounded-xl border cursor-pointer transition space-y-1.5 ${
                reportType === rep.id
                  ? 'bg-slate-950 border-[#febd69] ring-2 ring-amber-400/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white">{rep.label}</div>
              <p className="text-[10px] text-slate-400">{rep.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
