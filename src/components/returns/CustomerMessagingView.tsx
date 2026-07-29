import React, { useState } from 'react';
import { ReturnMessage, ReturnRequest } from '../../types/returns';
import {
  MessageSquare,
  Send,
  Paperclip,
  User,
  ShieldCheck,
  Store,
  PackageCheck,
  Clock,
} from 'lucide-react';

interface Props {
  messages: ReturnMessage[];
  returnRequests: ReturnRequest[];
  onSendMessage: (returnId: string, text: string, role: 'BUYER' | 'SELLER' | 'ADMIN') => void;
}

export const CustomerMessagingView: React.FC<Props> = ({ messages, returnRequests, onSendMessage }) => {
  const [selectedRmaId, setSelectedRmaId] = useState(returnRequests[0]?.returnId || '');
  const [textInput, setTextInput] = useState('');
  const [senderRole, setSenderRole] = useState<'BUYER' | 'SELLER' | 'ADMIN'>('BUYER');

  const rmaMessages = messages.filter((m) => m.returnId === selectedRmaId);
  const targetRma = returnRequests.find((r) => r.returnId === selectedRmaId) || returnRequests[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !selectedRmaId) return;

    onSendMessage(selectedRmaId, textInput, senderRole);
    setTextInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-[#febd69]" />
            <span>Buyer ↔ Merchant ↔ Support Integrated Communications Hub</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time encrypted message history, image evidence sharing, and dispute resolution chat.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400">Post As Role:</label>
          <select
            value={senderRole}
            onChange={(e) => setSenderRole(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
          >
            <option value="BUYER">Buyer (David Miller)</option>
            <option value="SELLER">Merchant Support</option>
            <option value="ADMIN">Amazon Marketplace Disputes Admin</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RMA Thread Selector */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-bold text-[#febd69] uppercase tracking-wider">Select RMA Thread</h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {returnRequests.map((r) => {
              const msgCount = messages.filter((m) => m.returnId === r.returnId).length;
              return (
                <div
                  key={r.returnId}
                  onClick={() => setSelectedRmaId(r.returnId)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedRmaId === r.returnId
                      ? 'bg-slate-800 border-[#febd69] ring-1 ring-[#febd69]/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono font-bold text-xs text-[#febd69]">{r.returnId}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      {msgCount} msgs
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{r.item.name}</div>
                  <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                    <span>{r.buyerName}</span>
                    <span className="text-amber-400 font-bold">{r.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Thread Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5 flex flex-col h-[600px]">
          {targetRma && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white">{targetRma.returnId}</span>
                <span className="text-slate-400 ml-2">Item: {targetRma.item.name}</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">${targetRma.item.unitPriceUSD.toFixed(2)}</span>
            </div>
          )}

          {/* Chat Bubble Scroll Container */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-thin">
            {rmaMessages.map((msg) => {
              const isBuyer = msg.senderRole === 'BUYER';
              const isAdmin = msg.senderRole === 'ADMIN';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBuyer ? 'items-start' : 'items-end'}`}
                >
                  <div className="text-[10px] text-slate-400 font-mono mb-1 flex items-center space-x-1">
                    <span className="font-bold text-slate-200">{msg.senderName}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs space-y-1 shadow ${
                      isBuyer
                        ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        : isAdmin
                        ? 'bg-rose-950/80 text-rose-200 border border-rose-800 rounded-tr-none'
                        : 'bg-[#febd69]/15 text-slate-100 border border-[#febd69]/30 rounded-tr-none'
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="pt-2 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Write response as ${senderRole}...`}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
