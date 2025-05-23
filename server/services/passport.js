const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys.js');
const { ProfilingLevel } = require("mongodb");

const User = mongoose.model('users');

passport.serializeUser((user,done) => {
  done(null, user.id);
});

passport.deserializeUser((id,done) => {
  User.findById(id)
    .then(user =>{
      done(null,user);
    });
});
passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
     },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }) 
          .then((existingUser)=>{
            if (existingUser) {
              //we already have a record of the profile
              done(null, existingUser);
            }
            else{
              //we dont have a user record, need to make a new record
              new User ({ googleId: profile.id })
                .save()
                .then( user => done(null, user));
            }
          });
      }
    )
  );