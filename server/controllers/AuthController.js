const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../services/emailService');

class AuthController {
  static TOKEN_EXPIRY = 10 * 60 * 1000; // 10 Menit

  // 1. REGISTER
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

  // 2. VERIFY EMAIL
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

  // 3. RESEND VERIFICATION
  static async resendVerification(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email diperlukan." });

      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user) return res.status(404).json({ message: "Email tidak terdaftar." });
      if (user.isVerified) return res.status(400).json({ message: "Akun sudah aktif." });

      const newToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = newToken;
      user.verificationTokenExpires = new Date(Date.now() + AuthController.TOKEN_EXPIRY);
      await user.save();

      await sendVerificationEmail(user.email, newToken);
      res.status(200).json({ success: true, message: "Link baru terkirim." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 4. FORGOT PASSWORD
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user) return res.status(404).json({ message: "Email tidak ditemukan." });

      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + AuthController.TOKEN_EXPIRY);
      await user.save();

      await sendResetPasswordEmail(user.email, token);
      res.status(200).json({ success: true, message: "Link reset password terkirim." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 5. RESET PASSWORD
  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const user = await User.findOne({ 
        where: { 
          resetPasswordToken: token, 
          resetPasswordExpires: { [Op.gt]: new Date() } 
        } 
      });

      if (!user) return res.status(400).json({ message: "Token reset kadaluwarsa." });

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.status(200).json({ success: true, message: "Password berhasil diperbarui." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 6. LOGIN
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
        access_token: token, email: user.email, role: user.role, isVerified: user.isVerified 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;