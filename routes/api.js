var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('APIs');
});

router.get('/question', function (req, res, next) {
	var category = 'world capitals';
	// var category = req.body.category;
	// var numOfQuestions = req.body.numOfQuestions;
	knex('questions').join('category_questions', 'questions.id', 'category_questions.question_id')
		.join('categories', 'category_questions.category_id', 'categories.id')
		.select().where('category_name', category)
	.then(function (data) {
		res.json(data);
	})
})

module.exports = router;