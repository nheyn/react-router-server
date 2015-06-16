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
		return React.cloneElement(this._route, {}, this._filterChildRoutes(
			(route) => !hasApiHandler(route) && !hasStaticFileHandler(route)
		));
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
			this._filterChildRoutes(hasApiHandler).map((route) => {
				return {
					path: route.props.path,
					type: 'api',
					router: this._makeApiRouterFrom(route)
				};
			}),
			this._filterChildRoutes(hasStaticFileHandler).map((route) => {
				return {
					path: route.props.path,
					type: 'file',
					router: this._makeStaticFileRouterFrom(route)
				};
			})
		);
	}

/*------------------------------------------------------------------------------------------------*/
//	--- Private Method ---
/*------------------------------------------------------------------------------------------------*/
	_filterChildRoutes(shouldKeep: (route: ReactRouterRoute) => bool): Array<ReactRouterRoute> 	{
		var routes = [];
		React.Children.forEach(
			this._route.props.children,
			(child) => {	if(shouldKeep(child)) routes.push(child); }
		);
		return routes;
	}

	_makeApiRouterFrom(apiRoute: ReactRouterRoute): ExpressRouter {
		return {};
	}

	_makeStaticFileRouterFrom(statifFileRoute: ReactRouterRoute): ExpressRouter {
		return {};
	}
}

/*------------------------------------------------------------------------------------------------*/
//	--- Helper function ---
/*------------------------------------------------------------------------------------------------*/
function hasApiHandler(obj: any): bool {
	return obj.hasApiHandler? true: false;
}

function hasStaticFileHandler(obj: any): bool {
	return obj.hasStaticFileHandler? true: false;
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = RouteParser;