const {body} = require("express-validator");

module.exports = [
    body('username')
        .notEmpty()
        .trim()
        .escape()
        .withMessage("Username cannot be empty"),
    body('password')
        .notEmpty()
        .trim()
        .escape()
        .withMessage("Password cannot be empty")
]
