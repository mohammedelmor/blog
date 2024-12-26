const {body} = require("express-validator");

module.exports = body('refresh_token')
    .notEmpty()
    .trim()
    .escape()
