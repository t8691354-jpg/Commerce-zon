/**
 * Enterprise Order Management System (OMS)
 * Pre-Checkout & Order Validation Engine
 */

import { Product, Warehouse } from '../../types/domain';
import { ComprehensiveMasterOrder, OrderItemDetail } from '../../types/oms';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class OrderValidator {
  /**
   * Validates an incoming order before checkout placement.
   */
  public static validateCheckoutRequest(payload: {
    items: { productId: string; quantity: number; variantId?: string }[];
    customerName?: string;
    customerEmail?: string;
    shippingAddress?: any;
    paymentMethod?: string;
    buyerWalletBalance?: number;
    availableProducts: Product[];
    availableWarehouses?: Warehouse[];
  }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Items Check
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push('Order must contain at least one product item.');
      return { isValid: false, errors, warnings };
    }

    // 2. Customer & Address Check
    if (!payload.customerName || payload.customerName.trim().length < 2) {
      errors.push('Valid customer name is required.');
    }

    if (!payload.customerEmail || !payload.customerEmail.includes('@')) {
      errors.push('Valid customer email address is required.');
    }

    if (!payload.shippingAddress || !payload.shippingAddress.address || !payload.shippingAddress.city) {
      errors.push('Complete shipping address (street address and city) is required.');
    }

    // 3. Inventory & Product Validation
    let calculatedSubtotal = 0;
    for (const item of payload.items) {
      if (item.quantity <= 0) {
        errors.push(`Invalid quantity (${item.quantity}) for product ID ${item.productId}.`);
        continue;
      }

      const product = payload.availableProducts.find((p) => p.id === item.productId);
      if (!product) {
        errors.push(`Product with ID "${item.productId}" was not found in active catalog.`);
        continue;
      }

      if (product.isArchived) {
        errors.push(`Product "${product.title}" is archived and no longer available for purchase.`);
      }

      if (product.totalStock < item.quantity) {
        errors.push(
          `Insufficient stock for "${product.title}". Requested: ${item.quantity}, Available: ${product.totalStock}.`
        );
      }

      if (product.totalStock <= item.quantity + 3) {
        warnings.push(`Low stock warning for "${product.title}". Only ${product.totalStock} remaining in warehouse.`);
      }

      calculatedSubtotal += product.price.amount * item.quantity;
    }

    // 4. Wallet Balance Check if paying via WALLET
    if (payload.paymentMethod === 'WALLET' && payload.buyerWalletBalance !== undefined) {
      const estimatedTotal = calculatedSubtotal * 1.08 + 25.0; // Subtotal + Tax + Shipping estimate
      if (payload.buyerWalletBalance < estimatedTotal) {
        errors.push(
          `Insufficient Commerce Zon Wallet balance ($${payload.buyerWalletBalance.toFixed(
            2
          )}). Order total requires $${estimatedTotal.toFixed(2)}.`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates state transition for Order Lifecycle.
   */
  public static canTransitionStatus(
    currentStatus: string,
    targetStatus: string,
    actorRole: string
  ): { allowed: boolean; reason?: string } {
    // Terminal state protection
    if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED' || currentStatus === 'REFUNDED') {
      return {
        allowed: false,
        reason: `Order is already in terminal state "${currentStatus}" and cannot be transitioned further.`,
      };
    }

    // Seller restriction for immediate cancellations if already shipped
    if (actorRole === 'SELLER' && (currentStatus === 'SHIPPED' || currentStatus === 'IN_TRANSIT') && targetStatus === 'CANCELLED') {
      return {
        allowed: false,
        reason: 'Sellers cannot cancel orders once package is in transit with carrier. Initiate return workflow instead.',
      };
    }

    return { allowed: true };
  }
}
