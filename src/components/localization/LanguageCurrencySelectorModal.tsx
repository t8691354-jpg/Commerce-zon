import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import {
  Globe,
  DollarSign,
  MapPin,
  Check,
  X,
  RefreshCw,
  Info,
  ShieldCheck,
  Sliders,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { LanguageCode, CurrencyCode, CountryCode } from '../../types/localization';

interface LanguageCurrencySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageCurrencySelectorModal: React.FC<LanguageCurrencySelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    country,
    setCountry,
    supportedLanguages,
    supportedCurrencies,
    supportedCountries,
    activeLanguageDef,
    activeCurrencyDef,
    activeCountryDef,
    exchangeRates,
    formatPrice,
    convertAmount,
    t,
    isRTL,
  } = useI18n();

  const [activeTab, setActiveTab] = useState<'language' | 'currency' | 'country' | 'rates'>('language');
  const [sampleAmount, setSampleAmount] = useState<number>(100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#febd69] text-slate-950 rounded-2xl font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>{t('i18n.title', 'Language, Currency & Regional Preferences')}</span>
                {isRTL && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                    {t('i18n.rtlActive', 'RTL Active')}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Current: {activeLanguageDef.nativeName} ({activeLanguageDef.name}) • {activeCurrencyDef.code} (
                {activeCurrencyDef.symbol}) • {activeCountryDef.name} {activeCountryDef.flag}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          {[
            { id: 'language', label: 'Language / زبان', icon: Globe },
            { id: 'currency', label: 'Currency (Multi-Currency)', icon: DollarSign },
            { id: 'country', label: 'Shipping Country / Region', icon: MapPin },
            { id: 'rates', label: 'Treasury Exchange Rates', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#febd69] text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LANGUAGE SELECTOR */}
        {activeTab === 'language' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Select your preferred marketplace language. Choosing <strong>اردو (Urdu)</strong> will dynamically
              activate the full right-to-left (RTL) marketplace interface layout.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportedLanguages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-amber-500/10 border-[#febd69] text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{l.flag}</span>
                      <div>
                        <div className="font-black text-sm flex items-center gap-2">
                          <span>{l.nativeName}</span>
                          {l.dir === 'rtl' && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-amber-300 font-mono rounded">
                              RTL
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{l.name}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1.5 bg-[#febd69] text-slate-950 rounded-xl">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-start space-x-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                {t(
                  'i18n.fallbackNotice',
                  'Sensible fallback to English is maintained for any third-party seller content or non-translated metadata.'
                )}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: CURRENCY SELECTOR */}
        {activeTab === 'currency' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Select your preferred display currency. Converted prices are estimates based on platform treasury exchange
              rates. Original seller listing currencies are preserved authoritative at checkout.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {supportedCurrencies.map((c) => {
                const isSelected = currency === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-[#febd69] text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-lg font-black text-[#febd69]">{c.symbol}</span>
                      <span className="text-xs font-mono font-bold text-slate-400">{c.code}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white line-clamp-1">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        1 USD = {c.exchangeRateToUSD} {c.code}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Converter Preview Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="text-xs font-black text-white flex items-center justify-between">
                <span>Interactive Conversion Estimator</span>
                <span className="text-[10px] text-amber-400 font-mono">1 USD = {activeCurrencyDef.exchangeRateToUSD} {activeCurrencyDef.code}</span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Base Listing (USD):</label>
                  <input
                    type="number"
                    value={sampleAmount}
                    onChange={(e) => setSampleAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0 mt-5" />
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Converted Estimate ({activeCurrencyDef.code}):</label>
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[#febd69] font-mono font-black text-sm">
                    {formatPrice(sampleAmount, 'USD').formattedConverted}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                {t(
                  'i18n.rateNotice',
                  'Currency conversion is provided for buyer convenience based on platform treasury reference rates. Authoritative order totals are preserved in the merchant\'s original listing currency.'
                )}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: SHIPPING COUNTRY & REGION */}
        {activeTab === 'country' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Select shipping destination. Delivery estimates, carrier routes, and regional customs compliance are adapted
              to your designated country.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportedCountries.map((co) => {
                const isSelected = country === co.code;
                return (
                  <button
                    key={co.code}
                    onClick={() => {
                      setCountry(co.code);
                      setCurrency(co.defaultCurrency);
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-amber-500/10 border-[#febd69] text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{co.flag}</span>
                      <div>
                        <div className="font-black text-sm text-white flex items-center gap-1.5">
                          <span>{co.name}</span>
                          <span className="text-xs text-slate-400 font-normal">({co.nativeName})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Default: <strong className="text-amber-300">{co.defaultCurrency}</strong> • Phone:{' '}
                          <span className="font-mono">{co.phonePrefix}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-1.5 bg-[#febd69] text-slate-950 rounded-xl">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {activeCountryDef.customsNotice && (
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl text-xs text-amber-200">
                <strong className="block text-amber-400 font-bold mb-0.5">Customs & Duty Notice:</strong>
                {activeCountryDef.customsNotice}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TREASURY EXCHANGE RATES TABLE */}
        {activeTab === 'rates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">{exchangeRates.providerName}</h3>
                <p className="text-xs text-slate-400">
                  {t('i18n.lastUpdated', 'Last Updated: {time}', {
                    time: new Date(exchangeRates.timestamp).toLocaleString(),
                  })}
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
                {exchangeRates.status}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Currency</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Base Unit (USD)</th>
                    <th className="py-2.5 px-3 text-right">Exchange Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {Object.entries(exchangeRates.rates).map(([curr, rate]) => (
                    <tr key={curr} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 text-white font-sans font-bold">
                        {supportedCurrencies.find((c) => c.code === curr)?.name || curr}
                      </td>
                      <td className="py-2.5 px-3 text-[#febd69] font-bold">{curr}</td>
                      <td className="py-2.5 px-3 text-slate-400">$1.00 USD</td>
                      <td className="py-2.5 px-3 text-right font-black text-white">
                        {rate.toFixed(curr === 'PKR' ? 2 : 4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Selected: <strong className="text-white">{activeLanguageDef.name}</strong> •{' '}
            <strong className="text-[#febd69]">{activeCurrencyDef.code}</strong> •{' '}
            <strong className="text-white">{activeCountryDef.name}</strong>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition shadow-lg"
          >
            {t('common.applyAndClose', 'Apply & Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
