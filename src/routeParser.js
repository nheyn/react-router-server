/**
 * @flow
 */
var React = require('react');

/*------------------------------------------------------------------------------------------------*/
//	--- RouteParser ---
/*------------------------------------------------------------------------------------------------*/
/**
 * A class that parse the react router routes, that also contains express http handlers.
 */
class RouteParser {
	_route: ReactRouterRoute;

	/**
	 * A constructor that takes the route that is being parsed.
	 *
	 * @param route	{ReactRouterRoute}	The route to parse
	 */
	constructor(route: ReactRouterRoute) {
		this._route = route;
	}

/*------------------------------------------------------------------------------------------------*/
//	--- Private Method ---
/*------------------------------------------------------------------------------------------------*/
	/**
	 * Gets the react router route without any of the http handler routes.
	 *
	 * @return	{ReactRouterRoute}	The route with out http handlers
	 */
	getReactRouterRoute(): ReactRouterRoute {
		var newChildern = [];
		React.Children.forEach((child) => {
			if(!child.isApiHandler && !child.isStaticFileHandler) newChildern.push(child);
		});

		return React.cloneElement(this._route, null, newChildern);
	}

	/**
	 * Gets the express routers defined in the react router Route.
	 *
	 * @return	{Array<ReactRouteToExpressRouterObject>}	The express routes in the object in the
	 *														form:
	 *																path 	{string}
	 *																type 	{'api' OR 'file'}
	 *																router	{ExpressRouter}	
	 */
	getExpressRouters(): Array<ReactRouteToExpressRouterObject> {
		return [].concat(
			this._getRoutesWithApiHandlers.map((route) => {
				return {
					path: route.path,
					type: 'api',
					router: this._makeApiRouterFrom(route)
				};
			}),
			this._getRoutesWithStaticFileHandlers.map((route) => {
				return {
					path: route.path,
					type: 'file',
					router: this._makeStaticFileRouterFrom(route)
				};
			}),	
		);
	}

/*------------------------------------------------------------------------------------------------*/
//	--- Private Method ---
/*------------------------------------------------------------------------------------------------*/
	_getRoutesWithApiHandlers(): Array<ReactRouterRoute> {
		//TODO
		return [];
	}

	_getRoutesWithStaticFileHandlers(): Array<ReactRouterRoute> {
		//TODO
		return [];
	}

	_makeApiRouterFrom(apiRoute: ReactRouterRoute): ExpressRouter {
		return {};
	}

	_makeStaticFileRouterFrom(statifFileRoute: ReactRouterRoute): ExpressRouter {
		return {};
	}
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = RouteParser;