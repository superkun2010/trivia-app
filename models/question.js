var Question = function (config) {
	if (!config) {
		config = {};
	}
	this.questionText = config.questionText || null;
	this.questionId = config.questionId || null;
	this.answers = config.answers || [];
}

module.exports = Question;