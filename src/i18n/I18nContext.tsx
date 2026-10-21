import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  LanguageCode,
  CurrencyCode,
  CountryCode,
  TextDirection,
  LanguageDefinition,
  CurrencyDefinition,
  CountryDefinition,
  ExchangeRateTable,
  PriceDisplayResult,
} from '../types/localization';
import {
  SUPPORTED_LANGUAGES,
  INITIAL_CURRENCIES,
  SUPPORTED_COUNTRIES,
  INITIAL_EXCHANGE_RATES,
} from './config';
import { enTranslations } from './translations/en';
import { urTranslations } from './translations/ur';
import { arTranslations } from './translations/ar';

const DICTIONARIES: Record<string, Record<string, string>> = {
  en: enTranslations,
  ur: urTranslations,
  ar: arTranslations,
};

interface I18nContextType {
  // Language & Direction
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  dir: TextDirection;
  isRTL: boolean;
  activeLanguageDef: LanguageDefinition;
  supportedLanguages: LanguageDefinition[];

  // Currency
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  activeCurrencyDef: CurrencyDefinition;
  supportedCurrencies: CurrencyDefinition[];
  exchangeRates: ExchangeRateTable;
  setExchangeRateOverride: (curr: CurrencyCode, rate: number) => void;

  // Country / Region
  country: CountryCode;
  setCountry: (country: CountryCode) => void;
  activeCountryDef: CountryDefinition;
  supportedCountries: CountryDefinition[];

