/**
 * Enterprise Order Management System (OMS)
 * Order Number & Document Reference Generator
 */

export class OrderNumberGenerator {
  /**
   * Generates a unique, searchable, human-readable, collision-resistant Order Number.
   * Format: ORD-{REGION}-{YYYYMMDD}-{RANDOM_ALPHANUM_5}
   * Example: ORD-US-20260730-8K92F
   */
  public static generateOrderNumber(regionCode: string = 'US', prefix: string = 'ORD'): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${regionCode.toUpperCase()}-${dateStr}-${randomChars}`;
  }

  /**
   * Generates a Tax Invoice Number.
   * Example: INV-202607-49210
   */
  public static generateInvoiceNumber(prefix: string = 'INV'): string {
    const today = new Date();
    const yearMonth = today.toISOString().slice(0, 7).replace('-', '');
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${yearMonth}-${randomDigits}`;
  }

  /**
   * Generates a Carrier Tracking Number.
   * Example: TRK-CZL-8829401
   */
  public static generateTrackingNumber(carrierCode: string = 'CZL'): string {
    const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
    return `TRK-${carrierCode.toUpperCase()}-${randomDigits}`;
  }

  /**
   * Generates a Sub-Order ID for split orders.
   * Example: subord-ord-1001-m2
   */
  public static generateSubOrderId(parentOrderId: string, merchantId: string, index: number): string {
    const sanitizedParent = parentOrderId.replace('ord-', '');
    const sanitizedMerchant = merchantId.replace('merch-', 'm');
    return `subord-${sanitizedParent}-${sanitizedMerchant}-${index + 1}`;
  }

  /**
   * Generates an RMA (Return Merchandise Authorization) number.
   * Example: RMA-2026-90421
   */
  public static generateRMANumber(): string {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `RMA-${year}-${randomDigits}`;
  }

  /**
   * Generates a Refund Reference Number.
   * Example: RFD-2026-38291
   */
  public static generateRefundNumber(): string {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `RFD-${year}-${randomDigits}`;
  }
}
