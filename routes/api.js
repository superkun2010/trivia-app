var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('APIs');
});

router.get('/category', function (req, res, next) {
	knex('categories').select().then( function (data) {
		res.json(data);
	})
})

router.get('/questionset/:category/:num', function (req, res, next) {
	console.log(req.params.category);
	console.log(req.params.num);

	var category = req.params.category;
	var numOfQuestions = req.params.num;
	knex('questions').join('category_questions', 'questions.id', 'category_questions.question_id')
		.join('categories', 'category_questions.category_id', 'categories.id')
		.select().where('category_name', category).orderBy(knex.raw('RANDOM()')).limit(numOfQuestions).pluck('question_id')
		.then(function (data) {
		knex('questions').select().join('answers', 'questions.id', 'answers.question_id').whereIn('question_id', data)
			.then(function (data) {
				console.log('test', data);
				res.json(data);
			})
	})
})

module.exports = router;