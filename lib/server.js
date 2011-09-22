var http = require('http');

var Fp = require('./fileProvider');
var Log = require('./log.js');

function server(config) {
	var log = this.log = config.log || new Log();
	var routers = this.routers = config.routers;
	var noRoute = this.noRoute = config.noRoute || server.defaultNoRouteHandler;
	var routeError = this.routeError = config.routeError || server.defaultErrorHandler;
	var logRequest = this.logRequest = config.logRequest || server.defaultLogRequest;

	requestHandler = function(req, res) {
		var time = new Date();
		var request = {
			"request": req,
			"responce": res,
			"requestTime": time,
		}

		req.on('end', function () {
			request.timeLapse = new Date() - time;
			log.write(logRequest(request));
		});

		try {
			var match = false;

			if ("string" === typeof(routers)) {
				routers = [routers];
			}

			if (Object.prototype.toString.call(routers) !== '[object Array]') {
				throw new Error("No routers given, nothing to serve.");
			}

			for (var i = 0; i < routers.length; i++) {
				if ("string" === typeof(routers[i])) {
					routers[i] = new Fp(routers[i]);
				}

				if (routers[i].match(req)) {
					routers[i].serve(request);
					match = true;
					break;
				}
			}

			if (!match) {
				noRoute(request);
			}
		} catch (error) {
			routeError(error, request);
		}
	}

	http.createServer(requestHandler).listen(config.port);
}

module.exports = server;

server.defaultNoRouteHandler = function(request) {
	request.responce.writeHead(404);;
	request.responce.end();
}

server.defaultErrorHandler = function(error, request) {
	if (error instanceof Error) {
		console.log(error.stack);
	} else {
		console.log("Error: " + error.toString());
	}

	request.responce.writeHead(500);
	request.responce.end();
}

server.defaultLogRequest = function(request) {
	return request.timeLapse + " ms, "
		+ request.responce.statusCode + " "
		+ request.request.connection.remoteAddress
		+ " -> " + request.request.url;
}
