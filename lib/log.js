function log(settings) {
	this.settings = settings;
}

module.exports = log;

log.prototype.write = function(event) {
	var time = new Date(Date.now());
	console.log(time.toString() + ": " + event);
};
