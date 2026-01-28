module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      receiverName: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      
      // ID Wilayah (Untuk API RajaOngkir)
      provinceId: { type: DataTypes.STRING, allowNull: true },
      cityId: { type: DataTypes.STRING, allowNull: true },
      districtId: { type: DataTypes.STRING, allowNull: true },     // BARU
      subDistrictId: { type: DataTypes.STRING, allowNull: true },  // BARU
      
      // Nama Wilayah (Untuk Tampilan AddressBook)
      province: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      district: { type: DataTypes.STRING, allowNull: true },       // BARU
      subDistrict: { type: DataTypes.STRING, allowNull: true },    // BARU
      
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