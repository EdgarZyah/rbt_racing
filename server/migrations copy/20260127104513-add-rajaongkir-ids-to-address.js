'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Addresses', 'provinceId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'phoneNumber'
    });
    await queryInterface.addColumn('Addresses', 'cityId', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'provinceId'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Addresses', 'provinceId');
    await queryInterface.removeColumn('Addresses', 'cityId');
  }
};