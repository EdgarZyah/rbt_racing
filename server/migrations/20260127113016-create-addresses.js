'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      receiverName: { type: Sequelize.STRING },
      phoneNumber: { type: Sequelize.STRING },
      
      // ID Wilayah (Untuk API RajaOngkir)
      provinceId: { type: Sequelize.STRING },
      cityId: { type: Sequelize.STRING },
      districtId: { type: Sequelize.STRING },
      subDistrictId: { type: Sequelize.STRING },

      // Nama Wilayah (Untuk Tampilan User)
      province: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      district: { type: Sequelize.STRING },
      subDistrict: { type: Sequelize.STRING },

      postalCode: { type: Sequelize.STRING },
      fullAddress: { type: Sequelize.TEXT },
      isMain: { type: Sequelize.BOOLEAN, defaultValue: false },
      
      UserId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Addresses');
  }
};