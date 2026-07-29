import React, { useState } from 'react';
import { 
  Bot, Send, User, Sparkles, ShoppingBag, Truck, Headphones, HelpCircle, ArrowRight, CheckCircle2, UserCheck, RefreshCw, MessageSquare
} from 'lucide-react';
import { AiChatMessage } from '../../types/aiEngine';
import { INITIAL_CHAT_MESSAGES, MOCK_PRODUCTS } from '../../data/mockAiEngineData';

export const AiChatAssistantView: React.FC = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [humanHandoverActive, setHumanHandoverActive] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: AiChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "I found several options in our marketplace matching your inquiry!";
      let recs = undefined;
      let actionBtns = undefined;
      let triggerHandover = false;

      const lower = query.toLowerCase();

      if (lower.includes('gaming laptop') || lower.includes('3500')) {
        replyText = "Here is the top-rated gaming laptop matching your $3,500 budget criteria: The ROG Strix Scar 18 with Intel i9-14900HX and RTX 4090 GPU.";
        recs = [MOCK_PRODUCTS[0], MOCK_PRODUCTS[3]];
        actionBtns = [
          { label: 'View Specs Breakdown', actionQuery: 'Explain ROG Strix Scar 18 specs' },
          { label: 'Compare with MacBook Pro 16', actionQuery: 'Compare ROG Scar 18 vs MacBook Pro 16' }
        ];
      } else if (lower.includes('compare') || lower.includes('xm5') || lower.includes('bose')) {
        replyText = "Comparing Sony WH-1000XM5 vs Bose QC Ultra: Sony leads in noise cancellation battery life (30 hours) and call microphone clarity, while Bose leads in Spatial Audio depth.";
        recs = [MOCK_PRODUCTS[1], MOCK_PRODUCTS[4]];
      } else if (lower.includes('order') || lower.includes('amz-99201')) {
        replyText = "Order #AMZ-99201 contains 1x Sony WH-1000XM5. Status: Out for delivery today via Express Logistics. Driver ETA: 2:15 PM.";
      } else if (lower.includes('human') || lower.includes('support') || lower.includes('agent')) {
        replyText = "Transferring session to a Live Human Support Representative... High Priority Queue assigned.";
        triggerHandover = true;
      } else {
        replyText = `I have analyzed your query "${query}". I can help you find products, track returns, recommend accessories, or compare features. Would you like to view our trending laptop or audio deals?`;
        recs = [MOCK_PRODUCTS[1], MOCK_PRODUCTS[2]];
      }

      const botMsg: AiChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: recs,
        actionButtons: actionBtns,
        needsHumanHandover: triggerHandover
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (triggerHandover) {
        setHumanHandoverActive(true);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Gemini Shopping & Concierge Assistant</h2>
            <p className="text-xs text-slate-400">Conversational AI for product discovery, order tracking, comparisons & support</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {humanHandoverActive ? (
            <span className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center space-x-1.5 animate-pulse">
              <Headphones className="w-4 h-4" />
              <span>Human Support Connected</span>
            </span>
          ) : (
            <button
              onClick={() => handleSendMessage('Transfer to human agent')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-800 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>Request Human Handover</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl h-[520px] flex flex-col justify-between">
        {/* Messages Scroll Area */}
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                msg.sender === 'user' 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-md space-y-2 ${
                msg.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed shadow ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}>
                  <p>{msg.text}</p>
                </div>

                {/* Embedded Product Recommendations */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-1">
                    {msg.recommendedProducts.map((prod) => (
                      <div key={prod.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2">
                        <img src={prod.imageUrl} alt={prod.title} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                        <div className="overflow-hidden">
                          <h5 className="text-[11px] font-bold text-white truncate">{prod.title}</h5>
                          <p className="text-[10px] text-amber-400 font-mono font-bold">${prod.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Suggestion Buttons */}
                {msg.actionButtons && (
                  <div className="flex flex-wrap gap-1.5 pt-1 text-left">
                    {msg.actionButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(btn.actionQuery)}
                        className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 transition"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-500 font-mono block">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
              <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Gemini Shopping Assistant is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800 relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI Assistant e.g. 'Compare Sony XM5 vs Bose QC Ultra' or 'Where is my order?'"
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none transition"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="absolute right-2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
