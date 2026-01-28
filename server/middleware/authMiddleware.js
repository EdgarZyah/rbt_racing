// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware untuk mengautentikasi token JWT
 * Memastikan token ada, valid, dan menyimpan data user ke req.user
 */
const authenticate = (req, res, next) => {
  // Mengambil token dari header Authorization (Bearer <token>)
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verifikasi token menggunakan secret key dari .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Menyimpan data hasil decode (id, role, isVerified) ke objek request
    req.user = decoded;
    next();
  } catch (err) {
    // Menangani token expired atau tidak valid
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware untuk membatasi akses khusus ADMIN
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};

/**
 * Middleware tambahan untuk memvalidasi apakah email sudah diverifikasi
 * Berguna untuk memproteksi route checkout/payment di sisi server
 */
const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ 
      message: "Your email is not verified. Please verify your email to proceed with this action." 
    });
  }
  next();
};

// Ekspor semua fungsi sebagai objek agar konsisten saat di-import
module.exports = { 
  authenticate, 
  authorizeAdmin, 
  requireVerification 
};