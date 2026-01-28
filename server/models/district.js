module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define('District', {
    district_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    data: DataTypes.TEXT
  }, {});
  return District;
};