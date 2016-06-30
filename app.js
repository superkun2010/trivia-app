var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var bcrypt = require('bcrypt');
var knex = require('./db/knex.js');
var pg = require('pg');
var redis = require('redis');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var category = require('./routes/category');
var question = require('./routes/question');
var game = require('./routes/game');
var api = require('./routes/api');

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

var app = express();

var server = require('http').Server(app); 
var io = require('socket.io')(server); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser(process.env.SECRET));
app.use(cookieSession({
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
    enableProof: true,
    profileFields: ['id', 'emails', 'displayName']
  },
  function(accessToken, refreshToken, profile, cb) {
      knex('users').where({
          facebook_oauth: profile.id
      }).first().then(function(user) {
        if (!user) {
          knex('users').insert({ facebook_oauth: profile.id, user_name: profile.displayName, email: profile.emails[0].value})
          .then(function () {
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

app.use(function (req, res, next) {
    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.displayName) {
        req.session.username = req.session.passport.user.displayName;
        knex('users').where({
            user_name: req.session.username
        }).first().then(function(user) {
            req.session.userID = user.id
         });
    }
    next();
});

var userForSocket;

app.use(function(req, res, next){
  res.locals.user = req.session.username;
  userForSocket = req.session.username;
  next();
});

//START ---- SOCKET CODE

var players = [];

io.on('connection', function(socket){
  console.log('connected');
  if (userForSocket) { 
    socket.on('enter-room', function(hello) {
      // console.log('HELLO', userForSocket);
      var curPlayer = {};
      curPlayer.socketId = socket.id;
      curPlayer.username = userForSocket;
      players.push(curPlayer);
      console.log(players);
      // io.sockets.connected[players[players.length-1].socketId].emit('attendance', players);
      io.emit('attendance', players);
    })

    socket.on('disconnect', function () {
        console.log('exit', socket.id);
        var socketIdArray = [];
        for (var i = 0; i < players.length; i++) {
          socketIdArray.push(players[i].socketId);
        }
        var spliceIndex = socketIdArray.indexOf(socket.id);
        console.log(spliceIndex);
        players.splice(spliceIndex,1);
        console.log(players);
      // io.sockets.broadcast[players[players.length-1].socketId].emit('attendance', players);
      io.emit('attendance', players);
    });
  }
});
//END -- SOCKET CODE

app.use('/', routes);
app.use('/auth', auth);
app.use('/api', api);
app.use('/game', game);
app.use('/category', category);
app.use('/question', question);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {
  app,
  server
}
