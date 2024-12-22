const {body} = require("express-validator");

const sequelize = require("../database")
const User = sequelize.models.User;

module.exports = body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
    .custom(async email => {
        if (await User.findOne({where: {email}})) {
            throw new Error('This email is already registered!');
        }
    })
