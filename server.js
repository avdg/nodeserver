var start = new Date();

var fileProvider = require('./lib/fileProvider');
var Server = require("./lib/server");

var config = require('./config.js').config;

var fp = new fileProvider(config.httpServe);

server = new Server({
	port: config.port,
	routers:[fp],
});

server.log.write('Server running (boot time: ' + (new Date() - start) + ' ms)');