const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../db/models');
const facebookStrategy = require('passport-facebook').Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;
const linkedinStrategy = require('passport-linkedin-oauth2').Strategy;

// find or create a new user
async function findOrCreateUser(token, refreshToken, profile, done) {

    try {
        const user = await User.findOne({ where: { 'email': profile.emails[0].value } });

        if (user)
            return done(null, user); // user found, return that user

        const newUser = await User.create({
            uid: profile.id,
            email: profile.emails[0].value,
            displayname: profile.displayName,
            token,
            pic: profile.photos[profile.photos.length - 1].value,
        })

        return done(null, newUser);
    } catch (err) {
        return done(err);
    }

}

passport.use(new googleStrategy({

    clientID: process.env.GclientID,
    clientSecret: process.env.GclientSecret,
    callbackURL: process.env.Gredirect,
    accessType: 'offline',
    scope: ['profile', 'email'],
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'

}, findOrCreateUser));

passport.use(new facebookStrategy({

    clientID: process.env.FBclientID,
    clientSecret: process.env.FBclientSecret,
    callbackURL: process.env.FBredirect,
    profileFields: ['id', 'displayName', 'name', 'email', 'picture.type(large)'],
    scope: 'email'

}, findOrCreateUser));

passport.use(new linkedinStrategy({

    clientID: process.env.LIcliendID,
    clientSecret: process.env.LIcliendSecret,
    callbackURL: process.env.LIredirect,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline'],
    scope: ['r_emailaddress', 'r_liteprofile']

}, findOrCreateUser));

// serializing & deserializing user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await User.findByPk(id);
    done(null, user);
});

// facebook auth apis
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

// google auth apis
router.get('/google', passport.authenticate('google'));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

// linkedin auth apis
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        successRedirect: '/',
        failureRedirect: '/',
    }));
// logging out a user
router.get('/logout', function (req, res) {
    req.session.destroy();
    req.logout();
    res.redirect('/');
});

module.exports = router;