  // Helpers
  t: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
  convertAmount: (amount: number, fromCurrency?: CurrencyCode, toCurrency?: CurrencyCode) => number;
  formatPrice: (amount: number, fromCurrency?: CurrencyCode) => PriceDisplayResult;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'cz_user_language',
  CURR: 'cz_user_currency',
  COUNTRY: 'cz_user_country',
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or defaults
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG) as LanguageCode;
      return SUPPORTED_LANGUAGES.some((l) => l.code === saved) ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURR) as CurrencyCode;
      return INITIAL_CURRENCIES.some((c) => c.code === saved) ? saved : 'USD';
    } catch {
      return 'USD';
    }
  });

  const [country, setCountryState] = useState<CountryCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUNTRY) as CountryCode;
      return SUPPORTED_COUNTRIES.some((c) => c.code === saved) ? saved : 'US';
    } catch {
      return 'US';
    }
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRateTable>(INITIAL_EXCHANGE_RATES);

  // Active definitions
  const activeLanguageDef = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );

  const activeCurrencyDef = useMemo(
    () => INITIAL_CURRENCIES.find((c) => c.code === currency) || INITIAL_CURRENCIES[0],
    [currency]
  );

  const activeCountryDef = useMemo(
    () => SUPPORTED_COUNTRIES.find((c) => c.code === country) || SUPPORTED_COUNTRIES[0],
    [country]
  );

  const dir: TextDirection = activeLanguageDef.dir;
  const isRTL = dir === 'rtl';

  // Synchronize document direction and lang attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = language;
    }
  }, [dir, language]);

  // Setters with persistence
  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, newLang);
    } catch (e) {
      console.warn('Could not persist language to localStorage', e);
    }
  };

  const setCurrency = (newCurr: CurrencyCode) => {
    setCurrencyState(newCurr);
    try {
      localStorage.setItem(STORAGE_KEYS.CURR, newCurr);
    } catch (e) {
      console.warn('Could not persist currency to localStorage', e);
    }
  };

  const setCountry = (newCountry: CountryCode) => {
    setCountryState(newCountry);
    try {
      localStorage.setItem(STORAGE_KEYS.COUNTRY, newCountry);
    } catch (e) {
      console.warn('Could not persist country to localStorage', e);
    }
  };

  const setExchangeRateOverride = (curr: CurrencyCode, rate: number) => {
    setExchangeRates((prev) => ({
      ...prev,
      rates: {
        ...prev.rates,
        [curr]: rate,
      },
      manualOverrides: {
        ...prev.manualOverrides,
        [curr]: rate,
      },
      timestamp: new Date().toISOString(),
    }));
  };

  // Translation Function
  const t = (key: string, fallback?: string, params?: Record<string, string | number>): string => {
    const currentDict = DICTIONARIES[language] || DICTIONARIES.en;
    let translation = currentDict[key];

    // Fallback to English dictionary if missing
    if (!translation && language !== 'en') {
      translation = DICTIONARIES.en[key];
    }

    if (!translation) {
      translation = fallback || key;
    }

    // Replace parameters e.g. {price}, {currency}, {time}
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }

    return translation;
  };

  // Convert amount between currencies using base USD rates
  const convertAmount = (
    amount: number,
    fromCurrency: CurrencyCode = 'USD',
    toCurrency: CurrencyCode = currency
  ): number => {
    if (fromCurrency === toCurrency) return Number(amount.toFixed(2));

    const rateFromUSD = exchangeRates.rates[fromCurrency] || 1.0;
    const rateToUSD = exchangeRates.rates[toCurrency] || 1.0;

    // Convert from origin to USD, then from USD to target
    const amountInUSD = amount / rateFromUSD;
    const targetAmount = amountInUSD * rateToUSD;

    return Number(targetAmount.toFixed(2));
  };

  // Format price with locale-aware format and distinction of original vs converted
  const formatPrice = (
    amount: number,
    fromCurrency: CurrencyCode = 'USD'
  ): PriceDisplayResult => {
    const isConverted = fromCurrency !== currency;
    const convertedAmount = convertAmount(amount, fromCurrency, currency);

    // Format display currency
    let formattedConverted = '';
    try {
      formattedConverted = new Intl.NumberFormat(activeLanguageDef.locale, {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
      }).format(convertedAmount);
    } catch {
      formattedConverted = `${activeCurrencyDef.symbol}${convertedAmount.toFixed(2)}`;
    }

    // Format original currency
    const originalCurrencyDef =
      INITIAL_CURRENCIES.find((c) => c.code === fromCurrency) || INITIAL_CURRENCIES[0];
    let formattedOriginal = '';
    try {
      formattedOriginal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: fromCurrency,
        currencyDisplay: 'symbol',
      }).format(amount);
    } catch {
      formattedOriginal = `${originalCurrencyDef.symbol}${amount.toFixed(2)}`;
    }

    const exchangeRateUsed =
      fromCurrency === currency
        ? 1.0
        : (exchangeRates.rates[currency] || 1.0) / (exchangeRates.rates[fromCurrency] || 1.0);

    return {
      formattedConverted,
      formattedOriginal,
      convertedAmount,
      originalAmount: amount,
      displayCurrency: currency,
      originalCurrency: fromCurrency,
      isConverted,
      exchangeRateUsed: Number(exchangeRateUsed.toFixed(4)),
      rateTimestamp: exchangeRates.timestamp,
    };
  };

  // Date formatting
  const formatDate = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' }
  ): string => {
    try {
      const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      return new Intl.DateTimeFormat(activeLanguageDef.locale, options).format(d);
    } catch {
      return String(date);
    }
  };

  // Number formatting
  const formatNumber = (
    num: number,
    options?: Intl.NumberFormatOptions
  ): string => {
    try {
      return new Intl.NumberFormat(activeLanguageDef.locale, options).format(num);
    } catch {
      return num.toLocaleString();
    }
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        isRTL,
        activeLanguageDef,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currency,
        setCurrency,
        activeCurrencyDef,
        supportedCurrencies: INITIAL_CURRENCIES,
        exchangeRates,
        setExchangeRateOverride,
        country,
        setCountry,
        activeCountryDef,
        supportedCountries: SUPPORTED_COUNTRIES,
        t,
        convertAmount,
        formatPrice,
        formatDate,
        formatNumber,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
