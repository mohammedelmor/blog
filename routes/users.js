const process = require("node:process");
const express = require("express");
const {sign, verify} = require("jsonwebtoken");

const sequelize = require("../database");
const logger = require("../logger");

// middlewares
const checkUserRegistration = require("../middlewares/users/checkUserRegistration");
const checkUserLogin = require("../middlewares/users/checkUserLogin");
const checkRefreshToken = require("../middlewares/users/checkRefreshToken");
const checkValidation = require("../middlewares/checkValidation");

const router = express.Router();

router.post("/signup",
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

router.post("/login",
    checkUserLogin,
    checkValidation,
    async (req, res) => {
        try {
            const User = sequelize.models.User;
            const RefreshToken = sequelize.models.RefreshToken;
            const user = await User.findOne({
                where: {
                    username: req.body.username,
                }
            })
            if (!user || !await user.comparePassword(req.body.password)) {
                res.status(403).json({message: "Invalid credentials!"})
            }

            // Generate tokens
            const accessToken = sign({user}, process.env.TOKEN_PRIVATE_KEY, {expiresIn: '1h'});
            const refreshToken = sign({user}, process.env.REFRESH_TOKEN_PRIVATE_KEY, {expiresIn: '7d'});

            const transaction = await sequelize.transaction();
            try {
                await RefreshToken.update(
                    { revoked: true },
                    { where: { user_id: user.id, revoked: false, device_name: req.headers["user-agent"] || "Unknown device" } }
                , { transaction });

                await RefreshToken.create({
                    user_id: user.id,
                    token: refreshToken,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    revoked: false,
                    device_name: req.headers["user-agent"] || "Unknown device"
                , transaction});

                await transaction.commit();

                res.status(200).json({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: process.env.TOKEN_EXPIRATION_TIME_IN_SEC,
                    token_type: process.env.TOKEN_TYPE,
                })

                logger.log('info', `User logged in successfully. | username: ${req.body.username}`);
            } catch (error) {
                await transaction.rollback();
                return res.status(500).json({message: "Error happened while logging in..."})
            }
        } catch (error) {
            res.status(400).json({message: "username or password is incorrect!"})
        }
    })


router.post("/refresh", checkRefreshToken, checkValidation, async (req, res) => {
    const userRefreshToken = req.body.refresh_token;

    if (!userRefreshToken) {
        return res.status(400).json({message: "Refresh token is required."});
    }

    try {
        const decoded = await new Promise((resolve, reject) => {
            verify(userRefreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        const {user} = decoded;

        const RefreshToken = sequelize.models.RefreshToken;
        const User = sequelize.models.User;

        const refreshToken = await RefreshToken.findOne({
            where: {token: userRefreshToken, revoked: false},
            include: [{model: User, as: 'User'}]
        });

        if (!refreshToken || !refreshToken.User) {
            return res.status(401).json({
                message: "Invalid or revoked refresh token."
            });
        }

        if (refreshToken.User.id !== user.id) {
            return res.status(401).json({
                message: "User associated with the token does not match."
            });
        }

        const transaction = await sequelize.transaction();
        try {
            await refreshToken.update({revoked: true}, {transaction});

            const accessToken = sign(
                {user: refreshToken.User},
                process.env.TOKEN_PRIVATE_KEY,
                {expiresIn: '1h'}
            );
            const newRefreshToken = sign(
                {user: refreshToken.User},
                process.env.REFRESH_TOKEN_PRIVATE_KEY,
                {expiresIn: '7d'}
            );

            await RefreshToken.create(
                {
                    user_id: refreshToken.User.id,
                    token: newRefreshToken,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    revoked: false,
                    device_name: req.headers["user-agent"] || "Unknown device"
                },
                {transaction}
            );

            await transaction.commit();

            // Respond with the newly generated tokens
            return res.status(200).json({
                access_token: accessToken,
                refresh_token: newRefreshToken,
                expires_in: process.env.TOKEN_EXPIRATION_TIME_IN_SEC || 3600,
                token_type: process.env.TOKEN_TYPE || 'Bearer',
            });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({message: "Failed to refresh token. Please try again."});
        }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({message: "Refresh token has expired. Please log in again."});
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({message: "Invalid refresh token."});
        }
        return res.status(500).json({message: "An error occurred while refreshing the token."});
    }
});

module.exports = router

