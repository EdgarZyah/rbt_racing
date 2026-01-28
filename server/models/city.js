module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    city_id: DataTypes.INTEGER,
    province_id: DataTypes.INTEGER,
    data: DataTypes.TEXT
  }, {});
  return City;
};