var fs = require('fs');
var browserify = require('browserify');

// Browserify client side app
var b = browserify('./lib/client.js');

//NOTE, ignore any javascript that should not be sent to the client

b.bundle().pipe(
	fs.createWriteStream('./app.js', { flags : 'w' })
);

// Start Server
require('./lib/server');