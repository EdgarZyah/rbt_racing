// server/controllers/ProductController.js
const { Product, ProductVariant, Category, sequelize } = require("../models");
const fs = require('fs');
const path = require('path');

class ProductController {
  
  // Helper: Format output agar gallery selalu array
  static _formatProduct(p) {
    if (!p) return null;
    const product = p.toJSON ? p.toJSON() : p;
    try {
      product.gallery = typeof product.gallery === 'string' ? JSON.parse(product.gallery) : (product.gallery || []);
    } catch (e) {
      product.gallery = [];
    }
    return product;
  }

  // Helper: Parse JSON string dari FormData
  static _parseField(fieldValue, defaultValue) {
    if (!fieldValue) return defaultValue;
    try {
      return typeof fieldValue === 'string' ? JSON.parse(fieldValue) : fieldValue;
    } catch (e) {
      return defaultValue;
    }
  }

  // Helper: Hapus file fisik dari server
  static _deleteFile(fileUrl) {
    if (!fileUrl) return;
    try {
      // fileUrl misal: "/uploads/gambar.webp" -> convert ke path absolut sistem
      const absolutePath = path.join(__dirname, '../public', fileUrl);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    } catch (err) {
      console.error(`Gagal menghapus file ${fileUrl}:`, err.message);
    }
  }

