import React, { useState } from 'react';
import { ShippingCarrier, ShippingMethodType } from '../../types/logistics';
import {
  Calculator,
  DollarSign,
  Scale,
  Ruler,
  MapPin,
  Truck,
  ShieldAlert,
  Fuel,
  Receipt,
} from 'lucide-react';

interface ShippingCostCalculatorViewProps {
  carriers: ShippingCarrier[];
}

export const ShippingCostCalculatorView: React.FC<ShippingCostCalculatorViewProps> = ({ carriers }) => {
  const [weightKg, setWeightKg] = useState(4.2);
  const [lengthCm, setLengthCm] = useState(30);
  const [widthCm, setWidthCm] = useState(20);
  const [heightCm, setHeightCm] = useState(15);
  const [distanceKm, setDistanceKm] = useState(850);
  const [method, setMethod] = useState<ShippingMethodType>('EXPRESS');
  const [carrierId, setCarrierId] = useState(carriers[0]?.id || 'CARRIER-AMZL');
  const [includeInsurance, setIncludeInsurance] = useState(true);

  // Volumetric weight formula: (L * W * H) / 5000
  const volumetricWeightKg = (lengthCm * widthCm * heightCm) / 5000;
  const billableWeightKg = Math.max(weightKg, volumetricWeightKg);

  const selectedCarrier = carriers.find((c) => c.id === carrierId) || carriers[0];
  const carrierMultiplier = selectedCarrier?.basePricingRate || 1.0;

  const baseRateUSD = method === 'SAME_DAY' ? 19.99 : method === 'EXPRESS' ? 12.99 : method === 'INTERNATIONAL' ? 39.99 : 4.99;
  const distanceCostUSD = (distanceKm / 100) * 1.20;
  const weightCostUSD = billableWeightKg * 1.50;
  const fuelSurchargeUSD = (baseRateUSD + distanceCostUSD + weightCostUSD) * 0.08; // 8% fuel surcharge
  const insuranceCostUSD = includeInsurance ? 3.50 : 0.0;
  const taxUSD = (baseRateUSD + distanceCostUSD + weightCostUSD + fuelSurchargeUSD) * 0.07; // 7% tax

  const totalCalculatedCostUSD = (baseRateUSD + distanceCostUSD + weightCostUSD + fuelSurchargeUSD + insuranceCostUSD + taxUSD) * carrierMultiplier;

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>DYNAMIC FREIGHT & VOLUMETRIC SHIPPING COST ENGINE</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Algorithmic Shipping Cost, Volumetric Weight & Surcharge Calculator</h2>
          <p className="text-xs text-slate-400 mt-1">
            Compute precise freight quotes using deadweight, cubic volumetric dimensions, distance matrices, carrier rate multipliers, fuel surcharges & insurance
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
            DIM Factor: 5000 cm³/kg
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        {/* Calculator Inputs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 font-mono">
            Package Dimensions & Route Inputs
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Actual Deadweight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Route Distance (km)</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Length (cm)</label>
                <input
                  type="number"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Width (cm)</label>
                <input
                  type="number"
                  value={widthCm}
                  onChange={(e) => setWidthCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Carrier Provider</label>
                <select
                  value={carrierId}
                  onChange={(e) => setCarrierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  {carriers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Speed SLA</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as ShippingMethodType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="EXPRESS">Express Air</option>
                  <option value="SAME_DAY">Prime Same-Day</option>
                  <option value="STANDARD">Standard Ground</option>
                  <option value="INTERNATIONAL">Cross-Border Int'l</option>
                </select>
              </div>
            </div>

            <label className="flex items-center space-x-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeInsurance}
                onChange={(e) => setIncludeInsurance(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span className="text-slate-300 font-bold">Add Full Loss & Damage Insurance ($3.50 Flat)</span>
            </label>
          </div>
        </div>

        {/* Breakdown Output */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-sans">
          <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-slate-800 pb-3 font-mono">
            Calculated Freight Quote Breakdown
          </h3>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Deadweight vs Volumetric Weight:</span>
              <span className="text-white font-bold">{weightKg.toFixed(1)} kg vs {volumetricWeightKg.toFixed(1)} kg</span>
            </div>

            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500 uppercase">Billable Weight Used:</span>
              <strong className="text-amber-300 font-bold">{billableWeightKg.toFixed(1)} kg</strong>
            </div>

            <div className="space-y-1.5 pt-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Base SLA Rate ({method}):</span>
                <span className="text-white">${baseRateUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance Charge ({distanceKm} km):</span>
                <span className="text-white">${distanceCostUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Weight Surcharge ({billableWeightKg.toFixed(1)} kg):</span>
                <span className="text-white">${weightCostUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fuel Surcharge (8% Index):</span>
                <span className="text-white">${fuelSurchargeUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Insurance Premium:</span>
                <span className="text-white">${insuranceCostUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Taxes & Port Levies (7%):</span>
                <span className="text-white">${taxUSD.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-slate-800 flex justify-between items-center text-sm">
              <span className="font-extrabold text-white uppercase">Total Calculated Shipping Quote:</span>
              <strong className="text-xl font-black text-emerald-400">${totalCalculatedCostUSD.toFixed(2)} USD</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
