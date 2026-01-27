module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      receiverName: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      province: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      postalCode: { type: DataTypes.STRING, allowNull: false },
      fullAddress: { type: DataTypes.TEXT, allowNull: false },
      isMain: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { timestamps: true },
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User);
  };
  return Address;
};
