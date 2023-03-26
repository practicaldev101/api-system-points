const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const controller = {};
const ObjectId = require('mongoose').Types.ObjectId;
const allowedRoles = ["administrator", "moderator"]

controller.getProfile = (req, res, next) => {
    res.status(200).json(req.user);
}

controller.updateProfile = async(req, res, next) => {
    if (req.user) {
        const { username, gameNickname, gameId, discordId, yearsOld, gender, password } = req.body;
        const user = new User({
            _id: req.user._id,
            username: username,
            role: req.user.role,
            gameNickname: gameNickname,
            gameId: gameId,
            discordId: discordId,
            yearsOld: yearsOld,
            gender: gender,
            password: password
        });

        user.password = await user.encryptPassword(user.password);

        User.findOneAndUpdate({ "_id": req.user._id }, { $set: [user] }, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (data !== null) {
                return res.status(200).json({ status: "OK", message: "Profile has been updated" });
            } else {
                return res.status(200).json({ status: "Error", message: "An error has ocurred" });
            }
        });

    }

}

controller.signin = async(req, res, next) => {
    const { limited } = req.body;
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
        if (req.user && limited == false) {
            if (allowedRoles.includes(req.user.role)) {
                const token = jwt.sign({ _id: user.toJSON()._id }, process.env.SECRET, { expiresIn: (60 * 60 * 24) * 365 });
                return res.json({ status: "OK", token });
            }
        }
        const token = jwt.sign({ _id: user.toJSON()._id }, process.env.SECRET, { expiresIn: (60 * 60 * 24) * 2 });
        return res.json({ status: "OK", token });
    })(req, res);
}
controller.signup = async(req, res, next) => {
    if ( allowedRoles.includes(req.user.role)) {
        const { username, nickname, role, gameId, discordId, yearsOld, gender, password } = req.body;

        const user = new User({
            username: username,
            nickname: nickname,
            role: role,
            gameId: gameId,
            discordId: discordId,
            yearsOld: yearsOld,
            gender: gender,
            password: password
        });

        User.find({ $or: [{ 'username': username }, { 'nickname': nickname }, { 'gameId': gameId }] }, async(err, result) => {
            if (err) {
                console.log(err)
            }
            if (result.length !== 0) {
                res.json({ status: "ERROR", message: "User already exists" });
            } else {
                await user.save()
                const token = jwt.sign({ _id: user._id.toJSON() }, process.env.SECRET, {
                    expiresIn: (60 * 60 * 24) * 2
                })
                res.json({ status: "OK", message: "User has been registered", token: token });

            }
        });
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" });
    }
}

controller.getUsers = async(req, res, next) => {

    if ( allowedRoles.includes(req.user.role)) {
        User.find({}, { __v: 0 }, (err, result) => {
            if (err) {
                console.log(err)
            }
            return res.status(200).json({ status: "OK", data: result })
        });

    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }

}

controller.getUserById = async(req, res, next) => {

    if ( allowedRoles.includes(req.user.role)) {
        const { id } = req.params;
        if (id.length > 23) {
            User.find({
                    '_id': id
                },
                (err, result) => {
                    if (err) {
                        throw err;
                    }
                    return res.status(200).json({ status: "OK", data: result })
                })
        } else {
            return res.status(400).json({ status: "ERROR", message: "It's not an ID" })
        }
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}

controller.updateUserById = async(req, res, next) => {

    const { username, nickname, role, gameId, discordId, yearsOld, gender, password } = req.body;

    const { id } = req.params;

    if ( allowedRoles.includes(req.user.role)) {
        if (id.length > 23 && id.length <= 24) {
            const user = new User({
                _id: new ObjectId(id),
                username: username,
                nickname: nickname,
                role: role,
                gameId: gameId,
                discordId: discordId,
                yearsOld: yearsOld,
                gender: gender,
                password: password
            });

            const data = User.findOneAndUpdate({
                    "_id": id
                }, { $set: user },
                (err, data) => {
                    if (err) {
                        throw err;
                    }
                    if (data !== null) {
                        return res.status(200).json({ status: "OK", message: "User has been updated" })
                    } else {
                        return res.status(400).json({ status: "ERROR", message: "User doesn't exist" })
                    }

                })
        } else {
            return res.status(400).json({ status: "ERROR", message: "It's not an ID" })
        }
    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}


controller.getUsersByKey = async(req, res, next) => {

    if ( allowedRoles.includes(req.user.role)) {
        const { key } = req.params;
        const keyQuery = { $regex: '.*' + key + '.*', $options: 'i' };

        if (Number.isInteger(Number(key))) {
            User.find({
                    'yearsOld': key
                },
                (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    return res.status(200).json({ status: "OK", data: result })
                }

            )
        } else {
            User.find({
                    $or: [{ 'username': keyQuery }, { 'nickname': keyQuery }, { 'role': keyQuery }]
                },
                (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    return res.status(200).json({ status: "OK", data: result })
                }

            )
        }


    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }

}

controller.deleteUserById = async(req, res) => {
    if ( allowedRoles.includes(req.user.role)) {
        const { id } = req.params;
        User.findByIdAndDelete(id, (err, data) => {
            if (err) {
                console.log(err)
            }
            if (data !== null) {
                return res.status(200).json({ status: "OK", message: "User has been deleted" })
            } else {
                return res.status(400).json({ status: "ERROR", message: "User doesn't exist" })
            }
        });

    } else {
        return res.status(400).json({ status: "ERROR", message: "You're not administrator" })
    }
}
module.exports = controller;