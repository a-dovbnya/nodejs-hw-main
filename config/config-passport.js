const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const secret = require("./config.json").secret;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: secret,
  //jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
  jwtFromRequest: function(req) {
    var token = null;
    if ((req && req.cookies) || req.headers) {
      token =
        req.cookies["jwt"] ||
        req.cookies["access_token"] ||
        req.headers["access_token"];
    }
    return token;
  }
};

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username })
      .then(user => {
        if (!user) {
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(err => done(err));
  })
);

passport.use(
  new Strategy(params, function(payload, done) {
    User.findOne({ id: payload.id })
      .then(user => {
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, user);
      })
      .catch(err => done(err));
  })
);
