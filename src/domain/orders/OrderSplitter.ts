/**
 * Enterprise Order Management System (OMS)
 * Multi-Seller & Multi-Warehouse Order Splitting Engine
 */

import { Money } from '../../types/domain';
import { ComprehensiveMasterOrder, MultiSellerSubOrder, OrderItemDetail, OrderLifecycleStatus } from '../../types/oms';
import { OrderNumberGenerator } from './OrderNumberGenerator';

export class OrderSplitter {
  /**
   * Splits a master order items list into individual seller/warehouse sub-orders.
   */
  public static splitOrder(
    parentOrderId: string,
    items: OrderItemDetail[],
    parentStatus: OrderLifecycleStatus = 'ORDER_CONFIRMED'
  ): MultiSellerSubOrder[] {
    if (!items || items.length === 0) return [];

    // Group items by Merchant ID
    const merchantGroups = new Map<string, OrderItemDetail[]>();
    for (const item of items) {
      const key = item.merchantId;
      if (!merchantGroups.has(key)) {
        merchantGroups.set(key, []);
      }
      merchantGroups.get(key)!.push(item);
    }

    const subOrders: MultiSellerSubOrder[] = [];
    let groupIndex = 0;

    merchantGroups.forEach((merchantItems, merchantId) => {
      const merchantName = merchantItems[0].merchantName || 'Commerce Zon Verified Seller';
      const warehouseId = merchantItems[0].warehouseId || 'wh-01';
      const warehouseName = merchantItems[0].warehouseName || 'Standard Distribution Hub';

      // Calculate Sub-Order Financials
      let subtotalAmount = 0;
      let taxAmount = 0;

      merchantItems.forEach((item) => {
        subtotalAmount += item.totalPrice.amount;
        if (item.taxAmount) {
          taxAmount += item.taxAmount.amount;
        } else {
          taxAmount += item.totalPrice.amount * 0.08;
        }
      });

      subtotalAmount = Math.round(subtotalAmount * 100) / 100;
      taxAmount = Math.round(taxAmount * 100) / 100;
      const shippingFeeAmount = 15.0; // Flat base shipping per sub-order seller dispatch
      const marketplaceFeeAmount = Math.round(subtotalAmount * 0.10 * 100) / 100; // 10% commission
      const totalAmount = Math.round((subtotalAmount + taxAmount + shippingFeeAmount) * 100) / 100;

      const currency = merchantItems[0].unitPrice.currency || 'USD';

      const subOrder: MultiSellerSubOrder = {
        subOrderId: OrderNumberGenerator.generateSubOrderId(parentOrderId, merchantId, groupIndex),
        parentOrderId,
        merchantId,
        merchantName,
        items: merchantItems,
        subtotal: { amount: subtotalAmount, currency },
        taxFee: { amount: taxAmount, currency },
        shippingFee: { amount: shippingFeeAmount, currency },
        marketplaceFee: { amount: marketplaceFeeAmount, currency },
        total: { amount: totalAmount, currency },
        status: parentStatus,
        warehouseId,
        warehouseName,
        trackingNumber: OrderNumberGenerator.generateTrackingNumber('CZL'),
        carrierName: 'Commerce Zon Logistics',
        packingSlipUrl: `/invoices/packing-slip-${parentOrderId}-${merchantId}.pdf`,
        shippingLabelUrl: `/labels/shipping-label-${parentOrderId}-${merchantId}.pdf`,
      };

      subOrders.push(subOrder);
      groupIndex++;
    });

    return subOrders;
  }

  /**
   * Recalculates master order total status from its sub-orders.
   * If all sub-orders are DELIVERED -> parent status becomes DELIVERED.
   * If any is IN_TRANSIT -> parent status becomes IN_TRANSIT.
   */
  public static deriveParentStatus(subOrders: MultiSellerSubOrder[]): OrderLifecycleStatus {
    if (!subOrders || subOrders.length === 0) return 'ORDER_CONFIRMED';

    const statuses = subOrders.map((so) => so.status);

    if (statuses.every((s) => s === 'CANCELLED')) return 'CANCELLED';
    if (statuses.every((s) => s === 'COMPLETED' || s === 'DELIVERED')) return 'DELIVERED';
    if (statuses.some((s) => s === 'IN_TRANSIT' || s === 'OUT_FOR_DELIVERY' || s === 'SHIPPED')) return 'IN_TRANSIT';
    if (statuses.some((s) => s === 'PROCESSING' || s === 'PACKED' || s === 'READY_FOR_SHIPMENT')) return 'PROCESSING';

    return 'ORDER_CONFIRMED';
  }
}
