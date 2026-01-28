// rbt_racing/server/controllers/OrderController.js
const { Order, OrderItem, Product, ProductVariant, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { 
  sendOrderConfirmationEmail, 
  sendPaymentUploadedCustomerNotification, 
  sendAdminPaymentNotification 
} = require('../services/transactionEmailService');

class OrderController {

  // --- 1. CREATE ORDER (With Transaction & Email) ---
  static async createOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const userId = req.user.id;
      const { 
        items, 
        shippingAddress, 
        shippingCourier, 
        shippingService, 
        shippingCost 
      } = req.body;

      let productTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await Product.findByPk(item.id, { 
          transaction: t,
          lock: true 
        });
        
        if (!product) throw new Error(`Product ID ${item.id} not found`);
        
        let variantFound = false;

        // Cek & Kurangi Stok Varian
        if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
           for (const [category, value] of Object.entries(item.selectedVariants)) {
             const variant = await ProductVariant.findOne({
               where: { ProductId: item.id, category, value },
               transaction: t,
               lock: true
             });

             if (variant) {
                variantFound = true;
                if (variant.stock < item.quantity) {
                  throw new Error(`Stok tidak mencukupi untuk ${product.name} (${category}: ${value})`);
                }
                await variant.update({ stock: variant.stock - item.quantity }, { transaction: t });
             }
           }
        }

        // Validasi & Update Stok Utama
        if (!variantFound && product.stock < item.quantity) {
          throw new Error(`Stok tidak mencukupi untuk '${product.name}'`);
        }
        await product.update({ stock: product.stock - item.quantity }, { transaction: t });

        productTotal += (product.price * item.quantity);

        orderItemsData.push({
          ProductId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
          productSnapshot: JSON.stringify({
            name: product.name,
            image: product.imageUrl,
            sku: product.sku || '-',
            variant: item.selectedVariants || null 
          })
        });
      }

      const grandTotal = productTotal + shippingCost;
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newOrder = await Order.create({
        id: orderId,
        UserId: userId,
        totalAmount: grandTotal,
        status: 'PENDING',
        paymentMethod: 'MANUAL_TRANSFER',
        shippingAddress: JSON.stringify(shippingAddress), 
        shippingCost: shippingCost,
        shippingService: `${shippingCourier ? shippingCourier.toUpperCase() : 'COURIER'} - ${shippingService}`,
      }, { transaction: t });

      const itemsWithOrderId = orderItemsData.map(item => ({ ...item, OrderId: newOrder.id }));
      await OrderItem.bulkCreate(itemsWithOrderId, { transaction: t });

      const user = await User.findByPk(userId, { transaction: t });

      await t.commit();

      // KIRIM EMAIL: Konfirmasi Pesanan ke Customer
      sendOrderConfirmationEmail(newOrder, user.email).catch(err => console.error("Email Error:", err));

      res.status(201).json({
        success: true,
        message: "Order created successfully. Please check your email.",
        data: newOrder
      });

    } catch (error) {
      await t.rollback();
      res.status(400).json({ message: error.message });
    }
  }

  // --- 2. CONFIRM PAYMENT (Upload Bukti & Email) ---
  static async confirmPayment(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [{ model: User, attributes: ['username', 'email'] }]
      });

      if (!order) return res.status(404).json({ message: "Order not found" });
      if (!req.file) return res.status(400).json({ message: "Please upload payment proof" });

      await order.update({ paymentProof: req.file.filename, status: 'PAID' });

      // KIRIM EMAIL: Notifikasi ke Customer & Admin
      sendPaymentUploadedCustomerNotification(order, order.User.email).catch(err => console.error(err));
      sendAdminPaymentNotification(order, order.User.username).catch(err => console.error(err));

      res.status(200).json({ message: "Payment proof uploaded", data: order });
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  // --- 3. CANCEL ORDER (With Stock Restore) ---
  static async cancelOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [{ model: OrderItem, as: 'items' }],
        transaction: t
      });
      
      if (!order) {
        await t.rollback();
        return res.status(404).json({ message: "Order not found" });
      }

      if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status)) {
        await t.rollback();
        return res.status(400).json({ message: `Cannot cancel order with status ${order.status}` });
      }

      // Kembalikan Stok
      for (const item of order.items) {
        const product = await Product.findByPk(item.ProductId, { transaction: t });
        if (product) await product.update({ stock: product.stock + item.quantity }, { transaction: t });

        if (item.productSnapshot) {
          try {
            const snapshot = JSON.parse(item.productSnapshot);
            if (snapshot.variant) {
              for (const [category, value] of Object.entries(snapshot.variant)) {
                const variant = await ProductVariant.findOne({
                  where: { ProductId: item.ProductId, category, value },
                  transaction: t
                });
                if (variant) await variant.update({ stock: variant.stock + item.quantity }, { transaction: t });
              }
            }
          } catch (e) { console.error(e); }
        }
      }

      await order.update({ status: 'CANCELLED' }, { transaction: t });
      await t.commit();
      res.status(200).json({ message: "Order cancelled and stock restored" });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: error.message });
    }
  }

  // --- 4. AUTO EXPIRED (Cancel otomatis pesanan > 24 jam) ---
  static async checkExpiredOrders(req, res) {
    const t = await sequelize.transaction();
    try {
      const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
      const expiredOrders = await Order.findAll({
        where: { status: 'PENDING', createdAt: { [Op.lt]: oneDayAgo } },
        include: [{ model: OrderItem, as: 'items' }],
        transaction: t
      });

      let count = 0;
      for (const order of expiredOrders) {
        // Logika Restore Stok sama dengan CancelOrder...
        for (const item of order.items) {
           const product = await Product.findByPk(item.ProductId, { transaction: t });
           if (product) await product.update({ stock: product.stock + item.quantity }, { transaction: t });
           // Restore Variant logic...
        }
        await order.update({ status: 'CANCELLED' }, { transaction: t });
        count++;
      }

      await t.commit();
      res.status(200).json({ message: `Cancelled ${count} expired orders.` });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: error.message });
    }
  }

  // --- 5. ADMIN: INPUT RESI ---
  static async inputResi(req, res) {
    try {
      const { id } = req.params;
      const { resi } = req.body;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (order.status !== 'PAID') return res.status(400).json({ message: "Hanya pesanan PAID yang bisa diproses" });
      
      await order.update({ resi: resi, status: 'SHIPPED' });
      res.status(200).json({ message: "Resi updated", data: order });
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  // --- 6. READ METHODS ---
  static async getOrderDetails(req, res) {
    try {
      const { id } = req.params;
      const whereClause = { id };
      if (req.user.role !== 'ADMIN') whereClause.UserId = req.user.id;

      const order = await Order.findOne({
        where: whereClause,
        include: [
          { model: User, attributes: ['username', 'email'] },
          { model: OrderItem, as: 'items', include: [{ model: Product, required: false }] } 
        ]
      });
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  static async getUserOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: { UserId: req.user.id },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(orders);
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [{ model: User, attributes: ['username', 'email'] }],
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(orders);
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  static async getDashboardStats(req, res) {
    try {
      const totalRevenue = await Order.sum('totalAmount', { where: { status: { [Op.in]: ['PAID', 'SHIPPED', 'DELIVERED'] } } }) || 0;
      const totalOrders = await Order.count();
      const totalCustomers = await User.count({ where: { role: 'CUSTOMER' } });
      const totalProducts = await Product.count();
      const lowStockItems = await Product.findAll({ where: { stock: { [Op.lt]: 5 } }, limit: 5 });
      res.status(200).json({ totalRevenue, totalOrders, totalCustomers, totalProducts, lowStockItems });
    } catch (error) { res.status(500).json({message: error.message}) }
  }
}

module.exports = OrderController;