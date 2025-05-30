const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  refNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  accountNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  isProcessed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  transactionCode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Mã giao dịch từ nội dung chuyển khoản'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['refNo']
    },
    {
      fields: ['transactionCode']
    }
  ],
  tableName: 'Transactions'
});
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });
module.exports = Transaction; 