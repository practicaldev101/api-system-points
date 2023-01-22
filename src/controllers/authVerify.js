const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const middleware = {};


middleware.verifyToken = async(req, res, next) => {

    const token = req.headers["access-token"];

    if (token) {
        try {
            const valid = await jwt.verify(token, process.env.SECRET)
            if (valid) {
                req.authenticated = valid;
                req.decoded_token = jwt.decode(token);
                next();
                return;
            }
        } catch (error) {}
    }

    res.json({ status: "error", message: "Invalid Token" })
}

module.exports = middleware;