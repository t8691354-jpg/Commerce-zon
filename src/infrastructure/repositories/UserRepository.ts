import { IUserRepository, UserEntity } from '../../domain/users/IUserRepository';
import { getPrismaClient } from '../database/prismaClient';
import { logger } from '../logging/Logger';

export class UserRepository implements IUserRepository {
  private inMemoryUsers: UserEntity[] = [
    { id: 'usr-01', email: 'admin@commercezon.com', fullName: 'Super Admin', role: 'SUPER_ADMIN', status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: 'usr-02', email: 'seller@cybertech.com', fullName: 'CyberTech Store Manager', role: 'SELLER', status: 'ACTIVE', createdAt: new Date().toISOString() },
    { id: 'usr-03', email: 'buyer@commercezon.com', fullName: 'Alex Buyer', role: 'BUYER', status: 'ACTIVE', createdAt: new Date().toISOString() },
  ];

  async findAll(): Promise<UserEntity[]> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const users = await prisma.user.findMany({ where: { deletedAt: null } });
        return users.map((u) => ({
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          role: u.role as UserEntity['role'],
          status: u.status as UserEntity['status'],
          createdAt: u.createdAt.toISOString(),
        }));
      } catch (err) {
        logger.error('Prisma query failed, falling back to in-memory users', 'UserRepository', { error: String(err) });
      }
    }
    return [...this.inMemoryUsers];
  }

  async findById(id: string): Promise<UserEntity | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const u = await prisma.user.findUnique({ where: { id } });
        if (u) {
          return {
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            role: u.role as UserEntity['role'],
            status: u.status as UserEntity['status'],
            createdAt: u.createdAt.toISOString(),
          };
        }
      } catch (err) {
        logger.error('Prisma query failed', 'UserRepository', { error: String(err) });
      }
    }
    return this.inMemoryUsers.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const u = await prisma.user.findUnique({ where: { email } });
        if (u) {
          return {
            id: u.id,
            email: u.email,
            fullName: u.fullName,
            role: u.role as UserEntity['role'],
            status: u.status as UserEntity['status'],
            createdAt: u.createdAt.toISOString(),
          };
        }
      } catch (err) {
        logger.error('Prisma query failed', 'UserRepository', { error: String(err) });
      }
    }
    return this.inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async create(user: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const created = await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
          },
        });
        return {
          id: created.id,
          email: created.email,
          fullName: created.fullName,
          role: created.role as UserEntity['role'],
          status: created.status as UserEntity['status'],
          createdAt: created.createdAt.toISOString(),
        };
      } catch (err) {
        logger.error('Prisma user creation failed', 'UserRepository', { error: String(err) });
      }
    }
    const newUser: UserEntity = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.inMemoryUsers.push(newUser);
    return newUser;
  }

  async updateStatus(id: string, status: UserEntity['status']): Promise<UserEntity | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const updated = await prisma.user.update({
          where: { id },
          data: { status },
        });
        return {
          id: updated.id,
          email: updated.email,
          fullName: updated.fullName,
          role: updated.role as UserEntity['role'],
          status: updated.status as UserEntity['status'],
          createdAt: updated.createdAt.toISOString(),
        };
      } catch (err) {
        logger.error('Prisma status update failed', 'UserRepository', { error: String(err) });
      }
    }
    const u = this.inMemoryUsers.find((user) => user.id === id);
    if (u) {
      u.status = status;
      return { ...u };
    }
    return null;
  }
}

export const userRepository = new UserRepository();
