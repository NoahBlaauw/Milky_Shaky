const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - helps with re-running seed)
  await prisma.orderDrink.deleteMany();
  await prisma.order.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.config.deleteMany();
  await prisma.flavour.deleteMany();
  await prisma.topping.deleteMany();
  await prisma.consistency.deleteMany();
  console.log('✅ Cleared existing data');

  // 1. Create Config
  const config = await prisma.config.create({
    data: {
      maxDrinks: 10,
      vatPercentage: 15.0,
      discountTier1Orders: 3,
      discountTier1MinDrinks: 2,
      discountTier2Orders: 5,
      discountTier2MinDrinks: 3,
      discountTier3Orders: 10,
      discountTier3MinDrinks: 4,
      maxDiscountAmount: 50.0
    }
  });
  console.log('✅ Config created');

  // 2. Create Flavours
  const strawberry = await prisma.flavour.create({ data: { name: 'Strawberry', fee: 25.0 } });
  const vanilla = await prisma.flavour.create({ data: { name: 'Vanilla', fee: 20.0 } });
  const chocolate = await prisma.flavour.create({ data: { name: 'Chocolate', fee: 25.0 } });
  const coffee = await prisma.flavour.create({ data: { name: 'Coffee', fee: 30.0 } });
  const banana = await prisma.flavour.create({ data: { name: 'Banana', fee: 22.0 } });
  const oreo = await prisma.flavour.create({ data: { name: 'Oreo', fee: 35.0 } });
  const barone = await prisma.flavour.create({ data: { name: 'Bar One', fee: 35.0 } });
  console.log('✅ Flavours created');

  // 3. Create Toppings
  const frozenStrawberries = await prisma.topping.create({ data: { name: 'Frozen Strawberries', fee: 10.0 } });
  const freezeDriedBanana = await prisma.topping.create({ data: { name: 'Freeze-dried Banana', fee: 12.0 } });
  const oreoCrumbs = await prisma.topping.create({ data: { name: 'Oreo Crumbs', fee: 15.0 } });
  const barOneSyrup = await prisma.topping.create({ data: { name: 'Bar One Syrup', fee: 15.0 } });
  const coffeePowder = await prisma.topping.create({ data: { name: 'Coffee Powder with Chocolate', fee: 18.0 } });
  const chocolateVermicelli = await prisma.topping.create({ data: { name: 'Chocolate Vermicelli', fee: 12.0 } });
  console.log('✅ Toppings created');

  // 4. Create Consistencies
  const doubleThick = await prisma.consistency.create({ data: { name: 'Double Thick', fee: 15.0 } });
  const thick = await prisma.consistency.create({ data: { name: 'Thick', fee: 10.0 } });
  const milky = await prisma.consistency.create({ data: { name: 'Milky', fee: 5.0 } });
  const icy = await prisma.consistency.create({ data: { name: 'Icy', fee: 8.0 } });
  console.log('✅ Consistencies created');

  // 5. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const manager = await prisma.user.create({
    data: {
      firstname: 'Manager John',
      email: 'manager@milkyshaky.com',
      mobile: '0821234567',
      password: hashedPassword,
      role: 'manager'
    }
  });

  const patron1 = await prisma.user.create({
    data: {
      firstname: 'Sarah',
      email: 'sarah@example.com',
      mobile: '0827654321',
      password: hashedPassword,
      role: 'patron'
    }
  });

  const patron2 = await prisma.user.create({
    data: {
      firstname: 'Mike',
      email: 'mike@example.com',
      mobile: '0829876543',
      password: hashedPassword,
      role: 'patron'
    }
  });
  console.log('✅ Users created (password: password123)');

  // 6. Create sample orders for patron1 (to test discount tiers)
  const order1 = await prisma.order.create({
    data: {
      userId: patron1.id,
      pickUpLocation: 'Main Street Branch',
      pickUpTime: new Date('2025-12-01T14:00:00'),
      totalAmount: 57.5,
      vatAmount: 7.5,
      discountApplied: 0,
      isPaid: true,
      drinks: {
        create: {
          flavourId: strawberry.id,
          toppingId: frozenStrawberries.id,
          consistencyId: doubleThick.id,
          price: 50.0
        }
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      userId: patron1.id,
      pickUpLocation: 'Main Street Branch',
      pickUpTime: new Date('2025-12-02T15:00:00'),
      totalAmount: 69.0,
      vatAmount: 9.0,
      discountApplied: 0,
      isPaid: true,
      drinks: {
        create: [
          {
            flavourId: vanilla.id,
            toppingId: freezeDriedBanana.id,
            consistencyId: thick.id,
            price: 30.0
          },
          {
            flavourId: chocolate.id,
            toppingId: oreoCrumbs.id,
            consistencyId: milky.id,
            price: 30.0
          }
        ]
      }
    }
  });
  console.log('✅ Sample orders created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });