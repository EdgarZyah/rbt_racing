'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan kolom note pada tabel Carts
    await queryInterface.addColumn('Carts', 'note', {
      type: Sequelize.TEXT,
      allowNull: true, // Opsional
    });

    // Menambahkan kolom note pada tabel OrderItems (untuk riwayat checkout)
    await queryInterface.addColumn('OrderItems', 'note', {
      type: Sequelize.TEXT,
      allowNull: true, // Opsional
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus kolom jika dilakukan rollback (undo migration)
    await queryInterface.removeColumn('Carts', 'note');
    await queryInterface.removeColumn('OrderItems', 'note');
  }
};