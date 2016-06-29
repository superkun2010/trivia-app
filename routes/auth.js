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
    callbackURL: "http://localhost:3000/auth/login/facebook/callback",
    enableProof: true
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile)
      knex('users').where({
          facebook_oauth: profile.id
      }).first().then(function(user) {
        if (!user) {
          knex('users').insert({ facebook_oauth: profile.id, user_name: profile.displayName, email: profile.emails})
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
   passport.authenticate('facebook', { scope: 'email' })
);

router.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/game');
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
              res.redirect('/game');
            });
        } else {
            res.redirect('/game');
        }
    });
});

router.get('/login', function(req, res, next) {
  res.render('auth');
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
            req.session.userID = user.id;
            req.session.username = user.user_name;
            console.log(req.session);
            res.redirect('/game');
        } else {
            res.redirect('/auth/login');
            //add error for not having the right password
        }
    });
});

router.get('/logout', function(req, res) {
    req.session = null;
    res.redirect('/');
});

router.use(function (req, res, next) {
    console.log(req.session)
    console.log('got here')
    if (req.session.passport.user.displayName) {
        req.session.user = req.session.passport.user.displayName
    }
    next();
})

router.get('/', function(req, res, next) {
    console.log('got here 2')
    console.log(req)
    res.render('index', { user: req.session.user});
});



module.exports = router;
