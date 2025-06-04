module.exports = (sequelize, DataTypes) => {
    const ListServer = sequelize.define('ListServer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Port: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'list_server',
        timestamps: false
    })
    return ListServer
}
