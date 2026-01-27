module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: { msg: "Category name already exists" },
      validate: {
        notEmpty: { msg: "Category name cannot be empty" }
      }
    }
  }, { timestamps: true });

  Category.associate = (models) => {
    // Relasi: Satu kategori bisa memiliki banyak produk
    Category.hasMany(models.Product, { foreignKey: 'CategoryId' });
  };
  return Category;
};