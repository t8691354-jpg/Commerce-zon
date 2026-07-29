import React, { useState } from 'react';
import {
  SupportTicket,
  TicketStatus,
  SupportAgent,
  TicketMessage,
} from '../../types/support';
import {
  X,
  Send,
  Lock,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Bot,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Tag,
  Paperclip,
} from 'lucide-react';

interface Props {
  ticket: SupportTicket;
  agents: SupportAgent[];
  onClose: () => void;
  onUpdateStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onAssignAgent: (ticketId: string, agentId: string, agentName: string) => void;
  onAddMessage: (
    ticketId: string,
    messageText: string,
    isInternalNote: boolean
  ) => void;
}

export const TicketWorkflowDetailModal: React.FC<Props> = ({
  ticket,
  agents,
  onClose,
  onUpdateStatus,
  onAssignAgent,
  onAddMessage,
}) => {
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    'Thank you for reaching out. Your order package tracking status is currently being refreshed by driver dispatch.',
    'I have verified your account details and issued an immediate promotional wallet credit.',
    'Please upload your carrier Bill of Lading document so our receiving team can release the stow hold.',
  ]);

  const pipelineStages: TicketStatus[] = [
    'CREATED',
    'AUTO_CATEGORIZED',
    'ASSIGNED',
    'IN_PROGRESS',
    'WAITING_FOR_CUSTOMER',
    'ESCALATED',
    'RESOLVED',
    'CLOSED',
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onAddMessage(ticket.ticketId, replyText, isInternal);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-extrabold text-[#febd69]">{ticket.ticketId}</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded uppercase font-bold border border-slate-700">
                {ticket.userRole}
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] rounded uppercase font-bold border border-amber-500/30">
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-white mt-1">{ticket.subject}</h2>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg self-start sm:self-auto">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* Lifecycle Pipeline Progress Bar */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-300 flex justify-between items-center">
              <span>Ticket Lifecycle Workflow Pipeline</span>
              <span className="font-mono text-[#febd69]">Current Status: {ticket.status}</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
              {pipelineStages.map((stage, idx) => {
                const currentIdx = pipelineStages.indexOf(ticket.status);
                const isCompleted = idx <= currentIdx;
                return (
                  <button
                    key={stage}
                    onClick={() => onUpdateStatus(ticket.ticketId, stage)}
                    className={`p-2 rounded text-[9px] font-mono font-bold text-center transition truncate ${
                      stage === ticket.status
                        ? 'bg-[#febd69] text-slate-950 shadow ring-2 ring-[#febd69]/50'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {stage.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metadata Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Assigned Support Agent</label>
              <select
                value={ticket.assignedAgentId || ''}
                onChange={(e) => {
                  const ag = agents.find((a) => a.agentId === e.target.value);
                  if (ag) onAssignAgent(ticket.ticketId, ag.agentId, ag.name);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                <option value="">Unassigned</option>
                {agents.map((a) => (
                  <option key={a.agentId} value={a.agentId}>
                    {a.name} ({a.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Update Status</label>
              <select
                value={ticket.status}
                onChange={(e) => onUpdateStatus(ticket.ticketId, e.target.value as TicketStatus)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              >
                {pipelineStages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <span className="block text-slate-400 font-semibold">SLA Targets</span>
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                <span className="text-emerald-400 font-bold">1st Resp: 30m SLA</span>
                <span className="text-slate-500">•</span>
                <span className="text-cyan-400 font-bold">Resolution: 12h</span>
              </div>
            </div>
          </div>

          {/* Reopen Ticket CTA Banner if closed/resolved */}
          {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex justify-between items-center">
              <span>This case is marked as resolved. Need to reopen for follow-up?</span>
              <button
                onClick={() => onUpdateStatus(ticket.ticketId, 'IN_PROGRESS')}
                className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400"
              >
                Reopen Ticket
              </button>
            </div>
          )}

          {/* Conversation Thread */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#febd69]" />
              <span>Conversation & Internal Notes Log ({ticket.messages.length})</span>
            </h3>

            <div className="space-y-3">
              {ticket.messages.map((m) => {
                const isInternal = m.isInternalNote;
                const isAi = m.isAiGenerated;

                return (
                  <div
                    key={m.messageId}
                    className={`p-4 rounded-xl text-xs space-y-1 border ${
                      isInternal
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                        : isAi
                        ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                        : 'bg-slate-950 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800/80 pb-1 mb-2 font-mono">
                      <span className="font-bold text-white flex items-center space-x-1">
                        {isInternal && <Lock className="w-3 h-3 text-amber-400" />}
                        {isAi && <Bot className="w-3 h-3 text-purple-400" />}
                        <span>{m.senderName} ({m.senderRole})</span>
                        {isInternal && <span className="text-amber-400 font-bold ml-1">[INTERNAL NOTE - HIDDEN FROM CUSTOMER]</span>}
                      </span>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <p className="whitespace-pre-line leading-relaxed">{m.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Copilot Suggested Smart Replies */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI Copilot Smart Reply Suggestions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {aiSuggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReplyText(sug)}
                  className="p-2 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-lg text-left text-[11px] text-slate-300 transition line-clamp-3"
                >
                  "{sug}"
                </button>
              ))}
            </div>
          </div>

          {/* Response Form */}
          <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Write Response</label>
              <label className="flex items-center space-x-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span className={`font-bold ${isInternal ? 'text-amber-400' : 'text-slate-400'}`}>
                  Post as Internal Note (Agent Only)
                </span>
              </label>
            </div>

            <textarea
              rows={3}
              placeholder={isInternal ? 'Write internal note for support staff...' : 'Write public reply to customer...'}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className={`w-full bg-slate-950 border rounded-xl p-3 text-xs text-white focus:outline-none ${
                isInternal ? 'border-amber-500/50 focus:border-amber-400' : 'border-slate-800 focus:border-[#febd69]'
              }`}
            />

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">
                {isInternal ? 'Note will NOT be visible to buyer.' : 'Reply will trigger SMS & Email notification to customer.'}
              </span>

              <button
                type="submit"
                className={`px-5 py-2 font-black text-xs rounded-xl shadow flex items-center space-x-1.5 ${
                  isInternal
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-[#febd69] hover:bg-[#f3a847] text-slate-950'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isInternal ? 'Save Internal Note' : 'Send Reply'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
