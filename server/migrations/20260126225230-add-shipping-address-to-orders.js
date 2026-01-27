'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tambahkan kolom shippingAddress
    await queryInterface.addColumn('Orders', 'shippingAddress', {
      type: Sequelize.TEXT,
      allowNull: true // Set true dulu agar data lama tidak error, lalu bisa diubah ke false
    });

    // Tambahkan kolom paymentMethod sekalian agar sinkron dengan model
    await queryInterface.addColumn('Orders', 'paymentMethod', {
      type: Sequelize.STRING,
      defaultValue: 'MANUAL_TRANSFER',
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Orders', 'shippingAddress');
    await queryInterface.removeColumn('Orders', 'paymentMethod');
  }
};