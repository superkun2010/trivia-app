var Question = function (config) {
	if (!config) {
		config = {};
	}
	this.questionText = config.questionText || null;
	this.questionType = config.questionType || null;
	this.answers = config.answers || [];
}
