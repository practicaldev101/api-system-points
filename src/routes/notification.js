const notification_controller = require("../controllers/notification");
const passport = require("passport");
require("../security/passport")

const routes = app => {

    app.get("/api/notification", passport.authenticate('jwt', { session: false }),notification_controller.notify);

}

module.exports = routes;