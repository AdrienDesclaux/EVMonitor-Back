const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user',
  },
);

module.exports = User;
