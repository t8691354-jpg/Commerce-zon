import React, { useState } from 'react';
import { MOCK_AI_PREDICTIVE_BI } from '../../data/mockBiAnalytics';
import { Bot, Sparkles, TrendingUp, Sliders, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const BiPredictiveAiView: React.FC = () => {
  const [marketingBoostPct, setMarketingBoostPct] = useState<number>(15);
  const [primeDaySurge, setPrimeDaySurge] = useState<boolean>(true);
  const [shippingSpeedBonus, setShippingSpeedBonus] = useState<boolean>(true);

  // Calculate dynamic multiplier
  const multiplier = 1 + (marketingBoostPct / 100) * 0.4 + (primeDaySurge ? 0.12 : 0) + (shippingSpeedBonus ? 0.05 : 0);

  return (
    <div className="space-y-6">
      {/* Predictive Engine Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 p-6 rounded-2xl border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300">
              <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                AI Predictive Analytics Engine (Deep-Learning Forecasting)
              </h3>
              <p className="text-xs text-purple-200">
                Multi-layer neural time-series forecast for GMV, FBA capacity demand & customer churn
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full font-bold self-start sm:self-auto">
            96.4% Model Accuracy (R² = 0.984)
          </span>
        </div>

        {/* Interactive Scenario Simulator Controls */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <Sliders className="w-4 h-4" />
            <span>Interactive Scenario Simulator Parameter Controls:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium flex justify-between">
                <span>Ad Spend Boost:</span>
                <span className="text-amber-400 font-mono font-bold">+{marketingBoostPct}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={marketingBoostPct}
                onChange={(e) => setMarketingBoostPct(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-300 font-medium">Prime Day Surge (+12%):</span>
              <button
                onClick={() => setPrimeDaySurge(!primeDaySurge)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  primeDaySurge ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {primeDaySurge ? 'ENABLED' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-300 font-medium">Same-Day Delivery (+5%):</span>
              <button
                onClick={() => setShippingSpeedBonus(!shippingSpeedBonus)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  shippingSpeedBonus ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {shippingSpeedBonus ? 'ENABLED' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Models Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {MOCK_AI_PREDICTIVE_BI.map((model) => {
          const simulatedVal = model.predictedValue30d * multiplier;
          return (
            <div key={model.metricName} className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{model.metricName}</h4>
                  <p className="text-xs text-purple-300 font-mono mt-0.5">Driver: {model.growthDriver}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded">
                  {model.confidenceScorePct}% Conf
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current Base Value:</span>
                  <span className="text-slate-200">${(model.currentValue / 1e6).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-xs text-amber-400 font-bold">
                  <span>Simulated 30-Day Target:</span>
                  <span className="text-emerald-400 text-sm">${(simulatedVal / 1e6).toFixed(1)}M</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">4-Week Confidence Intervals (Upper / Lower Bounds):</span>
                {model.forecastPoints.map((pt) => (
                  <div key={pt.date} className="p-2 bg-slate-950 rounded border border-slate-800/80 flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{pt.date}</span>
                    <span className="text-amber-400">
                      Est: ${( (pt.predicted * multiplier) / 1e6 ).toFixed(1)}M
                      <span className="text-[10px] text-slate-500 ml-1.5">
                        [${((pt.lowerBound * multiplier) / 1e6).toFixed(1)}M - ${((pt.upperBound * multiplier) / 1e6).toFixed(1)}M]
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
