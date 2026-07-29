import React, { useState } from 'react';
import { DollarSign, Sliders, Calculator, Shield, Scale, Truck, Percent } from 'lucide-react';

export const ShippingCostEngineView: React.FC = () => {
  const [weightKg, setWeightKg] = useState(3.5);
  const [distanceKm, setDistanceKm] = useState(850);
  const [speed, setSpeed] = useState<'STANDARD' | 'EXPRESS' | 'SAME_DAY'>('EXPRESS');
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [declaredValue, setDeclaredValue] = useState(300);

  // Dynamic cost calculation algorithm
  const baseRate = speed === 'SAME_DAY' ? 19.99 : speed === 'EXPRESS' ? 12.99 : 4.99;
  const weightFee = weightKg * (speed === 'SAME_DAY' ? 2.2 : 1.2);
  const distanceFee = (distanceKm / 100) * 1.15;
  const fuelSurcharge = (baseRate + weightFee + distanceFee) * 0.08; // 8% fuel
  const insuranceFee = includeInsurance ? declaredValue * 0.01 : 0.0;
  const totalCost = baseRate + weightFee + distanceFee + fuelSurcharge + insuranceFee;

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-[#febd69]" />
            <span>DYNAMIC SHIPPING COST & RATING ALGORITHM ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Multi-Dimensional Volumetric Weight & Distance Calculator</h2>
          <p className="text-xs text-slate-400 mt-1">
            Calculates exact freight rates factoring product dimensions, weight, carrier speed tier, fuel surcharges & cargo insurance
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            Tariff Engine v4.2
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-mono">
        {/* Rating Parameters */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Configure Shipment Variables</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Product Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Transit Distance (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold font-mono focus:outline-none focus:border-[#febd69]"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Delivery Speed Tier</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold font-mono focus:outline-none focus:border-[#febd69]"
              >
                <option value="STANDARD">Standard Ground (3-5 Days)</option>
                <option value="EXPRESS">Express Air (2 Days)</option>
                <option value="SAME_DAY">Prime Same-Day Dispatch</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase mb-1">Declared Value ($)</label>
                <input
                  type="number"
                  value={declaredValue}
                  onChange={(e) => setDeclaredValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold font-mono focus:outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800 w-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="rounded text-[#febd69]"
                  />
                  <span className="text-slate-300 font-mono text-[10px]">Include Insurance</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Output */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Calculated Rate Breakdown</span>
            <span className="text-emerald-400 text-[10px]">Instant Rating API Output</span>
          </h3>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Base Tariff Charge ({speed}):</span>
              <strong className="text-white">${baseRate.toFixed(2)} USD</strong>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Weight Surcharge ({weightKg} kg):</span>
              <strong className="text-white">${weightFee.toFixed(2)} USD</strong>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Distance Freight Charge ({distanceKm} km):</span>
              <strong className="text-white">${distanceFee.toFixed(2)} USD</strong>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Variable Fuel Surcharge (8%):</span>
              <strong className="text-[#febd69]">${fuelSurcharge.toFixed(2)} USD</strong>
            </div>

            {includeInsurance && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cargo Insurance Premium (1%):</span>
                <strong className="text-sky-300">${insuranceFee.toFixed(2)} USD</strong>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-base">
              <span className="font-extrabold text-white">Total Shipping Cost:</span>
              <strong className="text-xl font-black text-emerald-400">${totalCost.toFixed(2)} USD</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
