const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        token: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        expires_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        revoked: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        device_name: {
            allowNull: false,
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'refresh_tokens'
    });

};
