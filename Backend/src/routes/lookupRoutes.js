const express = require('express');
const {
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
} = require('../controllers/lookupController');

const { authenticateToken, requireManager } = require('../middleware/authMiddleware');

const router = express.Router();

// All lookup routes require authentication
router.use(authenticateToken);

// GET all lookups (available to all authenticated users)
router.get('/', getAllLookups);

// MANAGER-ONLY ROUTES
// Flavours
router.post('/flavours', requireManager, createFlavour);
router.put('/flavours/:id', requireManager, updateFlavour);
router.delete('/flavours/:id', requireManager, deleteFlavour);

// Toppings
router.post('/toppings', requireManager, createTopping);
router.put('/toppings/:id', requireManager, updateTopping);
router.delete('/toppings/:id', requireManager, deleteTopping);

// Consistencies
router.post('/consistencies', requireManager, createConsistency);
router.put('/consistencies/:id', requireManager, updateConsistency);
router.delete('/consistencies/:id', requireManager, deleteConsistency);

// Config
router.put('/config', requireManager, updateConfig);

// Audit logs
router.get('/audit-logs', requireManager, getAuditLogs);

module.exports = router;