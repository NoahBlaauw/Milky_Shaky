const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to create audit log
const createAuditLog = async (userId, action, field, oldValue, newValue) => {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      field,
      oldValue: oldValue ? String(oldValue) : null,
      newValue: newValue ? String(newValue) : null
    }
  });
};

// ============================================
// GET ALL LOOKUPS
// ============================================
const getAllLookups = async (req, res) => {
  try {
    const [flavours, toppings, consistencies, config] = await Promise.all([
      prisma.flavour.findMany({ orderBy: { name: 'asc' } }),
      prisma.topping.findMany({ orderBy: { name: 'asc' } }),
      prisma.consistency.findMany({ orderBy: { name: 'asc' } }),
      prisma.config.findFirst()
    ]);

    res.json({
      flavours,
      toppings,
      consistencies,
      config
    });

    console.log('✅ Lookups retrieved');
  } catch (error) {
    console.error('❌ Error getting lookups:', error);
    res.status(500).json({ error: 'Failed to retrieve lookups' });
  }
};

// ============================================
// CREATE FLAVOUR
// ============================================
const createFlavour = async (req, res) => {
  try {
    const { name, fee } = req.body;
    const userId = req.user.userId;

    if (!name || fee === undefined) {
      return res.status(400).json({ error: 'Name and fee are required' });
    }

    const flavour = await prisma.flavour.create({
      data: { name, fee: parseFloat(fee) }
    });

    // Log the creation
    await createAuditLog(
      userId,
      'CREATE_FLAVOUR',
      'Flavour',
      null,
      `${name} (R${fee})`
    );

    res.status(201).json({
      message: 'Flavour created successfully',
      flavour
    });

    console.log(`✅ Flavour created: ${name}`);
  } catch (error) {
    console.error('❌ Error creating flavour:', error);
    res.status(500).json({ error: 'Failed to create flavour' });
  }
};

// ============================================
// UPDATE FLAVOUR
// ============================================
const updateFlavour = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fee } = req.body;
    const userId = req.user.userId;

    // Get old values for audit
    const oldFlavour = await prisma.flavour.findUnique({
      where: { id: parseInt(id) }
    });

    if (!oldFlavour) {
      return res.status(404).json({ error: 'Flavour not found' });
    }

    // Update flavour
    const updatedFlavour = await prisma.flavour.update({
      where: { id: parseInt(id) },
      data: {
        name: name || oldFlavour.name,
        fee: fee !== undefined ? parseFloat(fee) : oldFlavour.fee
      }
    });

    // Log changes
    if (name && name !== oldFlavour.name) {
      await createAuditLog(
        userId,
        'UPDATE_FLAVOUR',
        'name',
        oldFlavour.name,
        name
      );
    }

    if (fee !== undefined && parseFloat(fee) !== oldFlavour.fee) {
      await createAuditLog(
        userId,
        'UPDATE_FLAVOUR',
        'fee',
        oldFlavour.fee,
        fee
      );
    }

    res.json({
      message: 'Flavour updated successfully',
      flavour: updatedFlavour
    });

    console.log(`✅ Flavour updated: ${updatedFlavour.name}`);
  } catch (error) {
    console.error('❌ Error updating flavour:', error);
    res.status(500).json({ error: 'Failed to update flavour' });
  }
};

// ============================================
// DELETE FLAVOUR
// ============================================
const deleteFlavour = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const flavour = await prisma.flavour.findUnique({
      where: { id: parseInt(id) }
    });

    if (!flavour) {
      return res.status(404).json({ error: 'Flavour not found' });
    }

    await prisma.flavour.delete({
      where: { id: parseInt(id) }
    });

    // Log deletion
    await createAuditLog(
      userId,
      'DELETE_FLAVOUR',
      'Flavour',
      `${flavour.name} (R${flavour.fee})`,
      null
    );

    res.json({
      message: 'Flavour deleted successfully'
    });

    console.log(`✅ Flavour deleted: ${flavour.name}`);
  } catch (error) {
    console.error('❌ Error deleting flavour:', error);
    res.status(500).json({ error: 'Failed to delete flavour' });
  }
};

