/**
 * @flow
 */
var ReactRouterServer = require('./server');
var ReactRouterClient = require('./client');
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

/**
 * Render the given route in the given element.
 *
 * @note The 'getProps' and 'getContext' arguments are called each time the page is changed
 *
 * @param route			{ReactRouterRoute}	The route for this server
 * @param reactElement	{HTMLElement}		The html element to render the react app in
 * @param [getProps]	{GetMaybePromise}	A function to get the props (maybe in a promise) 
 * @param [getContext]	{GetMaybePromise}	A function to get the context (maybe in a promise)
 *
 * @return				{Promise<ReactComponent>}	The rendered react component in an Promise
 */
function renderRoute(	route: ReactRouterRoute,
						element: HTMLElement,
						getProps?: GetMaybePromise, 
						getContext?: GetMaybePromise	): Promise<ReactComponent> {
	var client = new ReactRouterClient(route, getProps, getContext);
	return client.renderApp(element);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.RouteParser = require('./routeParser');
module.exports.server = { createRouter, createApp };
module.exports.client = { renderRoute };
module.exports.makeApiFunctionHandler = routeToRouter.makeApiFunctionHandler;
module.exports.makeApiRouterHandler = routeToRouter.makeApiRouterHandler;
module.exports.makeStaticFileHandler = routeToRouter.makeStaticFileHandler;
