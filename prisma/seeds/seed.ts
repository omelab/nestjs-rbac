// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashData } from '../../src/common/helper/hashData';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy users
  const password = await hashData('123456');

  const permission = await prisma.permission.upsert({
    where: { name: 'user-create' },
    update: {
      name: 'user_create',
    },
    create: {
      name: 'user_create',
      moduleName: 'user',
    },
  });

  const role = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      name: 'admin',
    },
    create: {
      name: 'admin',
      description: 'this role for super admin',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      password: password,
    },
    create: {
      username: 'admin',
      email: 'admin@gmail.com',
      name: 'Admin',
      password: password,
      //   roles: [1],
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: 'operator@gmail.com' },
    update: {
      password: password,
    },
    create: {
      username: 'sabin',
      email: 'operator@gmail.com',
      name: 'Operator',
      password: password,
      //   roles: [1],
    },
  });

  console.log({ permission, admin, operator, role });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
