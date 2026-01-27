module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Products', [
      {
        id: 1,
        name: 'RBT-01 Carbon Pro',
        slug: 'rbt-01-carbon-pro',
        price: 2500000,
        stock: 10,
        imageUrl: '/uploads/product-sample-1.webp',
        description: 'High performance racing exhaust with carbon fiber finish.',
        CategoryId: 3, // RACING
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Daily Stealth-X',
        slug: 'daily-stealth-x',
        price: 1200000,
        stock: 15,
        imageUrl: '/uploads/product-sample-2.webp',
        description: 'Perfect for daily use with low noise levels.',
        CategoryId: 4, // DAILY
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('Products', null, {}); }
};