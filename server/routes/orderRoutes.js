// rbt_racing/server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { 
  authenticate, 
  authorizeAdmin, 
  requireVerification // Tambahkan ini untuk proteksi checkout
} = require('../middleware/authMiddleware');
const { upload, processPaymentProof } = require('../middleware/uploadMiddleware');

/**
 * === 1. ADMIN ROUTES (Dashboard & Management) ===
 * Rute khusus untuk admin dalam mengelola semua pesanan pelanggan.
 */

// Mendapatkan statistik dashboard admin
router.get('/stats', authenticate, authorizeAdmin, OrderController.getDashboardStats);

// Mendapatkan daftar semua pesanan untuk admin
router.get('/admin', authenticate, authorizeAdmin, OrderController.getAllOrders);

// Admin: Input nomor resi pengiriman (Hanya untuk status PAID)
router.patch('/:id/resi', authenticate, authorizeAdmin, OrderController.inputResi);

// Admin: Batalkan pesanan secara manual
router.patch('/:id/admin-cancel', authenticate, authorizeAdmin, OrderController.cancelOrder);

// Admin: Trigger manual untuk pembersihan pesanan yang kedaluwarsa
router.post('/cleanup/expired', authenticate, authorizeAdmin, OrderController.checkExpiredOrders);


/**
 * === 2. CUSTOMER ROUTES (Transaction Flow) ===
 * Rute untuk pelanggan dalam melakukan transaksi.
 */

// 1. Checkout (Membuat pesanan baru dengan status PENDING)
// Ditambahkan requireVerification agar hanya user terverifikasi yang bisa belanja
router.post('/', authenticate, requireVerification, OrderController.createOrder); 

// Mendapatkan daftar pesanan milik user yang sedang login
router.get('/customer', authenticate, OrderController.getUserOrders);

// 2. Konfirmasi Pembayaran (Upload Bukti Bayar: PENDING -> PAID)
router.post('/:id/payment', 
  authenticate, 
  upload.single('paymentProof'), 
  processPaymentProof, 
  OrderController.confirmPayment
);


/**
 * === 3. SHARED ROUTES ===
 * Rute yang dapat diakses oleh Admin maupun Customer yang bersangkutan.
 */

// Mendapatkan detail lengkap satu pesanan berdasarkan ID
router.get('/:id', authenticate, OrderController.getOrderDetails);

module.exports = router;