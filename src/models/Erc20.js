const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class Erc20 extends Model {}

Erc20.init(
  {
    contract_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total_supply: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    decimals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price_usd: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_eth: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'erc20',
  },
);

module.exports = Erc20;
