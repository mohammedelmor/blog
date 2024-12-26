const {body} = require("express-validator");


module.exports = body('body')
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Body cannot be empty")
    .bail()
    .isLength({min: 50})
    .withMessage('Min body length is 50')
