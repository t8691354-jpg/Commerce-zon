/**
 * Enterprise Promotion & Coupon Validation Engine
 * Supports Percentage, Fixed, Minimum Spend, Product Limits & Expiry Validation
 */

export interface CouponCode {
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number; // e.g., 15 for 15% or 50 for $50
  minOrderSubtotal: number;
  maxDiscountCap?: number;
  usageLimit?: number;
  currentUsageCount: number;
  expiryDateISO: string;
  isActive: boolean;
  applicableCategories?: string[];
}

export interface CouponValidationResult {
  isValid: boolean;
  discountAmount: number;
  formattedReason?: string;
  coupon?: CouponCode;
}

export class PromotionEngine {
  private static couponStore: CouponCode[] = [
    {
      code: 'PRIME100',
      type: 'FIXED_AMOUNT',
      value: 100,
      minOrderSubtotal: 300,
      currentUsageCount: 42,
      expiryDateISO: '2027-12-31T23:59:59Z',
      isActive: true,
    },
    {
      code: 'SAVE10',
      type: 'PERCENTAGE',
      value: 10,
      minOrderSubtotal: 50,
      maxDiscountCap: 200,
      currentUsageCount: 115,
      expiryDateISO: '2027-12-31T23:59:59Z',
      isActive: true,
    },
    {
      code: 'ENTERPRISE50',
      type: 'FIXED_AMOUNT',
      value: 50,
      minOrderSubtotal: 200,
      currentUsageCount: 12,
      expiryDateISO: '2027-12-31T23:59:59Z',
      isActive: true,
    },
    {
      code: 'CZWELCOME20',
      type: 'PERCENTAGE',
      value: 20,
      minOrderSubtotal: 100,
      maxDiscountCap: 150,
      currentUsageCount: 88,
      expiryDateISO: '2027-12-31T23:59:59Z',
      isActive: true,
    },
  ];

  public static validateCoupon(code: string, subtotal: number): CouponValidationResult {
    if (!code || !code.trim()) {
      return { isValid: false, discountAmount: 0, formattedReason: 'No coupon code provided.' };
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = this.couponStore.find((c) => c.code === cleanCode);

    if (!coupon) {
      return { isValid: false, discountAmount: 0, formattedReason: `Coupon code "${cleanCode}" is invalid.` };
    }

    if (!coupon.isActive) {
      return { isValid: false, discountAmount: 0, formattedReason: `Coupon code "${cleanCode}" has been deactivated.` };
    }

    if (new Date() > new Date(coupon.expiryDateISO)) {
      return { isValid: false, discountAmount: 0, formattedReason: `Coupon code "${cleanCode}" has expired.` };
    }

    if (subtotal < coupon.minOrderSubtotal) {
      return {
        isValid: false,
        discountAmount: 0,
        formattedReason: `Coupon "${cleanCode}" requires a minimum subtotal of $${coupon.minOrderSubtotal.toFixed(2)}. Current: $${subtotal.toFixed(2)}.`,
      };
    }

    if (coupon.usageLimit && coupon.currentUsageCount >= coupon.usageLimit) {
      return { isValid: false, discountAmount: 0, formattedReason: `Coupon "${cleanCode}" has reached its maximum redemptions.` };
    }

    let discount = 0;
    if (coupon.type === 'FIXED_AMOUNT') {
      discount = Math.min(subtotal, coupon.value);
    } else {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
        discount = coupon.maxDiscountCap;
      }
    }

    discount = Math.round(discount * 100) / 100;

    return {
      isValid: true,
      discountAmount: discount,
      formattedReason: `Coupon "${cleanCode}" applied successfully ($${discount.toFixed(2)} savings).`,
      coupon,
    };
  }

  public static getActiveCoupons(): CouponCode[] {
    return [...this.couponStore];
  }
}
