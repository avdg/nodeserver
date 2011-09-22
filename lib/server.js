var http = require('http');

function server(config) {
	var log = this.log = config.log;
	var routers = this.routers = config.routers;
	var noRoute = this.noRoute = server.defaultNoRouteHandler;
	var routeError = this.routeError = server.defaultErrorHandler;

	requestHandler = function(req, res) {
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
