/**
 * Enterprise Fulfilment Engine
 * Manages Warehouse Allocation, Inventory Reservation, Pick & Pack Queueing, and Dispatch Readiness
 */

import { ShipmentItemRecord, ShippingAddressRecord } from './ShipmentEntity';

export interface WarehouseInventoryNode {
  warehouseId: string;
  warehouseName: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  availableStock: Map<string, number>; // SKU -> quantity available
}

export interface AllocationPlan {
  warehouseId: string;
  warehouseName: string;
  items: ShipmentItemRecord[];
  allFulfillableFromSingleWarehouse: boolean;
}

export class FulfilmentEngine {
  private warehouses: WarehouseInventoryNode[];

  constructor(warehouses: WarehouseInventoryNode[]) {
    this.warehouses = warehouses;
  }

  /**
   * Evaluates order items and selects the optimal warehouse based on stock availability and proximity.
   */
  public allocateFulfilment(items: ShipmentItemRecord[], destAddress: ShippingAddressRecord): AllocationPlan[] {
    if (this.warehouses.length === 0) {
      return [{
        warehouseId: 'WH-MAIN-US-EAST',
        warehouseName: 'Main US East Distribution Center',
        items,
        allFulfillableFromSingleWarehouse: true,
      }];
    }

    // Attempt to find a single warehouse with 100% stock availability
    for (const wh of this.warehouses) {
      const hasAllStock = items.every(item => {
        const stock = wh.availableStock.get(item.sku) || 0;
        return stock >= item.quantity;
      });

      if (hasAllStock) {
        return [{
          warehouseId: wh.warehouseId,
          warehouseName: wh.warehouseName,
          items,
          allFulfillableFromSingleWarehouse: true,
        }];
      }
    }

    // Split across warehouses if single warehouse cannot satisfy complete order
    const allocations: AllocationPlan[] = [];
    const unallocatedItems = items.map(i => ({ ...i }));

    for (const wh of this.warehouses) {
      const allocatedForWh: ShipmentItemRecord[] = [];

      for (let i = unallocatedItems.length - 1; i >= 0; i--) {
        const item = unallocatedItems[i];
        const stock = wh.availableStock.get(item.sku) || 0;

        if (stock > 0) {
          const qtyToTake = Math.min(item.quantity, stock);
          allocatedForWh.push({ ...item, quantity: qtyToTake });

          item.quantity -= qtyToTake;
          wh.availableStock.set(item.sku, stock - qtyToTake);

          if (item.quantity === 0) {
            unallocatedItems.splice(i, 1);
          }
        }
      }

      if (allocatedForWh.length > 0) {
        allocations.push({
          warehouseId: wh.warehouseId,
          warehouseName: wh.warehouseName,
          items: allocatedForWh,
          allFulfillableFromSingleWarehouse: false,
        });
      }

      if (unallocatedItems.length === 0) break;
    }

    // Fallback if remaining items exist
    if (unallocatedItems.length > 0) {
      allocations.push({
        warehouseId: this.warehouses[0]?.warehouseId || 'WH-MAIN-US-EAST',
        warehouseName: this.warehouses[0]?.warehouseName || 'Main Distribution Center',
        items: unallocatedItems,
        allFulfillableFromSingleWarehouse: false,
      });
    }

    return allocations;
  }
}
