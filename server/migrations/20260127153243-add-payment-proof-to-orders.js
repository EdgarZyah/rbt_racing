'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Orders');

    // 1. Tambah paymentProof (Penyebab Error Utama)
    if (!tableInfo.paymentProof) {
      await queryInterface.addColumn('Orders', 'paymentProof', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // 2. Tambah Resi (Jika belum ada)
    if (!tableInfo.resi) {
      await queryInterface.addColumn('Orders', 'resi', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // 3. Tambah Shipping Cost (Jika belum ada)
    if (!tableInfo.shippingCost) {
      await queryInterface.addColumn('Orders', 'shippingCost', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      });
    }

    // 4. Tambah Shipping Service (Jika belum ada)
    if (!tableInfo.shippingService) {
      await queryInterface.addColumn('Orders', 'shippingService', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'paymentProof');
    await queryInterface.removeColumn('Orders', 'resi');
    await queryInterface.removeColumn('Orders', 'shippingCost');
    await queryInterface.removeColumn('Orders', 'shippingService');
  }
};