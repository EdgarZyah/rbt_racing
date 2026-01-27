// server/models/productvariant.js
module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define('ProductVariant', {
    category: { type: DataTypes.STRING, allowNull: false }, // e.g., "Color", "Size"
    value: { type: DataTypes.STRING, allowNull: false },    // e.g., "Red", "XL"
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }     // Stok per varian
  });

  ProductVariant.associate = (models) => {
    ProductVariant.belongsTo(models.Product, { foreignKey: 'ProductId' });
  };
  return ProductVariant;
};