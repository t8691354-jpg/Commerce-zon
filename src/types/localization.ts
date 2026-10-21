/**
 * Part 16: Global Marketplace Localization, Multi-Currency & Internationalization Types
 */

export type LanguageCode = 'en' | 'ur' | 'ar' | 'es' | 'de';

export type CurrencyCode =
  | 'USD'
  | 'PKR'
  | 'GBP'
  | 'EUR'
  | 'AED'
  | 'SAR'
  | 'CAD'
  | 'AUD';

export type CountryCode =
  | 'US'
  | 'PK'
  | 'GB'
  | 'DE'
  | 'AE'
  | 'SA'
  | 'CA'
  | 'AU';

export type TextDirection = 'ltr' | 'rtl';

export interface LanguageDefinition {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir: TextDirection;
  flag: string;
  locale: string;
  enabled: boolean;
  completionPercentage: number;
}

export interface CurrencyDefinition {
  code: CurrencyCode;
  symbol: string;
  name: string;
  nativeName: string;
  decimals: number;
  exchangeRateToUSD: number; // e.g. 1 USD = 278.50 PKR
  lastUpdated: string;
  enabled: boolean;
  isBaseCurrency?: boolean;
}

export interface CountryDefinition {
  code: CountryCode;
  name: string;
  nativeName: string;
  flag: string;
  defaultCurrency: CurrencyCode;
  defaultLanguage: LanguageCode;
  continent: string;
  postalCodeLabel: string; // e.g. "ZIP Code" (US), "Postal Code" (UK/PK)
  stateProvinceLabel: string; // e.g. "State", "Province", "Emirate"
  phonePrefix: string;
  supportedShipping: boolean;
  customsNotice?: string;
}

export interface ExchangeRateTable {
  baseCurrency: CurrencyCode; // USD
  providerName: string; // "Commerce Zon Global Treasury Feed"
  status: 'ACTIVE' | 'STALE' | 'OFFLINE';
  timestamp: string;
  lastSuccessfulFetch: string;
  rates: Record<CurrencyCode, number>;
  manualOverrides: Record<string, number>;
}

export interface LocalizationPreferences {
  language: LanguageCode;
  currency: CurrencyCode;
  country: CountryCode;
  autoDetect: boolean;
}

export interface PriceDisplayResult {
  formattedConverted: string;
  formattedOriginal: string;
  convertedAmount: number;
  originalAmount: number;
  displayCurrency: CurrencyCode;
  originalCurrency: CurrencyCode;
  isConverted: boolean;
  exchangeRateUsed: number;
  rateTimestamp: string;
}

export interface AdminLocalizationSettings {
  defaultLanguage: LanguageCode;
  enabledLanguages: LanguageCode[];
  defaultCurrency: CurrencyCode;
  enabledCurrencies: CurrencyCode[];
  defaultCountry: CountryCode;
  enabledCountries: CountryCode[];
  fallbackToEnglish: boolean;
  allowBuyerCurrencySelection: boolean;
  enforceMerchantSettlementInUSD: boolean;
}
