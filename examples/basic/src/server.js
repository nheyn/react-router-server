require('babel/polyfill');

var RouterServer = require('react-router-server');
var exampleRoute = require('./route');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Servers ---
/*------------------------------------------------------------------------------------------------*/
RouterServer.server.createApp({
	route: exampleRoute,
	initialCallback(req, res, next) {
		//TODO, set props
		//TODO, set context
		next();
	}
}).listen(8080);
