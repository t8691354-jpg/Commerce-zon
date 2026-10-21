import React from 'react';
import { X, Sparkles, Briefcase, Bot, CheckCircle2, Bell, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { MarketplaceModeDefinition } from '../../types/marketplaceModes';

interface UpcomingMarketplaceModalProps {
  mode: MarketplaceModeDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onNotifyMe: (email: string) => void;
}

export const UpcomingMarketplaceModal: React.FC<UpcomingMarketplaceModalProps> = ({
  mode,
  isOpen,
  onClose,
  onNotifyMe
}) => {
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  if (!isOpen || !mode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onNotifyMe(email);
      setIsSubscribed(true);
    }
  };

  const isAI = mode.id === 'ai';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Gradient Header */}
        <div className={`p-6 ${isAI ? 'bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80' : 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80'} border-b border-slate-800 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${isAI ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}`}>
              {isAI ? <Bot className="w-7 h-7" /> : <Briefcase className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Phase {mode.number} Roadmap</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mode.badgeColor}`}>
                  {mode.badge}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">{mode.title}</h2>
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            {mode.description}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Planned Features */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#febd69]" />
              <span>Architectural Capabilities Under Development</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {mode.features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Development Timeline */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">Target Public Beta</div>
                <div className="text-[11px] text-slate-400">{isAI ? 'Q1 2027 (Following Digital Marketplace Stabilization)' : 'Q4 2026 (Following Digital Licensing Rollout)'}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#febd69] bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                In Active Design
              </span>
            </div>
          </div>

          {/* VIP Notification Signup */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
            {isSubscribed ? (
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-5 h-5" />
                <span>You are registered for early-access beta notification. We will notify {email} when live!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#febd69]" />
                  <span>Get VIP Early Access When {mode.title} Launches</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your developer or company email..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#febd69]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1 shrink-0"
                  >
                    <span>Notify Me</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition"
          >
            Close Roadmap Preview
          </button>
        </div>
      </div>
    </div>
  );
};
