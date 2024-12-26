const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Post = sequelize.define('Post', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                min: 5,
            }
        },
        body: {
            allowNull: false,
            type: DataTypes.STRING(1500),
            validate: {
                min: 50,
            }
        }
    }, {
        tableName: 'posts'
    });

};
