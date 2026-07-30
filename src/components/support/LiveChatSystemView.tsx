import React, { useState } from 'react';
import { LiveChatSession, ChatMessage, SupportUserRole } from '../../types/support';
import { MOCK_LIVE_CHAT_SESSIONS } from '../../data/supportMockData';
import {
  MessageSquareText,
  Send,
  Bot,
  User,
  UserCheck,
  Smile,
  Paperclip,
  CheckCheck,
  Zap,
  Globe2,
  Sparkles,
  PhoneOff,
  Headphones,
  ShieldCheck,
} from 'lucide-react';

export const LiveChatSystemView: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<LiveChatSession[]>(MOCK_LIVE_CHAT_SESSIONS);
  const [activeChatId, setActiveChatId] = useState<string>(MOCK_LIVE_CHAT_SESSIONS[0].chatSessionId);
  const [inputText, setInputText] = useState('');

  const activeSession = chatSessions.find((s) => s.chatSessionId === activeChatId) || chatSessions[0];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      messageId: `CMSG-${Date.now()}`,
      chatSessionId: activeSession.chatSessionId,
      senderRole: 'USER',
      senderName: activeSession.userName,
      text,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    setChatSessions((prev) =>
      prev.map((session) => {
        if (session.chatSessionId === activeSession.chatSessionId) {
          return {
            ...session,
            messages: [...session.messages, newMsg],
          };
        }
        return session;
      })
    );

    if (!textToSend) setInputText('');

    // Simulate AI Virtual Bot auto-reply if bot active
    if (activeSession.status === 'BOT_ACTIVE') {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          messageId: `CMSG-BOT-${Date.now()}`,
          chatSessionId: activeSession.chatSessionId,
          senderRole: 'BOT',
          senderName: 'Commerce Zon AI Virtual Assistant',
          text: 'I have processed your query using Commerce Zon Customer Intelligence. Would you like me to assign a human specialist?',
          timestamp: new Date().toISOString(),
          isRead: true,
          smartReplies: ['Connect to human agent', 'Check order tracking', 'Close session'],
        };

        setChatSessions((prev) =>
          prev.map((session) => {
            if (session.chatSessionId === activeSession.chatSessionId) {
              return {
                ...session,
                messages: [...session.messages, botMsg],
              };
            }
            return session;
          })
        );
      }, 1000);
    }
  };

  const handleTakeover = () => {
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.chatSessionId === activeSession.chatSessionId) {
          return {
            ...s,
            status: 'AGENT_CONNECTED',
            assignedAgentId: 'AGT-101',
            assignedAgentName: 'Sarah Jenkins (Senior CX)',
            messages: [
              ...s.messages,
              {
                messageId: `CMSG-SYS-${Date.now()}`,
                chatSessionId: s.chatSessionId,
                senderRole: 'SYSTEM',
                senderName: 'System',
                text: 'Human Agent Sarah Jenkins has taken over the chat.',
                timestamp: new Date().toISOString(),
                isRead: true,
              },
            ],
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <MessageSquareText className="w-5 h-5 text-[#febd69]" />
            <span>24/7 Omnichannel Live Chat System</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time messaging engine with AI Virtual Bot deflection & instant human agent takeover.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">184 Active Sessions Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* Active Sessions Sidebar */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Chat Queue ({chatSessions.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">WebSockets Active</span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {chatSessions.map((session) => {
              const isSelected = activeChatId === session.chatSessionId;
              const lastMsg = session.messages[session.messages.length - 1];

              return (
                <div
                  key={session.chatSessionId}
                  onClick={() => setActiveChatId(session.chatSessionId)}
                  className={`p-3 rounded-xl border cursor-pointer transition space-y-1.5 ${
                    isSelected
                      ? 'bg-slate-800 border-[#febd69] shadow-lg'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">{session.userName}</span>
                    <span
                      className={`px-1.5 py-0.2 text-[9px] font-mono rounded uppercase font-bold ${
                        session.status === 'AGENT_CONNECTED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {session.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">
                    {lastMsg ? lastMsg.text : 'No messages yet.'}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                    <span>Role: <span className="text-slate-300 font-bold">{session.userRole}</span></span>
                    <span>{new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Chat Window */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#febd69] text-slate-950 font-black flex items-center justify-center text-sm shadow">
                {activeSession.userName.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-extrabold text-white flex items-center space-x-2">
                  <span>{activeSession.userName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({activeSession.userEmail})</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                  <span>Role: <span className="text-slate-200 font-bold">{activeSession.userRole}</span></span>
                  <span>• Language: <span className="text-cyan-400 font-bold">{activeSession.language}</span></span>
                </div>
              </div>
            </div>

            {activeSession.status === 'BOT_ACTIVE' ? (
              <button
                onClick={handleTakeover}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Takeover Chat</span>
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Agent Connected: {activeSession.assignedAgentName}</span>
              </div>
            )}
          </div>

          {/* Messages Thread Container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-950/60 scrollbar-thin">
            {activeSession.messages.map((msg) => {
              const isUser = msg.senderRole === 'USER';
              const isBot = msg.senderRole === 'BOT';
              const isSystem = msg.senderRole === 'SYSTEM';

              if (isSystem) {
                return (
                  <div key={msg.messageId} className="text-center text-[10px] font-mono text-purple-400 py-1 bg-purple-950/30 border border-purple-500/20 rounded-lg">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div key={msg.messageId} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
                  <span className="text-[10px] text-slate-500 font-mono px-1">
                    {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs space-y-2 leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-[#febd69] text-slate-950 font-medium rounded-tr-none'
                        : isBot
                        ? 'bg-purple-950 border border-purple-500/40 text-purple-100 rounded-tl-none'
                        : 'bg-slate-800 text-white border border-slate-700 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Quick Smart Reply Chips */}
                    {msg.smartReplies && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-purple-500/30">
                        {msg.smartReplies.map((sr) => (
                          <button
                            key={sr}
                            onClick={() => handleSendMessage(sr)}
                            className="px-2.5 py-1 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-[10px] font-bold rounded-lg transition"
                          >
                            {sr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message or click a smart reply..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#febd69]"
              />

              <button
                onClick={() => handleSendMessage()}
                className="px-4 py-2.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl shadow flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
