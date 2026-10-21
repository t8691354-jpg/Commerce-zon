import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Package, Code, Briefcase, Bot, Check, ArrowUpRight, Sparkles } from 'lucide-react';
import { MarketplaceMode, MARKETPLACE_MODES, MarketplaceModeDefinition } from '../../types/marketplaceModes';

interface MarketplaceSwitcherDropdownProps {
  currentMode: MarketplaceMode;
  onSelectMode: (mode: MarketplaceMode) => void;
  onOpenUpcomingModal: (def: MarketplaceModeDefinition) => void;
}

export const MarketplaceSwitcherDropdown: React.FC<MarketplaceSwitcherDropdownProps> = ({
  currentMode,
  onSelectMode,
  onOpenUpcomingModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'Code':
        return <Code className="w-4 h-4 text-indigo-400" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'Bot':
        return <Bot className="w-4 h-4 text-purple-400" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleSelect = (modeDef: MarketplaceModeDefinition) => {
    if (modeDef.isAvailable) {
      onSelectMode(modeDef.id);
      setIsOpen(false);
    } else {
      setIsOpen(false);
      onOpenUpcomingModal(modeDef);
    }
  };

  const activeDef = MARKETPLACE_MODES.find((m) => m.id === currentMode) || MARKETPLACE_MODES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 3 Dots Trigger Button (...) as specifically requested by user */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border transition font-medium ${
          isOpen
            ? 'bg-[#febd69] text-slate-950 border-[#febd69] ring-2 ring-amber-400/50'
            : currentMode === 'digital'
            ? 'bg-indigo-950/80 text-indigo-200 border-indigo-500/50 hover:border-indigo-400'
            : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
        }`}
        title="Commerce Zon Multi-Marketplace Hub (1. Physical, 2. Digital, 3. Freelancer, 4. AI)"
      >
        <div className="flex items-center space-x-1">
          <MoreHorizontal className="w-4 h-4 stroke-[2.5]" />
          <span className="text-xs font-bold font-mono tracking-tight">
            {currentMode === 'digital' ? 'Digital Market' : 'Marketplaces'}
          </span>
        </div>
        <span className="text-[10px] font-mono px-1 rounded bg-black/40 text-[#febd69] font-bold">
          {activeDef.number}/4
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-80 rounded-2xl shadow-2xl bg-slate-900 border border-slate-700 divide-y divide-slate-800 focus:outline-none z-50 overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#febd69]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200 font-mono">
                Marketplace Switcher
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">4-Core Modes</span>
          </div>

          {/* List of 4 Marketplaces */}
          <div className="p-2 space-y-1">
            {MARKETPLACE_MODES.map((mode) => {
              const isActive = currentMode === mode.id;

              return (
                <div
                  key={mode.id}
                  onClick={() => handleSelect(mode)}
                  className={`w-full p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between group ${
                    isActive
                      ? 'bg-slate-800/90 border border-indigo-500/50 shadow-inner'
                      : 'hover:bg-slate-800/60 border border-transparent hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Number Badge */}
                    <span
                      className={`text-[11px] font-mono font-black px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-[#febd69] text-slate-950'
                          : 'bg-slate-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      {mode.number}
                    </span>

                    {/* Icon & Info */}
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        {getIcon(mode.iconName)}
                        <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {mode.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {mode.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Status / Action Indicator */}
                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    {isActive ? (
                      <span className="flex items-center space-x-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Active</span>
                      </span>
                    ) : mode.isAvailable ? (
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-[#febd69] flex items-center">
                        Switch
                        <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-semibold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                        Roadmap
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="px-4 py-2 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Unified Commerce Zon Ecosystem</span>
            <span className="text-slate-500 font-mono">v2026.10</span>
          </div>
        </div>
      )}
    </div>
  );
};
