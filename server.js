var http = require('http');

http.createServer(function (req, res) {
	res.writeHead({'Content-Type': 'text/plain'});
	res.end('Hello world');
}).listen(8000);


console.log('Server running');