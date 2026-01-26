'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Knalpot Racing Vario 160 Full System',
        description: 'Suara ngebas adem, performa naik 2HP. Bahan stainless steel anti karat.',
        price: 750000,
        stock: 10,
        imageUrl: '/uploads/knalpot-vario.jpg',
        categoryId: 1, // Kategori Matic
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Slip-On Ninja ZX-25R Carbon',
        description: 'Silencer carbon asli, suara teriak di RPM tinggi. PNP untuk ZX-25R.',
        price: 2500000,
        stock: 5,
        imageUrl: '/uploads/knalpot-zx25r.jpg',
        categoryId: 3, // Kategori Sport 250cc
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Knalpot Standar Racing Aerox 155',
        description: 'Tampilan standar tapi tenaga racing. Cocok untuk harian.',
        price: 600000,
        stock: 15,
        imageUrl: '/uploads/knalpot-aerox.jpg',
        categoryId: 1, // Kategori Matic
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Knalpot Kolong RX-King 3v3',
        description: 'Suara garing kemrincing khas 2 tak. Tenaga jambak.',
        price: 450000,
        stock: 8,
        imageUrl: '/uploads/knalpot-rxking.jpg',
        categoryId: 2, // Kita masukkan ke Sport 150cc/Bebek sbg contoh
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};