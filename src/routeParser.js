/**
 * @flow
 */
var React = require('react');

type ReactRouterRoutes = Array<ReactRouterRoute>;
type ReactRouterChildren = ?(ReactRouterRoute | ReactRouterRoutes);

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
	 *							NOTE:	React routes can have http sub-routes, but http routes can
	 *									not have React sub-routes
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
		return React.cloneElement(this._route, {}, this._filterRoutesChildren(
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
			this._filterRoutesChildren(hasApiHandler).map((route) => {
				return {
					path: route.props.name,
					type: 'api',
					router: this._makeApiRouterFrom(route)
				};
			}),
			this._filterRoutesChildren(hasStaticFileHandler).map((route) => {
				return {
					path: route.props.name,
					type: 'file',
					router: this._makeStaticFileRouterFrom(route)
				};
			})
		);
	}

/*------------------------------------------------------------------------------------------------*/
//	--- Private Method ---
/*------------------------------------------------------------------------------------------------*/
	_filterChildren(children: ReactRouterChildren, shouldKeep: (route: ReactRouterRoute) => bool)
																			: ReactRouterRoutes	{
		if(React.Children.count(children) === 0) return []; 

		var filteredChildren = [];
		React.Children.forEach(children, (child) => {
			// Keeps it so React routes can have http sub-routes, but http routes can not have 
			// React sub-routes. (Needs more changes to make it work this way)
			if(shouldKeep(child)) {
				filteredChildren.push(child);
				filteredChildren = [].concat(
					filteredChildren,
					this._filterChildren(child.props.children, shouldKeep)
				);
			}
		});
		return filteredChildren;
	}

	_filterRoutesChildren(shouldKeep: (route: ReactRouterRoute) => bool): ReactRouterRoutes {
		return this._filterChildren(this._route.props.children, shouldKeep);
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
function hasApiHandler(route: ReactRouterRoute): bool {
	return route.props.handler.hasApiHandler? true: false;
}

function hasStaticFileHandler(route: ReactRouterRoute): bool {
	return route.props.handler.hasStaticFileHandler? true: false;
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = RouteParser;