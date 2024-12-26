const {body} = require("express-validator");

const sequelize = require("../../database")
const User = sequelize.models.User;

module.exports = body('username')
    .notEmpty()
    .isLength({min: 3})
    .trim()
    .escape()
    .withMessage("username min length: 3")
    .custom(async username => {
        if (await User.findOne({ where: { username } })) {
            throw new Error('Username already exists');
        }
    })
