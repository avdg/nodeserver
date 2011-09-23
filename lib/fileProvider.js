var fs = require('fs');
var path = require('path');
var url = require('url');

function fileProvider(dir) {
	this.path = path.normalize(dir) + "/";
}

module.exports = fileProvider;

fileProvider.prototype.match = function(req)
{
	if (req.url[0] != "/") {
		return false; // Not a file
	}

	var file = url.parse(req.url).pathname;
	return path.existsSync(this.fullPath(file));
}

fileProvider.prototype.serve = function(request)
{
	var fileStream = fs.createReadStream(
		this.fullPath(url.parse(request.request.url).pathname),
		{
			encoding: 'binary',
		}
	);

	fileStream.on('data', function(chunk) {
		request.responce.write(chunk, "binary")
	});

	fileStream.on('end', function() {
		request.responce.end();
	});

	fileStream.on('error', function(error) {
		if (error instanceof Error) {
			request.log.write(error.stack);
		} else {
			request.log.write("Error: " + error.toString());
		}

		// If possible, modify header (for example non-readable files)
		request.responce.statusCode = 500;
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
