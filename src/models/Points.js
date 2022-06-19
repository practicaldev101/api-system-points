const { Schema, model } = require("mongoose")

const pointsSchema = Schema({
    userId: {
        type: String,
        required: [true, "User ID required"]
    },
    pointGroup: {
        type: Array,
        required: [true, "User point group required"]
    }
})


module.exports = model("points", pointsSchema, "points")