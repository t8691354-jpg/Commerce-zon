import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Sparkles } from 'lucide-react';

interface DeviceFrameWrapperProps {
  isPhoneFrame: boolean;
  onTogglePhoneFrame: (val: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  isPhoneFrame,
  onTogglePhoneFrame,
  children,
  title = 'Commerce Zone Mobile View'
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Floating Viewport Control Toolbar */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
            Device Preview:
          </span>
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => onTogglePhoneFrame(true)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                isPhoneFrame
                  ? 'bg-[#febd69] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Phone Screen (390px)</span>
            </button>
            <button
              type="button"
              onClick={() => onTogglePhoneFrame(false)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                !isPhoneFrame
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>💻 Full Screen</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center space-x-1 text-emerald-400">
            <Sparkles className="w-3 h-3" />
            <span>Mobile-First Optimized</span>
          </span>
          <span className="text-slate-700">|</span>
          <span>{isPhoneFrame ? 'Viewport: iPhone 16 Pro (390×844)' : 'Viewport: Responsive 100%'}</span>
        </div>
      </div>

      {/* Frame Container */}
      {isPhoneFrame ? (
        <div className="py-6 px-2 flex justify-center w-full bg-slate-950">
          {/* Smartphone Hardware Bezel (iPhone Style) */}
          <div className="relative w-full max-w-[400px] bg-slate-900 border-[10px] border-slate-800 rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden ring-1 ring-slate-700">
            {/* Top Phone Status Bar & Dynamic Island */}
            <div className="bg-slate-950 text-white px-7 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold sticky top-0 z-50 select-none">
              <span>9:41</span>
              {/* Dynamic Island Pill */}
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center space-x-2 border border-slate-800/80">
                <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Scrollable Phone Screen Content */}
            <div className="max-h-[820px] overflow-y-auto overflow-x-hidden no-scrollbar bg-slate-950">
              {children}
            </div>

            {/* Bottom Virtual Home Indicator */}
            <div className="bg-slate-950 py-2 flex justify-center select-none sticky bottom-0 z-50">
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
};
