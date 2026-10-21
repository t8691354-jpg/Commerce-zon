/**
 * Enterprise Address Validation & Management Engine
 * Standardizes Shipping, Billing, Saved Addresses & International Geo Verification
 */

import { ShippingAddressRecord } from './ShipmentEntity';

export interface AddressValidationResult {
  isValid: boolean;
  normalizedAddress?: ShippingAddressRecord;
  errors: string[];
  warnings: string[];
  suggestedCorrection?: string;
}

export class AddressManager {
  /**
   * Validates address fields and normalizes country/postal format.
   */
  public static validateAddress(addr: Partial<ShippingAddressRecord>): AddressValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!addr.fullName || !addr.fullName.trim()) {
      errors.push('Recipient full name is required.');
    }
    if (!addr.streetLine1 || !addr.streetLine1.trim()) {
      errors.push('Street address line 1 is required.');
    }
    if (!addr.city || !addr.city.trim()) {
      errors.push('City name is required.');
    }
    if (!addr.stateOrProvince || !addr.stateOrProvince.trim()) {
      errors.push('State / Province is required.');
    }
    if (!addr.postalCode || !addr.postalCode.trim()) {
      errors.push('Postal / Zip code is required.');
    }
    if (!addr.phone || !addr.phone.trim()) {
      warnings.push('Phone number missing; carrier SMS alerts disabled.');
    }

    const countryCode = (addr.countryCode || 'US').toUpperCase();

    // Standardize zip code formatting for US
    let postalCode = addr.postalCode ? addr.postalCode.trim() : '';
    if (countryCode === 'US' && postalCode.length === 5 && !/^\d{5}$/.test(postalCode)) {
      errors.push('US Zip Code must contain 5 numeric digits.');
    }

    const isValid = errors.length === 0;

    const normalizedAddress: ShippingAddressRecord = {
      id: addr.id || `addr-${Date.now()}`,
      fullName: addr.fullName?.trim() || 'Valued Customer',
      companyName: addr.companyName?.trim(),
      streetLine1: addr.streetLine1?.trim() || '',
      streetLine2: addr.streetLine2?.trim(),
      city: addr.city?.trim() || '',
      stateOrProvince: addr.stateOrProvince?.trim().toUpperCase() || '',
      postalCode,
      countryCode,
      phone: addr.phone?.trim() || '+1-000-000-0000',
      email: addr.email?.trim() || 'customer@commercezon.com',
      isDefault: Boolean(addr.isDefault),
    };

    return {
      isValid,
      normalizedAddress,
      errors,
      warnings,
      suggestedCorrection: isValid ? undefined : 'Please verify street line 1 and postal code format.',
    };
  }

  /**
   * Mock distance calculation between origin and destination zip codes in km.
   */
  public static estimateDistanceKm(originZip: string, destZip: string): number {
    const zip1 = parseInt(originZip.replace(/\D/g, '').slice(0, 5)) || 10001;
    const zip2 = parseInt(destZip.replace(/\D/g, '').slice(0, 5)) || 90210;
    const diff = Math.abs(zip1 - zip2);
    return Math.min(4500, Math.max(25, Math.round(diff * 0.05)));
  }
}
