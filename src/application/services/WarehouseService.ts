import { Warehouse } from '../../types/domain';
import { IWarehouseRepository } from '../../domain/inventory/IWarehouseRepository';
import { warehouseRepository } from '../../infrastructure/repositories/WarehouseRepository';
import { logger } from '../../infrastructure/logging/Logger';

export class WarehouseService {
  constructor(private repo: IWarehouseRepository = warehouseRepository) {}

  async getAllWarehouses(): Promise<Warehouse[]> {
    logger.debug('Fetching all warehouses', 'WarehouseService');
    return this.repo.findAll();
  }

  async allocateStock(productId: string, quantity: number, preferredRegion?: string) {
    logger.info(`Allocating stock for product ${productId} (qty: ${quantity})`, 'WarehouseService');
    return this.repo.allocateStock(productId, quantity, preferredRegion);
  }
}

export const warehouseService = new WarehouseService();
