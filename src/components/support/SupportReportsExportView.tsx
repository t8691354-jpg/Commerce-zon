import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  PieChart,
  BarChart,
} from 'lucide-react';

export const SupportReportsExportView: React.FC = () => {
  const [reportType, setReportType] = useState('ALL_TICKETS_AUDIT');
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    alert(
      `Generating ${format} report for "${reportType.replace('_', ' ')}" (${dateRange}). Download will begin in a moment.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#febd69]" />
            <span>Support Analytics & Regulatory Audit Reports</span>
          </h2>
          <p className="text-xs text-slate-400">
            Export comprehensive support performance metrics, CSAT audits, SLA compliance records, and agent roster logs.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Report Module Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
            >
              <option value="ALL_TICKETS_AUDIT">All Support Tickets Audit Trail</option>
              <option value="SLA_COMPLIANCE_REPORT">SLA Compliance & Breach Breakdown</option>
              <option value="AGENT_PERFORMANCE_METRICS">Agent Performance & CSAT Roster</option>
              <option value="AI_DEFLECTION_ANALYTICS">AI Copilot Deflection & CSAT Metrics</option>
              <option value="KNOWLEDGE_BASE_USAGE">Knowledge Base Readership & Ratings</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Time Horizon</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
            >
              <option value="TODAY">Today (24 Hours)</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
              <option value="CURRENT_QUARTER">Current Quarter (Q3 2026)</option>
              <option value="YEAR_TO_DATE">Year to Date (2026)</option>
            </select>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Export Format:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleExport('PDF')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 rounded-xl text-left transition space-y-1 group"
            >
              <div className="flex justify-between items-center text-xs font-bold text-rose-400">
                <span>PDF Document</span>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-rose-400" />
              </div>
              <p className="text-[10px] text-slate-500">Formatted executive report with embedded charts.</p>
            </button>

            <button
              onClick={() => handleExport('EXCEL')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition space-y-1 group"
            >
              <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                <span>Excel Spreadsheet (.xlsx)</span>
                <FileSpreadsheet className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-[10px] text-slate-500">Raw dataset with pivot table formulas.</p>
            </button>

            <button
              onClick={() => handleExport('CSV')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition space-y-1 group"
            >
              <div className="flex justify-between items-center text-xs font-bold text-cyan-400">
                <span>CSV Raw Export (.csv)</span>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </div>
              <p className="text-[10px] text-slate-500">Universal comma-separated database records.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
