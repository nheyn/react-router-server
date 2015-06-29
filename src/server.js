/**
 * @flow
 */
var express = require('express');
var React = require('react');
var { AsyncReact, AsyncRouter } = require('async-react-router');

var RouteParser = require('./routeParser');

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Server Class ---
/*------------------------------------------------------------------------------------------------*/
class ReactRouterServer {
	_route: ReactRouterRoute;
	_httpRouter: ExpressRouter;
	_staticSettings: Object;
	_initialCallback: ExpressCallback;
	_router: ExpressRouter;
	_app: ExpressApp;

	/**
	 * Create a Server that uses the given route and calls the given callback when every request
	 * is received.
	 *
	 * @param route				{ReactRouterRoute}	The route for this server
	 * @param [initialCallback]	{?ExpressCallback}	The first callback to call for this server
	 * @param [staticSettings]	{?Object}			The settings to put in req.server on every
	 *												request
	 */
	constructor(	route: ReactRouterRoute,
					initialCallback?: ?ExpressCallback,
					staticSettings?: ?Object			) {
		this._parseRoute(route);
		this._setInitialCallback(initialCallback, staticSettings);
	}

/*------------------------------------------------------------------------------------------------*/
//	Public Methods
/*------------------------------------------------------------------------------------------------*/
	/**
	 * Gets the express router of this server.
	 *
	 * @return	{ExpressRouter}	The router for this server
	 */
	getRouter(): ExpressRouter {
		if(!this._router) this._router = this._createRouter();

		return this._router;
	}

	/**
	 * Gets an express app for this server.
	 *
	 * @return	{ExpressApp}	The app for this server
	 */
	 getApp(): ExpressApp {
	 	if(!this._app) this._app = this._createApp();

	 	return this._app;
	 }

/*------------------------------------------------------------------------------------------------*/
//	Private Methods
/*------------------------------------------------------------------------------------------------*/
	_parseRoute(route: ReactRouterRoute) {
		var parser = new RouteParser(route);

		// Get parts or the route
		this._route = parser.getReactRouterRoute();
		this._httpRouter = parser.getExpressRouter();
	}

	_setInitialCallback(callback: ?ExpressCallback, staticSettings: ?Object = {}) {
		this._initialCallback = (req, res, next) => {
			// Set up store for server data for this request
			req.server = Object.assign({}, staticSettings);

			// Call next callback
			if(callback) {
				try{
					callback(req, res, next);
				}
				catch(err) {
					next(err);
				}
			}
			else {
				next();
			}
		};
	}

	_createApp(): ExpressApp {
		var _express: any = express;	//NOTE, for flowtype
		var app = _express();

		app.use('/', this.getRouter());

		return app;
	}

	_createRouter(): ExpressRouter {
		var router = express.Router();

		router.use(this._initialCallback);				// Callback for constructor
		router.use(this._httpRouter);					// Express routers for (non-html) http reqs
		router.use(this._getHandleInitialPageLoad());	// Callback for react server side rendering
		router.use(this._getHandleError());				// Callback for error handling

		return router;
	}

	_getHandleInitialPageLoad(): ExpressCallback {
		return (req, res, next) => {
			// Get inputs, can be set in this._initialCallback
			var props = req.server.props? req.server.props: {}
			var context = req.server.context? req.server.context: {};
			var htmlTemplate = req.server.htmlTemplate? req.server.htmlTemplate: '<react />';

			// Render / Send the the current React Route
			AsyncRouter.run(this._route, req.url, (Handler, state) => {
				AsyncReact.renderToString(<Handler {...props} />, context)
					.then((reactHtml) => {
						// Add rendered react element to html template
						var htmlDoc = htmlTemplate.replace('<react />', reactHtml);

						// Send Rendered Page
						res.status('200');
						res.type('html');
						res.send(htmlDoc);
					})
					.catch((err) => {
						next(err);
					});
			});
		};
	}

	_getHandleError(): ExpressErrorCallback {
		return (err, req, res, next) => {
			//TODO, change error handling based on error
			console.error('Error Durring Request:', err);
			res.status(500);
			res.json({
				errors: [err.message? err.message: 'Unknown Error']
			});
		};
	}
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = ReactRouterServer;
