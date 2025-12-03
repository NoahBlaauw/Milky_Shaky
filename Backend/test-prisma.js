const { PrismaClient } = require('@prisma/client');

console.log('Attempting to create Prisma Client...');
console.log('PrismaClient type:', typeof PrismaClient);

try {
  const prisma = new PrismaClient();
  console.log('✅ Prisma Client created successfully!');
  prisma.$disconnect();
} catch (error) {
  console.error('❌ Error creating Prisma Client:', error.message);
  console.error('Full error:', error);
}