var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('APIs');
});

router.get('/category', function (req, res, next) {
	knex('categories').select().then( function (data) {
		res.json(data);
	})
})

router.post('/question', function (req, res, next) {
	console.log(req.body.first_name);
	var category = 'world capitals';
	var numOfQuestions = 2;
	// var category = req.body.category;
	// var numOfQuestions = req.body.numOfQuestions;
	knex('questions').join('category_questions', 'questions.id', 'category_questions.question_id')
		.join('categories', 'category_questions.category_id', 'categories.id')
		.select().orderBy(knex.raw('RANDOM()')).limit(numOfQuestions).pluck('question_id')
		.then(function (data) {
		knex('questions').select().join('answers', 'questions.id', 'answers.question_id').whereIn('question_id', data)
			.then(function (data) {
				console.log(data);
				res.json(data);
			})
	})
})

module.exports = router;