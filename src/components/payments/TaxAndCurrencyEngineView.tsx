import React, { useState } from 'react';
import { TaxRuleSetting, CurrencyRate } from '../../types/payments';
import { MOCK_TAX_RULES, MOCK_CURRENCIES } from '../../data/paymentsMockData';
import {
  Globe,
  DollarSign,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Calculator,
  Sliders,
} from 'lucide-react';

export const TaxAndCurrencyEngineView: React.FC = () => {
  const [taxRules, setTaxRules] = useState<TaxRuleSetting[]>(MOCK_TAX_RULES);
  const [currencies, setCurrencies] = useState<CurrencyRate[]>(MOCK_CURRENCIES);

  // Currency Converter State
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('PKR');

  // Perform Conversion
  const fromRate = currencies.find((c) => c.code === fromCurr)?.exchangeRateToUSD || 1.0;
  const toRate = currencies.find((c) => c.code === toCurr)?.exchangeRateToUSD || 1.0;
  const convertedValue = (calcAmount / fromRate) * toRate;

  const handleToggleTax = (id: string) => {
    setTaxRules((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isEnabled: !t.isEnabled } : t))
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#febd69] uppercase tracking-wider">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>GLOBAL TAX ENGINE & MULTI-CURRENCY CONVERSION</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">International Tax Engine & Currency Rate Matrix</h2>
          <p className="text-xs text-slate-400 mt-1">
            US Sales Tax, EU/UK VAT & GST compliance automation alongside real-time multi-currency FX conversion rates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tax Rules Matrix */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#febd69]" />
            <span>Jurisdictional Tax Rate Matrix ({taxRules.length} Configured)</span>
          </h3>

          <div className="space-y-3">
            {taxRules.map((tax) => (
              <div key={tax.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{tax.countryName}</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded">
                      {tax.taxName}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Standard Rate: <strong className="text-emerald-400">{tax.standardRatePct}%</strong>
                    {tax.reducedRatePct && ` | Reduced: ${tax.reducedRatePct}%`}
                    {tax.vatNumberRequired && ` | VAT ID Required`}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleTax(tax.id)}
                  className={`px-3 py-1 rounded-xl font-bold transition text-xs ${
                    tax.isEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tax.isEnabled ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Multi-Currency Rate Converter */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
          <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Live Multi-Currency FX Converter</span>
          </h3>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Base Amount to Convert:</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold text-base focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1">From Currency:</label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">To Currency:</label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Result Display */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center space-y-1 font-mono">
              <span className="text-slate-400 text-[10px] uppercase">Converted Output:</span>
              <div className="text-xl font-black text-[#febd69]">
                {currencies.find((c) => c.code === toCurr)?.symbol}
                {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurr}
              </div>
              <div className="text-[10px] text-slate-500">
                1 {fromCurr} = {(toRate / fromRate).toFixed(4)} {toCurr}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
