'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Testimonials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING, // Opsional (misal: "Pelanggan Setia", "Pembalap Lokal", dll)
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true // Admin bisa menyembunyikan testimoni tanpa menghapusnya
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Testimonials');
  }
};