const { Address } = require('../models');

class AddressController {
  // Ambil semua alamat user
  static async getUserAddresses(req, res) {
    try {
      const addresses = await Address.findAll({
        where: { UserId: req.user.id },
        order: [['isMain', 'DESC'], ['createdAt', 'DESC']]
      });
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Tambah alamat baru
  static async addAddress(req, res) {
    try {
      const { isMain } = req.body;
      if (isMain) {
        await Address.update({ isMain: false }, { where: { UserId: req.user.id } });
      }
      const address = await Address.create({ ...req.body, UserId: req.user.id });
      res.status(201).json(address);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // --- FUNGSI YANG DIPERLUKAN BARIS 14 ---
  static async updateAddress(req, res) {
    try {
      const { id } = req.params;
      const address = await Address.findOne({ where: { id, UserId: req.user.id } });
      
      if (!address) return res.status(404).json({ message: "Alamat tidak ditemukan" });

      if (req.body.isMain) {
        await Address.update({ isMain: false }, { where: { UserId: req.user.id } });
      }

      await address.update(req.body);
      res.status(200).json({ message: "Alamat berhasil diperbarui", data: address });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async setMainAddress(req, res) {
    try {
      const { id } = req.params;
      await Address.update({ isMain: false }, { where: { UserId: req.user.id } });
      const address = await Address.findOne({ where: { id, UserId: req.user.id } });
      if (!address) return res.status(404).json({ message: "Alamat tidak ditemukan" });
      await address.update({ isMain: true });
      res.status(200).json({ message: "Alamat utama diperbarui" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteAddress(req, res) {
    try {
      const deleted = await Address.destroy({ where: { id: req.params.id, UserId: req.user.id } });
      if (!deleted) return res.status(404).json({ message: "Alamat tidak ditemukan" });
      res.status(200).json({ message: "Alamat dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AddressController;