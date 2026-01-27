// server/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { uploadFields, processImages } = require("../middleware/uploadMiddleware");
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");

// Public Routes
router.get("/", ProductController.getAll);
router.get("/:slug", ProductController.getBySlug);

// Admin Routes (Protected)
router.get("/id/:id", authenticate, authorizeAdmin, ProductController.getById);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  uploadFields,  // 1. Tangkap file dari form-data
  processImages, // 2. Resize & convert ke WebP, simpan URL ke req.body
  ProductController.create // 3. Simpan data ke DB
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  uploadFields,
  processImages,
  ProductController.update
);

router.delete(
  "/:id", 
  authenticate, 
  authorizeAdmin, 
  ProductController.delete
);

module.exports = router;