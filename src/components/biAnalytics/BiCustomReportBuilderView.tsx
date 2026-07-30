import React, { useState } from 'react';
import { MOCK_CUSTOM_REPORTS } from '../../data/mockBiAnalytics';
import { CustomReportConfig, ExportFormat, ScheduledFrequency, BiTimeframe } from '../../types/biAnalytics';
import { FileText, Download, Calendar, Mail, Plus, CheckCircle2, BarChart2, PieChart, Table, Play } from 'lucide-react';

export const BiCustomReportBuilderView: React.FC = () => {
  const [reports, setReports] = useState<CustomReportConfig[]>(MOCK_CUSTOM_REPORTS);
  const [title, setTitle] = useState('');
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>(['Sales', 'Financial']);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['GMV', 'Net Profit']);
  const [chartType, setChartType] = useState<CustomReportConfig['chartType']>('line');
  const [timeframe, setTimeframe] = useState<BiTimeframe>('30d');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduledFrequency>('monthly');
  const [emailRecipients, setEmailRecipients] = useState('executive-reports@commercezon.com');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const availableDataSources = ['Sales', 'Financial', 'Customers', 'Sellers', 'Affiliates', 'Inventory', 'Orders', 'Marketing', 'Logistics'];
  const availableMetrics = ['GMV', 'Marketplace Revenue', 'Net Profit', 'Customer CLV', 'Return Rate', 'Conversion Rate', 'Inventory Turnover', 'CAC'];

  const toggleDataSource = (ds: string) => {
    setSelectedDataSources((prev) =>
      prev.includes(ds) ? prev.filter((item) => item !== ds) : [...prev, ds]
    );
  };

  const toggleMetric = (m: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newReport: CustomReportConfig = {
      id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
      title,
      dataSources: selectedDataSources,
      metrics: selectedMetrics,
      chartType,
      timeframe,
      createdAt: new Date().toISOString().substring(0, 10),
      isScheduled,
      scheduleFrequency: isScheduled ? scheduleFrequency : undefined,
      recipients: isScheduled ? [emailRecipients] : undefined,
    };

    setReports([newReport, ...reports]);
    setTitle('');
    setNotificationMsg(`Report template "${title}" generated and saved successfully!`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleExport = (reportTitle: string, format: ExportFormat) => {
    setNotificationMsg(`Generating and downloading "${reportTitle}" as .${format.toUpperCase()} file...`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {notificationMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Custom Report Builder */}
        <form onSubmit={handleCreateReport} className="lg:col-span-2 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Enterprise Custom Report Builder
            </h3>
            <p className="text-xs text-slate-400">Select data sources, metrics, chart visualizers, filters and scheduled email delivery</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Report Title / Description</label>
              <input
                type="text"
                placeholder="e.g. Q3 Regional Sales & FBA Profit Margin Analysis"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-amber-500 outline-none"
                required
              />
            </div>

            {/* Data Sources */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Select Data Sources</label>
              <div className="flex flex-wrap gap-2">
                {availableDataSources.map((ds) => (
                  <button
                    type="button"
                    key={ds}
                    onClick={() => toggleDataSource(ds)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      selectedDataSources.includes(ds)
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {ds}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Select Metrics</label>
              <div className="flex flex-wrap gap-2">
                {availableMetrics.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleMetric(m)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                      selectedMetrics.includes(m)
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type & Timeframe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Visualization Format</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono"
                >
                  <option value="line">Line Chart</option>
                  <option value="bar">Bar Chart</option>
                  <option value="area">Area Chart</option>
                  <option value="pie">Pie / Donut Chart</option>
                  <option value="heatmap">Heatmap / Geo Map</option>
                  <option value="funnel">Funnel Chart</option>
                  <option value="table">Data Table</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Time Horizon Range</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono"
                >
                  <option value="24h">Trailing 24 Hours</option>
                  <option value="7d">Trailing 7 Days</option>
                  <option value="30d">Trailing 30 Days</option>
                  <option value="90d">Trailing 90 Days</option>
                  <option value="1y">Trailing 1 Year</option>
                </select>
              </div>
            </div>

            {/* Schedule Toggle */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Enable Automated Scheduled Dispatch</p>
                  <p className="text-slate-400 text-[11px]">Send PDF/Excel report automatically to executive stakeholders</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsScheduled(!isScheduled)}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    isScheduled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isScheduled ? 'SCHEDULED' : 'OFF'}
                </button>
              </div>

              {isScheduled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Frequency</label>
                    <select
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                    >
                      <option value="daily">Daily Morning Digest</option>
                      <option value="weekly">Weekly Monday Report</option>
                      <option value="monthly">Monthly Executive Audit</option>
                      <option value="quarterly">Quarterly Board Packet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Email Recipients</label>
                    <input
                      type="email"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Generate & Save Custom Report Template</span>
            </button>
          </div>
        </form>

        {/* Saved Reports List & Export Action Bar */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Saved Custom Reports</span>
            <span className="text-xs font-mono text-amber-400">{reports.length} Templates</span>
          </h3>

          <div className="space-y-3">
            {reports.map((rpt) => (
              <div key={rpt.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs">{rpt.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {rpt.id} • Format: {rpt.chartType}</p>
                  </div>
                  {rpt.isScheduled && (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold font-mono">
                      {rpt.scheduleFrequency}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>Data Sources: <span className="text-slate-200 font-semibold">{rpt.dataSources.join(', ')}</span></p>
                  <p>Metrics: <span className="text-amber-300 font-semibold">{rpt.metrics.join(', ')}</span></p>
                </div>

                {/* Instant Export Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {(['pdf', 'excel', 'csv', 'json'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(rpt.title, fmt)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 rounded text-[10px] font-bold uppercase transition flex items-center space-x-1"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>{fmt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
