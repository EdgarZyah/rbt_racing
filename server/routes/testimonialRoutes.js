// server/routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const TestimonialController = require('../controllers/TestimonialController');
// SESUAIKAN IMPORT DENGAN AUTHMIDDLEWARE MILIK ANDA
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Route Public (Bisa diakses tanpa login untuk ditampilkan di Homepage)
router.get('/', TestimonialController.getActiveTestimonials);

// Routes Admin (Membutuhkan login dan role admin)
// GUNAKAN AUTHENTICATE DAN AUTHORIZEADMIN
router.use(authenticate, authorizeAdmin); 

router.get('/admin', TestimonialController.getAllTestimonials);
router.post('/', TestimonialController.createTestimonial);
router.put('/:id', TestimonialController.updateTestimonial);
router.delete('/:id', TestimonialController.deleteTestimonial);
router.patch('/:id/status', TestimonialController.toggleStatus); 

module.exports = router;