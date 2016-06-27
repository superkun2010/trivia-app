if(process.env.NODE_ENV !== 'production') require('dotenv').load();

var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var knex = require('../db/knex');
var passport = require('passport');
var apiRoutes = require('./api');
var bcrypt = require('bcrypt');

router.use(cookieParser(process.env.SECRET));
router.use(cookieSession({
  name: 'session',
  keys: [
    process.env.SESSION_KEY1,
    process.env.SESSION_KEY2,
    process.env.SESSION_KEY3
  ]
}));

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
            Users().insert({
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
    knex('users').where({
        user_name: req.body.user_name,
    }).first().then(function(user) {
        if (user && bcrypt.compareSync(req.body.password, user.password) ) {
            res.cookie('userID', user.id, {
                signed: true
            });
            res.redirect('/game');
        } else {
            res.redirect('/');
        }
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.clearCookie('userID');
    res.redirect('/');
});

module.exports = router;
