var start = new Date();
var Server = require("./lib/server");

try {
	var config = require('./config.js').config;
} catch (e) {
	console.log("Failed to load config.js, loading config.default.js");
	config = require('./config.default.js').config;
}

server = new Server({
	port: config.port,
	routers: config.httpServe,
});

server.log.write('Server running (boot time: ' + (new Date() - start) + ' ms)');