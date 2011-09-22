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
	if (req.url[0] != "/") {
		return false; // Not a file
	}

	var file = url.parse(req.url).pathname;
	return this.existsSync(file);
}

fileProvider.prototype.serve = function(request)
{
	var fileStream = fs.createReadStream(
		this.fullPath(url.parse(request.request.url).pathname),
		{
			flags: 'r',
			encoding: 'binary',
		}
	);

	fileStream.on('data', function(chunk) {
		request.responce.write(chunk, "binary")
	});

	fileStream.on('end', function() {
		request.responce.end();
	});
}

fileProvider.prototype.fullPath = function(file)
{
	file = path.normalize(file);

	if (file == "/") {
		file = "/index.html";
	}

	return path.join(this.path, file);
}
