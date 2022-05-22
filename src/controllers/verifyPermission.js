const passport = require("passport");

const middleware = {};


middleware.verifyPermissions = async(req, res, next) => {
    passport.authenticate('jwt', { session: false })
    next()
}


module.exports = middleware;