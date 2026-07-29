import React from 'react';
import { Globe, FileText, ShieldCheck, CheckCircle2, AlertTriangle, DollarSign, ArrowRight } from 'lucide-react';

export const InternationalShippingView: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Globe className="w-4 h-4 text-[#febd69]" />
            <span>CROSS-BORDER LOGISTICS & EU / US CUSTOMS CLEARANCE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Automated Import Duties, Export HS Code Verification & CN22/CN23 Forms</h2>
          <p className="text-xs text-slate-400 mt-1">
            Compliant international trade documentation, customs duty pre-collection (DDP) & cross-border cargo inspection tracking
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg font-bold">
            EORI & IOSS Tax Compliant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
        {/* Customs Document Generator */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#febd69]" />
            <span>Active Cross-Border Customs Manifest (Shipment SHP-1002)</span>
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Harmonized System (HS) Code:</span>
              <strong className="text-white">8508.11.0000 (LiDAR Vacuums)</strong>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Declared Goods Commercial Value:</span>
              <strong className="text-emerald-400">$599.00 USD</strong>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">EU Import Tariff Duty (6%):</span>
              <strong className="text-amber-400">$35.94 USD</strong>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">VAT / Import Tax (19% DE):</span>
              <strong className="text-amber-400">$113.81 USD</strong>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase block">Generated Official Clearance Documents</span>
              <div className="space-y-1 text-[10px] text-slate-300">
                <p className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Commercial Invoice (3 Copies Verified for Frankfurt FRA Customs)</span>
                </p>
                <p className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CN23 Customs Declaration Barcoded Document</span>
                </p>
                <p className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>EU EORI Duty Pre-Paid Certificate</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Restricted Goods Policy Guard */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Restricted Goods & Compliance Engine</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">Lithium Battery Transport Safety (UN 38.3)</span>
              <p className="text-slate-400 text-[10px]">
                Automated dangerous goods declaration generated for electronics containing lithium ion batteries. Air cargo flight restriction passed.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-sky-300 font-bold block">OFAC & Export Control Sanctions Screening</span>
              <p className="text-slate-400 text-[10px]">
                Real-time automated check against denied persons lists, sanctioned regions & restricted dual-use technology databases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
