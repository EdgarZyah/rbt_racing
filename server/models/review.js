// server/models/review.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User);
      Review.belongsTo(models.Product);
      Review.belongsTo(models.Order); // Relasi ke Order agar ulasan terikat transaksi
    }
  }
  Review.init({
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    OrderId: DataTypes.STRING, // TAMBAHKAN KOLOM INI
    rating: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};