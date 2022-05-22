const express = require("express");
const session = require("express-session")
const passport = require("passport");
const routes = require("../routes/dashboard");
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
        cookie: { maxAge: 60 * 60 * 1000 }
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    routes(app);
}

module.exports = config;