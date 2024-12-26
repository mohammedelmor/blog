const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Comment = sequelize.define('Comment', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        body: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                min: 1
            }
        }
    },{
        tableName: 'comments'
    });
};
