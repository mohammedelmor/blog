const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                is: /^\w{3,}$/
            }
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        }
    });

    User.beforeCreate(async (user, options) => {
        user.password = await bcrypt.hash(user.password, saltRounds);
    });
};
