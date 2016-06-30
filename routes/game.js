var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var knex = require('../db/knex.js');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
/* GET users listing. */
router.get('/mystats', function(req, res, next) {
	var user = req.session.username;
	var games = [];
	
	return knex('games').join('user_games','games.id','user_games.game_id')
		.join('users', 'user_games.user_id', 'users.id')
		.join('categories', 'games.category_id', 'categories.id')
		.select().where('user_name', user)
		.then(function (data) {
			// console.log(data);

			for (var i = 0; i < data.length; i++) {
				var curGame = {};
				curGame.num = i;
				curGame.category = data[i].category_name;
				curGame.questions = data[i].num_questions;
				curGame.score = data[i].score;
				games.push(curGame);
			}
			console.log(games);
			res.render('mystats', {games: games, user:user});
		})

	
});

router.get('/start', function(req, res, next) {
  	res.render('game');
});


module.exports = router;