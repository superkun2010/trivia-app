var Game = function (config) {
	if (!config) {
		config = {};
	}
	this.category = config.category || null;
	this.user = config.user|| null;
	this.questions = config.questions || [];
	this.responses = config.responses || [];
}

Game.prototype.addResponse = function (questionIndex, answerIndex) {
	var response = {};
	response.questionId = this.questions[questionIndex].questionId;
	response.questionText = this.questions[questionIndex].questionText;
	response.answerId = this.questions[questionIndex].answers[answerIndex].id;
	response.answerText = this.questions[questionIndex].answers[answerIndex].text;
	if (this.questions[questionIndex].answers[answerIndex].correct) {
		response.result = "Correct"
	} else {
		response.result = "Incorrect"
	}
	
	return response;
}