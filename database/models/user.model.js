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
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Invalid email'
                }
            }
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
    },{
        tableName: 'users'
    });

    User.beforeCreate(async (user, options) => {
        user.password = await bcrypt.hash(user.password, saltRounds);
    });

    User.prototype.comparePassword = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    User.prototype.toJSON = function () {
        const values = { ...this.get() };

        // Remove sensitive data
        delete values.password;
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    };
};
