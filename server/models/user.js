module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM("ADMIN", "CUSTOMER"),
        defaultValue: "CUSTOMER",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { timestamps: true },
  );

  User.associate = (models) => {
    User.hasMany(models.Order);
    User.hasMany(models.Address);
  };
  return User;
};
