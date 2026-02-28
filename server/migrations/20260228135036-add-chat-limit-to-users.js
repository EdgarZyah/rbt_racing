'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'chatQuota', {
      type: Sequelize.INTEGER,
      defaultValue: 3
    });
    await queryInterface.addColumn('Users', 'lastChatDate', {
      type: Sequelize.DATEONLY, // Hanya menyimpan tanggal (YYYY-MM-DD)
      defaultValue: Sequelize.fn('NOW')
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'chatQuota');
    await queryInterface.removeColumn('Users', 'lastChatDate');
  }
};