'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testimonial extends Model {
    static associate(models) {
      // Testimonial berdiri sendiri, diinput oleh admin
    }
  }
  Testimonial.init({
    customerName: DataTypes.STRING,
    role: DataTypes.STRING,
    content: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Testimonial',
  });
  return Testimonial;
};