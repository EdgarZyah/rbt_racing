const { ShopAddress } = require('../models');

class ShopAddressController {
  static async getShopAddress(req, res) {
    try {
      // Ambil data pertama (karena cuma ada 1 toko)
      let shop = await ShopAddress.findOne();
      if (!shop) return res.json(null);
      res.status(200).json(shop);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateShopAddress(req, res) {
    try {
      const data = req.body;
      let shop = await ShopAddress.findOne();

      if (shop) {
        // Update jika sudah ada
        await shop.update(data);
      } else {
        // Buat baru jika belum ada
        shop = await ShopAddress.create(data);
      }

      res.status(200).json({ message: "Alamat Toko diperbarui", data: shop });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ShopAddressController;