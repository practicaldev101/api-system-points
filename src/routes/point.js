const point_controller = require("../controllers/points");

const passport = require("passport");
require("../security/passport")


const routes = app => {
    app.get("/api/point/user", passport.authenticate('jwt', { session: false }), point_controller.getPoints)
    app.get("/api/point/user/:playerId", passport.authenticate('jwt', { session: false }), point_controller.getPointsById)
    app.post("/api/point/user", passport.authenticate('jwt', { session: false }), point_controller.createPoints)
    app.post("/api/point/user/:playerId/:game", passport.authenticate('jwt', { session: false }), point_controller.createGamePoints)
    app.put("/api/point/user/:playerId/:game/:pointId", passport.authenticate('jwt', { session: false }), point_controller.updatePointsById)
    app.delete("/api/point/user/:pointsId", passport.authenticate('jwt', { session: false }), point_controller.deletePoints)
}

module.exports = routes;