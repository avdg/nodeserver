var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

function fileProvider(dir) {
	this.path = path.normalize(dir) + "/";
}

fileProvider.prototype.exists = function(file, callback)
{
	return path.exists(this.fullPath(file), callback);
}

fileProvider.prototype.read = function(file, callback)
{
	return fs.readFile(this.fullPath(file), "binary", callback);
}

fileProvider.prototype.fullPath = function(file)
{
	return path.join(this.path, path.normalize(file));
}

var fp = new fileProvider(process.cwd() + "/http/");

http.createServer(function (req, res) {
	var file = url.parse(req.url).pathname;
	var time = new Date(Date.now());

	console.log(time.toString() + ": " + req.connection.remoteAddress + " -> " + req.url);

	if (path.normalize(file) == "/") {
		file = "index.html";
	}

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
}).listen(8000);

console.log('Server running');