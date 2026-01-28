const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { authenticate, authorizeCustomer } = require('../middleware/authMiddleware'); // Pastikan import ini

// Middleware 'authorizeCustomer' penting agar Admin tidak bisa hit endpoint ini
// Jika belum punya middleware authorizeCustomer, cukup pakai authenticate dulu
// dan filter di frontend/controller. 

// 1. Get Cart (Khusus Customer Login)
router.get('/', authenticate, CartController.getUserCart); 

// 2. Manipulasi Cart
router.post('/item', authenticate, CartController.updateItem);
router.delete('/item', authenticate, CartController.removeItem);
router.delete('/', authenticate, CartController.clearCart);

module.exports = router;