'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        fullName: 'Admin Knalpot',
        email: 'admin@knalpot.com',
        password: hashedPassword,
        role: 'admin',
        phoneNumber: '081234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        fullName: 'Budi Pembeli',
        email: 'budi@gmail.com',
        password: hashedPassword,
        role: 'customer',
        phoneNumber: '089876543210',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};