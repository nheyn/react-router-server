/**
 * @flow
 */
var React = require('react');

type RouteFilter = (route: ReactRouterRoute) => bool;

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
		var hasHttpHandler = (route) => hasApiHandler(route) || hasStaticFileHandler(route);
		return this._flattenRoutesFilteredChildren(hasHttpHandler).map((route) => {
			return {
				path: route.props.path? route.props.path: route.props.name,
				type: hasApiHandler(route)? 'api': 'file', // Already must be 'api' or 'file'
				router: this._getRouterFrom(route)
			};
		});
	}

/*------------------------------------------------------------------------------------------------*/
//	--- Private Method ---
/*------------------------------------------------------------------------------------------------*/
	_filterChildren(children: ReactRouterChildren, shouldKeep: RouteFilter)
																		: Array<ReactRouterRoute> {
		//NOTE, Should use React.Children.filter, but https://github.com/facebook/react/issues/2956
		var filteredChildren = [];
		React.Children.forEach(children, (child, i) => {
			// Filter children and their children by should keep
			if(typeof child !== 'string' && shouldKeep(child)) {
				filteredChildren.push(
					React.cloneElement(
						child,
						{key: i},
						React.Children.count(child.props.children) === 0?
							null:
							this._filterChildren(child.props.children, shouldKeep)
					)	
				);
			}
		});
		return filteredChildren;
	}

	_filterRoutesChildren(shouldKeep: RouteFilter): Array<ReactRouterRoute> {
		return this._filterChildren(this._route.props.children, shouldKeep);
	}

	_getRouterFrom(route: ReactRouterRoute): ExpressRouter {
		return route.props.handler.getRouter();
	}

	_flattenRoutesFilteredChildren(shouldKeep: RouteFilter) : Array<ReactRouterRoute> {
		return this._flattenRoutes(this._filterRoutesChildren(shouldKeep));
	}
	
	_flattenRoutes(routes: Array<ReactRouterRoute>): Array<ReactRouterRoute> {
		if(routes.length === 0) return [];

		//NOTE, Not using React.Children.map because https://github.com/facebook/react/issues/2872
		var flattenedRoutes = [];
		var flattener = (currRoutes) => {
			React.Children.forEach(currRoutes, (route) => {
				flattenedRoutes.push(route);

				if(route.props.children) flattener(route.props.children);
			});
		}; flattener(routes);

		return flattenedRoutes;
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