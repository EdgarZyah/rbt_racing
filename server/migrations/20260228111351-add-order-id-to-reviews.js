'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Reviews', 'OrderId', {
      type: Sequelize.STRING, // Sesuaikan dengan tipe data ID Order Anda (ORD-...)
      allowNull: false,
      references: { model: 'Orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reviews', 'OrderId');
  }
};