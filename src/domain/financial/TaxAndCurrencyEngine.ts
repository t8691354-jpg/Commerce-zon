/**
 * Enterprise Tax & Multi-Currency Engine
 * Regional Tax Rules (VAT/GST/Sales Tax) & Multi-Currency Formatters/Converters
 */

export interface TaxCalculationResult {
  taxableAmount: number;
  taxRatePct: number;
  taxAmount: number;
  taxType: 'SALES_TAX' | 'VAT' | 'GST';
  regionName: string;
}

export interface CurrencyConversionResult {
  sourceAmount: number;
  sourceCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
  convertedAmount: number;
  formattedTarget: string;
}

export class TaxAndCurrencyEngine {
  private static ratesMap: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    CAD: 1.35,
    JPY: 155.0,
    PKR: 278.5,
    INR: 83.2,
  };

  private static currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    JPY: '¥',
    PKR: 'Rs.',
    INR: '₹',
  };

  /**
   * Calculates regional sales tax, VAT, or GST based on destination country/state.
   */
  public static calculateTax(subtotal: number, countryCode: string = 'USA', stateCode?: string): TaxCalculationResult {
    let taxRatePct = 8.0; // Default US base sales tax
    let taxType: 'SALES_TAX' | 'VAT' | 'GST' = 'SALES_TAX';
    let regionName = 'United States Base Tax';

    const c = countryCode.toUpperCase();

    if (c === 'USA' || c === 'US') {
      taxType = 'SALES_TAX';
      if (stateCode === 'CA') {
        taxRatePct = 9.25;
        regionName = 'California State & Local Tax';
      } else if (stateCode === 'NY') {
        taxRatePct = 8.875;
        regionName = 'New York State & Local Tax';
      } else if (stateCode === 'TX') {
        taxRatePct = 8.25;
        regionName = 'Texas State Sales Tax';
      } else {
        taxRatePct = 7.5;
        regionName = 'US Standard Regional Tax';
      }
    } else if (c === 'DEU' || c === 'DE' || c === 'FRA' || c === 'FR' || c === 'GBR' || c === 'UK') {
      taxType = 'VAT';
      taxRatePct = 20.0;
      regionName = 'European Union / UK Standard VAT';
    } else if (c === 'CAN' || c === 'CA') {
      taxType = 'GST';
      taxRatePct = 13.0;
      regionName = 'Canada Harmonized Sales Tax (HST/GST)';
    } else if (c === 'IND' || c === 'IN') {
      taxType = 'GST';
      taxRatePct = 18.0;
      regionName = 'India Goods & Services Tax (GST)';
    }

    const taxAmount = Math.round((subtotal * (taxRatePct / 100)) * 100) / 100;

    return {
      taxableAmount: subtotal,
      taxRatePct,
      taxAmount,
      taxType,
      regionName,
    };
  }

  /**
   * Converts amount between currencies using current exchange rate table.
   */
  public static convertCurrency(amount: number, from: string = 'USD', to: string = 'USD'): CurrencyConversionResult {
    const fromRate = this.ratesMap[from.toUpperCase()] || 1.0;
    const toRate = this.ratesMap[to.toUpperCase()] || 1.0;

    // Convert to USD base first, then to target currency
    const amountInUSD = amount / fromRate;
    const convertedAmount = Math.round((amountInUSD * toRate) * 100) / 100;
    const exchangeRate = Math.round((toRate / fromRate) * 10000) / 10000;

    const symbol = this.currencySymbols[to.toUpperCase()] || '$';

    return {
      sourceAmount: amount,
      sourceCurrency: from.toUpperCase(),
      targetCurrency: to.toUpperCase(),
      exchangeRate,
      convertedAmount,
      formattedTarget: `${symbol}${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    };
  }

  public static formatCurrency(amount: number, currency: string = 'USD'): string {
    const symbol = this.currencySymbols[currency.toUpperCase()] || '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
