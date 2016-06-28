if(process.env.NODE_ENV !== 'production') require('dotenv').load();

var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());

router.use(cookieParser(process.env.SECRET));
router.use(cookieSession({
  name: 'session',
  keys: [
    process.env.SESSION_KEY1,
    process.env.SESSION_KEY2,
    process.env.SESSION_KEY3
  ]
}));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/login/facebook/callback",
    enableProof: true
  },
  function(accessToken, refreshToken, profile, cb) {
      knex('users').where({
          facebook_oauth: profile.id
      }).first().then(function(user) {
        if (!user) {
          knex('users').insert({ facebook_oauth: profile.id, user_name: profile.displayName, email: 'facebookUser'})
          .then(function (err, profile) {
            return cb(null, profile);
          });
        } else {
          return cb(null, profile);
        }
     })
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

router.get('/login/facebook', function (req, res, next) {
    req.logout();
    res.clearCookie('session');
    res.clearCookie('session.sig');
    res.clearCookie('userID');
    next();
    },
   passport.authenticate('facebook')
);

router.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

// Signup/Login with bcrypt
router.get('/signup', function(req, res, next) {
	res.render('index');
});

router.post('/signup', function(req, res, next) {
    knex('users').where({
        user_name: req.body.user_name
    }).first().then(function(user) {
        if (!user) {
            var hash = bcrypt.hashSync(req.body.password, 10);
            knex('users').insert({
              user_name: req.body.user_name,
              email: req.body.email,
              password: hash
            }).then(function(){
              res.redirect('/');
            });
        } else {
            res.redirect('/game');
        }
    });
});

router.get('/login', function(req, res, next) {
  res.render('index');
});

router.post('/login', function(req, res, next) {
    req.logout();
    res.clearCookie('session');
    res.clearCookie('session.sig');
    res.clearCookie('userID');
    knex('users').where({
        user_name: req.body.user_name,
    }).first().then(function(user) {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            res.cookie('userID', user.id, {
                signed: true
            });
            res.redirect('/game');
        } else {
            res.redirect('/');
        }
    });
});

router.get('/', function(req, res, next) {
    res.render('index', { user: req.session.passport.user.displayName });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.clearCookie('session');
    res.clearCookie('session.sig');
    res.clearCookie('userID');
    res.redirect('/');
});

module.exports = router;
