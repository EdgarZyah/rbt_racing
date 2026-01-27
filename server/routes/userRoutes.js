const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Rute Profil diletakkan di atas rute dengan parameter :id
router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile', authenticate, UserController.updateProfile);

// Rute Admin
router.get('/', authenticate, authorizeAdmin, UserController.getAllUsers);
router.patch('/:id/role', authenticate, authorizeAdmin, UserController.updateRole);

module.exports = router;