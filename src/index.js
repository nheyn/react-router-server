/**
 * @flow
 */
var ReactRouterServer = require('./server');
var routeToRouter = require('./routeToRouter');

/*------------------------------------------------------------------------------------------------*/
//	--- Constructor Function ---
/*------------------------------------------------------------------------------------------------*/
/**
 * Create an express Router that uses the given route and calls the given callback for each request.
 *
 * @param route				{ReactRouterRoute}	The route for this server
 * @param [initialCallback]	{ExpressCallback}	The first callback to call for this server
 *
 * @return					{ExpressRouter}		The router for this server
 */
function createRouter(route: ReactRouterRoute, initialCallback?: ExpressCallback): ExpressRouter {
	var server = new ReactRouterServer(route, initialCallback);
	return server.getRouter();
}

/**
 * Create an express Router that uses the given route and calls the given callback for each app.
 *
 * @param route				{ReactRouterRoute}	The route for this server
 * @param [initialCallback]	{ExpressCallback}	The first callback to call for this server
 *
 * @return	{ExpressApp}	The app for this server
 */
function createApp(route: ReactRouterRoute, initialCallback?: ExpressCallback): ExpressApp {
	var server = new ReactRouterServer(route, initialCallback);
	return server.getApp();
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.RouteParser = require('./routeParser');
module.exports.server = { createRouter, createApp };
module.exports.makeApiFunctionHandler = routeToRouter.makeApiFunctionHandler;
module.exports.makeApiRouterHandler = routeToRouter.makeApiRouterHandler;
module.exports.makeStaticFileHandler = routeToRouter.makeStaticFileHandler;
