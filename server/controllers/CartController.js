const { Cart, Product, ProductVariant } = require('../models');

class CartController {

  // 1. GET CART (Pengganti Sync)
  // Hanya mengambil data dari database user yang login
  static async getUserCart(req, res) {
    try {
      const userId = req.user.id;

      const cartDB = await Cart.findAll({
        where: { UserId: userId },
        include: [
            { 
                model: Product,
                include: [{ model: ProductVariant, as: 'variants' }] 
            }
        ]
      });

      // Format data untuk Frontend
      const formattedCart = cartDB.map(c => {
        const product = c.Product ? c.Product.toJSON() : null;
        if (!product) return null; // Safety check jika produk dihapus
        
        // Logika hitung stok saat ini
        let currentStock = product.stock;
        if (c.rawVariantId && product.variants) {
            const variant = product.variants.find(v => v.id === c.rawVariantId);
            if (variant) currentStock = variant.stock;
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          cartId: c.id, // ID Database Cart
          quantity: c.quantity,
          stock: currentStock, 
          selectedVariants: c.selectedVariants ? JSON.parse(c.selectedVariants) : {},
          rawVariantId: c.rawVariantId
        };
      }).filter(item => item !== null);

      res.status(200).json(formattedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  // 2. Add/Update Item (Tetap sama)
  static async updateItem(req, res) {
    try {
      // Pastikan Admin tidak bisa akses ini (sudah dicek di middleware route nanti)
      const userId = req.user.id;
      const { id, quantity, selectedVariants, rawVariantId } = req.body;

      const [cartItem, created] = await Cart.findOrCreate({
        where: { 
            UserId: userId, 
            ProductId: id,
            rawVariantId: rawVariantId || null 
        },
        defaults: {
            quantity,
            selectedVariants: JSON.stringify(selectedVariants)
        }
      });

      if (!created) {
        cartItem.quantity = quantity;
        await cartItem.save();
      }

      res.status(200).json({ message: "Cart updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 3. Remove Item (Tetap sama)
  static async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, rawVariantId } = req.body;

      await Cart.destroy({
        where: {
          UserId: userId,
          ProductId: productId,
          rawVariantId: rawVariantId || null
        }
      });

      res.status(200).json({ message: "Item removed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
    
  // 4. Clear Cart (Tetap sama)
  static async clearCart(req, res) {
      try {
          await Cart.destroy({ where: { UserId: req.user.id } });
          res.status(200).json({ message: "Cart cleared" });
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  }
}

module.exports = CartController;