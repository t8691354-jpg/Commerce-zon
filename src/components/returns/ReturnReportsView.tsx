import React from 'react';
import { ReturnRequest } from '../../types/returns';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface Props {
  returnRequests: ReturnRequest[];
}

export const ReturnReportsView: React.FC<Props> = ({ returnRequests }) => {
  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV', reportName: string) => {
    alert(`Exporting ${reportName} in ${format} format... Document download initialized.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#febd69]" />
            <span>Financial Audit Reports & Returns Analytics Exporter</span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate enterprise return rate statements, seller defect audits, and wallet ledger reconciliation reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: 'Monthly Return & Refund Financial Statement',
            desc: 'Detailed breakdown of refunds issued, wallet credits, restocking fees collected, and carrier costs.',
            code: 'REP-FIN-2026-07',
          },
          {
            title: 'Seller Defect Rate & Return Performance Audit',
            desc: 'Merchant-by-merchant analysis of defect rates, return volumes, and SLA response compliance.',
            code: 'REP-SEL-PERF-Q3',
          },
          {
            title: 'Warehouse Quality Inspection Analytics Log',
            desc: 'FC inspection logs detailing item condition, missing accessories, scrap rates, and refurbishments.',
            code: 'REP-WH-INSP-07',
          },
          {
            title: 'AI Return Abuse & Fraud Investigation Log',
            desc: 'Flagged accounts, empty box claims, serial number mismatch audits, and frozen wallet records.',
            code: 'REP-FRD-SEC-2026',
          },
        ].map((report) => (
          <div key={report.code} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-white">{report.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{report.desc}</p>
              </div>
              <span className="font-mono text-[10px] bg-slate-950 border border-slate-800 text-[#febd69] px-2 py-0.5 rounded font-bold">
                {report.code}
              </span>
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleExport('PDF', report.title)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Export PDF</span>
              </button>

              <button
                onClick={() => handleExport('EXCEL', report.title)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={() => handleExport('CSV', report.title)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
