var Game = function (config) {
	if (!config) {
		config = {};
	}
	this.category = config.category || null;
	this.questions = config.questions || [];
}
