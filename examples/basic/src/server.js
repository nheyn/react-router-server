require('babel/polyfill');

var { server } = require('react-router-server');
var exampleRoute = require('./route');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Servers ---
/*------------------------------------------------------------------------------------------------*/
server.createApp({
	route: exampleRoute,
	initialCallback(req, res, next) {
		//TODO, set props
		//TODO, set context
		next();
	}
}).listen(8080);