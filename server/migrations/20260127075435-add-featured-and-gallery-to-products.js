'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Tambah kolom 'featured' ke tabel Products
    await queryInterface.addColumn('Products', 'featured', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // 2. Tambah kolom 'gallery' ke tabel Products (untuk galeri foto)
    await queryInterface.addColumn('Products', 'gallery', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // 3. Tambah kolom 'imageUrl' ke tabel ProductVariants
    await queryInterface.addColumn('ProductVariants', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'featured');
    await queryInterface.removeColumn('Products', 'gallery');
    await queryInterface.removeColumn('ProductVariants', 'imageUrl');
  }
};