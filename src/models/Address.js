const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class Address extends Model {}

Address.init(
  {
    public_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'address',
  },
);

module.exports = Address;
