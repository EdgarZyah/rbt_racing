const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { sendVerificationEmail } = require('../services/emailService');

class AuthController {
  static TOKEN_EXPIRY = 10 * 60 * 1000; // 10 Menit

  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + AuthController.TOKEN_EXPIRY);

      await User.create({ 
        username, 
        email: email.toLowerCase(),
        password: hashedPassword,
        verificationToken: token,
        verificationTokenExpires: expiresAt,
        isVerified: false 
      });

      await sendVerificationEmail(email, token);
      res.status(201).json({ success: true, message: "Registrasi berhasil. Cek email Anda." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      const user = await User.findOne({ 
        where: { 
          verificationToken: token,
          verificationTokenExpires: { [Op.gt]: new Date() }
        } 
      });

      if (!user) return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });

      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();

      const accessToken = jwt.sign(
        { id: user.id, role: user.role, isVerified: true }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      res.status(200).json({ 
        success: true, 
        message: "Email berhasil diverifikasi.",
        access_token: accessToken,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async resendVerification(req, res) {
    try {
      const { email } = req.body; // Mengambil email dari body request

      if (!email) {
        return res.status(400).json({ message: "Email diperlukan dalam request body." });
      }

      const user = await User.findOne({ where: { email: email.toLowerCase() } });

      if (!user) {
        return res.status(404).json({ message: "Email tidak terdaftar di sistem kami." });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "Akun ini sudah aktif. Silakan login." });
      }

      const newToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = newToken;
      user.verificationTokenExpires = new Date(Date.now() + AuthController.TOKEN_EXPIRY);
      await user.save();

      await sendVerificationEmail(user.email, newToken);
      res.status(200).json({ success: true, message: "Link verifikasi baru telah dikirim." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user) return res.status(404).json({ message: "User tidak ditemukan." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Password salah." });

      const token = jwt.sign(
        { id: user.id, role: user.role, isVerified: user.isVerified }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      res.status(200).json({ 
        access_token: token, 
        email: user.email, 
        role: user.role, 
        isVerified: user.isVerified 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;