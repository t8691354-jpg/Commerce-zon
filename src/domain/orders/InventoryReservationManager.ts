/**
 * Enterprise Order Management System (OMS)
 * Inventory Reservation & Automatic Stock Recovery Engine
 */

import { Product, Warehouse } from '../../types/domain';
import { OrderItemDetail } from '../../types/oms';
import { logger } from '../../infrastructure/logging/Logger';

export interface StockReservationLog {
  id: string;
  orderId: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  status: 'RESERVED' | 'COMMITTED' | 'RELEASED' | 'ADJUSTED';
  timestamp: string;
}

export class InventoryReservationManager {
  private static reservationLogs: StockReservationLog[] = [];

  /**
   * Reserves stock across warehouses for an active order placement.
   */
  public static reserveStockForOrder(
    orderId: string,
    items: OrderItemDetail[],
    productsList: Product[]
  ): { success: boolean; errors: string[] } {
    const errors: string[] = [];
    const stockLogsToApply: StockReservationLog[] = [];

    for (const item of items) {
      const product = productsList.find((p) => p.id === item.productId);
      if (!product) {
        errors.push(`Product ID ${item.productId} not found.`);
        continue;
      }

      // Find suitable warehouse stock entry or first available
      let targetWarehouseStock = product.warehouseStock.find((w) => w.warehouseId === item.warehouseId);
      if (!targetWarehouseStock && product.warehouseStock.length > 0) {
        targetWarehouseStock = product.warehouseStock[0];
      }

      if (targetWarehouseStock) {
        // Increase reserved stock and decrement live total available stock safely
        targetWarehouseStock.reserved += item.quantity;
        product.totalStock = Math.max(0, product.totalStock - item.quantity);

        stockLogsToApply.push({
          id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          orderId,
          productId: item.productId,
          warehouseId: targetWarehouseStock.warehouseId,
          quantity: item.quantity,
          status: 'RESERVED',
          timestamp: new Date().toISOString(),
        });

        logger.info(
          `[InventoryReservation] Reserved ${item.quantity} units of "${product.title}" at warehouse "${targetWarehouseStock.warehouseName}" for Order "${orderId}".`,
          'OMS_Inventory'
        );
      } else {
        // Simple stock decrement if no granular warehouse array
        product.totalStock = Math.max(0, product.totalStock - item.quantity);
      }
    }

    if (errors.length === 0) {
      this.reservationLogs.push(...stockLogsToApply);
      return { success: true, errors: [] };
    } else {
      return { success: false, errors };
    }
  }

  /**
   * Releases reserved stock back to active inventory upon order cancellation or timeout.
   */
  public static releaseStockForOrder(
    orderId: string,
    items: OrderItemDetail[],
    productsList: Product[],
    reason: string = 'Order Cancellation'
  ): void {
    for (const item of items) {
      const product = productsList.find((p) => p.id === item.productId);
      if (product) {
        const targetWarehouseStock = product.warehouseStock.find((w) => w.warehouseId === item.warehouseId) || product.warehouseStock[0];
        if (targetWarehouseStock) {
          targetWarehouseStock.reserved = Math.max(0, targetWarehouseStock.reserved - item.quantity);
        }
        product.totalStock += item.quantity;

        this.reservationLogs.push({
          id: `rel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          orderId,
          productId: item.productId,
          warehouseId: item.warehouseId || 'wh-01',
          quantity: item.quantity,
          status: 'RELEASED',
          timestamp: new Date().toISOString(),
        });

        logger.info(
          `[InventoryReservation] Released ${item.quantity} units of "${product.title}" back to inventory (${reason}).`,
          'OMS_Inventory'
        );
      }
    }
  }

  /**
   * Commits reserved stock upon shipment completion.
   */
  public static commitStockForOrder(orderId: string, items: OrderItemDetail[], productsList: Product[]): void {
    for (const item of items) {
      const product = productsList.find((p) => p.id === item.productId);
      if (product) {
        const targetWarehouseStock = product.warehouseStock.find((w) => w.warehouseId === item.warehouseId) || product.warehouseStock[0];
        if (targetWarehouseStock) {
          targetWarehouseStock.reserved = Math.max(0, targetWarehouseStock.reserved - item.quantity);
          targetWarehouseStock.quantity = Math.max(0, targetWarehouseStock.quantity - item.quantity);
        }

        this.reservationLogs.push({
          id: `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          orderId,
          productId: item.productId,
          warehouseId: item.warehouseId || 'wh-01',
          quantity: item.quantity,
          status: 'COMMITTED',
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  public static getLogsForOrder(orderId: string): StockReservationLog[] {
    return this.reservationLogs.filter((log) => log.orderId === orderId);
  }
}
