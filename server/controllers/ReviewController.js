// server/controllers/ReviewController.js
const { Review, User, Product } = require("../models");

class ReviewController {
  /**
   * Menambahkan ulasan baru (User)
   */
  static async createReview(req, res) {
    try {
      const UserId = req.user.id;
      // imageUrl diisi oleh middleware processReviewImage di req.body
      const { ProductId, rating, comment, OrderId, imageUrl } = req.body;

      // Validasi input wajib
      if (!ProductId || !rating || !OrderId) {
        return res
          .status(400)
          .json({ message: "ProductId, OrderId, dan Rating wajib diisi" });
      }

      // Cek apakah sudah pernah review produk ini di transaksi yang sama
      const existingReview = await Review.findOne({
        where: { 
          ProductId: Number(ProductId), 
          OrderId: String(OrderId), 
          UserId 
        },
      });

      if (existingReview) {
        return res
          .status(400)
          .json({ message: "Anda sudah memberikan ulasan untuk item di transaksi ini" });
      }

      // Simpan ulasan baru
      const newReview = await Review.create({
        UserId,
        ProductId: Number(ProductId),
        OrderId: String(OrderId),
        rating: Number(rating),
        comment: comment || "",
        imageUrl: imageUrl || null, // Diambil dari path yang dihasilkan middleware
      });

      res.status(201).json({ 
        message: "Ulasan berhasil disimpan", 
        data: newReview 
      });
    } catch (error) {
      console.error("Create Review Error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Mengambil ulasan per produk (Public)
   */
  static async getProductReviews(req, res) {
    try {
      const { productId } = req.params;
      const reviews = await Review.findAll({
        where: { ProductId: productId },
        include: [
          {
            model: User,
            attributes: ["id", "username"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil ulasan produk." });
    }
  }

  /**
   * Dashboard Admin: Mengambil semua ulasan
   */
  static async getAllReviews(req, res) {
    try {
      const reviews = await Review.findAll({
        include: [
          { model: User, attributes: ["username", "email"] },
          { model: Product, attributes: ["name", "imageUrl"] },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Gagal mengambil data semua ulasan." });
    }
  }

  /**
   * Hapus ulasan (Admin)
   */
  static async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
      if (!review) return res.status(404).json({ message: "Ulasan tidak ditemukan" });

      await review.destroy();
      res.status(200).json({ message: "Ulasan berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: "Gagal menghapus ulasan." });
    }
  }
}

module.exports = ReviewController;