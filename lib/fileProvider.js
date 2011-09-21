var fs = require('fs');
var path = require('path');
var url = require('url');

function fileProvider(dir) {
	this.path = path.normalize(dir) + "/";
}

module.exports = fileProvider;

fileProvider.prototype.exists = function(file, callback)
{
	return path.exists(this.fullPath(file), callback);
}

fileProvider.prototype.existsSync = function(file)
{
	return path.existsSync(this.fullPath(file));
}

fileProvider.prototype.match = function(req)
{
	var file = url.parse(req.url).pathname;
	return this.existsSync(file);
}

fileProvider.prototype.read = function(file, callback)
{
	return fs.readFile(this.fullPath(file), "binary", callback);
}

fileProvider.prototype.serve = function(request)
{
	return this.read(
		url.parse(request.request.url).pathname,
		function(error, content) {
			request.responce.write(content, "binary");
			request.responce.end();
		}
	);
}

fileProvider.prototype.fullPath = function(file)
{
	file = path.normalize(file);

	if (file == "/") {
		file = "/index.html";
	}

	return path.join(this.path, file);
}
