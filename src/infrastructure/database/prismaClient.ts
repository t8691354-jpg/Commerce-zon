import { PrismaClient } from '@prisma/client';
import { logger } from '../logging/Logger';

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  if (process.env.DATABASE_URL) {
    if (!prismaInstance) {
      try {
        prismaInstance = new PrismaClient();
        logger.info('Prisma Database Client initialized with PostgreSQL connection', 'PrismaClient');
      } catch (err) {
        logger.error('Failed to initialize Prisma Client', 'PrismaClient', { error: String(err) });
        prismaInstance = null;
      }
    }
    return prismaInstance;
  }
  return null;
}
