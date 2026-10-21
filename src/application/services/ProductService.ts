import { Product } from '../../types/domain';
import { IProductRepository } from '../../domain/marketplace/IProductRepository';
import { productRepository } from '../../infrastructure/repositories/ProductRepository';
import { logger } from '../../infrastructure/logging/Logger';

export class ProductService {
  constructor(private repo: IProductRepository = productRepository) {}

  async getAllProducts(): Promise<Product[]> {
    logger.debug('Fetching all products', 'ProductService');
    return this.repo.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    logger.debug(`Fetching product by ID ${id}`, 'ProductService');
    return this.repo.findById(id);
  }

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    logger.info(`Searching products with query="${query}" category="${category || 'All'}"`, 'ProductService');
    return this.repo.search(query, category);
  }

  async addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    logger.audit(`Adding new product "${productData.title}"`, 'ProductService');
    return this.repo.create(productData);
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    logger.audit(`Updating product ID ${id}`, 'ProductService');
    return this.repo.update(id, updates);
  }

  async deleteProduct(id: string): Promise<boolean> {
    logger.audit(`Deleting product ID ${id}`, 'ProductService');
    return this.repo.delete(id);
  }
}

export const productService = new ProductService();
