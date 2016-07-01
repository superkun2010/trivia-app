var Game = function (config) {
	if (!config) {
		config = {};
	}
	this.category = config.category || null;
	this.userOne = config.userOne|| null;
	this.userTwo = config.userTwo|| null;
	this.userOneSocketId = config.userOneSocketId || null;
	this.userTwoSocketId = config.userTwoSocketId || null;
	this.score = config.score || 0;
	this.numQuest = config.numQuest || 0;
	this.questions = config.questions || [];
	this.responses = config.responses || [];
	this.gameRoomId = config.gameRoomId || null;
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

module.exports = Game;