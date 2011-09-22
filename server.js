var start = new Date();

var fileProvider = require('./lib/fileProvider');
var Log = require('./lib/log.js');
var Server = require("./lib/server");

var config = require('./config.js').config;

var fp = new fileProvider(config.httpServe);
var log = new Log();
var routers = [fp];

server = new Server({
	port: config.port,
	routers:[fp],
	log: log
});

log.write('Server running (boot time: ' + (new Date() - start) + ' ms)');