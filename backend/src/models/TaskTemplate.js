const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const TaskTemplate = sequelize.define('TaskTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    defaultValue: ''
  },
  gender: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  detail: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    defaultValue: ''
  },
  subNames: {
    type: DataTypes.STRING(5000),
    allowNull: true,
    defaultValue: '[]'
  },
  counts: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: '[]'
  },
  contentInfo: {
    type: DataTypes.STRING(5000),
    allowNull: true,
    defaultValue: '[]'
  },
  gold: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '0'
  },
  gem: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '0'
  },
  tnsm: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '0'
  }
}, {
  tableName: 'tasktemplate',
  timestamps: false
});

module.exports = TaskTemplate; 