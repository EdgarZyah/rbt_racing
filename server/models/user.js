'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Definisikan relasi di sini jika ada (misal: User.hasMany(models.Cart))
      User.hasMany(models.Cart, { foreignKey: 'UserId' });
      User.hasMany(models.Order, { foreignKey: 'UserId' });
      User.hasMany(models.Address, { foreignKey: 'UserId' });
      User.hasMany(models.Review, { foreignKey: 'UserId' });
    }
  }
  
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'CUSTOMER'
    },
    
    // --- KOLOM VERIFIKASI EMAIL & RESET PASSWORD ---
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: DataTypes.STRING,
    verificationTokenExpires: DataTypes.DATE,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,

    // --- KOLOM LIMITASI CHAT AI (YANG BARU) ---
    chatQuota: {
      type: DataTypes.INTEGER,
      defaultValue: 3
    },
    lastChatDate: {
      type: DataTypes.DATEONLY, // Pastikan pakai DATEONLY agar selaras dengan migrasi
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};