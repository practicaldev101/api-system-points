const { Schema, model } = require("mongoose")

const SRFSchema = Schema({
    red: {
        type: Number,
        required: true,
        default: () => 0
    },
    yellow:{
        type: Number,
        required: true,
        default: () => 0
    },
    white:{
        type: Number,
        required: true,
        default: () => 0
    },
    failed: {
        type: Number,
        required: true,
        default: () => 0
    },
    total: {
        type: Number,
        required: true,
        default: () => 0
    },
    created: {
        type: Date,
        required: true,
        default: () => new Date(Date.now())
    },
    modified:{
        type: Date,
        required: true,
        default: () => new Date(Date.now())
    }
})
const pointsSubSchema = Schema({
    SRF: {
        type: [SRFSchema], 
        required: true,
        default: () => (
            {
                _id: SRFSchema._id,
                red: SRFSchema.red, 
                yellow: SRFSchema.yellow, 
                white: SRFSchema.white, 
                total: SRFSchema.total, 
                created: SRFSchema.created, 
                modified: SRFSchema.modified}
            )
        },
    _id: false
})


const pointsSchema = Schema({
    userId: {
        type: String,
        required: [true, "User ID required"]
    },
    points: {
        type: pointsSubSchema,
        required: true,
        default: ()=> pointsSubSchema
    }
})


SRFSchema.pre("save", function(next){
    this.created = Date.now();
    this.modified = Date.now();
    next();
})

module.exports = model("points", pointsSchema, "points")