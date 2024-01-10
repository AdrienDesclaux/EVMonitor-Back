const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class UserHasAddresses extends Model {}

UserHasAddresses.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_address: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_owned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    subname: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_has_addresses',
  },
);

module.exports = UserHasAddresses;
