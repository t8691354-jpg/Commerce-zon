import React, { useState } from 'react';
import { SupportTicket } from '../../types/support';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  Languages,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  tickets: SupportTicket[];
}

export const AiCopilotAssistantView: React.FC<Props> = ({ tickets }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.ticketId || '');
  const [simulatedLanguage, setSimulatedLanguage] = useState('Spanish (auto-detected)');
  const [translatedText, setTranslatedText] = useState('');

  const ticket = tickets.find((t) => t.ticketId === selectedTicketId) || tickets[0];

  const handleTranslate = () => {
    setTranslatedText(
      `[AI Translation (${simulatedLanguage})]: "El cliente informa que el paquete fue marcado como entregado a las 2:15 PM pero la puerta de entrada está vacía. Se recomienda verificar el GPS del conductor."`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 p-6 rounded-2xl shadow-xl space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-lg font-extrabold text-white">
                Commerce Zon AI Support Copilot & Intelligence Engine
              </h2>
            </div>
            <p className="text-xs text-purple-200">
              Real-time ticket classification, sentiment analysis, translation, smart replies, and deflection analytics.
            </p>
          </div>

          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-xs font-bold rounded-lg flex items-center space-x-1">
            <BrainCircuit className="w-4 h-4" />
            <span>Gemini AI Engine Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Selector Column */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Select Ticket for AI Audit</span>
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {tickets.map((t) => {
              const isSelected = t.ticketId === selectedTicketId;
              return (
                <div
                  key={t.ticketId}
                  onClick={() => setSelectedTicketId(t.ticketId)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500 text-white ring-1 ring-purple-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-[#febd69]">{t.ticketId}</span>
                    <span
                      className={`px-1.5 py-0.2 text-[9px] font-mono rounded font-bold uppercase ${
                        t.sentiment === 'CRITICAL' || t.sentiment === 'FRUSTRATED'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {t.sentiment}
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate mt-1">{t.subject}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Analysis Panel */}
        {ticket && (
          <div className="lg:col-span-2 space-y-4">
            {/* Sentiment & Classification Box */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#febd69]" />
                  <span>Real-time AI Sentiment & Intent Audit</span>
                </span>
                <span className="font-mono text-xs text-purple-400 font-bold">Confidence Score: 98.6%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Customer Sentiment</span>
                  <div className="text-sm font-black text-rose-400 uppercase">{ticket.sentiment}</div>
                  <p className="text-[10px] text-slate-500">Language tone detected from text phrasing.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Auto Category</span>
                  <div className="text-sm font-black text-amber-400">{ticket.category}</div>
                  <p className="text-[10px] text-slate-500">Auto-routed to {ticket.department}.</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Recommended Action</span>
                  <div className="text-xs font-bold text-cyan-400">Driver Telemetry Callback</div>
                  <p className="text-[10px] text-slate-500">Triggered by high misplacement risk.</p>
                </div>
              </div>

              {/* AI Executive Summary */}
              <div className="p-4 bg-slate-950 border border-purple-500/30 rounded-xl space-y-2">
                <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  <span>AI Conversation Summarizer</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The user David Miller reports that order ORD-2026-8812 was marked as delivered by carrier driver at 2:15 PM, but the package is missing. Security footage confirms no truck visited. The AI Copilot recommends contacting FC Seattle DSP dispatch before initiating refund.
                </p>
              </div>

              {/* Auto Translation Tool */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Languages className="w-4 h-4 text-cyan-400" />
                    <span>Instant Multi-Language Translation</span>
                  </span>
                  <button
                    onClick={handleTranslate}
                    className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-bold rounded-lg border border-cyan-500/30 text-xs hover:bg-cyan-500/30"
                  >
                    Translate
                  </button>
                </div>

                {translatedText && (
                  <p className="text-xs text-cyan-200 bg-cyan-950/40 p-3 rounded-lg border border-cyan-500/30 font-mono italic">
                    {translatedText}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
