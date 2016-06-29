var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('These are not the JSONs you are looking for');
});

router.get('/category', function (req, res, next) {
	knex('categories').select().then( function (data) {
		res.json(data);
	})
})

router.get('/questionset/:category/:num', function (req, res, next) {
	// console.log(req.params.category);
	// console.log(req.params.num);

	var category = req.params.category;
	var numOfQuestions = req.params.num;
	knex('questions').join('category_questions', 'questions.id', 'category_questions.question_id')
		.join('categories', 'category_questions.category_id', 'categories.id')
		.select().where('category_name', category).orderBy(knex.raw('RANDOM()')).limit(numOfQuestions).pluck('question_id')
		.then(function (data) {
		knex('questions').select().join('answers', 'questions.id', 'answers.question_id').whereIn('question_id', data)
			.then(function (data) {
				// console.log('test', data);
				res.json(data);
			})
	})
})

router.post('/responses', function (req,res,next) {
	var category = req.body.category;
	var responses = req.body.responses;
	var userId = req.session.userID;
	return knex('categories').select().where('category_name', category)
	.then(function(category) {
		console.log('hey', category);
		return knex('games').insert({category_id: category[0].id}).returning('id')
	}).then(function(gameId) {
		console.log(gameId);
		return knex('user_games').insert({user_id: userId, game_id: gameId[0]}).returning('game_id')
	}).then(function(gameId) {
		console.log(gameId);
		var promises = [];
		for (var i = 0; i < responses.length; i++) {
			promises.push(knex('game_questions').insert({game_id: gameId[0], question_id: responses[i].questionId}));
		}

		for (var j = 0; j < responses.length; j++) {
			promises.push(knex('user_questions').insert({game_id: gameId[0], question_id: responses[j].questionId, user_id: userId, answers_id: responses[j].answerId}));
		}

		return Promise.all(promises);
	}).catch(function (error) {
		console.log(error);
	})
	

})

module.exports = router;