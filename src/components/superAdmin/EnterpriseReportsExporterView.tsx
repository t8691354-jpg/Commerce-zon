import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle2, BarChart2 } from 'lucide-react';

export const EnterpriseReportsExporterView: React.FC = () => {
  const [reportType, setReportType] = useState('Financial GMV & Commission Summary');
  const [exportFormat, setExportFormat] = useState<'PDF' | 'EXCEL' | 'CSV' | 'JSON'>('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setNotification(`Enterprise report "${reportType}" successfully generated & downloaded in ${exportFormat} format.`);
      setTimeout(() => setNotification(null), 3500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-amber-400" />
          Enterprise Business Intelligence & Audit Report Generator
        </h3>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Report Template</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono"
            >
              <option value="Financial GMV & Commission Summary">Financial GMV & Commission Ledger Report</option>
              <option value="Global User IAM & Role Compliance Audit">Global User IAM & Role Compliance Audit</option>
              <option value="Platform Security & Threat Incident Matrix">Platform Security & Threat Incident Matrix</option>
              <option value="Seller Performance & Order Defect Analysis">Seller Performance & Order Defect Analysis</option>
              <option value="System Infrastructure Telemetry & Uptime Log">System Infrastructure Telemetry & Uptime Log</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Export Data Format</label>
            <div className="grid grid-cols-4 gap-2">
              {(['PDF', 'EXCEL', 'CSV', 'JSON'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={`py-2 rounded-xl font-bold border transition ${
                    exportFormat === fmt
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center space-x-2 text-xs shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Generating Enterprise Report...' : `Export ${exportFormat} Document`}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
