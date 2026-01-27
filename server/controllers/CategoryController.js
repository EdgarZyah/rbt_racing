const { Category, Product } = require('../models');

class CategoryController {
  // 1. Ambil Semua Kategori
  static async getAll(req, res) {
    try {
      const categories = await Category.findAll({
        order: [['id', 'DESC']]
      });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 2. Tambah Kategori Baru
  static async create(req, res) {
    try {
      const { name } = req.body;
      const newCategory = await Category.create({ name });
      res.status(201).json(newCategory);
    } catch (error) {
      // Menangani error Unique Constraint (Nama sudah ada)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: "Category name already exists" });
      }
      res.status(400).json({ message: error.message });
    }
  }

  // 3. Update Kategori
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ message: "Category not found" });

      await category.update({ name });
      res.status(200).json(category);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: "Category name already exists" });
      }
      res.status(400).json({ message: error.message });
    }
  }

  // 4. Hapus Kategori
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) return res.status(404).json({ message: "Category not found" });

      // Pengecekan: Apakah kategori masih dipakai oleh produk?
      const productCount = await Product.count({ where: { CategoryId: id } });
      if (productCount > 0) {
        return res.status(400).json({ 
          message: `Cannot delete: ${productCount} products are still linked to this category.` 
        });
      }

      await category.destroy();
      res.status(200).json({ message: "Category successfully expunged" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = CategoryController;