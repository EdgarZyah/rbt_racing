const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Public Access
router.get('/', CategoryController.getAll);

// Admin Only Access
router.post('/', authenticate, authorizeAdmin, CategoryController.create);
router.put('/:id', authenticate, authorizeAdmin, CategoryController.update);
router.delete('/:id', authenticate, authorizeAdmin, CategoryController.delete);

module.exports = router;