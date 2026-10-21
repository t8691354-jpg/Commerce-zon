import { Product } from '../../types/domain';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  search(query: string, category?: string): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: string, updates: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
