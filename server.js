var http = require('http');

http.createServer(function (req, res) {
	res.writeHead({'Content-Type': 'text/plain'});
	res.end('<!DOCTYPE HTML>\n<body><marquee>Hello world</marquee></body>');
}).listen(8000);


console.log('Server running');