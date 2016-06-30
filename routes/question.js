var express = require('express');
var router = express.Router();
var knex = require('../db/knex');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('question', { user: req.session.username});
});

// router.post('/added', function(req, res, next) {
// 	return knex('questions').insert({
// 		question_text: req.body.question,
// 		question_type: req.body.question_type
// 	}).returning('id')
// 	.then(function(data) {
// 		console.log(data);
// 		// knex('answers').insert({s
//
// 		// })
// 	});
// });

module.exports = router;
