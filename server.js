var start = new Date();

var http = require('http');
var url = require('url');

var fileProvider = require('./lib/fileProvider');
var Log = require('./lib/log.js');

var config = require('./config.js').config;

var fp = new fileProvider(config.httpServe);
var log = new Log();
var routers = [fp];

function noRouteHandler(request) {
	request.responce.writeHead(404);
	request.responce.end();
}

function errorHandler(error, request) {
	if (error instanceof Error) {
		console.log(error.stack);
	} else {
		console.log("Error: " + error.toString());
	}

	request.responce.writeHead(500);
	request.responce.end();
}

function requestHandler(req, res) {
	var time = new Date();
	var request = {
		"request": req,
		"responce": res,
		"requestTime": time,
	}

var errorHandler = {
	noRoute: noRouteHandler,
	routeError: requestHandler,
}

	req.on('end', function () {
		var timeLapse = new Date() - time;
		log.write(timeLapse + " ms, " + res.statusCode + " " + req.connection.remoteAddress + " -> " + req.url);
	});

	try {
		match = false;
		for (var i = 0; i < routers.length; i++) {
			if (routers[i].match(req)) {
				routers[i].serve(request);
				match = true;
				break;
			}
		}

		if (!match) {
			errorHandler.noRoute(request);
		}
	} catch (error) {
		errorHandler.routeError(error, request);
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