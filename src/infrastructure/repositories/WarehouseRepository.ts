import { Warehouse } from '../../types/domain';
import { IWarehouseRepository } from '../../domain/inventory/IWarehouseRepository';
import { MOCK_WAREHOUSES } from '../../data/mockData';

export class WarehouseRepository implements IWarehouseRepository {
  private warehouses: Warehouse[] = [...MOCK_WAREHOUSES];

  async findAll(): Promise<Warehouse[]> {
    return [...this.warehouses];
  }

  async findById(id: string): Promise<Warehouse | null> {
    const w = this.warehouses.find((item) => item.id === id);
    return w ? { ...w } : null;
  }

  async allocateStock(productId: string, quantity: number, preferredRegion?: string): Promise<{ warehouseId: string; allocated: number }> {
    let target = this.warehouses.find(
      (w) => preferredRegion && w.location.city.toLowerCase().includes(preferredRegion.toLowerCase()) && w.capacityUnits - w.utilizedUnits >= quantity
    );
    if (!target) {
      target = this.warehouses.find((w) => w.capacityUnits - w.utilizedUnits >= quantity) || this.warehouses[0];
    }
    if (target) {
      target.utilizedUnits += quantity;
      return { warehouseId: target.id, allocated: quantity };
    }
    return { warehouseId: 'wh-01', allocated: quantity };
  }
}

export const warehouseRepository = new WarehouseRepository();
