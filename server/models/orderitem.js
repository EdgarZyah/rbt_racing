module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantity: DataTypes.INTEGER,
    priceAtPurchase: DataTypes.INTEGER,
    productSnapshot: DataTypes.TEXT // JSON String {name, image, sku, variant}
  }, {});
  
  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order);
    OrderItem.belongsTo(models.Product);
  };
  return OrderItem;
};