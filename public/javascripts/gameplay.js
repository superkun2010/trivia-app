
'use strict'

$('#game-play').hide();

$('#play-button').on('click', function (event) {
	let category = $('#category').val();
	let numOfQuestions = $('#num-of-questions').val();
	console.log(numOfQuestions);
	event.preventDefault();
	$.ajax({
		url: '/api/questionset/' + category + '/' + numOfQuestions,
		method: 'GET',
		success: function (data) {
			$('#game-start').remove();
			$('#game-play').show();
			let game = new Game();
			game.category = category;

			let questionIds = []
			for (let i = 0; i < data.length; i++ ) {
				if (questionIds.indexOf(data[i].question_id) == -1) {
					questionIds.push(data[i].question_id);
					let curQuestion = new Question();
					curQuestion.questionText = data[i].question_text;
					curQuestion.questionId = data[i].question_id;
					game.questions.push(curQuestion);
					console.log(questionIds);
				}
			}
			
			for (let i = 0; i < game.questions.length; i++) {
				for (let j = 0; j < data.length; j++) {
					if (game.questions[i].questionId == data[j].question_id) {
						let curAnswer = {};
						curAnswer.correct = data[j].answer_bool;
						curAnswer.text = data[j].answer_text;
						curAnswer.id = data[j].id;
						game.questions[i].answers.push(curAnswer);
					}
				}
			}			
			console.log(game);

			$('#title-category').html(game.category);
			$('#question').html(game.questions[0].questionText);

			for (let i = 0; i < game.questions[0].answers.length; i++) {
				let currentButton = $('<a>').addClass('waves-effect waves-light btn');
				currentButton.html(game.questions[0].answers[i].text);
				currentButton.appendTo('#button-box');
			}
			


		},
		error: function (error) {
			console.log(error);
		}
	}).then(function(data) {
		

	})
})