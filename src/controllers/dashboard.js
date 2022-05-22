const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const controller = {}


controller.home = async(req, res, next) => {

    if (req.authenticated) {
        const data = await User.find({ _id: req.decoded_token.id }, { __v: 0, password: 0, _id: 0 });
        res.json(data);
    }

}

controller.profile = (req, res, next) => {
    res.json(req.user)
}

controller.updateProfile = async(req, res, next) => {
    if (req.user) {
        const { username, status, robloxNickname, robloxId, yearsOld, gender, email, password } = req.body;
        const user = new User({
            _id: req.user._id,
            username: username,
            robloxNickname: robloxNickname,
            status: req.user.status,
            robloxId: robloxId,
            yearsOld: yearsOld,
            gender: gender,
            email: email,
            password: password
        });

        user.password = await user.encryptPassword(user.password);

        User.findByIdAndUpdate(req.user._id, user, (err) => {
            if (err) {
                console.log(err)
            }
        });
        return res.send("work")
    }

}

controller.signin = async(req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            console.log(user, err)
            return res.status(400).json({
                status: "ERROR",
                message: "Something went wrong",
                user: user
            })
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
        });
        const token = jwt.sign(user.toJSON(), "123", { expiresIn: (60 * 60 * 24) * 2 });
        return res.json({ status: "OK", token });
    })(req, res);
}
controller.signup = async(req, res, next) => {
    if (req.user.status == "admin") {
        const { username, status, robloxNickname, robloxId, yearsOld, gender, email, password } = req.body;

        const user = new User({
            username: username,
            status: status,
            robloxNickname: robloxNickname,
            robloxId: robloxId,
            yearsOld: yearsOld,
            gender: gender,
            email: email,
            password: password
        });


        await user.save()
        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: (60 * 60 * 24) * 2
        })


        res.json({ status: "OK", message: "User has been registered", token: token })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.getUsers = async(req, res, next) => {

    if (req.user.status == "admin") {
        const data = User.find({}, (err, result) => {
            if (err) {
                console.log(err)
            }
            return res.status(200).json({ status: "OK", result })
        });

    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }

}

controller.getUserById = async(req, res, next) => {

    if (req.user.status == "admin") {
        const { id } = req.params;
        if (id.length > 23) {
            const data = User.find({
                    '_id': id
                },
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    return res.status(200).json({ status: "OK", result })
                })
        } else {
            return res.status(400).json({ status: "ERROR", message: "It's not an ID" })
        }
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.getUsersByKey = async(req, res, next) => {

    if (req.user.status == "admin") {
        const { key } = req.params;
        const keyQuery = { $regex: '.*' + key + '.*', $options: 'i' };

        if (Number.isInteger(Number(key))) {
            const data = User.find({
                    'yearsOld': key
                },
                (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    return res.status(200).json({ status: "OK", result })
                }

            )
        } else {
            const data = User.find({
                    $or: [{ 'username': keyQuery }, { 'robloxNickname': keyQuery }, { 'status': keyQuery }]
                },
                (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    return res.status(200).json({ status: "OK", result })
                }

            )
        }


    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }

}

controller.deleteUser = async(req, res) => {
    if (req.user.status == "admin") {
        const { id } = req.params;
        User.findByIdAndDelete(id, (err) => {
            if (err) {
                console.log(err)
            }
        });
        return res.status(200).json({ status: "OK", message: "User has been deleted" })
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}
module.exports = controller;