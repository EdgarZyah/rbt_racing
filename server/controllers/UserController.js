const { User } = require('../models');
const { Op } = require('sequelize');

class UserController {
  // ADMIN: Ambil daftar seluruh personel
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        order: [['id', 'DESC']]
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // ADMIN: Modifikasi akses (Role)
  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "Personnel not found" });

      await user.update({ role });
      res.status(200).json({ message: `Access level updated to ${role}` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PROFILE: Mengambil data identitas sendiri
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PROFILE: Sinkronisasi pembaruan identitas
  static async updateProfile(req, res) {
    try {
      const { username, email } = req.body;
      const userId = req.user.id;

      // Validasi email agar tidak duplikat dengan user lain
      const existingUser = await User.findOne({ 
        where: { email, id: { [Op.ne]: userId } } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Email is already deployed by another user" });
      }

      const user = await User.findByPk(userId);
      await user.update({ username, email });
      
      res.status(200).json({ 
        message: "Identity successfully updated", 
        user: { id: user.id, username: user.username, email: user.email, role: user.role } 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UserController;