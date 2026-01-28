module.exports = (sequelize, DataTypes) => {
  const SubDistrict = sequelize.define('SubDistrict', {
    sub_district_id: DataTypes.INTEGER,
    district_id: DataTypes.INTEGER,
    data: DataTypes.TEXT
  }, {});
  return SubDistrict;
};