import { Product, ProductCategory } from '../../types/domain';
import { IProductRepository } from '../../domain/marketplace/IProductRepository';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { NotFoundError } from '../errors/AppError';
import { getPrismaClient } from '../database/prismaClient';
import { logger } from '../logging/Logger';

export class ProductRepository implements IProductRepository {
  private products: Product[] = [...MOCK_PRODUCTS];

  async findAll(): Promise<Product[]> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const dbProducts = await prisma.product.findMany({
          where: { deletedAt: null },
          include: { seller: true },
        });
        if (dbProducts.length > 0) {
          return dbProducts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.sku.toLowerCase(),
            sku: p.sku,
            description: p.description,
            category: (p.categoryId as ProductCategory) || 'computing',
            tags: p.tags,
            price: { amount: p.price, currency: 'USD' },
            rating: p.rating,
            reviewCount: p.reviewCount,
            merchant: p.seller
              ? {
                  id: p.seller.id,
                  name: p.seller.storeName,
                  code: p.seller.storeName.toUpperCase().replace(/\s+/g, '-'),
                  tier: 'flagship',
                  rating: p.seller.rating,
                  reviewCount: p.seller.totalSales,
                  isVerified: p.seller.kycVerified,
                  createdAt: p.seller.createdAt.toISOString(),
                }
              : MOCK_PRODUCTS[0].merchant,
            images: p.imageUrl ? [p.imageUrl] : MOCK_PRODUCTS[0].images,
            variants: [],
            warehouseStock: [],
            totalStock: 100,
            isArchived: false,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          }));
        }
      } catch (err) {
        logger.error('Prisma products query failed, using fallback repository state', 'ProductRepository', { error: String(err) });
      }
    }
    return [...this.products];
  }

  async findById(id: string): Promise<Product | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const p = await prisma.product.findUnique({
          where: { id },
          include: { seller: true },
        });
        if (p) {
          return {
            id: p.id,
            title: p.title,
            slug: p.sku.toLowerCase(),
            sku: p.sku,
            description: p.description,
            category: (p.categoryId as ProductCategory) || 'computing',
            tags: p.tags,
            price: { amount: p.price, currency: 'USD' },
            rating: p.rating,
            reviewCount: p.reviewCount,
            merchant: p.seller
              ? {
                  id: p.seller.id,
                  name: p.seller.storeName,
                  code: p.seller.storeName.toUpperCase().replace(/\s+/g, '-'),
                  tier: 'flagship',
                  rating: p.seller.rating,
                  reviewCount: p.seller.totalSales,
                  isVerified: p.seller.kycVerified,
                  createdAt: p.seller.createdAt.toISOString(),
                }
              : MOCK_PRODUCTS[0].merchant,
            images: p.imageUrl ? [p.imageUrl] : MOCK_PRODUCTS[0].images,
            variants: [],
            warehouseStock: [],
            totalStock: 100,
            isArchived: false,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        logger.error('Prisma findById failed', 'ProductRepository', { error: String(err) });
      }
    }
    const p = this.products.find((item) => item.id === id);
    return p ? { ...p } : null;
  }

  async search(query: string, category?: string): Promise<Product[]> {
    const all = await this.findAll();
    const q = query.toLowerCase().trim();
    return all.filter((p) => {
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCategory = !category || category === 'All' || p.category.toLowerCase() === category.toLowerCase();
      return matchQuery && matchCategory;
    });
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    this.products.unshift(newProduct);
    return { ...newProduct };
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundError(`Product with ID ${id} not found`);
    this.products[index] = { ...this.products[index], ...updates };
    return { ...this.products[index] };
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLength;
  }
}

export const productRepository = new ProductRepository();
