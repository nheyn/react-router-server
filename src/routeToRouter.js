/**
 * @flow
 */
var React = require('react');
var express = require('express');

/*------------------------------------------------------------------------------------------------*/
//	--- React Http Classes Constructors ---
/*------------------------------------------------------------------------------------------------*/
/**
 * Create a React Route Handler that can be used to call a callback.
 *
 * @param callback	{ExpressCallback}		The callback to call on an http request
 *
 * @return			{ReactRouterHandler}	The Route Handler for the callback
 */
function makeApiFunctionHandler(callback: ExpressCallback): ReactRouterHandler {
	return makeHandler({
		isApiHandler: true,
		getRouter() {
			var router = express.Router();
			router.use(callback);
			return router;
		}
	});
}

/**
 * Create a React Route Handler that can be used to call a router.
 *
 * @param router	{ExpressRouter}			The router to call on an http request
 *
 * @return			{ReactRouterHandler}	The Route Handler for the router
 */
function makeApiRouterHandler(router: ExpressRouter): ReactRouterHandler {
	return makeHandler({
		isApiHandler: true,
		getRouter() {
			return router;
		}
	});
}

/**
 * Create a React Route Handler that server a single file.
 *
 * @param filePath	{string}				The path to the file to respond with
 *
 * @return			{ReactRouterHandler}	The Route Handler for the file
 */
function makeStaticFileHandler(filePath: string): ReactRouterHandler {
	return makeHandler({
		isStaticFileHandler: true,
		getRouter() {
			return express.static(filePath);
		}
	});
}


/*------------------------------------------------------------------------------------------------*/
//	--- Helper Functions ---
/*------------------------------------------------------------------------------------------------*/
type StaticsType = {
	isApiHandler: ?bool;
	isStaticFileHandler: ?bool;
	getRouter: () => ExpressRouter;
};
function makeHandler(statics: any): ReactRouterHandler {
	return React.createClass({
		displayName: 'HttpHandler',
		statics: statics,
		render() {
			throw new Error('Render of HTTP Handler should not be called');
		}
	});
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.makeApiFunctionHandler = makeApiFunctionHandler;
module.exports.makeApiRouterHandler = makeApiRouterHandler;
module.exports.makeStaticFileHandler = makeStaticFileHandler;
