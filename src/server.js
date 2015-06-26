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
	_initialCallback: ExpressCallback;
	_router: ExpressRouter;
	_app: ExpressApp;

	/**
	 * Create a Server that uses the given route and calls the given callback when every request
	 * is received.
	 *
	 * @param route				{ReactRouterRoute}	The route for this server
	 * @param [initialCallback]	{?ExpressCallback}	The first callback to call for this server
	 */
	constructor(route: ReactRouterRoute, initialCallback?: ?ExpressCallback) {
		this._parseRoute(route);
		this._setInitialCallback(initialCallback);
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

		this._route = parser.getReactRouterRoute();
		this._httpRouter = express.Router();
		parser.getExpressRouters().forEach((routerSettings) => {
			this._httpRouter.use(routerSettings.path, routerSettings.router);
		});
	}

	_setInitialCallback(callback: ?ExpressCallback) {
		this._initialCallback = (req, res, next) => {
			// Set up store for server data for this request
			req.server = {};

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

		app.use(this.getRouter());

		return app;
	}

	_createRouter(): ExpressRouter {
		var router = express.Router();

		router.use(this._initialCallback);
		router.use(this._httpRouter);
		router.use((req, res, next) => this._handleInitialPageLoad(req, res, next));
		router.use((err, req, res, next) => this._handleError(err, req, res, next));

		return router;
	}

	_handleInitialPageLoad(req: ExpressReq, res: ExpressRes, next: () => void) {
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
		})
	}

	_handleError(err: Error, req: ExpressReq, res: ExpressRes) {
		//TODO, change error handling based on error
		console.error('Error Durring Request:', err);
		res.status(500);
		res.json({
			errors: [err.message? err.message: 'Unknown Error']
		});
	}
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = ReactRouterServer;
