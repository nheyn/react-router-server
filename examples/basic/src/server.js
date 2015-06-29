require('babel/polyfill');

var path = require('path');
var fs = require('fs');
var RouterServer = require('react-router-server');
var exampleRoute = require('./route');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Servers ---
/*------------------------------------------------------------------------------------------------*/
RouterServer.server.createApp({
	route: exampleRoute,
	staticSettings: {
		htmlTemplate: fs.readFileSync(
			path.join(__dirname, '../staticFiles/template.html'),
			{ encoding: 'utf8' }
		)
	},
	initialCallback(req, res, next) {
		//TODO, set props
		//TODO, set context
		next();
	}
}).listen(8080);
