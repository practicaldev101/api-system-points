const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username required"]
    },
    status: {
        type: String,
        required: [true, "Status required"]
    },
    robloxNickname: {
        type: String,
        required: [true, "Roblox user required"]
    },
    robloxId: {
        type: String,
        required: [true, "Roblox ID required"]
    },
    yearsOld: {
        type: Number,
        required: [true, "Years old required"]
    },
    gender: {
        type: String,
        required: [true, "Gender required"]
    },
    email: {
        type: String,
        required: false
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