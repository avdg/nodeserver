var fs = require('fs');
var path = require('path');

function fileProvider(dir) {
	this.path = path.normalize(dir) + "/";
}

module.exports = fileProvider;

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
