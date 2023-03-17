const notification_controller = require("../controllers/notification");

const routes = app => {

    app.get("/api/notification", notification_controller.notify);

}

module.exports = routes;