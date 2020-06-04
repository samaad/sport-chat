'use strict';

const passport = require('passport');
const User = require('../models/user');
const secret = require('../secret/secretFile');
const FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:5555/auth/facebook/callback',
    passReqToCallback: true
    
}, (req, token, refreshToken, profile, done) => {
    
    User.findOne({facebook:profile.id}, (err, userData) => {
       if(err){
           return done(err);
       }
        
        if(userData){
            return done(null, userData);
        }else{
            const user = new User();
            user.facebook = profile.id;
            user.fullname = profile.displayName;
            user.username = profile.displayName;
            user.email = profile._json.email;
            user.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            user.fbTokens.push({token:token});
            
            user.save((err) => {
                return done(null, user);
            })
        }
    })
}));