const proxy_controller = require("../controllers/proxy");

const routes = app => {
    app.get("/proxy/servers", proxy_controller.getServersByPlaceId)
}

module.exports = routes;