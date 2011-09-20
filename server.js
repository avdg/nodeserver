var start = new Date();

var http = require('http');
var url = require('url');

var fileProvider = require('./lib/fileProvider');
var Log = require('./lib/log.js');

var config = require('./config.js').config;

var fp = new fileProvider(config.httpServe);
var log = new Log();

function basicServer(req, res) {
	var time = new Date();
	var file = url.parse(req.url).pathname;

	fp.exists(file, function(exists){
		if (exists) {
			fp.read(file, function(error, content){
				res.write(content, "binary");
				res.end();
			});
		} else {
			res.writeHead(404);
			res.end();
		}

		var timeLapse = new Date() - time;
		log.write(timeLapse + " ms, " + res.statusCode + " " + req.connection.remoteAddress + " -> " + req.url);
	});
}

http.createServer(basicServer).listen(config.port);

log.write('Server running (boot time: ' + (new Date() - start) + ' ms)');