import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise Commerce Zon Seed...');

  // 1. Create Super Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@commercezon.com' },
    update: {},
    create: {
      email: 'admin@commercezon.com',
      fullName: 'Enterprise Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      adminAccount: {
        create: {
          department: 'Executive Operations',
          clearance: 'FULL_ENTERPRISE',
        },
      },
    },
  });

  // 2. Create Seller User & Account
  const sellerUser = await prisma.user.upsert({
    where: { email: 'cybertech@commercezon.com' },
    update: {},
    create: {
      email: 'cybertech@commercezon.com',
      fullName: 'CyberTech Enterprise Solutions',
      role: 'SELLER',
      status: 'ACTIVE',
      sellerAccount: {
        create: {
          storeName: 'CyberTech Store',
          rating: 4.9,
          totalSales: 15400,
          status: 'ACTIVE',
          kycVerified: true,
        },
      },
    },
    include: { sellerAccount: true },
  });

  // 3. Create Categories
  const categoryComputing = await prisma.category.upsert({
    where: { slug: 'computing' },
    update: {},
    create: {
      name: 'Computing & AI Hardware',
      slug: 'computing',
    },
  });

  // 4. Create Brand
  const brandApex = await prisma.brand.upsert({
    where: { name: 'Apex Robotics' },
    update: {},
    create: {
      name: 'Apex Robotics',
    },
  });

  // 5. Create Warehouses
  const warehouseEast = await prisma.warehouse.upsert({
    where: { code: 'WH-US-EAST' },
    update: {},
    create: {
      code: 'WH-US-EAST',
      name: 'New York Metro Fulfillment Hub',
      city: 'Newark',
      country: 'USA',
      capacityUnits: 100000,
      utilizedUnits: 45000,
      status: 'OPERATIONAL',
    },
  });

  // 6. Create Seed Products
  await prisma.product.upsert({
    where: { sku: 'TW-X9-64GB-2TB' },
    update: {},
    create: {
      sku: 'TW-X9-64GB-2TB',
      title: 'Titan Workstation X9 Heavy Duty Laptop',
      description: 'Ultra-performance enterprise workstation with 64GB RAM, 2TB NVMe SSD, discrete AI accelerator GPU.',
      price: 2899.99,
      msrp: 3299.99,
      categoryId: categoryComputing.id,
      brandId: brandApex.id,
      sellerId: sellerUser.sellerAccount?.id,
      tags: ['laptop', 'workstation', 'ai-accelerated', 'enterprise'],
      inStock: true,
      inventories: {
        create: {
          warehouseId: warehouseEast.id,
          stockOnHand: 420,
          reservedUnits: 12,
        },
      },
    },
  });

  // 7. Create System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'PLATFORM_COMMISSION_RATE' },
    update: {},
    create: {
      key: 'PLATFORM_COMMISSION_RATE',
      value: '0.08',
      category: 'FINANCE',
    },
  });

  console.log('✅ Enterprise Commerce Zon Database Seeding Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
