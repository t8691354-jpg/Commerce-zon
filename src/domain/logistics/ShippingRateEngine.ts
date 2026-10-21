/**
 * Enterprise Shipping Rate Engine
 * Calculates Freight & Delivery Costs based on Weight, Distance, Zone, Service Level, and Free Shipping Rules
 */

import { ShippingMethodType } from '../../types/logistics';
import { ShippingAddressRecord, ShipmentItemRecord } from './ShipmentEntity';
import { AddressManager } from './AddressManager';

export interface RateCalculationInput {
  originAddress: ShippingAddressRecord;
  destinationAddress: ShippingAddressRecord;
  items: ShipmentItemRecord[];
  shippingMethod: ShippingMethodType;
  subtotalUSD: number;
  promoCode?: string;
}

export interface RateCalculationResult {
  shippingMethod: ShippingMethodType;
  baseFeeUSD: number;
  weightFeeUSD: number;
  distanceFeeUSD: number;
  grossShippingCostUSD: number;
  discountUSD: number;
  netShippingCostUSD: number;
  estimatedDays: string;
  isFreeShipping: boolean;
  freeShippingThresholdUSD: number;
}

export class ShippingRateEngine {
  private static readonly FREE_SHIPPING_THRESHOLD = 99.00; // Orders >= $99 get free standard shipping

  public static calculateShippingRate(input: RateCalculationInput): RateCalculationResult {
    const totalWeightKg = input.items.reduce((sum, item) => sum + (item.unitWeightKg * item.quantity), 0);
    const distanceKm = AddressManager.estimateDistanceKm(input.originAddress.postalCode, input.destinationAddress.postalCode);

    let baseFeeUSD = 4.99;
    let weightRatePerKg = 0.85;
    let distanceRatePer100Km = 0.40;
    let estimatedDays = '3 - 5 Business Days';

    switch (input.shippingMethod) {
      case 'SAME_DAY':
        baseFeeUSD = 19.99;
        weightRatePerKg = 2.20;
        distanceRatePer100Km = 1.50;
        estimatedDays = 'Same Day (By 9 PM)';
        break;
      case 'NEXT_DAY':
        baseFeeUSD = 24.99;
        weightRatePerKg = 1.95;
        distanceRatePer100Km = 1.20;
        estimatedDays = '1 Business Day';
        break;
      case 'EXPRESS':
        baseFeeUSD = 12.99;
        weightRatePerKg = 1.50;
        distanceRatePer100Km = 0.80;
        estimatedDays = '2 Business Days';
        break;
      case 'INTERNATIONAL':
        baseFeeUSD = 34.99;
        weightRatePerKg = 3.50;
        distanceRatePer100Km = 2.10;
        estimatedDays = '4 - 7 Business Days';
        break;
      case 'FREIGHT':
        baseFeeUSD = 49.99;
        weightRatePerKg = 0.45;
        distanceRatePer100Km = 0.25;
        estimatedDays = '5 - 8 Business Days';
        break;
      case 'LOCAL_DELIVERY':
        baseFeeUSD = 7.99;
        weightRatePerKg = 0.60;
        distanceRatePer100Km = 0.30;
        estimatedDays = '1 - 2 Business Days';
        break;
      case 'STORE_PICKUP':
        baseFeeUSD = 0;
        weightRatePerKg = 0;
        distanceRatePer100Km = 0;
        estimatedDays = 'Ready in 2 Hours';
        break;
      case 'STANDARD':
      default:
        baseFeeUSD = 4.99;
        weightRatePerKg = 0.85;
        distanceRatePer100Km = 0.40;
        estimatedDays = '3 - 5 Business Days';
        break;
    }

    const weightFeeUSD = Math.round(totalWeightKg * weightRatePerKg * 100) / 100;
    const distanceFeeUSD = Math.round((distanceKm / 100) * distanceRatePer100Km * 100) / 100;
    const grossShippingCostUSD = Math.round((baseFeeUSD + weightFeeUSD + distanceFeeUSD) * 100) / 100;

    let discountUSD = 0;
    let isFreeShipping = false;

    // Apply free shipping rule for standard shipping on subtotal >= $99
    if (input.shippingMethod === 'STANDARD' && input.subtotalUSD >= this.FREE_SHIPPING_THRESHOLD) {
      discountUSD = grossShippingCostUSD;
      isFreeShipping = true;
    } else if (input.promoCode?.toUpperCase() === 'FREESHIP') {
      discountUSD = grossShippingCostUSD;
      isFreeShipping = true;
    }

    const netShippingCostUSD = Math.max(0, Math.round((grossShippingCostUSD - discountUSD) * 100) / 100);

    return {
      shippingMethod: input.shippingMethod,
      baseFeeUSD,
      weightFeeUSD,
      distanceFeeUSD,
      grossShippingCostUSD,
      discountUSD,
      netShippingCostUSD,
      estimatedDays,
      isFreeShipping,
      freeShippingThresholdUSD: this.FREE_SHIPPING_THRESHOLD,
    };
  }
}
