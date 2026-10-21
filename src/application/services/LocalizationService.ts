import {
  LanguageCode,
  CurrencyCode,
  CountryCode,
  ExchangeRateTable,
  AdminLocalizationSettings,
  PriceDisplayResult,
} from '../../types/localization.js';
import {
  SUPPORTED_LANGUAGES,
  INITIAL_CURRENCIES,
  SUPPORTED_COUNTRIES,
  INITIAL_EXCHANGE_RATES,
  DEFAULT_ADMIN_LOCALIZATION_SETTINGS,
} from '../../i18n/config.js';
import { logger } from '../../infrastructure/logging/Logger.js';

export class LocalizationService {
  private exchangeRateTable: ExchangeRateTable;
  private adminSettings: AdminLocalizationSettings;

  constructor() {
    this.exchangeRateTable = { ...INITIAL_EXCHANGE_RATES };
    this.adminSettings = { ...DEFAULT_ADMIN_LOCALIZATION_SETTINGS };
  }

  // Get full localization configuration for clients
  public getLocalizationConfig() {
    return {
      languages: SUPPORTED_LANGUAGES.filter((l) =>
        this.adminSettings.enabledLanguages.includes(l.code)
      ),
      currencies: INITIAL_CURRENCIES.filter((c) =>
        this.adminSettings.enabledCurrencies.includes(c.code)
      ),
      countries: SUPPORTED_COUNTRIES.filter((co) =>
        this.adminSettings.enabledCountries.includes(co.code)
      ),
      exchangeRates: this.getExchangeRates(),
      settings: this.adminSettings,
    };
  }

  // Get exchange rates table with status
  public getExchangeRates(): ExchangeRateTable {
    // Check if rates are stale (older than 24 hours)
    const lastFetch = new Date(this.exchangeRateTable.lastSuccessfulFetch).getTime();
    const now = Date.now();
    const isStale = now - lastFetch > 24 * 60 * 60 * 1000;

    return {
      ...this.exchangeRateTable,
      status: isStale ? 'STALE' : 'ACTIVE',
    };
  }

  // Convert amount between currencies
  public convertCurrency(
    amount: number,
    fromCurrency: CurrencyCode,
    toCurrency: CurrencyCode
  ): {
    originalAmount: number;
    fromCurrency: CurrencyCode;
    convertedAmount: number;
    toCurrency: CurrencyCode;
    rateUsed: number;
    timestamp: string;
  } {
    if (amount < 0) {
      throw new Error('Conversion amount cannot be negative');
    }

    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        fromCurrency,
        convertedAmount: amount,
        toCurrency,
        rateUsed: 1.0,
        timestamp: this.exchangeRateTable.timestamp,
      };
    }

    const rates = this.exchangeRateTable.rates;
    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];

    if (!rateFrom || !rateTo) {
      throw new Error(`Exchange rate unavailable for conversion ${fromCurrency} -> ${toCurrency}`);
    }

    // Convert from origin to USD, then USD to destination
    const inUSD = amount / rateFrom;
    const converted = Number((inUSD * rateTo).toFixed(2));
    const effectiveRate = Number((rateTo / rateFrom).toFixed(4));

    return {
      originalAmount: amount,
      fromCurrency,
      convertedAmount: converted,
      toCurrency,
      rateUsed: effectiveRate,
      timestamp: this.exchangeRateTable.timestamp,
    };
  }

  // Admin: Override specific exchange rate
  public overrideExchangeRate(
    currency: CurrencyCode,
    newRate: number,
    adminId: string = 'admin-01'
  ): ExchangeRateTable {
    if (newRate <= 0) {
      throw new Error('Exchange rate must be greater than zero');
    }

    this.exchangeRateTable.rates[currency] = newRate;
    this.exchangeRateTable.manualOverrides[currency] = newRate;
    this.exchangeRateTable.timestamp = new Date().toISOString();

    logger.info(
      `Exchange rate for ${currency} overridden to ${newRate} by admin ${adminId}`,
      'LocalizationService'
    );

    return this.getExchangeRates();
  }

  // Admin: Update settings
  public updateAdminSettings(settings: Partial<AdminLocalizationSettings>): AdminLocalizationSettings {
    this.adminSettings = {
      ...this.adminSettings,
      ...settings,
    };
    logger.info('Updated localization admin settings', 'LocalizationService');
    return this.adminSettings;
  }

  // Validate order transaction currency vs gateway capability
  public validateTransactionCurrency(
    sellerListingCurrency: CurrencyCode,
    buyerCheckoutCurrency: CurrencyCode,
    orderTotalOriginal: number
  ): {
    settlementCurrency: CurrencyCode;
    settlementAmount: number;
    displayCurrency: CurrencyCode;
    displayAmount: number;
    isConversionApplied: boolean;
    gatewayNotice: string;
  } {
    // Authoritative transaction currency is always the seller's original listing currency
    // or standard USD settlement if cross-border gateway requires it
    const isConversionApplied = sellerListingCurrency !== buyerCheckoutCurrency;
    const displayAmount = isConversionApplied
      ? this.convertCurrency(orderTotalOriginal, sellerListingCurrency, buyerCheckoutCurrency).convertedAmount
      : orderTotalOriginal;

    let gatewayNotice = `Authoritative payment will be charged in ${sellerListingCurrency}.`;
    if (isConversionApplied) {
      gatewayNotice += ` Estimated display total in ${buyerCheckoutCurrency} is provided for buyer clarity.`;
    }

    return {
      settlementCurrency: sellerListingCurrency,
      settlementAmount: orderTotalOriginal,
      displayCurrency: buyerCheckoutCurrency,
      displayAmount,
      isConversionApplied,
      gatewayNotice,
    };
  }
}

export const localizationService = new LocalizationService();
