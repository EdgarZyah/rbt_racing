module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Orders', [
      {
        id: 'ORD-2026-001',
        totalAmount: 2500000,
        status: 'PAID',
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ORD-2026-002',
        totalAmount: 1200000,
        status: 'PENDING',
        UserId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('Orders', null, {}); }
};