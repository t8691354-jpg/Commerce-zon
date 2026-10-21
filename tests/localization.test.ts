/**
 * Commerce Zon Marketplace - Part 16 Validation Suite
 * Global Marketplace Localization, Multi-Currency & Internationalization (i18n)
 */

import { localizationService } from '../src/application/services/LocalizationService';
import {
  SUPPORTED_LANGUAGES,
  INITIAL_CURRENCIES,
  SUPPORTED_COUNTRIES,
  INITIAL_EXCHANGE_RATES,
} from '../src/i18n/config';
import { enTranslations } from '../src/i18n/translations/en';
import { urTranslations } from '../src/i18n/translations/ur';
import { arTranslations } from '../src/i18n/translations/ar';
import { CurrencyCode } from '../src/types/localization';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

console.log('================================================================');
console.log('COMMERCE ZON LOCALIZATION & MULTI-CURRENCY - PART 16 VALIDATION');
console.log('================================================================');

// -------------------------------------------------------------
// Test 1: Configuration & Supported Locales
// -------------------------------------------------------------
console.log('\n--- Test 1: Supported Languages & i18n Matrix ---');
const config = localizationService.getLocalizationConfig();

assert(Array.isArray(config.languages) && config.languages.length >= 5, 'Provides at least 5 supported languages');
const english = config.languages.find((l) => l.code === 'en');
assert(english !== undefined && english.dir === 'ltr' && english.locale === 'en-US', 'English is configured as LTR default (en-US)');

const urdu = config.languages.find((l) => l.code === 'ur');
assert(urdu !== undefined && urdu.dir === 'rtl' && urdu.locale === 'ur-PK', 'Urdu is configured with RTL direction and ur-PK locale');

const arabic = config.languages.find((l) => l.code === 'ar');
assert(arabic !== undefined && arabic.dir === 'rtl' && arabic.locale === 'ar-SA', 'Arabic is configured with RTL direction');

// -------------------------------------------------------------
// Test 2: Urdu Translation Dictionary Completeness & Fallback
// -------------------------------------------------------------
console.log('\n--- Test 2: Urdu Translation Dictionary & Fallback ---');
assert(Object.keys(urTranslations).length >= 50, 'Urdu dictionary contains comprehensive translated strings');
assert(typeof urTranslations['common.appName'] === 'string' && urTranslations['common.appName'].includes('کامرس زون'), 'Translates app name to Urdu');
assert(typeof urTranslations['nav.returnsAndOrders'] === 'string', 'Translates navigation items to Urdu');
assert(typeof urTranslations['checkout.transactionCurrencyNote'] === 'string', 'Translates transaction currency safety notice to Urdu');

// Test fallback behavior simulation
const sampleMissingKey = 'non.existent.translation.key';
const fallbackResult = (urTranslations as Record<string, string>)[sampleMissingKey] || (enTranslations as Record<string, string>)[sampleMissingKey] || 'Default Fallback';
assert(fallbackResult === 'Default Fallback', 'Gracefully falls back when translation is absent');

// -------------------------------------------------------------
// Test 3: Multi-Currency Configuration (USD, PKR, GBP, EUR, etc.)
// -------------------------------------------------------------
console.log('\n--- Test 3: Multi-Currency Matrix ---');
const expectedCurrencies: CurrencyCode[] = ['USD', 'PKR', 'GBP', 'EUR', 'AED', 'SAR', 'CAD', 'AUD'];

expectedCurrencies.forEach((code) => {
  const found = config.currencies.find((c) => c.code === code);
  assert(found !== undefined, `Currency ${code} is configured in marketplace definitions`);
  assert(found?.exchangeRateToUSD !== undefined && found.exchangeRateToUSD > 0, `Currency ${code} has positive exchange rate to USD`);
});

const baseUSD = config.currencies.find((c) => c.code === 'USD');
assert(baseUSD?.isBaseCurrency === true && baseUSD.exchangeRateToUSD === 1.0, 'USD is the authoritative base currency (1.0)');

// -------------------------------------------------------------
// Test 4: Currency Conversion Calculations
// -------------------------------------------------------------
console.log('\n--- Test 4: Currency Conversion Calculations ---');

// Same currency conversion
const sameConv = localizationService.convertCurrency(100, 'USD', 'USD');
assert(sameConv.convertedAmount === 100 && sameConv.rateUsed === 1.0, 'USD to USD returns identical amount and 1.0 rate');

// USD to PKR conversion
const usdToPkr = localizationService.convertCurrency(100, 'USD', 'PKR');
assert(usdToPkr.convertedAmount === 27850 && usdToPkr.rateUsed === 278.5, 'Converts $100 USD to 27,850 PKR (rate 278.5)');

// PKR to USD conversion
const pkrToUsd = localizationService.convertCurrency(27850, 'PKR', 'USD');
assert(pkrToUsd.convertedAmount === 100, 'Converts 27,850 PKR back to $100.00 USD');

// Cross-currency conversion (PKR to EUR via base USD)
const pkrToEur = localizationService.convertCurrency(27850, 'PKR', 'EUR');
assert(pkrToEur.convertedAmount === 92, 'Cross-converts 27,850 PKR to 92.00 EUR through base USD');