  // ... (GET Methods tetap sama, tidak perlu diubah) ...
  static async getAll(req, res) { /* ... kode sama ... */ 
    try {
      const products = await Product.findAll({
        include: [
          { model: Category, attributes: ["name"] },
          { model: ProductVariant, as: "variants" },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(products.map(p => ProductController._formatProduct(p)));
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  static async getById(req, res) { /* ... kode sama ... */
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{ model: ProductVariant, as: "variants" }]
      });
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.status(200).json(ProductController._formatProduct(product));
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  static async getBySlug(req, res) { /* ... kode sama ... */ 
    try {
      const product = await Product.findOne({
        where: { slug: req.params.slug },
        include: [{ model: Category }, { model: ProductVariant, as: "variants" }]
      });
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.status(200).json(ProductController._formatProduct(product));
    } catch (error) { res.status(500).json({ message: error.message }); }
  }

  // CREATE (Tetap sama, logic update yang berubah banyak)
  static async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { name, price, stock, description, CategoryId, featured } = req.body;
      const variants = ProductController._parseField(req.body.variants, []);
      const slug = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
      const imageUrl = req.body.imageUrl || null;
      const gallery = req.body.newGalleryUrls || []; // Create hanya pakai gambar baru

      const product = await Product.create({
        name, slug, price: parseInt(price), stock: parseInt(stock), description, CategoryId,
        featured: featured === 'true',
        imageUrl,
        gallery: JSON.stringify(gallery)
      }, { transaction: t });

      if (variants && variants.length > 0) {
        let newVariantImgIdx = 0;
        const newVariantUrls = req.body.newVariantUrls || [];
        const variantData = variants.map(v => {
          let variantImageUrl = null;
          if (v.hasImage && newVariantUrls[newVariantImgIdx]) {
            variantImageUrl = newVariantUrls[newVariantImgIdx];
            newVariantImgIdx++;
          }
          return { ProductId: product.id, category: v.category, value: v.value, stock: parseInt(v.stock), imageUrl: variantImageUrl };
        });
        await ProductVariant.bulkCreate(variantData, { transaction: t });
      }

      await t.commit();
      res.status(201).json({ message: "Product created", product });
    } catch (error) {
      if (t) await t.rollback();
      res.status(400).json({ message: error.message });
    }
  }

  // --- UPDATE (PERBAIKAN UTAMA DISINI) ---
  static async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: ProductVariant, as: 'variants' }] // Load variant untuk cleanup gambar lama
      });
      
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: "Product not found" });
      }

      // 1. Parse Data Dasar
      const { name, price, stock, description, CategoryId, featured } = req.body;
      const variantsInput = ProductController._parseField(req.body.variants, []);
      
      // existingGallery: Daftar URL gambar lama yang user PILIH untuk disimpan
      const keptGallery = ProductController._parseField(req.body.existingGallery, []); 
      
      // newGalleryUrls: Daftar URL gambar BARU yang baru saja diupload
      const newGalleryUrls = req.body.newGalleryUrls || [];

      // 2. Logic Cleanup Gambar Utama (Jika diganti)
      let finalImageUrl = product.imageUrl;
      if (req.body.imageUrl && req.body.imageUrl !== product.imageUrl) {
        // Hapus gambar lama dari disk
        ProductController._deleteFile(product.imageUrl);
        finalImageUrl = req.body.imageUrl;
      }

      // 3. Logic Cleanup Galeri (Hapus yang dibuang user)
      const oldGallery = typeof product.gallery === 'string' ? JSON.parse(product.gallery) : (product.gallery || []);
      
      // Cari gambar yang ada di database lama, TAPI tidak ada di daftar 'keptGallery'
      const removedGalleryImages = oldGallery.filter(url => !keptGallery.includes(url));
      
      // Hapus file fisik gambar yang dibuang
      removedGalleryImages.forEach(url => ProductController._deleteFile(url));

      // Gabungkan yang disimpan + yang baru
      const finalGallery = [...keptGallery, ...newGalleryUrls];

      // 4. Update Data Produk
      let slug = product.slug;
      if (name && name !== product.name) {
        slug = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
      }

      await product.update({
        name, slug, price: parseInt(price), stock: parseInt(stock), description, CategoryId,
        featured: featured === 'true',
        imageUrl: finalImageUrl,
        gallery: JSON.stringify(finalGallery)
      }, { transaction: t });

      // 5. Logic Variant & Cleanup Gambar Variant
      // Kumpulkan semua gambar variant lama
      const oldVariantImages = product.variants.map(v => v.imageUrl).filter(u => u);
      
      // Hapus semua variant lama di DB (teknik replace)
      await ProductVariant.destroy({ where: { ProductId: id }, transaction: t });

      // Bangun data variant baru
      let newVariantImgIdx = 0;
      const newVariantUploads = req.body.newVariantUrls || [];
      const newVariantData = [];
      const activeVariantImages = []; // Untuk melacak gambar mana yang masih dipakai

      variantsInput.forEach(v => {
        let finalVariantImg = v.imageUrl || null; // Default pakai URL lama jika ada

        // Jika user upload baru untuk variant ini
        if (v.hasImage && newVariantUploads[newVariantImgIdx]) {
          finalVariantImg = newVariantUploads[newVariantImgIdx];
          newVariantImgIdx++;
        }

        if (finalVariantImg) activeVariantImages.push(finalVariantImg);

        newVariantData.push({
          ProductId: id,
          category: v.category,
          value: v.value,
          stock: parseInt(v.stock) || 0,
          imageUrl: finalVariantImg
        });
      });

      // Cleanup: Hapus gambar variant lama yang TIDAK ada di daftar variant baru
      const removedVariantImages = oldVariantImages.filter(url => !activeVariantImages.includes(url));
      removedVariantImages.forEach(url => ProductController._deleteFile(url));

      // Simpan variant baru
      if (newVariantData.length > 0) {
        await ProductVariant.bulkCreate(newVariantData, { transaction: t });
      }

      await t.commit();
      res.status(200).json({ message: "Product updated successfully" });

    } catch (error) {
      if (t) await t.rollback();
      console.error("Update Error:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{ model: ProductVariant, as: 'variants' }]
      });
      if (!product) return res.status(404).json({ message: "Product not found" });

      // Hapus semua gambar terkait
      ProductController._deleteFile(product.imageUrl);
      
      const gallery = typeof product.gallery === 'string' ? JSON.parse(product.gallery) : [];
      gallery.forEach(url => ProductController._deleteFile(url));

      product.variants.forEach(v => {
        if(v.imageUrl) ProductController._deleteFile(v.imageUrl);
      });

      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ProductController;