const checkUsername = require('./checkUsername');
const checkEmail = require('./checkEmail');
const checkPassword = require('./checkPassword');

module.exports = [
    checkUsername,
    checkEmail,
    checkPassword,
]
