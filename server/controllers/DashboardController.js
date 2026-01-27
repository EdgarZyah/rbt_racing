// server/controllers/DashboardController.js
const { Product, Order, Category, User, sequelize } = require('../models');

class DashboardController {
  static async getStats(req, res) {
    try {
      // 1. Hitung Total Produk & Kategori
      const totalProducts = await Product.count();
      const totalCategories = await Category.count();

      // 2. Hitung Total Pesanan & Pendapatan (Hanya yang berstatus PAID/DELIVERED)
      const totalOrders = await Order.count();
      const revenueData = await Order.sum('totalAmount', {
        where: { status: ['PAID', 'SHIPPED', 'DELIVERED'] }
      });

      // 3. Ambil Produk dengan Stok Menipis (Kurang dari 5)
      const lowStockItems = await Product.findAll({
        where: {
          stock: { [sequelize.Op.lt]: 5 }
        },
        limit: 5
      });

      // 4. Hitung Total Customer
      const totalCustomers = await User.count({ where: { role: 'CUSTOMER' } });

      res.status(200).json({
        totalProducts,
        totalCategories,
        totalOrders,
        totalCustomers,
        totalRevenue: revenueData || 0,
        lowStockItems
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = DashboardController;