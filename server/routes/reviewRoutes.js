// server/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// IMPORT YANG BENAR DENGAN DESTRUCTURING
const {
  upload,
  processReviewImage,
} = require("../middleware/uploadMiddleware");

// ==========================================
// PUBLIC ROUTES
// ==========================================
// Mengambil review berdasarkan ID produk (Bisa diakses tanpa login)
router.get("/product/:productId", ReviewController.getProductReviews);

// ==========================================
// USER ROUTES (Butuh login)
// ==========================================
// Menambahkan review baru dengan support upload 1 gambar
router.post(
  "/",
  authenticate,
  upload.single("image"), // 1. Ambil file ke memori
  processReviewImage, // 2. Olah gambar & simpan ke disk (set req.body.imageUrl)
  ReviewController.createReview, // 3. Simpan data ke database
);
// ==========================================
// ADMIN ROUTES (Butuh login & role admin)
// ==========================================
// Mengambil semua review dan menghapus review
router.get(
  "/admin",
  authenticate,
  authorizeAdmin,
  ReviewController.getAllReviews,
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  ReviewController.deleteReview,
);

module.exports = router;
