const bcrypt = require("bcrypt");
const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    username: String,
    status: String,
    robloxNickname: String,
    robloxId: String,
    yearsOld: Number,
    gender: String,
    email: String,
    password: String
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