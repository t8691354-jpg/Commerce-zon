import React from 'react';
import { ShippingMethodConfig } from '../../types/logistics';
import { Sliders, Zap, CheckCircle2, XCircle, Clock, DollarSign, Package } from 'lucide-react';

interface ShippingMethodsViewProps {
  shippingMethods: ShippingMethodConfig[];
  onToggleMethod: (methodId: string) => void;
}

export const ShippingMethodsView: React.FC<ShippingMethodsViewProps> = ({
  shippingMethods,
  onToggleMethod,
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Zap className="w-4 h-4 text-[#febd69]" />
            <span>SHIPPING METHODS & SERVICE LEVEL TIERS</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Configure Fulfillment Shipping Speeds & Rates</h2>
          <p className="text-xs text-slate-400 mt-1">
            Standard ground, Prime Same-Day, Next-Day Air, Scheduled time-slot, Cross-Border International, LTL Freight & Locker Pickup
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            9 Active Delivery Speeds
          </span>
        </div>
      </div>

      {/* Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
        {shippingMethods.map((m) => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border transition shadow-xl space-y-4 flex flex-col justify-between ${
              m.isEnabled ? 'bg-slate-900 border-slate-800' : 'bg-slate-950 border-slate-800/50 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-extrabold text-white text-sm">{m.name}</span>
                <button
                  onClick={() => onToggleMethod(m.id)}
                  className={`px-2.5 py-1 rounded text-[9px] font-black uppercase ${
                    m.isEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {m.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <p className="text-slate-400 text-[11px] font-sans">{m.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 uppercase">Estimated SLA Speed:</span>
                <strong className="text-[#febd69]">{m.estimatedDays}</strong>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 uppercase">Base Shipping Cost:</span>
                <strong className="text-emerald-400">${m.baseCostUSD.toFixed(2)} USD</strong>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 uppercase">Per Weight Surcharge:</span>
                <strong className="text-sky-300">${m.perKgCostUSD.toFixed(2)} / kg</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
