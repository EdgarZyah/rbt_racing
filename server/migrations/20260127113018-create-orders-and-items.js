'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tabel Orders
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING // Menggunakan String/UUID
      },
      totalAmount: { type: Sequelize.INTEGER },
      status: { type: Sequelize.STRING, defaultValue: 'PENDING' },
      paymentMethod: { type: Sequelize.STRING },
      shippingAddress: { type: Sequelize.TEXT }, // Snapshot alamat pengiriman
      shippingCost: { type: Sequelize.INTEGER, defaultValue: 0 },
      shippingService: { type: Sequelize.STRING },
      resi: { type: Sequelize.STRING },
      
      UserId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' }
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 2. Tabel OrderItems
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: { type: Sequelize.INTEGER },
      priceAtPurchase: { type: Sequelize.INTEGER },
      
      // Snapshot produk (menyimpan data produk saat dibeli)
      productSnapshot: { type: Sequelize.TEXT }, 

      OrderId: {
        type: Sequelize.STRING,
        references: { model: 'Orders', key: 'id' },
        onDelete: 'CASCADE'
      },
      ProductId: {
        type: Sequelize.INTEGER,
        references: { model: 'Products', key: 'id' },
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItems');
    await queryInterface.dropTable('Orders');
  }
};