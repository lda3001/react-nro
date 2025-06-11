const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ItemOptions = sequelize.define('ItemOptions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      option_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      param: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'item_options',
      timestamps: false
    });

module.exports = ItemOptions;