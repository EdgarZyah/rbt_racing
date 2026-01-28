'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tabel Provinces
    await queryInterface.createTable('Provinces', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      province_id: { type: Sequelize.INTEGER, unique: true },
      data: { type: Sequelize.TEXT }, // Menyimpan JSON raw dari API
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 2. Tabel Cities
    await queryInterface.createTable('Cities', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      city_id: { type: Sequelize.INTEGER, unique: true },
      province_id: { type: Sequelize.INTEGER },
      data: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 3. Tabel Districts (Kecamatan)
    await queryInterface.createTable('Districts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      district_id: { type: Sequelize.INTEGER, unique: true },
      city_id: { type: Sequelize.INTEGER },
      data: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 4. Tabel SubDistricts (Kelurahan)
    await queryInterface.createTable('SubDistricts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      sub_district_id: { type: Sequelize.INTEGER, unique: true },
      district_id: { type: Sequelize.INTEGER },
      data: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SubDistricts');
    await queryInterface.dropTable('Districts');
    await queryInterface.dropTable('Cities');
    await queryInterface.dropTable('Provinces');
  }
};