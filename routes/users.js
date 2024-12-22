const express = require("express");
const {validationResult} = require('express-validator');

const sequelize = require("../database");
const logger = require("../logger");

// middleware
const checkUserRegistration = require("../middlewares/checkUserRegistration");
const checkValidation = require("../middlewares/checkValidation");

const router = express.Router();

router.post("/",
    checkUserRegistration,
    checkValidation,
    async (req, res) => {
        try {
            const User = sequelize.models.User;
            const user = User.build(req.body)
            const savedUser = await user.save()
            logger.log('info', `User saved successfully. | username: ${req.body.username}`);
            res.status(200).json({
                username: savedUser.username,
                email: savedUser.email,
            })
        } catch (error) {
            res.status(500).json({message: "Error happened while creating the user"})
        }
    })

module.exports = router

