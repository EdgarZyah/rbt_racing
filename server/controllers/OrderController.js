const { Order, OrderItem, Product, ProductVariant, User, sequelize } = require('../models');
const { Op } = require('sequelize');

class OrderController {

  // --- 1. CREATE ORDER (Perbaikan Logika Stok) ---
  static async createOrder(req, res) {
    const t = await sequelize.transaction(); // Mulai Transaksi
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
        // 1. Ambil Product Utama
        const product = await Product.findByPk(item.id, { 
          transaction: t,
          lock: true 
        });
        
        if (!product) throw new Error(`Product ID ${item.id} not found`);
        
        let variantFound = false;

        // 2. Cek Stok Varian (Prioritas)
        if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
           for (const [category, value] of Object.entries(item.selectedVariants)) {
              // Cari Varian
              const variant = await ProductVariant.findOne({
                where: {
                  ProductId: item.id,
                  category: category,
                  value: value
                },
                transaction: t,
                lock: true
              });

              if (variant) {
                 variantFound = true;
                 // Validasi Stok Varian (STRICT)
                 if (variant.stock < item.quantity) {
                   throw new Error(`Insufficient stock for ${product.name} (${category}: ${value}). Available: ${variant.stock}`);
                 }
                 // Kurangi Stok Varian
                 await variant.update({ stock: variant.stock - item.quantity }, { transaction: t });
              }
           }
        }

        // 3. Update Stok Utama
        if (variantFound) {
            // JIKA VARIAN DITEMUKAN:
            // Kita kurangi stok utama HANYA untuk sinkronisasi data.
            // Jangan lakukan validasi ketat (throw error) pada stok utama, 
            // karena "kebenaran" stok ada pada varian.
            await product.update({ stock: product.stock - item.quantity }, { transaction: t });
        } else {
            // JIKA PRODUK SIMPLE (TANPA VARIAN):
            // Lakukan validasi ketat pada stok utama.
            if (product.stock < item.quantity) {
              throw new Error(`Insufficient total stock for '${product.name}'`);
            }
            await product.update({ stock: product.stock - item.quantity }, { transaction: t });
        }

        // Hitung Subtotal
        productTotal += (product.price * item.quantity);

        // Siapkan Data Item
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

      // Hitung Grand Total & Simpan
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
        resi: null,
        paymentProof: null
      }, { transaction: t });

      const itemsWithOrderId = orderItemsData.map(item => ({
        ...item,
        OrderId: newOrder.id
      }));
      await OrderItem.bulkCreate(itemsWithOrderId, { transaction: t });

      await t.commit();

      res.status(201).json({
        message: "Order created successfully",
        data: newOrder
      });

    } catch (error) {
      await t.rollback();
      console.error("Create Order Error:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // --- 2. CANCEL ORDER ---
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

      // RESTORE STOCK
      for (const item of order.items) {
        // Restore Product Utama
        const product = await Product.findByPk(item.ProductId, { transaction: t });
        if (product) {
          await product.update({ stock: product.stock + item.quantity }, { transaction: t });
        }

        // Restore Varian (Jika ada)
        if (item.productSnapshot) {
           try {
             const snapshot = JSON.parse(item.productSnapshot);
             if (snapshot.variant) {
                for (const [category, value] of Object.entries(snapshot.variant)) {
                   const variant = await ProductVariant.findOne({
                      where: { ProductId: item.ProductId, category, value },
                      transaction: t
                   });
                   if (variant) {
                      await variant.update({ stock: variant.stock + item.quantity }, { transaction: t });
                   }
                }
             }
           } catch (e) {
             console.error("Failed to parse snapshot for stock restore", e);
           }
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

  // --- 3. AUTO EXPIRED ---
  static async checkExpiredOrders(req, res) {
    const t = await sequelize.transaction();
    try {
      const oneDayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
      
      const expiredOrders = await Order.findAll({
        where: {
          status: 'PENDING',
          createdAt: { [Op.lt]: oneDayAgo } 
        },
        include: [{ model: OrderItem, as: 'items' }],
        transaction: t
      });

      let count = 0;
      for (const order of expiredOrders) {
        for (const item of order.items) {
          // Restore Stock
          const product = await Product.findByPk(item.ProductId, { transaction: t });
          if (product) await product.update({ stock: product.stock + item.quantity }, { transaction: t });
          
          if (item.productSnapshot) {
             try {
                const snapshot = JSON.parse(item.productSnapshot);
                if (snapshot.variant) {
                   for (const [category, value] of Object.entries(snapshot.variant)) {
                      const variant = await ProductVariant.findOne({ where: { ProductId: item.ProductId, category, value }, transaction: t });
                      if (variant) await variant.update({ stock: variant.stock + item.quantity }, { transaction: t });
                   }
                }
             } catch (e) {}
          }
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

  // --- OTHER METHODS (NO CHANGE) ---
  static async confirmPayment(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (!req.file) return res.status(400).json({ message: "Please upload payment proof" });

      await order.update({ paymentProof: req.file.filename, status: 'PAID' });
      res.status(200).json({ message: "Payment confirmed", data: order });
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  static async inputResi(req, res) {
     try {
      const { id } = req.params;
      const { resi } = req.body;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      if (order.status !== 'PAID' && order.status !== 'SHIPPED') return res.status(400).json({ message: "Order must be PAID before shipping" });
      
      await order.update({ resi: resi, status: 'SHIPPED' });
      res.status(200).json({ message: "Resi updated", data: order });
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

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
        const lowStockItems = await Product.findAll({ where: { stock: { [Op.lt]: 5 } }, attributes: ['id', 'name', 'stock'], limit: 5 });
        res.status(200).json({ totalRevenue, totalOrders, totalCustomers, totalProducts, lowStockItems });
    } catch (error) { res.status(500).json({message: error.message}) }
  }
}

module.exports = OrderController;