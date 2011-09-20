var http = require('http');
var path = require('path');
var url = require('url');

var fileProvider = require('./lib/fileProvider');
var config = require('./config.js').config;

var fp = new fileProvider(process.cwd() + "/http/");

function basicServer(req, res) {
	var file = url.parse(req.url).pathname;
	var time = new Date(Date.now());

	console.log(time.toString() + ": " + req.connection.remoteAddress + " -> " + req.url);

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
	});
}

http.createServer(basicServer).listen(config.port);

console.log('Server running');