const express = require("express");
const session = require("express-session")
const passport = require("passport");
const userRoutes = require("../routes/user");
const pointRoutes = require("../routes/point");
const notificationRoutes = require("../routes/notification");
const proxyRoutes = require("../routes/proxy");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session)
const cookieParser = require("cookie-parser")
const User = require("../models/User")
const db = require("../database")


const config = app => {

    app.use(express.json());

    app.use(express.urlencoded({ extended: false }));

    app.use(cookieParser());

    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        cookie: { maxAge: 60 * 60 * 2 }
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    userRoutes(app);
    pointRoutes(app);
    notificationRoutes(app);
    proxyRoutes(app);
}

module.exports = config;