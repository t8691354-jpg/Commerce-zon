import React from 'react';
import { MarketplaceMode } from '../../types/marketplaceModes';
import { MarketplaceSwitcherDropdown } from '../navigation/MarketplaceSwitcherDropdown';
import { Wallet, User, ShieldCheck } from 'lucide-react';

interface MarketplaceTopNavProps {
  currentMode: MarketplaceMode;
  onSelectMode: (mode: MarketplaceMode) => void;
  walletBalance: number;
  onOpenSettings?: () => void;
  brandTitle?: string;
}

export const MarketplaceTopNav: React.FC<MarketplaceTopNavProps> = ({
  currentMode,
  onSelectMode,
  walletBalance,
  onOpenSettings,
  brandTitle
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#131921] border-b border-slate-800 text-white font-sans shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        {/* Left: Brand Logo & Marketplace Switcher */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 cursor-pointer select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#febd69] to-amber-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
              CZ
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-base font-black tracking-tight text-white">Commerce</span>
                <span className="text-base font-black tracking-tight text-[#febd69]">Zone</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono -mt-0.5">
                {brandTitle || (
                  currentMode === 'ai'
                    ? 'AI Agent Marketplace'
                    : currentMode === 'digital'
                    ? 'Digital Marketplace'
                    : currentMode === 'freelancer'
                    ? 'Freelancer Talent Hub'
                    : 'Physical Goods'
                )}
              </span>
            </div>
          </div>

          {/* 3-Dots Marketplace Switcher - ONLY place to switch */}
          <div className="flex items-center">
            <MarketplaceSwitcherDropdown
              currentMode={currentMode}
              onSelectMode={onSelectMode}
              onOpenUpcomingModal={() => {}}
            />
          </div>
        </div>

        {/* Right: Wallet Balance & Profile */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-400 font-mono uppercase">Wallet</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ${walletBalance.toFixed(2)} USD
              </span>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