// ============================================
// CREATE TOPPING
// ============================================
const createTopping = async (req, res) => {
  try {
    const { name, fee } = req.body;
    const userId = req.user.userId;

    if (!name || fee === undefined) {
      return res.status(400).json({ error: 'Name and fee are required' });
    }

    const topping = await prisma.topping.create({
      data: { name, fee: parseFloat(fee) }
    });

    await createAuditLog(
      userId,
      'CREATE_TOPPING',
      'Topping',
      null,
      `${name} (R${fee})`
    );

    res.status(201).json({
      message: 'Topping created successfully',
      topping
    });

    console.log(`✅ Topping created: ${name}`);
  } catch (error) {
    console.error('❌ Error creating topping:', error);
    res.status(500).json({ error: 'Failed to create topping' });
  }
};

// ============================================
// UPDATE TOPPING
// ============================================
const updateTopping = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fee } = req.body;
    const userId = req.user.userId;

    const oldTopping = await prisma.topping.findUnique({
      where: { id: parseInt(id) }
    });

    if (!oldTopping) {
      return res.status(404).json({ error: 'Topping not found' });
    }

    const updatedTopping = await prisma.topping.update({
      where: { id: parseInt(id) },
      data: {
        name: name || oldTopping.name,
        fee: fee !== undefined ? parseFloat(fee) : oldTopping.fee
      }
    });

    if (name && name !== oldTopping.name) {
      await createAuditLog(userId, 'UPDATE_TOPPING', 'name', oldTopping.name, name);
    }

    if (fee !== undefined && parseFloat(fee) !== oldTopping.fee) {
      await createAuditLog(userId, 'UPDATE_TOPPING', 'fee', oldTopping.fee, fee);
    }

    res.json({
      message: 'Topping updated successfully',
      topping: updatedTopping
    });

    console.log(`✅ Topping updated: ${updatedTopping.name}`);
  } catch (error) {
    console.error('❌ Error updating topping:', error);
    res.status(500).json({ error: 'Failed to update topping' });
  }
};

// ============================================
// DELETE TOPPING
// ============================================
const deleteTopping = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const topping = await prisma.topping.findUnique({
      where: { id: parseInt(id) }
    });

    if (!topping) {
      return res.status(404).json({ error: 'Topping not found' });
    }

    await prisma.topping.delete({
      where: { id: parseInt(id) }
    });

    await createAuditLog(
      userId,
      'DELETE_TOPPING',
      'Topping',
      `${topping.name} (R${topping.fee})`,
      null
    );

    res.json({ message: 'Topping deleted successfully' });

    console.log(`✅ Topping deleted: ${topping.name}`);
  } catch (error) {
    console.error('❌ Error deleting topping:', error);
    res.status(500).json({ error: 'Failed to delete topping' });
  }
};

// ============================================
// CREATE CONSISTENCY
// ============================================
const createConsistency = async (req, res) => {
  try {
    const { name, fee } = req.body;
    const userId = req.user.userId;

    if (!name || fee === undefined) {
      return res.status(400).json({ error: 'Name and fee are required' });
    }

    const consistency = await prisma.consistency.create({
      data: { name, fee: parseFloat(fee) }
    });

    await createAuditLog(
      userId,
      'CREATE_CONSISTENCY',
      'Consistency',
      null,
      `${name} (R${fee})`
    );

    res.status(201).json({
      message: 'Consistency created successfully',
      consistency
    });

    console.log(`✅ Consistency created: ${name}`);
  } catch (error) {
    console.error('❌ Error creating consistency:', error);
    res.status(500).json({ error: 'Failed to create consistency' });
  }
};

// ============================================
// UPDATE CONSISTENCY
// ============================================
const updateConsistency = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fee } = req.body;
    const userId = req.user.userId;

    const oldConsistency = await prisma.consistency.findUnique({
      where: { id: parseInt(id) }
    });

    if (!oldConsistency) {
      return res.status(404).json({ error: 'Consistency not found' });
    }

    const updatedConsistency = await prisma.consistency.update({
      where: { id: parseInt(id) },
      data: {
        name: name || oldConsistency.name,
        fee: fee !== undefined ? parseFloat(fee) : oldConsistency.fee
      }
    });

    if (name && name !== oldConsistency.name) {
      await createAuditLog(userId, 'UPDATE_CONSISTENCY', 'name', oldConsistency.name, name);
    }

    if (fee !== undefined && parseFloat(fee) !== oldConsistency.fee) {
      await createAuditLog(userId, 'UPDATE_CONSISTENCY', 'fee', oldConsistency.fee, fee);
    }

    res.json({
      message: 'Consistency updated successfully',
      consistency: updatedConsistency
    });

    console.log(`✅ Consistency updated: ${updatedConsistency.name}`);
  } catch (error) {
    console.error('❌ Error updating consistency:', error);
    res.status(500).json({ error: 'Failed to update consistency' });
  }
};

