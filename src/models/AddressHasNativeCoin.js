const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class AddressHasNativeCoin extends Model {}

AddressHasNativeCoin.init(
  {
    id_address: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_nativecoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'address_has_nativecoin',
  },
);

module.exports = AddressHasNativeCoin;
