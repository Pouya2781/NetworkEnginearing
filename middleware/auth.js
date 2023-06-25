const jwt = require("jsonwebtoken");
const config = require("config");

const jwtPrivateKey = config.get("jwt.private_key");

module.exports = async function (req, res, next) {
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).json({ status: "missing_token", message: "Access denied. auth token required!" });
    
    let decoded = null;
    try {
        decoded = jwt.verify(token, jwtPrivateKey);
    }
    catch (ex) {
        return res.status(400).json({ status: "invalid_token", message: "Invalid token!" });
    }

    req.user = decoded;
    next();
}