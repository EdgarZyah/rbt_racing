module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('ProductVariants', [
      // Variasi untuk RBT-01 Carbon Pro (ID: 1)
      { category: 'Inlet', value: '50mm', ProductId: 1, createdAt: new Date(), updatedAt: new Date() },
      { category: 'Inlet', value: '55mm', ProductId: 1, createdAt: new Date(), updatedAt: new Date() },
      { category: 'Finish', value: 'Glossy Carbon', ProductId: 1, createdAt: new Date(), updatedAt: new Date() },
      { category: 'Finish', value: 'Matte Carbon', ProductId: 1, createdAt: new Date(), updatedAt: new Date() },
      
      // Variasi untuk Daily Stealth-X (ID: 2)
      { category: 'Inlet', value: '38mm', ProductId: 2, createdAt: new Date(), updatedAt: new Date() },
      { category: 'Finish', value: 'Black Sandblast', ProductId: 2, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('ProductVariants', null, {}); }
};