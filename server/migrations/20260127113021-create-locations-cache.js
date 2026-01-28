'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Provinces', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      province_id: { type: Sequelize.INTEGER, unique: true },
      data: { type: Sequelize.TEXT }, 
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.createTable('Cities', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      city_id: { type: Sequelize.INTEGER, unique: true },
      province_id: { type: Sequelize.INTEGER },
      data: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.createTable('Districts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      district_id: { type: Sequelize.INTEGER, unique: true },
      city_id: { type: Sequelize.INTEGER },
      data: { type: Sequelize.TEXT },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

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