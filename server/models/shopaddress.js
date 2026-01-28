module.exports = (sequelize, DataTypes) => {
  const ShopAddress = sequelize.define('ShopAddress', {
    shopName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    cityId: DataTypes.STRING,
    districtId: DataTypes.STRING,
    subDistrictId: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    district: DataTypes.STRING,
    subDistrict: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    fullAddress: DataTypes.TEXT
  }, {});
  return ShopAddress;
};