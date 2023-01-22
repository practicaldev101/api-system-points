const passport = require('passport');
const passportJWT = require("passport-jwt");
const bcrypt = require("bcrypt");
require("dotenv").config();

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

const UserModel = require("../models/User")


passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async function(username, password, cb) {
    return await UserModel.findOne({ gameNickname: username }, { __v: 0 }).exec()
        .then(async(user) => {
            if (!user) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            } else {
                const isValid = await bcrypt.compare(password, user.password);
                if (isValid) {
                    return cb(null, user, { message: 'Logged In Successfully' });
                } else {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
            }

        })
        .catch(err => cb(err));
}));

passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET
    },
    function(jwtPayload, cb) {
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return UserModel.findById(jwtPayload._id, { password: 0, __v: 0 })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));