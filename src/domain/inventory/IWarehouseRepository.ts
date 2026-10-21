import { Warehouse } from '../../types/domain';

export interface IWarehouseRepository {
  findAll(): Promise<Warehouse[]>;
  findById(id: string): Promise<Warehouse | null>;
  allocateStock(productId: string, quantity: number, preferredRegion?: string): Promise<{ warehouseId: string; allocated: number }>;
}
