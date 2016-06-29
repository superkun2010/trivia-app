var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');


/* GET users listing. */
router.get('/mystats', function(req, res, next) {
	var user = req.session.username;
	res.render('mystats', {user:user});
});

router.get('/start', function(req, res, next) {
  	res.render('game');
});


module.exports = router;