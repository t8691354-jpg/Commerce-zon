import { Warehouse, Product, Location, DomainEvent } from '../types/domain';
import { eventBus } from './eventBus';

export interface AllocationResultItem {
  productId: string;
  sku: string;
  productTitle: string;
  requestedQuantity: number;
  allocatedWarehouseId: string;
  allocatedWarehouseName: string;
  allocatedWarehouseCode: string;
  fulfillmentDistanceKm: number;
  estimatedDeliveryDays: number;
  isSplitFulfillment: boolean;
  stockRemainingInWarehouse: number;
}

export interface AllocationPlan {
  orderId?: string;
  allocations: AllocationResultItem[];
  totalDistanceKm: number;
  estimatedDaysMax: number;
  isMultiWarehouseSplit: boolean;
  warnings: string[];
}

// Calculate Haversine distance between two coordinates in kilometers
function calculateDistanceKm(loc1: Location, loc2: Location): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.latitude * Math.PI) / 180) *
      Math.cos((loc2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export class StockAllocationEngine {
  /**
   * Calculates optimal warehouse allocation for an array of requested order items
   */
  public allocateOrderStock(
    items: { productId: string; quantity: number }[],
    destination: Location,
    products: Product[],
    warehouses: Warehouse[]
  ): AllocationPlan {
    const allocations: AllocationResultItem[] = [];
    const warnings: string[] = [];
    let totalDistanceKm = 0;
    let estimatedDaysMax = 1;
    const warehouseUsedIds = new Set<string>();

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        warnings.push(`Product ID ${item.productId} not found in catalog.`);
        continue;
      }

      // Filter warehouses that have available unreserved stock for this product
      const candidateWarehouses = product.warehouseStock
        .map((stockInfo) => {
          const whDetail = warehouses.find((w) => w.id === stockInfo.warehouseId);
          const availableStock = stockInfo.quantity - stockInfo.reserved;
          const dist = whDetail ? calculateDistanceKm(whDetail.location, destination) : 9999;
          return {
            stockInfo,
            whDetail,
            availableStock,
            distanceKm: dist,
          };
        })
        .filter((c) => c.availableStock > 0);

      // Sort candidate warehouses by nearest distance first
      candidateWarehouses.sort((a, b) => a.distanceKm - b.distanceKm);

      if (candidateWarehouses.length === 0) {
        warnings.push(`Insufficient stock available for ${product.title} across all warehouses.`);
        continue;
      }

      // Check if nearest warehouse can fulfill full quantity
      const nearestFullWH = candidateWarehouses.find((c) => c.availableStock >= item.quantity);

      if (nearestFullWH && nearestFullWH.whDetail) {
        // Single warehouse full fulfillment
        const days = nearestFullWH.distanceKm > 3000 ? 3 : nearestFullWH.distanceKm > 1000 ? 2 : 1;
        allocations.push({
          productId: product.id,
          sku: product.sku,
          productTitle: product.title,
          requestedQuantity: item.quantity,
          allocatedWarehouseId: nearestFullWH.whDetail.id,
          allocatedWarehouseName: nearestFullWH.whDetail.name,
          allocatedWarehouseCode: nearestFullWH.whDetail.code,
          fulfillmentDistanceKm: nearestFullWH.distanceKm,
          estimatedDeliveryDays: days,
          isSplitFulfillment: false,
          stockRemainingInWarehouse: nearestFullWH.availableStock - item.quantity,
        });

        totalDistanceKm += nearestFullWH.distanceKm;
        if (days > estimatedDaysMax) estimatedDaysMax = days;
        warehouseUsedIds.add(nearestFullWH.whDetail.id);
      } else {
        // Split order fulfillment across multiple candidate warehouses
        let remainingQty = item.quantity;
        for (const candidate of candidateWarehouses) {
          if (remainingQty <= 0) break;
          if (!candidate.whDetail) continue;

          const qtyToTake = Math.min(remainingQty, candidate.availableStock);
          const days = candidate.distanceKm > 3000 ? 3 : candidate.distanceKm > 1000 ? 2 : 1;

          allocations.push({
            productId: product.id,
            sku: product.sku,
            productTitle: product.title,
            requestedQuantity: qtyToTake,
            allocatedWarehouseId: candidate.whDetail.id,
            allocatedWarehouseName: candidate.whDetail.name,
            allocatedWarehouseCode: candidate.whDetail.code,
            fulfillmentDistanceKm: candidate.distanceKm,
            estimatedDeliveryDays: days,
            isSplitFulfillment: true,
            stockRemainingInWarehouse: candidate.availableStock - qtyToTake,
          });

          remainingQty -= qtyToTake;
          totalDistanceKm += candidate.distanceKm;
          if (days > estimatedDaysMax) estimatedDaysMax = days;
          warehouseUsedIds.add(candidate.whDetail.id);
        }

        if (remainingQty > 0) {
          warnings.push(`Partial stock allocation for ${product.title}: Short by ${remainingQty} units.`);
        }
      }
    }

    const isMultiWarehouseSplit = warehouseUsedIds.size > 1;

    // Publish Allocation Event to Domain Event Bus
    eventBus.publish({
      id: `evt-alloc-${Date.now()}`,
      eventType: isMultiWarehouseSplit ? 'STOCK_SPLIT_ROUTED' : 'INVENTORY_ALLOCATED',
      domain: 'INVENTORY',
      aggregateId: `plan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payload: {
        totalItemsAllocated: allocations.length,
        warehousesUtilized: Array.from(warehouseUsedIds),
        totalDistanceKm,
        isMultiWarehouseSplit,
        warnings,
      },
      actor: { type: 'SYSTEM', id: 'stock-allocation-engine' },
    });

    return {
      allocations,
      totalDistanceKm,
      estimatedDaysMax,
      isMultiWarehouseSplit,
      warnings,
    };
  }
}

export const stockAllocationEngine = new StockAllocationEngine();
