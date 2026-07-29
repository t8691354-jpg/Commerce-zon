import React, { useState } from 'react';
import { MOCK_API_SECURITY_METRICS, MOCK_COMPLIANCE_STATUS } from '../../data/mockSecurityFraud';
import { Key, ShieldCheck, Lock, FileCheck, CheckCircle2, Server, Globe, Download } from 'lucide-react';

export const ApiSecurityComplianceView: React.FC = () => {
  const [complianceList, setComplianceList] = useState(MOCK_COMPLIANCE_STATUS);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const handleDownloadCompliancePacket = (framework: string) => {
    setDownloadMsg(`Generating certified compliance audit report packet for ${framework} (.PDF)...`);
    setTimeout(() => setDownloadMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {downloadMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* API Gateway Security Status */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              API Gateway Security & Rate Limiting Health
            </h3>
            <p className="text-xs text-slate-400">
              HMAC SHA-256 Request Signing, OAuth 2.0 / JWT authorization, Input Validation & Webhook Verification
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold self-start sm:self-auto">
            100% Request Signing Enforced
          </span>
        </div>

        {/* API Endpoint Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">API Endpoint Path</th>
                <th className="py-2.5 px-3">Throughput (Req/Min)</th>
                <th className="py-2.5 px-3">Rate Limit Hits</th>
                <th className="py-2.5 px-3">Avg Latency</th>
                <th className="py-2.5 px-3">Signing Method</th>
                <th className="py-2.5 px-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_API_SECURITY_METRICS.map((m) => (
                <tr key={m.endpoint} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-200">{m.endpoint}</td>
                  <td className="py-2.5 px-3 text-amber-400">{m.requestsPerMin.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-rose-400">{m.rateLimitHits}</td>
                  <td className="py-2.5 px-3 text-slate-300">{m.avgLatencyMs} ms</td>
                  <td className="py-2.5 px-3 text-purple-300">{m.signingStatus}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.health === 'Optimal'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {m.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Compliance Frameworks Checklist */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              Global Regulatory Compliance & Data Protection Frameworks
            </h3>
            <p className="text-xs text-slate-400">
              GDPR, CCPA, PCI-DSS v4.0, SOC 2 Type II and ISO 27001 readiness & audit records
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">5 Active Frameworks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceList.map((comp) => (
            <div
              key={comp.framework}
              className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{comp.framework}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Last Audit: {comp.lastAuditDate}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                    comp.status === 'Compliant'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {comp.status} ({comp.complianceScorePct}%)
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-2.5 rounded border border-slate-800/80">
                Key Standard: {comp.keyRequirement}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono">Open Audit Findings: {comp.openFindings}</span>
                <button
                  onClick={() => handleDownloadCompliancePacket(comp.framework)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded text-[11px] font-bold transition flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Audit Packet</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
