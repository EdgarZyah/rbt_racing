// server/models/cart.js
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    // Kita simpan varian sebagai string JSON untuk fleksibilitas
    selectedVariants: {
      type: DataTypes.TEXT, 
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('selectedVariants');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('selectedVariants', JSON.stringify(value));
      }
    },
    rawVariantId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User);
    Cart.belongsTo(models.Product);
  };

  return Cart;
};