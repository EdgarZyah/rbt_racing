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
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'MANUAL_TRANSFER' },
    
    // DETAIL PENGIRIMAN
    shippingAddress: { type: DataTypes.TEXT, allowNull: false }, 
    shippingCost: { type: DataTypes.INTEGER, defaultValue: 0 },
    shippingService: { type: DataTypes.STRING }, 
    resi: { type: DataTypes.STRING, allowNull: true },

    // TAMBAHAN: BUKTI BAYAR
    paymentProof: { type: DataTypes.STRING, allowNull: true } 
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.hasMany(models.OrderItem, { as: 'items' });
  };
  return Order;
};