// ============================================
// DELETE CONSISTENCY
// ============================================
const deleteConsistency = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const consistency = await prisma.consistency.findUnique({
      where: { id: parseInt(id) }
    });

    if (!consistency) {
      return res.status(404).json({ error: 'Consistency not found' });
    }

    await prisma.consistency.delete({
      where: { id: parseInt(id) }
    });

    await createAuditLog(
      userId,
      'DELETE_CONSISTENCY',
      'Consistency',
      `${consistency.name} (R${consistency.fee})`,
      null
    );

    res.json({ message: 'Consistency deleted successfully' });

    console.log(`✅ Consistency deleted: ${consistency.name}`);
  } catch (error) {
    console.error('❌ Error deleting consistency:', error);
    res.status(500).json({ error: 'Failed to delete consistency' });
  }
};

// ============================================
// UPDATE CONFIG
// ============================================
const updateConfig = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Get current config
    const oldConfig = await prisma.config.findFirst();

    if (!oldConfig) {
      return res.status(404).json({ error: 'Config not found' });
    }

    // Update config
    const updatedConfig = await prisma.config.update({
      where: { id: oldConfig.id },
      data: {
        maxDrinks: updates.maxDrinks !== undefined ? parseInt(updates.maxDrinks) : oldConfig.maxDrinks,
        vatPercentage: updates.vatPercentage !== undefined ? parseFloat(updates.vatPercentage) : oldConfig.vatPercentage,
        discountTier1Orders: updates.discountTier1Orders !== undefined ? parseInt(updates.discountTier1Orders) : oldConfig.discountTier1Orders,
        discountTier1MinDrinks: updates.discountTier1MinDrinks !== undefined ? parseInt(updates.discountTier1MinDrinks) : oldConfig.discountTier1MinDrinks,
        discountTier2Orders: updates.discountTier2Orders !== undefined ? parseInt(updates.discountTier2Orders) : oldConfig.discountTier2Orders,
        discountTier2MinDrinks: updates.discountTier2MinDrinks !== undefined ? parseInt(updates.discountTier2MinDrinks) : oldConfig.discountTier2MinDrinks,
        discountTier3Orders: updates.discountTier3Orders !== undefined ? parseInt(updates.discountTier3Orders) : oldConfig.discountTier3Orders,
        discountTier3MinDrinks: updates.discountTier3MinDrinks !== undefined ? parseInt(updates.discountTier3MinDrinks) : oldConfig.discountTier3MinDrinks,
        maxDiscountAmount: updates.maxDiscountAmount !== undefined ? parseFloat(updates.maxDiscountAmount) : oldConfig.maxDiscountAmount
      }
    });

    // Log all changes
    for (const [field, newValue] of Object.entries(updates)) {
      if (oldConfig[field] !== undefined && oldConfig[field] !== newValue) {
        await createAuditLog(
          userId,
          'UPDATE_CONFIG',
          field,
          oldConfig[field],
          newValue
        );
      }
    }

    res.json({
      message: 'Config updated successfully',
      config: updatedConfig
    });

    console.log('✅ Config updated');
  } catch (error) {
    console.error('❌ Error updating config:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
};

// ============================================
// GET AUDIT LOGS
// ============================================
const getAuditLogs = async (req, res) => {
  try {
    const { action, startDate, endDate } = req.query;

    const where = {};

    if (action) {
      where.action = action;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 100 // Limit to last 100 logs
    });

    res.json({ logs });

    console.log(`✅ Retrieved ${logs.length} audit logs`);
  } catch (error) {
    console.error('❌ Error getting audit logs:', error);
    res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
};

module.exports = {
  getAllLookups,
  createFlavour,
  updateFlavour,
  deleteFlavour,
  createTopping,
  updateTopping,
  deleteTopping,
  createConsistency,
  updateConsistency,
  deleteConsistency,
  updateConfig,
  getAuditLogs
};