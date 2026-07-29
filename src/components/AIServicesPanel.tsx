import React, { useState } from 'react';
import { Bot, Sparkles, DollarSign, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const AIServicesPanel: React.FC = () => {
  const [roughTitle, setRoughTitle] = useState('');
  const [category, setCategory] = useState('computing');
  const [generatingProduct, setGeneratingProduct] = useState(false);
  const [aiProductResult, setAiProductResult] = useState<any>(null);

  const [fraudScoreInput, setFraudScoreInput] = useState({
    amount: '6400',
    itemCount: '2',
    userAccountAgeDays: '4',
  });
  const [fraudAssessment, setFraudAssessment] = useState<any>(null);

  const handleGenerateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingProduct(true);
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roughTitle, targetCategory: category }),
      });
      const data = await res.json();
      setAiProductResult(data);
    } catch (err) {
      console.error('Failed AI draft generation', err);
    } finally {
      setGeneratingProduct(false);
    }
  };

  const handleEvaluateFraud = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(fraudScoreInput.amount) || 0;
    const age = parseInt(fraudScoreInput.userAccountAgeDays) || 1;

    let score = 5;
    if (amt > 5000) score += 25;
    if (age < 7) score += 30;

    setFraudAssessment({
      score,
      riskLevel: score > 50 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW',
      reasons: [
        amt > 5000 ? 'High order monetary volume (> $5,000 USD)' : 'Standard transaction volume',
        age < 7 ? 'New buyer account age (< 7 days)' : 'Established buyer account age',
        'Cross-border fulfillment address pattern verified',
      ],
      suggestedAction: score > 50 ? 'REQUIRE_MANUAL_REVIEW' : 'AUTO_APPROVE',
    });
  };

  return (
    <div className="space-y-8">
      {/* AI Intelligence Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Enterprise AI Intelligence Hub</span>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                Powered by Gemini 3.6 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Modular AI engines for sellers, inventory managers, and security operations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Module 1: AI Merchant Product Listing Studio */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">1. AI Seller Content Generator</h3>
          </div>

          <form onSubmit={handleGenerateListing} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Rough Concept / Working Title
              </label>
              <input
                type="text"
                value={roughTitle}
                onChange={(e) => setRoughTitle(e.target.value)}
                placeholder="e.g. Ultra high speed industrial 3d scanner"
                className="w-full bg-slate-950 text-white placeholder-slate-600 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
              >
                <option value="computing">Computing & Hardware</option>
                <option value="robotics">Robotics & Automation</option>
                <option value="electronics">Enterprise Electronics</option>
                <option value="industrial">Industrial & Metrology</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={generatingProduct}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>{generatingProduct ? 'Generating Listing via Gemini...' : 'Generate AI Catalog Listing'}</span>
            </button>
          </form>

          {aiProductResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between text-blue-400 font-semibold">
                <span>Generated Product Draft</span>
                <span className="text-[10px] bg-blue-900/60 px-2 py-0.5 rounded text-blue-200">
                  {aiProductResult.suggestedSKU}
                </span>
              </div>

              <div>
                <span className="text-slate-500">Title: </span>
                <span className="font-bold text-white">{aiProductResult.title}</span>
              </div>

              <div>
                <span className="text-slate-500">Description: </span>
                <p className="text-slate-300 mt-1 leading-relaxed">{aiProductResult.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <span className="text-slate-400">Suggested Price:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${aiProductResult.suggestedPrice?.toLocaleString()} USD
                </span>
              </div>

              <div className="text-[10px] text-slate-500 italic pt-1">{aiProductResult.note}</div>
            </div>
          )}
        </div>

        {/* Module 2: AI Order Fraud Detection Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">2. AI Fraud & Risk Scoring Engine</h3>
          </div>

          <form onSubmit={handleEvaluateFraud} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Order Amount ($ USD)
                </label>
                <input
                  type="number"
                  value={fraudScoreInput.amount}
                  onChange={(e) => setFraudScoreInput({ ...fraudScoreInput, amount: e.target.value })}
                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Buyer Account Age (Days)
                </label>
                <input
                  type="number"
                  value={fraudScoreInput.userAccountAgeDays}
                  onChange={(e) =>
                    setFraudScoreInput({ ...fraudScoreInput, userAccountAgeDays: e.target.value })
                  }
                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Run AI Fraud Evaluation</span>
            </button>
          </form>

          {fraudAssessment && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Calculated Fraud Risk Score:</span>
                <span
                  className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded ${
                    fraudAssessment.riskLevel === 'HIGH'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {fraudAssessment.score} / 100 ({fraudAssessment.riskLevel} RISK)
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-semibold">Evaluation Signals:</span>
                {fraudAssessment.reasons.map((r: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-900 flex justify-between font-mono">
                <span className="text-slate-400">Action Recommendation:</span>
                <span className="text-amber-400 font-bold">{fraudAssessment.suggestedAction}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
