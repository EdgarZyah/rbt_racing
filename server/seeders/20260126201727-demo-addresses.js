module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Addresses', [
      {
        receiverName: 'Rider One',
        phoneNumber: '08123456789',
        province: 'Jawa Barat',
        city: 'Bandung',
        postalCode: '40123',
        fullAddress: 'Jl. Balap No. 1, Kota Bandung',
        isMain: true,
        UserId: 2, // Customer
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('Addresses', null, {}); }
};