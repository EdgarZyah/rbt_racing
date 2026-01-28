'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'verificationTokenExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'verificationTokenExpires');
  }
};