// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const { authenticate } = require('../middleware/authMiddleware');

// PASTIKAN BARIS INI ADA DAN SUDAH DI-SAVE
router.get('/quota', authenticate, ChatController.getQuota);

router.post('/', authenticate, ChatController.handleChat);

module.exports = router;