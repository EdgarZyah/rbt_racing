// server/models/product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // PENTING: Tipe TEXT untuk menyimpan JSON String array gambar
    gallery: {
      type: DataTypes.TEXT, 
      allowNull: true
    }
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category);
    Product.hasMany(models.ProductVariant, { as: 'variants', onDelete: 'CASCADE' });
  };

  return Product;
};