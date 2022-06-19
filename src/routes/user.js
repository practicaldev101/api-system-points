const user_controller = require("../controllers/user");
const middleware = require("../controllers/verifyPermission");
const passport = require("passport");
require("../security/passport")

const routes = app => {

    app.post("/", (req, res) => { res.json({ message: "Funciona" }) });

    /**
     * Authentication route
     */
    app.post("/api/auth", user_controller.signin);

    /**
     * Personal Routes
     */
    app.get("/api/me", passport.authenticate('jwt', { session: false }), user_controller.getProfile)
    app.put("/api/me", passport.authenticate('jwt', { session: false }), user_controller.updateProfile)

    /**
     * General User routes
     */
    app.get("/api/user", passport.authenticate('jwt', { session: false }), user_controller.getUsers)
    app.post("/api/user", passport.authenticate('jwt', { session: false }), user_controller.signup)
    app.get("/api/user/:id", passport.authenticate('jwt', { session: false }), user_controller.getUserById)
    app.put("/api/user/:id", passport.authenticate('jwt', { session: false }), user_controller.updateUserById)
    app.delete("/api/user/:id", passport.authenticate('jwt', { session: false }), user_controller.deleteUserById)
    app.get("/api/user/search", passport.authenticate('jwt', { session: false }), user_controller.getUsers)
    app.get("/api/user/search/:key", passport.authenticate('jwt', { session: false }), user_controller.getUsersByKey)
}

module.exports = routes;