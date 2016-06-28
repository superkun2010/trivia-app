var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/mystats', function(req, res, next) {
	res.render('mystats');
});

router.get('/start', function(req, res, next) {
  	res.render('game');
});


module.exports = router;