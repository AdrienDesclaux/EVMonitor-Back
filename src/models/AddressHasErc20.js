const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class AddressHasErc20 extends Model {}

AddressHasErc20.init(
  {
    id_address: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_erc20: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'address_has_erc20',
  },
);

module.exports = AddressHasErc20;
