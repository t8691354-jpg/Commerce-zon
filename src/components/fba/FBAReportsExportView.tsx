import React, { useState } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FileType,
  Printer,
  BarChart,
  Warehouse,
  Boxes,
  Truck,
  RotateCcw,
  DollarSign,
  Users,
} from 'lucide-react';

export const FBAReportsExportView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('WAREHOUSE_UTILISATION');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'EXCEL' | 'CSV'>('PDF');

  const handleExport = () => {
    alert(`Generating & Downloading FBA ${selectedReport.replace('_', ' ')} Report in ${exportFormat} format...`);
  };

  const reportTypes = [
    { id: 'WAREHOUSE_UTILISATION', title: 'Warehouse Utilisation & Cubic Occupancy Report', icon: Warehouse },
    { id: 'INVENTORY_HEALTH', title: 'Inventory Aging & Storage Fee Breakdown', icon: Boxes },
    { id: 'FULFILMENT_PERFORMANCE', title: 'Pick, Pack & Carrier Dispatch SLA Metrics', icon: Truck },
    { id: 'RETURNS_ANALYSIS', title: 'RMA Customer Returns & Inspection Report', icon: RotateCcw },
    { id: 'SELLER_FINANCIAL_LEDGER', title: 'Seller FBA Fee & Wallet Deduction Ledger', icon: DollarSign },
    { id: 'STAFF_PRODUCTIVITY', title: 'Warehouse Staff Picking & Packing Accuracy Roster', icon: Users },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#febd69]" />
            <span>FBA GLOBAL LOGISTICS REPORTING & EXPORT ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Export Enterprise Warehouse & Fulfilment Audit Datasets</h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate audit-ready compliance reports for inventory valuation, bin utilization, carrier shipping SLAs & seller wallet fee deductions
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black rounded-xl transition flex items-center space-x-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Export {exportFormat} Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-mono">
        {/* Report Selector List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3">
            Select Report Template
          </h3>

          <div className="space-y-2">
            {reportTypes.map((rep) => {
              const IconComp = rep.icon;
              const isSelected = selectedReport === rep.id;

              return (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReport(rep.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-slate-950 border-[#febd69] text-white font-bold'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <IconComp className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#febd69]' : 'text-slate-500'}`} />
                  <span className="text-xs leading-snug">{rep.title}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase block">Export Format</span>
            <div className="grid grid-cols-3 gap-2">
              {(['PDF', 'EXCEL', 'CSV'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`py-2 rounded-xl text-center font-bold border transition ${
                    exportFormat === fmt
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Preview Panel */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 lg:col-span-2 font-sans">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 font-mono">
            <div>
              <span className="text-xs font-black text-white uppercase block">Report Live Audit Preview</span>
              <span className="text-emerald-400 text-[10px]">Generated for Commerce Zon FBA Global Network</span>
            </div>

            <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-[10px]">
              Status: Verified Production Data
            </span>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 text-xs font-mono">
            <div className="text-center space-y-1 border-b border-slate-800 pb-4">
              <h4 className="text-base font-black text-[#febd69] tracking-wider uppercase">FULFILMENT BY MARKETPLACE (FBA) AUDIT STATEMENT</h4>
              <p className="text-slate-400 text-[11px]">Template: {selectedReport.replace('_', ' ')} • Date: July 27, 2026</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[10px]">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[8px] uppercase block">Total Warehouses</span>
                <strong className="text-white text-xs">3 Active Hubs</strong>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[8px] uppercase block">Storage Occupancy</span>
                <strong className="text-emerald-400 text-xs">75.3% Avg</strong>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[8px] uppercase block">Pick Accuracy SLA</span>
                <strong className="text-sky-400 text-xs">99.85%</strong>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[8px] uppercase block">Total Units Stored</span>
                <strong className="text-amber-300 text-xs">2,660 Units</strong>
              </div>
            </div>

            <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-800 pt-3">
              <p>✔ All warehouse locations pass thermal and climate calibration compliance tests.</p>
              <p>✔ Digital scale accuracy audits verified for all packing lanes in EWR4, ONT8 & BFI4 hubs.</p>
              <p>✔ Wallet fee deductions calculated with volumetric cubic meter billing algorithm.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
