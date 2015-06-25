/**
 * @flow
 */
var ReactRouterServer = require('./server');
var ReactRouterClient = require('./client');

type SeverSettingsType = {
	route: ReactRouterRoute;
	initialCallback?: ExpressCallback;
};

type ClientSettingsType = {
	route: ReactRouterRoute;
	element: HTMLElement;
	getProps?: GetMaybePromise;
	getContext?: GetMaybePromise;
};

/*------------------------------------------------------------------------------------------------*/
//	--- Constructor Function ---
/*------------------------------------------------------------------------------------------------*/
/**
 * Create an express Router that uses the given route and calls the given callback for each request.
 *
 * @note	The 'initialCallback' can set (in req.server)
 *				- The html template string (in req.server.htmlTemplate)
 *					- will replace '<react />' with the app's html
 *				- The props (in req.server.props)
 *				- The context (in req.server.context)
 *
 * @param settings			{Object}				The settings for the server
 *			route				{ReactRouterRoute}		The route for this server
 *			[initialCallback]	{ExpressCallback}		The first callback to call for this server
 *
 * @throws 					{Error}					Thrown if '.route' is missing in the settings
 *													argument
 *
 * @return					{ExpressRouter}			The router for this server
 */
function createRouter(settings: SeverSettingsType): ExpressRouter {
	if(!settings.route) throw new Error("The 'createRouter()' settings must include '.route'");

	var server = new ReactRouterServer(settings.route, settings.initialCallback);
	return server.getRouter();
}

/**
 * Create an express Router that uses the given route and calls the given callback for each app.
 *
 * @param settings			{Object}				The settings for the server
 *			route				{ReactRouterRoute}		The route for this server
 *			[initialCallback]	{ExpressCallback}		The first callback to call for this server
 *
 * @throws 					{Error}					Thrown if '.route' is missing in the settings
 *													argument
 *
 * @return	{ExpressApp}	The app for this server
 */
function createApp(settings: SeverSettingsType): ExpressApp {
	if(!settings.route) throw new Error("The 'createApp()' settings must include '.route'");

	var server = new ReactRouterServer(settings.route, settings.initialCallback);
	return server.getApp();
}

/**
 * Render the given route in the given element.
 *
 * @note 	The 'getProps' and 'getContext' arguments are called (if given) each time the page
 *			is changed
 * @note	The 'getProps' and 'getContext' arguments can either return the result (prop or
 *			context), or the result inside of a Promise
 *
 * @param settings		{Object}					The settings for the server
 *			route			{ReactRouterRoute}			The route for this server
 *			element			{HTMLElement}				The element to render the app's html in
 *			[getProps]		{GetMaybePromise}			A function to get the props
 *			[getContext]	{GetMaybePromise}			A function to get the context
 *
 * @throws 				{Error}						Thrown if '.route' or '.element' is missing in
 *													the settings argument
 *
 * @return				{Promise<ReactComponent>}	The rendered react component in a Promise
 */
function renderRoute(settings: ClientSettingsType): Promise<ReactComponent> {
	if(!settings.route) {
		throw new Error("The 'renderRoute()' settings must include '.route'");
	}
	if(!settings.element) {
		throw new Error("The 'renderRoute()' settings must include '.element'");
	}

	var client = new ReactRouterClient(settings.route, settings.getProps, settings.getContext);
	return client.renderApp(settings.element);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.RouteParser = require('./routeParser');
module.exports.RouterRoute = require('./routerRoute');
module.exports.server = { createRouter, createApp };
module.exports.client = { renderRoute };
