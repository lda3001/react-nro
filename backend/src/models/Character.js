const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Character = sequelize.define('Character', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: ''
  },
  Skills: {
    type: DataTypes.TEXT('LONG'),
    allowNull: false
  },
  ItemBody: {
    type: DataTypes.TEXT('LONG'),
    allowNull: false
  },
  ItemBag: {
    type: DataTypes.TEXT('LONG'),
    allowNull: false
  },
  ItemBox: {
    type: DataTypes.TEXT('LONG'),
    allowNull: false
  },
  InfoChar: {
    type: DataTypes.TEXT('LONG'),
    allowNull: false
  },
  BoughtSkill: {
    type: DataTypes.TEXT('LONG'),
    allowNull: false
  },
  PlusBag: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  PlusBox: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  Friends: {
    type: DataTypes.TEXT('LONG'),
    allowNull: true
  },
  Enemies: {
    type: DataTypes.TEXT('LONG'),
    allowNull: true
  },
  Me: {
    type: DataTypes.STRING(500),
    defaultValue: '[]'
  },
  ClanId: {
    type: DataTypes.INTEGER,
    defaultValue: -1
  },
  LuckyBox: {
    type: DataTypes.TEXT('LONG'),
    allowNull: true
  },
  LastLogin: {
    type: DataTypes.DATE,
    defaultValue: '2022-03-05 18:25:21'
  },
  CreateDate: {
    type: DataTypes.DATE,
    defaultValue: '2022-03-05 18:25:21'
  },
  SpecialSkill: {
    type: DataTypes.TEXT('LONG'),
    allowNull: true
  },
  InfoBuff: {
    type: DataTypes.TEXT('LONG'),
    allowNull: true
  },
  diemsukien: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  thoivang: {
    type: DataTypes.STRING(255),
    defaultValue: '0'
  },
  Enchant: {
    type: DataTypes.TEXT('LONG'),
    allowNull: true
  },
  DataBlackBall: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  DataBlackBall2: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  DataBlackBall3: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  DataBlackBall4: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  DataBlackBall5: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  DataBlackBall6: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  DataBlackBall7: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'character',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Character; 