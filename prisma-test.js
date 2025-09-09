// prisma-test.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Prisma OK');
  } catch (e) {
    console.error('Prisma FAIL', e);
  } finally {
    await prisma.$disconnect();
  }
})();
