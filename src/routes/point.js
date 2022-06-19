const point_controller = require("../controllers/points");

const passport = require("passport");
require("../security/passport")


const routes = app => {
    app.get("/api/point/user", passport.authenticate('jwt', { session: false }), point_controller.getPoints)
    app.get("/api/point/user/:id", passport.authenticate('jwt', { session: false }), point_controller.getPointsById)
    app.post("/api/point/user", passport.authenticate('jwt', { session: false }), point_controller.createPoints)
    app.put("/api/point/user/:id", passport.authenticate('jwt', { session: false }), point_controller.updatePoints)
    app.delete("/api/point/user/:id", passport.authenticate('jwt', { session: false }), point_controller.deletePoints)
}

module.exports = routes;