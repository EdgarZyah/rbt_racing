// server/controllers/TestimonialController.js
const { Testimonial } = require('../models');

class TestimonialController {
  // ==========================================
  // PUBLIC ENDPOINT (Untuk Homepage)
  // ==========================================
  static async getActiveTestimonials(req, res) {
    try {
      const testimonials = await Testimonial.findAll({
        where: { isActive: true },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(testimonials);
    } catch (error) {
      console.error('Error fetching active testimonials:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================
  
  // Mengambil semua testimoni (termasuk yang tidak aktif)
  static async getAllTestimonials(req, res) {
    try {
      const testimonials = await Testimonial.findAll({
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(testimonials);
    } catch (error) {
      console.error('Error fetching all testimonials:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Menambah testimoni baru
  static async createTestimonial(req, res) {
    try {
      const { customerName, role, content, rating, isActive } = req.body;

      const newTestimonial = await Testimonial.create({
        customerName,
        role,
        content,
        rating: rating || 5,
        isActive: isActive !== undefined ? isActive : true
      });

      res.status(201).json({
        message: 'Testimoni berhasil ditambahkan',
        data: newTestimonial
      });
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Mengedit testimoni
  static async updateTestimonial(req, res) {
    try {
      const { id } = req.params;
      const { customerName, role, content, rating, isActive } = req.body;

      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
      }

      await testimonial.update({
        customerName,
        role,
        content,
        rating,
        isActive
      });

      res.status(200).json({
        message: 'Testimoni berhasil diperbarui',
        data: testimonial
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Menghapus testimoni
  static async deleteTestimonial(req, res) {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
      }

      await testimonial.destroy();

      res.status(200).json({ message: 'Testimoni berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Mengubah status aktif/tidak aktif dengan cepat
  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      
      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimoni tidak ditemukan' });
      }

      await testimonial.update({ isActive: !testimonial.isActive });

      res.status(200).json({
        message: `Testimoni berhasil di${testimonial.isActive ? 'aktifkan' : 'nonaktifkan'}`,
        data: testimonial
      });
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = TestimonialController;