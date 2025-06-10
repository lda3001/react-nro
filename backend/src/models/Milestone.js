const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Milestone = sequelize.define('Milestone', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reward: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    tableName: 'milestones',
    timestamps: false
});

module.exports = Milestone;
