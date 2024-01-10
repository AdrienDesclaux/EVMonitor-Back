const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize-client');

class Alert extends Model {}

Alert.init(
  {
    type_alert: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'alert',
  },
);

module.exports = Alert;
