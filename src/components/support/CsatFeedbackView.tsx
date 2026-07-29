import React, { useState } from 'react';
import { CsatFeedback } from '../../types/support';
import { MOCK_CSAT_FEEDBACKS } from '../../data/supportMockData';
import { Star, MessageSquare, Tag, UserCheck, CheckCircle2, HeartHandshake } from 'lucide-react';

export const CsatFeedbackView: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<CsatFeedback[]>(MOCK_CSAT_FEEDBACKS);
  const [starFilter, setStarFilter] = useState<number | 'ALL'>('ALL');

  const filtered = feedbacks.filter((f) => starFilter === 'ALL' || f.rating === starFilter);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Customer Satisfaction (CSAT) & Feedback Portal</span>
          </h2>
          <p className="text-xs text-slate-400">
            Post-resolution customer rating audits, service feedback tags, and agent praise logs.
          </p>
        </div>

        {/* Star Rating Filter */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setStarFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              starFilter === 'ALL' ? 'bg-[#febd69] text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setStarFilter(s)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition flex items-center space-x-1 ${
                starFilter === s ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{s}★</span>
            </button>
          ))}
        </div>
      </div>

      {/* CSAT Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((f) => (
          <div key={f.feedbackId} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < f.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-slate-500">{new Date(f.submittedAt).toLocaleDateString()}</span>
            </div>

            <p className="text-xs text-white italic font-serif leading-relaxed">"{f.comment}"</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {f.serviceTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-slate-950 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/30"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Ticket: <span className="text-[#febd69] font-bold">{f.ticketId}</span></span>
              <span>Handled by: <span className="text-white font-bold">{f.agentName}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
