const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('Users', [
      { id: 1, username: 'Admin RBT', email: 'admin@example.com', password: hashedPassword, role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, username: 'Rider Customer', email: 'user@example.com', password: hashedPassword, role: 'CUSTOMER', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('Users', null, {}); }
};