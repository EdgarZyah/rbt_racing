module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    priceAtPurchase: { type: DataTypes.INTEGER, allowNull: false }, // Harga saat dibeli (bukan harga produk sekarang)
    selectedVariants: { type: DataTypes.JSON } // Menyimpan pilihan Inlet, Finish, dll.
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order);
    OrderItem.belongsTo(models.Product);
  };
  return OrderItem;
};