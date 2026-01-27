module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Categories', [
      { id: 1, name: 'MATIC', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'SPORT', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'RACING', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'DAILY', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('Categories', null, {}); }
};