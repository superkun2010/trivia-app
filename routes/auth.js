if(process.env.NODE_ENV !== 'production') require('dotenv').load();

var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

router.get('/login/facebook', function (req, res, next) {
    req.session = null;
    next();
    },
   passport.authenticate('facebook', { scope: 'email' })
);

router.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/game/start');
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
            knex('users').returning(['id', 'user_name']).insert({
              user_name: req.body.user_name,
              email: req.body.email,
              password: hash
          }).then(function(user){
              req.session.userID = user[0].id;
              req.session.username = user[0].user_name;
              res.redirect('/game/start');
            });
        } else {
            res.redirect('/game/start');
        }
    });
});

router.get('/login', function(req, res, next) {
  res.render('auth');
});

router.post('/login', function(req, res, next) {
    knex('users').where({
        user_name: req.body.user_name,
    }).first().then(function(user) {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.userID = user.id;
            req.session.username = user.user_name;
            res.redirect('/game/start');
        } else {
            res.redirect('/auth/login');
            //add error for not having the right password
        }
    });
});

router.get('/logout', function(req, res) {
    req.session = null;
    res.redirect('/auth/login');
});

router.get('/', function(req, res, next) {
    res.render('index', { user: req.session.username});
});


module.exports = router;
