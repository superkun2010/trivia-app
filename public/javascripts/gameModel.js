var Game = function (config) {
	if (!config) {
		config = {};
	}
	this.category = config.category || null;
	this.user = config.user|| null;
	this.questions = config.questions || [];
	this.responses = config.responses || [];
}
