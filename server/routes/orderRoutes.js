const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Dashboard Stats (Dimasukkan ke rute orders)
router.get('/stats', authenticate, authorizeAdmin, OrderController.getDashboardStats);

// Admin Routes
router.get('/admin', authenticate, authorizeAdmin, OrderController.getAllOrders);
router.patch('/:id/status', authenticate, authorizeAdmin, OrderController.updateStatus);

// Common/Customer Routes
router.get('/customer', authenticate, OrderController.getUserOrders);
router.get('/:id', authenticate, OrderController.getOrderDetails);

module.exports = router;