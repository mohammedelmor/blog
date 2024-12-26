const {verify} = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization.replace("Bearer ", "")
    verify(token, process.env.TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) return res.status(401).json({message: "Invalid token"})
        req.user = decoded.user;
        next();
    })
}