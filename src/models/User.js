const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username required"],
        default: () => "N/A"
    },
    nickname: {
        type: String,
        required: [true, "Game nickname required"],
        default: () => "N/A"
    },
    role: {
        type: String,
        required: [true, "Role required"],
        default: () => "member"
    },
    gameId: {
        type: String,
        required: [true, "Game ID required"],
        default: () => "N/A"
    },
    discordId: {
        type: String,
        required: [true, "Discord ID required"],
        default: () => "N/A"
    },
    yearsOld: {
        type: Number,
        required: [true, "Years old required"],
        default: () => 0
    },
    gender: {
        type: String,
        required: [true, "Gender required"],
        default: () => "N/A"
    },
    password: {
        type: String,
        required: [true, "Password required"],
        default: () => "N/A"
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