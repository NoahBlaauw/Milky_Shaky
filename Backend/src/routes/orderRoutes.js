const express = require('express');
const {
  calculateOrderPrice,
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  getOrderVolumeByDayOfWeek
} = require('../controllers/orderController');

const { authenticateToken, requireManager } = require('../middleware/authMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(authenticateToken);

// Calculate order price (before creating)
router.post('/calculate', calculateOrderPrice);

// Create order
router.post('/create', createOrder);

// Get user's own orders
router.get('/my-orders', getUserOrders);

// Get specific order by ID
router.get('/:id', getOrderById);

// MANAGER-ONLY ROUTES
// Get all orders
router.get('/', requireManager, getAllOrders);

// Get order volume by day of week
router.get('/reports/day-of-week', requireManager, getOrderVolumeByDayOfWeek);

module.exports = router;