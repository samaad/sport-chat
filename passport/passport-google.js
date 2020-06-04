'use strict';

const passport = require('passport');
const User = require('../models/user');
const secret = require('../secret/secretFile');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,//process.env.GOOGLE_CLIENT_ID,
    clientSecret: secret.google.clientSecret,//process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5555/auth/google/callback',
    passReqToCallback: true
    
}, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({google:profile.id}, (err, user) => {
        if(err){
           return done(err);
        }
        
        if(user){
            return done(null, user);
        }else{
            console.dir(profile)
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            // newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.picture;
            
            newUser.save((err) => {
                if(err){
                    return done(err)
                }
                return done(null, newUser);
            })
        }
    })
}));