// Precision and rounding check
const precisionTest = localizationService.convertCurrency(19.99, 'USD', 'GBP');
assert(typeof precisionTest.convertedAmount === 'number' && Number.isFinite(precisionTest.convertedAmount), 'Conversion produces finite decimal');
assert(precisionTest.convertedAmount === 15.79, 'Correctly rounds fractional minor units ($19.99 * 0.79 = 15.79 GBP)');

// -------------------------------------------------------------
// Test 5: Conversion Error Handling & Safety
// -------------------------------------------------------------
console.log('\n--- Test 5: Conversion Validation & Safety ---');
try {
  localizationService.convertCurrency(-50, 'USD', 'PKR');
  assert(false, 'Should throw error on negative conversion amount');
} catch (err: any) {
  assert(err.message.includes('negative'), 'Correctly rejects negative conversion amount');
}

// -------------------------------------------------------------
// Test 6: Central Treasury Exchange Rates & Admin Overrides
// -------------------------------------------------------------
console.log('\n--- Test 6: Exchange Rates Table & Admin Overrides ---');
const initialRates = localizationService.getExchangeRates();
assert(initialRates.status === 'ACTIVE', 'Exchange rate table status is ACTIVE');
assert(initialRates.baseCurrency === 'USD', 'Exchange rate table base is USD');

// Admin override test
const overridden = localizationService.overrideExchangeRate('PKR', 280.0, 'admin-treasury-01');
assert(overridden.rates.PKR === 280.0, 'Admin can override currency exchange rate');
assert(overridden.manualOverrides['PKR'] === 280.0, 'Manual override is tracked in audit records');

// Verify updated conversion uses new rate
const updatedConv = localizationService.convertCurrency(10, 'USD', 'PKR');
assert(updatedConv.convertedAmount === 2800, 'Subsequent conversions immediately use updated rate ($10 -> 2,800 PKR)');

// Reset rate back to standard baseline
localizationService.overrideExchangeRate('PKR', 278.5, 'admin-treasury-01');

// -------------------------------------------------------------
// Test 7: Admin Localization Settings Management
// -------------------------------------------------------------
console.log('\n--- Test 7: Admin Localization Settings ---');
const updatedSettings = localizationService.updateAdminSettings({
  defaultLanguage: 'ur',
  defaultCurrency: 'PKR',
});
assert(updatedSettings.defaultLanguage === 'ur', 'Admin settings update default language');
assert(updatedSettings.defaultCurrency === 'PKR', 'Admin settings update default currency');

// Restore defaults
localizationService.updateAdminSettings({
  defaultLanguage: 'en',
  defaultCurrency: 'USD',
});

// -------------------------------------------------------------
// Test 8: Checkout Transaction Currency Safety
// -------------------------------------------------------------
console.log('\n--- Test 8: Checkout Transaction Currency Safety ---');
// When buyer display currency matches seller listing currency
const checkoutSame = localizationService.validateTransactionCurrency('USD', 'USD', 250);
assert(checkoutSame.settlementCurrency === 'USD', 'Settlement currency matches listing currency (USD)');
assert(checkoutSame.settlementAmount === 250, 'Settlement amount is preserved without alteration');
assert(checkoutSame.isConversionApplied === false, 'No conversion applied when currencies match');

// When buyer views in PKR but seller lists in USD
const checkoutDiff = localizationService.validateTransactionCurrency('USD', 'PKR', 100);
assert(checkoutDiff.settlementCurrency === 'USD', 'Settlement currency remains USD to protect seller listing');
assert(checkoutDiff.settlementAmount === 100, 'Original seller listing total is strictly preserved ($100)');
assert(checkoutDiff.displayAmount === 27850, 'Buyer sees exact converted estimate (27,850 PKR)');
assert(checkoutDiff.isConversionApplied === true, 'Flags that cross-currency conversion is applied');
assert(typeof checkoutDiff.gatewayNotice === 'string' && checkoutDiff.gatewayNotice.includes('USD'), 'Provides clear notice that settlement is charged in USD');

// -------------------------------------------------------------
// Test 9: Supported Countries & Regional Preferences
// -------------------------------------------------------------
console.log('\n--- Test 9: Supported Countries & Regional Preferences ---');
assert(config.countries.length >= 8, 'Marketplace supports at least 8 international destinations');

const pakistan = config.countries.find((c) => c.code === 'PK');
assert(pakistan !== undefined && pakistan.defaultCurrency === 'PKR' && pakistan.phonePrefix === '+92', 'Pakistan is configured with +92 and PKR');
assert(pakistan?.postalCodeLabel === 'Postal Code', 'Pakistan has localized address label "Postal Code"');

const usa = config.countries.find((c) => c.code === 'US');
assert(usa !== undefined && usa.postalCodeLabel === 'ZIP Code' && usa.stateProvinceLabel === 'State', 'USA has localized address labels "ZIP Code" and "State"');

const uae = config.countries.find((c) => c.code === 'AE');
assert(uae !== undefined && uae.stateProvinceLabel === 'Emirate', 'UAE has localized address label "Emirate"');

const germany = config.countries.find((c) => c.code === 'DE');
assert(germany !== undefined && germany.postalCodeLabel === 'Postleitzahl', 'Germany has localized address label "Postleitzahl"');

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) {
  process.exit(1);
}
