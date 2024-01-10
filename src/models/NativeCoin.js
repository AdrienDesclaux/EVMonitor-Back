const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class NativeCoin extends Model {}

NativeCoin.init(
  {
    symbol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    evm: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'nativecoin',
  },
);

module.exports = NativeCoin;
