import React, { useState } from 'react';
import { 
  Sparkles, Clock, TrendingUp, ShieldCheck, Zap, Cpu, BarChart3, Bot, CheckCircle2, RefreshCw
} from 'lucide-react';
import { AISendOptimizer } from '../../types/notifications';
import { INITIAL_AI_OPTIMIZERS } from '../../data/mockNotificationsData';

export const AiCommunicationView: React.FC = () => {
  const [optimizers, setOptimizers] = useState<AISendOptimizer[]>(INITIAL_AI_OPTIMIZERS);
  const [sampleText, setSampleText] = useState<string>('Your order #AMZ-99201 is out for delivery today.');
  const [selectedTone, setSelectedTone] = useState<'Urgent' | 'Friendly' | 'Professional' | 'Promotional'>('Friendly');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleOptimizeTone = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (selectedTone === 'Urgent') {
        setAiResult('⚡ URGENT ACTION REQUIRED: Driver Carlos M. is 3 stops away with Order #AMZ-99201! Track live now.');
      } else if (selectedTone === 'Friendly') {
        setAiResult('📦 Exciting news! Your order #AMZ-99201 is out for delivery today with Carlos M. Enjoy your purchase!');
      } else if (selectedTone === 'Professional') {
        setAiResult('Marketplace Logistics Notice: Shipment #AMZ-99201 has departed fulfillment center and is out for final delivery.');
      } else {
        setAiResult('🎉 Special Delivery Day! Order #AMZ-99201 is arriving today plus earn 2x Prime points on your next item!');
      }
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/40">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Communication & Send Time Optimization Engine</h2>
            <p className="text-xs text-slate-300">Intelligent dispatch timing, predictive engagement scoring, tone adaptation & fatigue prevention</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded.full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
          Gemini AI Engine v16.0 Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Smart Send Time Optimization Table */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Smart Send Time Optimization Models</span>
              </h3>
              <p className="text-xs text-slate-400">Predicted optimal engagement hours per customer cohort</p>
            </div>

            <button
              onClick={() => alert('AI models retrained against recent 30-day clickstream metrics!')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-purple-300 border border-slate-700 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retrain Models</span>
            </button>
          </div>

          <div className="space-y-3">
            {optimizers.map((opt, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{opt.userSegment}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Priority Score: {opt.priorityScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">Optimal Hour</span>
                    <strong className="text-amber-400 font-mono">{opt.predictedOptimalHour}:00 ({opt.predictedOptimalHour > 12 ? `${opt.predictedOptimalHour - 12} PM` : `${opt.predictedOptimalHour} AM`})</strong>
                  </div>

                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">Est Open Rate</span>
                    <strong className="text-emerald-400 font-bold">{opt.predictedOpenRatePct}%</strong>
                  </div>

                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">Recommended Channel</span>
                    <strong className="text-sky-300 uppercase font-mono">{opt.recommendedChannel}</strong>
                  </div>

                  <div className="bg-slate-900 p-2 rounded">
                    <span className="text-[10px] text-slate-400 block">Fatigue Risk</span>
                    <strong className={opt.fatigueRisk === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>{opt.fatigueRisk}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tone Personalization Studio */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>AI Copy Personalization & Tone Adjuster</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Base Message Text</label>
              <textarea
                rows={3}
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Tone Profile</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Urgent', 'Friendly', 'Professional', 'Promotional'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={`py-1.5 px-2 rounded text-xs font-bold transition border ${
                      selectedTone === t
                        ? 'bg-purple-500 text-white border-purple-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleOptimizeTone}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-black text-xs transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'Generating AI Variant...' : 'Optimize Message Copy with AI'}</span>
            </button>

            {aiResult && (
              <div className="p-3.5 bg-slate-950 rounded-lg border border-purple-500/40 space-y-1.5">
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center justify-between">
                  <span>AI Optimized Copy ({selectedTone})</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">{aiResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
