const express = require("express");

const config = require("./server/config");

const database = require("./database");

const app = express();

require("dotenv").config();

config(app);

app.listen(process.env.PORT, () => {
    console.log("It's listening at " + process.env.PORT + " port")
})