const dashboard_controller = require("../controllers/dashboard");
const middleware = require("../controllers/verifyPermission");
const passport = require("passport");
require("../security/passport")

const routes = app => {

    app.post("/", (req, res) => { res.json({ message: "Funciona" }) });

    /**
     * Authentication route
     */
    app.post("/api/auth", dashboard_controller.signin);

    /**
     * Personal Routes
     */
    app.get("/api/me", passport.authenticate('jwt', { session: false }), dashboard_controller.profile)
    app.put("/api/me", passport.authenticate('jwt', { session: false }), dashboard_controller.updateProfile)

    /**
     * General User routes
     */
    app.get("/api/user", passport.authenticate('jwt', { session: false }), dashboard_controller.getUsers)
    app.get("/api/user/:id", passport.authenticate('jwt', { session: false }), dashboard_controller.getUserById)
    app.get("/api/user/search", passport.authenticate('jwt', { session: false }), dashboard_controller.getUsers)
    app.get("/api/user/search/:key", passport.authenticate('jwt', { session: false }), dashboard_controller.getUsersByKey)
    app.post("/api/user", passport.authenticate('jwt', { session: false }), dashboard_controller.signup)
    app.delete("/api/user/:id", passport.authenticate('jwt', { session: false }), dashboard_controller.deleteUser)
}

module.exports = routes;