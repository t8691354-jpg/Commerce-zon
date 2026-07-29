import React, { useState } from 'react';
import { 
  UserCheck, Shield, Laptop, Smartphone, Tablet, Globe, Heart, ShoppingCart, Search, History, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import { PersonalizedCustomerProfile } from '../../types/aiEngine';
import { MOCK_CUSTOMER_PROFILES, MOCK_PRODUCTS } from '../../data/mockAiEngineData';

export const PersonalizationEngineView: React.FC = () => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(MOCK_CUSTOMER_PROFILES[0].id);

  const currentPersona = MOCK_CUSTOMER_PROFILES.find(p => p.id === selectedPersonaId) || MOCK_CUSTOMER_PROFILES[0];

  return (
    <div className="space-y-6">
      {/* Persona Switcher Bar */}
      <div className="bg-slate-900/95 border border-slate-800 p-5 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Real-Time Customer Personalization Engine</h2>
              <p className="text-xs text-slate-400">Switch shopper persona to observe instant dynamic homepage & product catalog customization</p>
            </div>
          </div>

          <span className="text-xs text-sky-400 font-mono font-bold bg-sky-500/10 px-3 py-1 rounded-lg border border-sky-500/30">
            Vector Embedding Dimensions: 2048-D
          </span>
        </div>

        {/* Persona Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_CUSTOMER_PROFILES.map((persona) => {
            const isSelected = persona.id === selectedPersonaId;

            return (
              <div
                key={persona.id}
                onClick={() => setSelectedPersonaId(persona.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center space-x-3 ${
                  isSelected
                    ? 'bg-slate-950 border-sky-400 ring-2 ring-sky-400/30 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <img 
                  src={persona.avatar} 
                  alt={persona.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-sky-400/50"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center space-x-1">
                    <h4 className="text-xs font-bold text-white truncate">{persona.name}</h4>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-sky-400 font-bold truncate">{persona.personaTitle}</p>
                  <p className="text-[10px] text-slate-400">{persona.country} • {persona.deviceType}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Customer Vector Profile Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Behavioral Signal Vectors</span>
            </h3>

            <span className="text-[10px] text-slate-400 font-mono">ID: {currentPersona.id}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold">AI Vector Summary</span>
              <p className="text-slate-200 text-xs">{currentPersona.vectorEmbeddingsSummary}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center space-x-1">
                <Search className="w-3 h-3 text-amber-400" />
                <span>Recent Search Terms</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {currentPersona.searchHistory.map((sh, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-[10px] border border-slate-800">
                    "{sh}"
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center space-x-1">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>Favorite Brands & Categories</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {currentPersona.favoriteBrands.map((b, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px]">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold flex items-center space-x-1">
                <ShoppingCart className="w-3 h-3 text-emerald-400" />
                <span>Active Cart State</span>
              </span>
              <p className="text-emerald-400 font-bold">
                {currentPersona.cartActivity.length > 0 ? currentPersona.cartActivity.join(', ') : 'Cart is empty'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Personalised Marketplace Homepage View */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Live Persona Homepage Preview</h3>
              <p className="text-xs text-slate-400">Tailored UI, banner recommendations & curated feed for {currentPersona.name}</p>
            </div>

            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
              100% Personalization Active
            </span>
          </div>

          {/* Hero Banner tailored to Persona */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 border border-slate-800 p-6 space-y-3">
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold uppercase tracking-wider">
              {currentPersona.personaTitle}
            </div>

            <h3 className="text-lg font-black text-white">
              Welcome back, {currentPersona.name}!
            </h3>

            <p className="text-xs text-slate-300 max-w-md">
              We've refreshed your catalog feed with top deals on {currentPersona.favoriteCategories[0]} and {currentPersona.favoriteCategories[1]}.
            </p>

            <button className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition shadow flex items-center space-x-1">
              <span>Explore My Personalized Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Curated Products for Persona */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Curated Picks For You</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_PRODUCTS.slice(0, 2).map((prod) => (
                <div key={prod.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-28 object-cover rounded-lg" referrerPolicy="no-referrer" />
                  <h5 className="text-xs font-bold text-white line-clamp-1">{prod.title}</h5>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 font-mono">${prod.price.toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{prod.relevanceScore}% Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
