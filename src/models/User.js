const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username required"]
    },
    role: {
        type: String,
        required: [true, "Role required"]
    },
    gameNickname: {
        type: String,
        required: [true, "Game nickname required"]
    },
    gameId: {
        type: String,
        required: [true, "Game ID required"]
    },
    discordId: {
        type: String,
        required: [true, "Discord ID required"]
    },
    yearsOld: {
        type: Number,
        required: [true, "Years old required"]
    },
    gender: {
        type: String,
        required: [true, "Gender required"]
    },
    password: {
        type: String,
        required: [true, "Password required"]
    }
})

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function(next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
    next();
})

userSchema.methods.encryptPassword = async(password) => {
    const hash = await bcrypt.hash(password, 10)
    return hash;
}

module.exports = model("user", userSchema, "user");