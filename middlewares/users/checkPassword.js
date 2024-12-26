const {body} = require("express-validator");

module.exports = body('password')
    .notEmpty()
    .trim()
    .withMessage("Password cannot be empty")
