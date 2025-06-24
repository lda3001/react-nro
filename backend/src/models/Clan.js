const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Clan = sequelize.define('Clan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING(50),
    defaultValue: '',
    collate: 'utf8mb4_unicode_ci'
  },
  Slogan: {
    type: DataTypes.STRING(500),
    defaultValue: '',
    collate: 'utf8mb4_unicode_ci'
  },
  ImgId: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  Power: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  LeaderName: {
    type: DataTypes.STRING(50),
    defaultValue: '',
    collate: 'utf8mb4_unicode_ci'
  },
  CurrMember: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  MaxMember: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  Date: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  Level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  Point: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  Members: {
    type: DataTypes.TEXT('long'),
    defaultValue: null,
    collate: 'utf8mb4_unicode_ci'
  },
  Messages: {
    type: DataTypes.TEXT('long'),
    defaultValue: null,
    collate: 'utf8mb4_unicode_ci'
  },
  CharacterPeas: {
    type: DataTypes.TEXT('long'),
    defaultValue: null,
    collate: 'utf8mb4_unicode_ci'
  },
  BDKB: {
    type: DataTypes.TEXT('long'),
    defaultValue: null,
    collate: 'utf8mb4_unicode_ci'
  },
  LimitJoinBDKB: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 5
  },
  ZoneBDKB: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  doanhtrai: {
    type: DataTypes.TEXT('long'),
    defaultValue: null,
    collate: 'utf8mb4_unicode_ci'
  },
  LimitJoindoanhtrai: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  Zonedoanhtrai: {
    type: DataTypes.INTEGER,
    defaultValue: null
  }
}, {
  tableName: 'clan',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  timestamps: false
});

module.exports = Clan; 