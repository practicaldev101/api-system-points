const mongoose = require("mongoose");
require("dotenv").config();

const db = mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Database error"))