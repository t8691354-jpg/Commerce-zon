import { Product, Order, Warehouse, AuditLog, DomainEvent } from '../types/domain';
import { eventBus } from './eventBus';

// --- Command Definitions ---

export interface CreateOrderCommand {
  type: 'CREATE_ORDER';
  payload: {
    items: Array<{ productId: string; quantity: number }>;
    customerName: string;
    customerEmail: string;
  };
}

export interface ReserveInventoryCommand {
  type: 'RESERVE_INVENTORY';
  payload: {
    productId: string;
    warehouseId: string;
    quantity: number;
  };
}

export interface UpdateProductPriceCommand {
  type: 'UPDATE_PRODUCT_PRICE';
  payload: {
    productId: string;
    newPriceAmount: number;
  };
}

export type Command = CreateOrderCommand | ReserveInventoryCommand | UpdateProductPriceCommand;

// --- Query Definitions ---

export interface GetProductCatalogQuery {
  type: 'GET_PRODUCT_CATALOG';
  filter?: {
    category?: string;
    maxPrice?: number;
    search?: string;
  };
}

export interface GetWarehouseStockQuery {
  type: 'GET_WAREHOUSE_STOCK';
  warehouseId?: string;
}

export interface GetAuditTrailQuery {
  type: 'GET_AUDIT_TRAIL';
  domain?: string;
}

export type Query = GetProductCatalogQuery | GetWarehouseStockQuery | GetAuditTrailQuery;

// --- CQRS Mediator Implementation ---

class CQRSService {
  // Command Dispatcher
  public async executeCommand<T = any>(command: Command, repository: { products: Product[]; warehouses: Warehouse[]; orders: Order[] }): Promise<{ success: boolean; result?: T; error?: string }> {
    switch (command.type) {
      case 'CREATE_ORDER': {
        const { items, customerName, customerEmail } = command.payload;
        let subtotal = 0;

        const orderItems = items.map((item, idx) => {
          const product = repository.products.find((p) => p.id === item.productId);
          const unitPrice = product ? product.price.amount : 100;
          const totalItemPrice = unitPrice * item.quantity;
          subtotal += totalItemPrice;

          return {
            id: `item-${Date.now()}-${idx}`,
            productId: item.productId,
            productTitle: product ? product.title : 'Marketplace Item',
            sku: product ? product.sku : 'SKU-CQRS',
            merchantId: product ? product.merchant.id : 'merch-01',
            merchantName: product ? product.merchant.name : 'Apex Merchants',
            warehouseId: product && product.warehouseStock[0] ? product.warehouseStock[0].warehouseId : 'wh-01',
            unitPrice: { amount: unitPrice, currency: 'USD' as const },
            quantity: item.quantity,
            totalPrice: { amount: totalItemPrice, currency: 'USD' as const },
          };
        });

        const tax = Math.round(subtotal * 0.08 * 100) / 100;
        const shipping = 25.0;
        const total = Math.round((subtotal + tax + shipping) * 100) / 100;

        const newOrder: Order = {
          id: `ord-cqrs-${Date.now()}`,
          orderNumber: `ORD-CQRS-${Math.floor(1000 + Math.random() * 9000)}`,
          customerId: 'usr-cqrs-buyer',
          customerName,
          customerEmail,
          items: orderItems,
          subtotal: { amount: subtotal, currency: 'USD' },
          shippingFee: { amount: shipping, currency: 'USD' },
          taxFee: { amount: tax, currency: 'USD' },
          total: { amount: total, currency: 'USD' },
          status: 'placed',
          shippingAddress: {
            address: '500 CQRS Boulevard',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA',
            latitude: 37.7749,
            longitude: -122.4194,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        repository.orders.unshift(newOrder);

        // Emit domain event via EventBus
        await eventBus.publish({
          id: `evt-cqrs-${Date.now()}`,
          eventType: 'COMMAND_CREATE_ORDER_EXECUTED',
          domain: 'ORDER',
          aggregateId: newOrder.id,
          timestamp: new Date().toISOString(),
          payload: { orderNumber: newOrder.orderNumber, totalAmount: total },
          actor: { type: 'SYSTEM', id: 'cqrs-mediator' },
        });

        return { success: true, result: newOrder as unknown as T };
      }

      case 'UPDATE_PRODUCT_PRICE': {
        const { productId, newPriceAmount } = command.payload;
        const product = repository.products.find((p) => p.id === productId);
        if (!product) return { success: false, error: 'Product not found' };

        const oldPrice = product.price.amount;
        product.price.amount = newPriceAmount;
        product.updatedAt = new Date().toISOString();

        await eventBus.publish({
          id: `evt-cqrs-${Date.now()}`,
          eventType: 'PRODUCT_PRICE_UPDATED',
          domain: 'CATALOG',
          aggregateId: product.id,
          timestamp: new Date().toISOString(),
          payload: { productId, oldPrice, newPrice: newPriceAmount },
          actor: { type: 'SYSTEM', id: 'cqrs-mediator' },
        });

        return { success: true, result: product as unknown as T };
      }

      default:
        return { success: false, error: 'Unknown command type' };
    }
  }

  // Query Dispatcher (Read Projections)
  public executeQuery<T = any>(query: Query, repository: { products: Product[]; warehouses: Warehouse[]; orders: Order[] }): T {
    switch (query.type) {
      case 'GET_PRODUCT_CATALOG': {
        let results = [...repository.products];
        if (query.filter?.category && query.filter.category !== 'all') {
          results = results.filter((p) => p.category === query.filter?.category);
        }
        if (query.filter?.maxPrice) {
          results = results.filter((p) => p.price.amount <= query.filter!.maxPrice!);
        }
        if (query.filter?.search) {
          const s = query.filter.search.toLowerCase();
          results = results.filter((p) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
        }
        return results as unknown as T;
      }

      case 'GET_WAREHOUSE_STOCK': {
        if (query.warehouseId) {
          return repository.warehouses.filter((w) => w.id === query.warehouseId) as unknown as T;
        }
        return repository.warehouses as unknown as T;
      }

      default:
        return [] as unknown as T;
    }
  }
}

export const cqrsService = new CQRSService();
