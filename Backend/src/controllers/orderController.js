const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendOrderConfirmation } = require('../utils/emailService');

// ============================================
// HELPER: Calculate Discount for User
// ============================================
const calculateDiscount = async (userId, subtotal) => {
  try {
    // Get config
    const config = await prisma.config.findFirst();
    
    // Get user's past PAID orders
    const pastOrders = await prisma.order.findMany({
      where: {
        userId,
        isPaid: true
      },
      include: {
        drinks: true
      }
    });

    // Count qualifying orders for each tier
    const tier1Orders = pastOrders.filter(order => order.drinks.length >= config.discountTier1MinDrinks);
    const tier2Orders = pastOrders.filter(order => order.drinks.length >= config.discountTier2MinDrinks);
    const tier3Orders = pastOrders.filter(order => order.drinks.length >= config.discountTier3MinDrinks);

    let discountPercentage = 0;
    let tier = 0;

    // Check tier 3 first (highest)
    if (tier3Orders.length >= config.discountTier3Orders) {
      discountPercentage = 15;
      tier = 3;
    }
    // Check tier 2
    else if (tier2Orders.length >= config.discountTier2Orders) {
      discountPercentage = 10;
      tier = 2;
    }
    // Check tier 1
    else if (tier1Orders.length >= config.discountTier1Orders) {
      discountPercentage = 5;
      tier = 1;
    }

    // Calculate discount amount
    let discountAmount = (subtotal * discountPercentage) / 100;

    // Apply max discount cap
    if (discountAmount > config.maxDiscountAmount) {
      discountAmount = config.maxDiscountAmount;
    }

    return {
      discountPercentage,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      tier,
      qualifyingOrders: tier === 3 ? tier3Orders.length : tier === 2 ? tier2Orders.length : tier1Orders.length
    };

  } catch (error) {
    console.error('❌ Error calculating discount:', error);
    return {
      discountPercentage: 0,
      discountAmount: 0,
      tier: 0,
      qualifyingOrders: 0
    };
  }
};

// ============================================
// CALCULATE ORDER PRICE (Before Creating)
// ============================================
const calculateOrderPrice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { drinks } = req.body;

    if (!drinks || !Array.isArray(drinks) || drinks.length === 0) {
      return res.status(400).json({ error: 'Drinks array is required' });
    }

    // Get config for VAT
    const config = await prisma.config.findFirst();

    // Validate number of drinks
    if (drinks.length > config.maxDrinks) {
      return res.status(400).json({ 
        error: `Maximum ${config.maxDrinks} drinks allowed per order` 
      });
    }

    // Calculate each drink's price
    const drinkPrices = [];
    let subtotal = 0;

    for (const drink of drinks) {
      const { flavourId, toppingId, consistencyId } = drink;

      // Get prices from database
      const [flavour, topping, consistency] = await Promise.all([
        prisma.flavour.findUnique({ where: { id: parseInt(flavourId) } }),
        prisma.topping.findUnique({ where: { id: parseInt(toppingId) } }),
        prisma.consistency.findUnique({ where: { id: parseInt(consistencyId) } })
      ]);

      if (!flavour || !topping || !consistency) {
        return res.status(400).json({ 
          error: 'Invalid flavour, topping, or consistency ID' 
        });
      }

      // Calculate drink price
      const drinkPrice = flavour.fee + topping.fee + consistency.fee;
      drinkPrices.push({
        flavour: flavour.name,
        topping: topping.name,
        consistency: consistency.name,
        price: parseFloat(drinkPrice.toFixed(2))
      });

      subtotal += drinkPrice;
    }

    // Calculate discount
    const discount = await calculateDiscount(userId, subtotal);

    // Calculate total after discount
    const subtotalAfterDiscount = subtotal - discount.discountAmount;

    // Calculate VAT
    const vatAmount = (subtotalAfterDiscount * config.vatPercentage) / 100;

    // Calculate final total
    const totalAmount = subtotalAfterDiscount + vatAmount;

    res.json({
      drinks: drinkPrices,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: {
        percentage: discount.discountPercentage,
        amount: discount.discountAmount,
        tier: discount.tier,
        qualifyingOrders: discount.qualifyingOrders
      },
      subtotalAfterDiscount: parseFloat(subtotalAfterDiscount.toFixed(2)),
      vat: {
        percentage: config.vatPercentage,
        amount: parseFloat(vatAmount.toFixed(2))
      },
      totalAmount: parseFloat(totalAmount.toFixed(2))
    });

    console.log(`✅ Price calculated for user ${userId}: R${totalAmount.toFixed(2)}`);

  } catch (error) {
    console.error('❌ Error calculating price:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
};

// ============================================
// CREATE ORDER
// ============================================
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { drinks, pickUpLocation, pickUpTime } = req.body;

    // Validate input
    if (!drinks || !Array.isArray(drinks) || drinks.length === 0) {
      return res.status(400).json({ error: 'Drinks array is required' });
    }

    if (!pickUpLocation || !pickUpTime) {
      return res.status(400).json({ 
        error: 'Pick up location and time are required' 
      });
    }

    // Get config
    const config = await prisma.config.findFirst();

    if (drinks.length > config.maxDrinks) {
      return res.status(400).json({ 
        error: `Maximum ${config.maxDrinks} drinks allowed per order` 
      });
    }

    // Calculate prices (same logic as calculateOrderPrice)
    let subtotal = 0;
    const drinkData = [];

    for (const drink of drinks) {
      const { flavourId, toppingId, consistencyId } = drink;

      const [flavour, topping, consistency] = await Promise.all([
        prisma.flavour.findUnique({ where: { id: parseInt(flavourId) } }),
        prisma.topping.findUnique({ where: { id: parseInt(toppingId) } }),
        prisma.consistency.findUnique({ where: { id: parseInt(consistencyId) } })
      ]);

      if (!flavour || !topping || !consistency) {
        return res.status(400).json({ 
          error: 'Invalid flavour, topping, or consistency ID' 
        });
      }

      const drinkPrice = flavour.fee + topping.fee + consistency.fee;
      subtotal += drinkPrice;

      drinkData.push({
        flavourId: parseInt(flavourId),
        toppingId: parseInt(toppingId),
        consistencyId: parseInt(consistencyId),
        price: parseFloat(drinkPrice.toFixed(2))
      });
    }

    // Calculate discount
    const discount = await calculateDiscount(userId, subtotal);
    const subtotalAfterDiscount = subtotal - discount.discountAmount;

    // Calculate VAT
    const vatAmount = (subtotalAfterDiscount * config.vatPercentage) / 100;

    // Calculate total
    const totalAmount = subtotalAfterDiscount + vatAmount;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        pickUpLocation,
        pickUpTime: new Date(pickUpTime),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        vatAmount: parseFloat(vatAmount.toFixed(2)),
        discountApplied: discount.discountAmount,
        isPaid: false, // Will be set to true after PayFast payment
        drinks: {
          create: drinkData
        }
      },
      include: {
        drinks: {
          include: {
            flavour: true,
            topping: true,
            consistency: true
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'CREATE_ORDER',
        field: 'Order',
        oldValue: null,
        newValue: `Order #${order.id} - R${totalAmount.toFixed(2)}`
      }
    });

