module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    totalAmount: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
      type: DataTypes.ENUM('PENDING', 'PAID', 'SHIPPED', 'CANCELLED', 'DELIVERED'),
      defaultValue: 'PENDING'
    },
    shippingAddress: { type: DataTypes.TEXT, allowNull: false }, // Kolom ini yang tadi error
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'MANUAL_TRANSFER' }
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.hasMany(models.OrderItem, { as: 'items' });
  };
  return Order;
};