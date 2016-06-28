var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/mystats', function(req, res, next) {
	res.render('mystats');
});

router.get('/start', function(req, res, next) {
  	res.sendfile('public/html/startpage.html');
});

module.exports = router;