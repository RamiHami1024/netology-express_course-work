const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {UserModule} = require('../modules/user');

const verify = async (email, password, done) => {
    await UserModule.findByEmail(email, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false)
        if (!UserModule.verifyPassword(user, password)) return done(null, false)

        return done(null, user, {message: 'success'})
    })
};

const options = {
  usernameField: "email",
  passwordField: "password",
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
    await UserModule.findById(id, (err, user) => {
        if (err) cb(err);

        cb(null, user);
    });
});

module.exports = passport;