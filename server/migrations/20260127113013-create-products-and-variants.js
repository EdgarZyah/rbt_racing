'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tabel Products
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { type: Sequelize.STRING },
      slug: { type: Sequelize.STRING, unique: true },
      price: { type: Sequelize.INTEGER },
      stock: { type: Sequelize.INTEGER }, // Stok Global
      description: { type: Sequelize.TEXT },
      imageUrl: { type: Sequelize.STRING },
      gallery: { type: Sequelize.TEXT }, // Kolom baru
      featured: { type: Sequelize.BOOLEAN, defaultValue: false }, // Kolom baru
      CategoryId: {
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 2. Tabel ProductVariants
    await queryInterface.createTable('ProductVariants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: { type: Sequelize.STRING },
      value: { type: Sequelize.STRING },
      imageUrl: { type: Sequelize.STRING },
      stock: { type: Sequelize.INTEGER, defaultValue: 0 }, // Stok per varian
      ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductVariants');
    await queryInterface.dropTable('Products');
  }
};