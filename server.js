var start = new Date();

var http = require('http');
var url = require('url');

var fileProvider = require('./lib/fileProvider');
var Log = require('./lib/log.js');

var config = require('./config.js').config;

var fp = new fileProvider(config.httpServe);
var log = new Log();
var routers = [fp];

function requestHandler(req, res) {
	var time = new Date();
	var request = {
		"request": req,
		"responce": res,
		"requestTime": time,
	}

	req.on('end', function () {
		var timeLapse = new Date() - time;
		log.write(timeLapse + " ms, " + res.statusCode + " " + req.connection.remoteAddress + " -> " + req.url);
	});

	try {
		match = false;
		for (var i = 0; i < routers.length; i++) {
			if (routers[i].match(request)) {
				routers[i].serve(request);
				match = true;
				break;
			}
		}

		if (!match) {
			// Do nothing for now
			res.writeHead(404);
			res.end();
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.stack);
		} else {
			console.log(error.toString());
		}

		res.writeHead(500);
		res.end();
	}
}

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

http.createServer(requestHandler).listen(config.port);

log.write('Server running (boot time: ' + (new Date() - start) + ' ms)');