// server/middleware/uploadMiddleware.js
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Konfigurasi field yang diterima dari FormData frontend
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },         // Gambar Utama (Thumbnail)
  { name: 'gallery', maxCount: 10 },      // Galeri Tambahan
  { name: 'variantImages', maxCount: 20 } // Gambar untuk varian
]);

const processImages = async (req, res, next) => {
  // Jika tidak ada file sama sekali, lanjut
  if (!req.files) return next();

  try {
    const timestamp = Date.now();
    // Pastikan path ke public/uploads benar
    const uploadPath = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // 1. Proses Gambar Utama (Main Image)
    if (req.files['image']) {
      const fileName = `main-${timestamp}.webp`;
      await sharp(req.files['image'][0].buffer)
        .resize(800) // Resize agar tidak terlalu berat (opsional)
        .webp({ quality: 80 })
        .toFile(path.join(uploadPath, fileName));
      
      // Masukkan URL ke body agar Controller bisa baca
      req.body.imageUrl = `/uploads/${fileName}`;
    }

    // 2. Proses Galeri (Array)
    if (req.files['gallery']) {
      const galleryUrls = [];
      for (const file of req.files['gallery']) {
        const uniqueSuffix = Math.random().toString(36).substring(7);
        const fileName = `gallery-${timestamp}-${uniqueSuffix}.webp`;
        
        await sharp(file.buffer)
          .resize(800)
          .webp({ quality: 80 })
          .toFile(path.join(uploadPath, fileName));
          
        galleryUrls.push(`/uploads/${fileName}`);
      }
      req.body.newGalleryUrls = galleryUrls; // Gunakan nama variabel jelas
    }

    // 3. Proses Gambar Varian (Array)
    if (req.files['variantImages']) {
      const variantUrls = [];
      for (const file of req.files['variantImages']) {
        const uniqueSuffix = Math.random().toString(36).substring(7);
        const fileName = `variant-${timestamp}-${uniqueSuffix}.webp`;
        
        await sharp(file.buffer)
          .resize(600)
          .webp({ quality: 80 })
          .toFile(path.join(uploadPath, fileName));
          
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

module.exports = { uploadFields, processImages };