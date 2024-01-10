const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class Erc721 extends Model {}

Erc721.init(
  {
    contract_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    collection_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    token_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    floor_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'erc721',
  },
);

module.exports = Erc721;
