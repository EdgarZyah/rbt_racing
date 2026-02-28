const { Cart, Product, ProductVariant } = require('../models');

class CartController {

  // 1. GET CART
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
        ],
        order: [['createdAt', 'DESC']] // Opsional: Urutkan dari yang terbaru dimasukkan
      });

      // Format data untuk Frontend
      const formattedCart = cartDB.map(c => {
        const product = c.Product ? c.Product.toJSON() : null;
        if (!product) return null; 
        
        let currentStock = product.stock;
        let currentImage = product.imageUrl; 

        if (c.rawVariantId && product.variants) {
            const variant = product.variants.find(v => v.id === c.rawVariantId);
            if (variant) {
              currentStock = variant.stock;
              if (variant.imageUrl) {
                currentImage = variant.imageUrl;
              }
            }
        }

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: currentImage, 
          cartId: c.id, 
          quantity: c.quantity,
          stock: currentStock, 
          selectedVariants: c.selectedVariants ? JSON.parse(c.selectedVariants) : {},
          rawVariantId: c.rawVariantId,
          note: c.note 
        };
      }).filter(item => item !== null);

      res.status(200).json(formattedCart);
    } catch (error) {
      console.error("Error getUserCart:", error);
      res.status(500).json({ message: "Gagal mengambil data keranjang" });
    }
  }

  // 2. Add/Update Item 
  static async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const { id, quantity, selectedVariants, rawVariantId, note } = req.body;

      // --- [BARU] VALIDASI STOK SEBELUM MENAMBAH KE KERANJANG ---
      const product = await Product.findByPk(id, {
        include: [{ model: ProductVariant, as: 'variants' }]
      });

      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }

      let availableStock = product.stock;
      if (rawVariantId && product.variants) {
        const variant = product.variants.find(v => v.id === rawVariantId);
        if (variant) {
          availableStock = variant.stock;
        } else {
          return res.status(404).json({ message: "Varian produk tidak valid" });
        }
      }

      // Tolak jika quantity melebihi stok yang ada
      if (quantity > availableStock) {
        return res.status(400).json({ message: `Stok tidak mencukupi. Sisa stok: ${availableStock}` });
      }
      // -----------------------------------------------------------

      const [cartItem, created] = await Cart.findOrCreate({
        where: { 
            UserId: userId, 
            ProductId: id,
            rawVariantId: rawVariantId || null 
        },
        defaults: {
            quantity,
            selectedVariants: JSON.stringify(selectedVariants),
            note: note || null 
        }
      });

      if (!created) {
        cartItem.quantity = quantity;
        if (note !== undefined) {
          cartItem.note = note; 
        }
        await cartItem.save();
      }

      res.status(200).json({ message: "Keranjang berhasil diperbarui" });
    } catch (error) {
      console.error("Error updateItem:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // 3. Remove Item
  static async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, rawVariantId } = req.body;

      const deletedCount = await Cart.destroy({
        where: {
          UserId: userId,
          ProductId: productId,
          rawVariantId: rawVariantId || null
        }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ message: "Item tidak ditemukan di keranjang" });
      }

      res.status(200).json({ message: "Item berhasil dihapus" });
    } catch (error) {
      console.error("Error removeItem:", error);
      res.status(500).json({ message: error.message });
    }
  }
    
  // 4. Clear Cart
  static async clearCart(req, res) {
      try {
          await Cart.destroy({ where: { UserId: req.user.id } });
          res.status(200).json({ message: "Keranjang berhasil dikosongkan" });
      } catch (error) {
          console.error("Error clearCart:", error);
          res.status(500).json({ message: error.message });
      }
  }
}

module.exports = CartController;