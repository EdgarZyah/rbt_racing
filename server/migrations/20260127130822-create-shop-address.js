'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShopAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shopName: { type: Sequelize.STRING, defaultValue: "My Store" },
      phoneNumber: { type: Sequelize.STRING },
      
      // ID Wilayah (Untuk API RajaOngkir)
      provinceId: { type: Sequelize.STRING },
      cityId: { type: Sequelize.STRING },
      districtId: { type: Sequelize.STRING },
      subDistrictId: { type: Sequelize.STRING },

      // Nama Wilayah (Untuk Display)
      province: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      district: { type: Sequelize.STRING },
      subDistrict: { type: Sequelize.STRING },

      postalCode: { type: Sequelize.STRING },
      fullAddress: { type: Sequelize.TEXT },
      
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShopAddresses');
  }
};