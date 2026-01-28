const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Gunakan Memory Storage agar bisa diproses sharp sebelum disimpan
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 1. Konfigurasi Field Produk (Untuk Product Controller)
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
  { name: 'variantImages', maxCount: 20 }
]);

// 2. Processor Gambar Produk
const processImages = async (req, res, next) => {
  if (!req.files) return next();

  try {
    const timestamp = Date.now();
    const uploadPath = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Proses Main Image
    if (req.files['image']) {
      const fileName = `main-${timestamp}.webp`;
      await sharp(req.files['image'][0].buffer)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(path.join(uploadPath, fileName));
      req.body.imageUrl = `/uploads/${fileName}`;
    }

    // Proses Gallery
    if (req.files['gallery']) {
      const galleryUrls = [];
      for (const file of req.files['gallery']) {
        const suffix = Math.random().toString(36).substring(7);
        const fileName = `gallery-${timestamp}-${suffix}.webp`;
        await sharp(file.buffer).resize(800).webp({ quality: 80 }).toFile(path.join(uploadPath, fileName));
        galleryUrls.push(`/uploads/${fileName}`);
      }
      req.body.newGalleryUrls = galleryUrls;
    }

    // Proses Variant
    if (req.files['variantImages']) {
      const variantUrls = [];
      for (const file of req.files['variantImages']) {
        const suffix = Math.random().toString(36).substring(7);
        const fileName = `variant-${timestamp}-${suffix}.webp`;
        await sharp(file.buffer).resize(600).webp({ quality: 80 }).toFile(path.join(uploadPath, fileName));
        variantUrls.push(`/uploads/${fileName}`);
      }
      req.body.newVariantUrls = variantUrls;
    }

    next();
  } catch (error) {
    console.error("Image Processing Error:", error);
    res.status(500).json({ message: "Gagal memproses gambar: " + error.message });
  }
};

// 3. Processor Bukti Bayar (KHUSUS PAYMENT)
const processPaymentProof = async (req, res, next) => {
  if (!req.file) return next(); // Skip jika tidak ada file

  try {
    const timestamp = Date.now();
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    const fileName = `payment-${timestamp}.webp`;

    // Resize ringan & Convert ke WebP
    await sharp(req.file.buffer)
      .resize(600) 
      .webp({ quality: 80 })
      .toFile(path.join(uploadPath, fileName));

    // PENTING: Inject filename ke req.file agar dibaca oleh Controller
    req.file.filename = fileName;

    next();
  } catch (error) {
    console.error("Payment Proof Error:", error);
    res.status(500).json({ message: "Gagal memproses bukti bayar" });
  }
};

// Export 'upload' agar bisa dipakai sebagai upload.single()
module.exports = { upload, uploadFields, processImages, processPaymentProof };