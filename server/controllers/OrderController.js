// server/controllers/OrderController.js
const { Order, OrderItem, Product, User, sequelize } = require('../models');
const { Op } = require('sequelize');

class OrderController {
  // 1. DASHBOARD STATS (Admin Overview)
  static async getDashboardStats(req, res) {
    try {
      const totalRevenue = await Order.sum('totalAmount', {
        where: { status: { [Op.in]: ['PAID', 'SHIPPED', 'DELIVERED'] } }
      }) || 0;

      const totalOrders = await Order.count();
      const totalCustomers = await User.count({ where: { role: 'CUSTOMER' } });
      const totalProducts = await Product.count();
      
      const lowStockItems = await Product.findAll({
        where: { stock: { [Op.lt]: 5 } },
        attributes: ['id', 'name', 'stock'],
        limit: 5
      });

      res.status(200).json({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockItems
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 2. ADMIN: Ambil Semua Pesanan
  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [{ model: User, attributes: ['username', 'email'] }],
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 3. CUSTOMER: Ambil Pesanan Saya (FUNGSI YANG TADI HILANG)
  static async getUserOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { UserId: req.user.id },
        include: [
          { 
            model: OrderItem, 
            as: 'items',
            include: [{ model: Product, attributes: ['name', 'imageUrl'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 4. DETAIL: Rincian Pesanan Berdasarkan ID
  static async getOrderDetails(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          { model: User, attributes: ['username', 'email'] },
          { 
            model: OrderItem, 
            as: 'items', 
            include: [{ model: Product }] 
          }
        ]
      });

      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 5. STATUS: Update Status Transaksi
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      await order.update({ status });
      res.status(200).json({ message: `Status updated to ${status}` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = OrderController;