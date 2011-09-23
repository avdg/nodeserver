var start = new Date();
var Server = require("./lib/server");
var config = require('./config.js').config;

server = new Server({
	port: config.port,
	routers: config.httpServe,
});

server.log.write('Server running (boot time: ' + (new Date() - start) + ' ms)');