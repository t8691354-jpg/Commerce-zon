import React, { useState } from 'react';
import { Shipment, CustomsDeclaration } from '../../types/logistics';
import {
  Globe,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  DollarSign,
  Download,
} from 'lucide-react';

interface InternationalCustomsViewProps {
  shipments: Shipment[];
}

export const InternationalCustomsView: React.FC<InternationalCustomsViewProps> = ({ shipments }) => {
  const intlShipments = shipments.filter((s) => s.shippingMethod === 'INTERNATIONAL' || s.customs);
  const currentShipment = intlShipments[0] || shipments[1];

  const handleDownloadDoc = (docName: string) => {
    alert(`Downloading Official Customs Compliance Document: ${docName}`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>CROSS-BORDER INTERNATIONAL SHIPPING & CUSTOMS ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Export / Import Customs Declarations, HS Code Audits & Duty Collection</h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate Commercial Invoices, CN22/CN23 customs declarations, pre-calculated EU/UK import duties, VAT taxes & restricted goods scanning
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            EORI & IOSS Tax Verified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Customs Declaration Panel */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between font-mono">
            <span>Declaration Certificate — {currentShipment?.customs?.declarationId || 'CUSTOMS-DE-8821'}</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[9px] font-bold">
              {currentShipment?.customs?.clearedStatus || 'PENDING'}
            </span>
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Destination Country:</span>
              <strong className="text-white">{currentShipment?.destinationCountry || 'DEU (Germany)'}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Harmonized System (HS) Code:</span>
              <strong className="text-emerald-400">{currentShipment?.customs?.hsCode || '8508.11.0000'}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Declared Commercial Value:</span>
              <strong className="text-white">${currentShipment?.customs?.declaredValueUSD.toFixed(2) || '599.00'} USD</strong>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 text-center text-[10px]">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 uppercase block">Import Duty</span>
                <strong className="text-emerald-400">${currentShipment?.customs?.importDutyUSD.toFixed(2) || '35.94'}</strong>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 uppercase block">Export Duty</span>
                <strong className="text-emerald-400">${currentShipment?.customs?.exportDutyUSD.toFixed(2) || '0.00'}</strong>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-500 uppercase block">EU VAT Tax</span>
                <strong className="text-sky-300">${currentShipment?.customs?.customsTaxUSD.toFixed(2) || '113.81'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Official Generated Customs Documents */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 font-mono">
            Generated Official Customs Compliance Documents
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {(currentShipment?.customs?.documentsGenerated || [
              'Commercial Invoice (3 Triplicate Copies)',
              'EU CN23 Customs Label Declaration',
              'EORI Tax Verification Certificate',
            ]).map((doc, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white block text-xs">{doc}</span>
                    <span className="text-[9px] text-slate-500">Form Standard: WCO Compliant</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadDoc(doc)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PDF</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