// Send order confirmation email
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const emailResult = await sendOrderConfirmation(user, order);
    
    if (emailResult.success) {
      console.log(`📧 Order confirmation email sent to ${user.email}`);
    } else {
      console.log(`⚠️ Failed to send order confirmation email: ${emailResult.error}`);
    }

    res.status(201).json({
      message: 'Order created successfully',
      emailSent: emailResult.success,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        vatAmount: order.vatAmount,
        discountApplied: order.discountApplied,
        pickUpLocation: order.pickUpLocation,
        pickUpTime: order.pickUpTime,
        isPaid: order.isPaid,
        drinks: order.drinks
      }
    });

    console.log(`✅ Order created: #${order.id} for user ${userId}`);

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ============================================
// GET USER'S ORDERS (Patron's own orders)
// ============================================
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        drinks: {
          include: {
            flavour: true,
            topping: true,
            consistency: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      orders,
      totalOrders: orders.length
    });

    console.log(`✅ Retrieved ${orders.length} orders for user ${userId}`);

  } catch (error) {
    console.error('❌ Error getting user orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// ============================================
// GET ALL ORDERS (Manager only)
// ============================================
const getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate, isPaid } = req.query;

    const where = {};

    // Filter by date range
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Filter by payment status
    if (isPaid !== undefined) {
      where.isPaid = isPaid === 'true';
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            email: true
          }
        },
        drinks: {
          include: {
            flavour: true,
            topping: true,
            consistency: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      orders,
      totalOrders: orders.length
    });

    console.log(`✅ Manager retrieved ${orders.length} orders`);

  } catch (error) {
    console.error('❌ Error getting all orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// ============================================
// GET ORDER BY ID
// ============================================
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            email: true
          }
        },
        drinks: {
          include: {
            flavour: true,
            topping: true,
            consistency: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (userRole !== 'manager' && order.userId !== userId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only view your own orders.' 
      });
    }

    res.json({ order });

    console.log(`✅ Retrieved order #${id}`);

  } catch (error) {
    console.error('❌ Error getting order:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
};

// ============================================
// GET ORDER VOLUME BY DAY OF WEEK (Manager)
// ============================================
const getOrderVolumeByDayOfWeek = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { isPaid: true },
      select: {
        createdAt: true,
        drinks: true
      }
    });

    // Initialize day counts
    const dayOfWeek = {
      Sunday: { orders: 0, drinks: 0 },
      Monday: { orders: 0, drinks: 0 },
      Tuesday: { orders: 0, drinks: 0 },
      Wednesday: { orders: 0, drinks: 0 },
      Thursday: { orders: 0, drinks: 0 },
      Friday: { orders: 0, drinks: 0 },
      Saturday: { orders: 0, drinks: 0 }
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Count orders by day
    orders.forEach(order => {
      const day = days[order.createdAt.getDay()];
      dayOfWeek[day].orders += 1;
      dayOfWeek[day].drinks += order.drinks.length;
    });

    res.json({ dayOfWeek });

    console.log('✅ Order volume by day of week calculated');

  } catch (error) {
    console.error('❌ Error calculating order volume:', error);
    res.status(500).json({ error: 'Failed to calculate order volume' });
  }
};

module.exports = {
  calculateOrderPrice,
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  getOrderVolumeByDayOfWeek
};