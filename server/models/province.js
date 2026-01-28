module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define('Province', {
    province_id: DataTypes.INTEGER,
    data: DataTypes.TEXT
  }, {});
  return Province;
};