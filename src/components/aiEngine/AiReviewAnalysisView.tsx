import React, { useState } from 'react';
import { 
  MessageSquare, ShieldAlert, Sparkles, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle2, FileText, Filter
} from 'lucide-react';
import { ReviewSentimentAnalysis } from '../../types/aiEngine';
import { MOCK_REVIEW_ANALYSIS } from '../../data/mockAiEngineData';

export const AiReviewAnalysisView: React.FC = () => {
  const [reviewData, setReviewData] = useState<ReviewSentimentAnalysis>(MOCK_REVIEW_ANALYSIS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Sentiment & Fake Review Intelligence Engine</h2>
              <p className="text-xs text-slate-400">Natural Language Processing (NLP) for review authenticity, complaint detection & summary synthesis</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-slate-300">
              Analyzed Reviews: <strong className="text-emerald-400">{reviewData.totalReviews.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top Cards: Sentiment Gauge & Authenticity Flagger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sentiment Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
            <span>Overall Sentiment Index</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 font-bold">Positive ({reviewData.positiveSentimentPct}%)</span>
                <span className="text-slate-400">Neutral ({reviewData.neutralSentimentPct}%)</span>
                <span className="text-rose-400 font-bold">Negative ({reviewData.negativeSentimentPct}%)</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800">
                <div style={{ width: `${reviewData.positiveSentimentPct}%` }} className="bg-emerald-500 h-full" />
                <div style={{ width: `${reviewData.neutralSentimentPct}%` }} className="bg-slate-500 h-full" />
                <div style={{ width: `${reviewData.negativeSentimentPct}%` }} className="bg-rose-500 h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Fake Review & Spam Flagger */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
            <span>Fake Review & Bot Risk</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="text-2xl font-black text-emerald-400 font-mono">
            {reviewData.fakeReviewRiskPct}% Risk
          </div>
          <p className="text-[10px] text-slate-400">
            {reviewData.spamCount} Spam items filtered • {reviewData.duplicateCount} Duplicate text blocks removed
          </p>
        </div>

        {/* Product Target Info */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2 shadow-lg">
          <div className="text-xs text-slate-400 font-bold">Target Product</div>
          <h4 className="text-xs font-bold text-white line-clamp-2">{reviewData.productTitle}</h4>
          <span className="text-[10px] text-amber-400 font-mono font-bold">ID: {reviewData.productId}</span>
        </div>
      </div>

      {/* AI Generated Review Summary Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>AI Synthesized Executive Review Summary</span>
        </h3>

        <p className="text-xs font-medium text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
          "{reviewData.aiReviewSummary}"
        </p>
      </div>

      {/* Frequently Mentioned Features & Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-800">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <span>Frequently Mentioned Features</span>
          </h3>

          <div className="space-y-2 text-xs">
            {reviewData.frequentlyMentionedFeatures.map((feat, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-200 font-bold">{feat.feature}</span>
                <span className="text-emerald-400 font-mono font-bold">{feat.count} mentions</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Common Customer Complaints</span>
          </h3>

          <div className="space-y-2 text-xs">
            {reviewData.commonComplaints.map((comp, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 flex items-center space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{comp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
