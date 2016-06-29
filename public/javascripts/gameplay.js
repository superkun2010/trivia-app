
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
			let pageCount = 0;
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
			
			renderQuestion(0);

			function renderQuestion(page) {
				$('#question').html(game.questions[page].questionText);
				for (let i = 0; i < game.questions[page].answers.length; i++) {
					let currentButton = $('<a>').addClass('answer-buttons waves-effect waves-light btn');
					currentButton.attr('id', i.toString());
					currentButton.html(game.questions[page].answers[i].text);
					currentButton.on('click', function(event) {
						let answerNum = $(event.target).attr('id');
						game.responses.push(game.addResponse(page,answerNum));
						console.log(game.responses);
						let correct = game.questions[page].answers[answerNum].correct;
						newPage(correct);
						event.preventDefault();
					})
					currentButton.appendTo('#button-box');
				}
			}
			
			function newPage(prevAnswer) {
				pageCount++;
				if (pageCount < game.questions.length) {
					$('.answer-buttons').remove();
					renderQuestion(pageCount);
					if (prevAnswer) {
						$('#correct-box').html('correct');
					} else {
						$('#correct-box').html('You are a failure');
					}
				} else {
					resultsPage();
				}
			}

			function resultsPage() {
				
			}

		},
		error: function (error) {
			console.log(error);
		}
	}).then(function(data) {
		

	})
})