const {body} = require("express-validator");


module.exports = body('title')
    .notEmpty()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .bail()
    .isLength({min: 5})
    .withMessage('Min title length is 5')
