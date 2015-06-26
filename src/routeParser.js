/**
 * @flow
 */
var path = require('path');
var express = require('express');
var React = require('react');

type RouteFilter = (route: ReactRouterRoute) => bool;
type RouterAndPath = {
	path: string;
	router: ExpressRouter;
};

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
//	Public Methods
/*------------------------------------------------------------------------------------------------*/
	/**
	 * Gets the react router route without any of the http handler routes.
	 *
	 * @return	{ReactRouterRoute}	The route with out http handlers
	 */
	getReactRouterRoute(): ReactRouterRoute {
		return React.cloneElement(
			this._route,
			{},
			this._filterRoutesChildren(dosentHaveExpressRouter)
		);
	}

	/**
	 * Gets the express router defined in the react router Route.
	 *
	 * @return	{ExpressRouter}		The router that handles all non page load requests
	 */
	getExpressRouter(): ExpressRouter {
		var router = express.Router();
		this._getExpressRouters().forEach(
			(routerSettings) => {
				console.log(routerSettings);
				router.use(routerSettings.path, routerSettings.router);
			}
		);
		return router;
	}

/*------------------------------------------------------------------------------------------------*/
//	Private Methods
/*------------------------------------------------------------------------------------------------*/
	_filterChildren(children: ReactRouterChildren, shouldKeep: RouteFilter)
																		: Array<ReactRouterRoute> {
		//NOTE, Should use React.Children.filter, but github.com/facebook/react/issues/2956
		var filteredChildren = [];
		React.Children.forEach(children, (child, i) => {
			// Filter children and their children by should keep
			if(shouldKeep(child)) {
				filteredChildren.push(
					React.cloneElement(
						child,
						{key: i},
						child.props.children?
							this._filterChildren(child.props.children, shouldKeep):
							null
					)
				);
			}
		});
		return filteredChildren;
	}

	_filterRoutesChildren(shouldKeep: RouteFilter): Array<ReactRouterRoute> {
		return this._filterChildren(this._route.props.children, shouldKeep);
	}

	_flattenAndFilteredChildren(shouldKeep: RouteFilter) : Array<ReactRouterRoute> {
		return this._flattenRoutes(this._filterRoutesChildren(shouldKeep));
	}

	_flattenRoutes(routes: Array<ReactRouterRoute>): Array<ReactRouterRoute> {
		if(routes.length === 0) return [];

		var flattenedRoutes = [];
		var flattener = (currRoutes, prefix) => {
			//NOTE, Not using React.Children.map because github.com/facebook/react/issues/2872
			React.Children.forEach(currRoutes, (route) => {
				var currPath = getPathOf(route, prefix);

				flattenedRoutes.push(React.cloneElement(route, { path: currPath }));
				if(route.props.children) flattener(route.props.children, currPath);
			});
		};
		flattener(routes, getPathOf(this._route));

		return flattenedRoutes;
	}

	_getExpressRouters(): Array<RouterAndPath> {
		return this._flattenAndFilteredChildren(hasExpressRouter).map((route) => {
			return {
				path: getPathOf(route),
				router: getRouterFrom(route)
			};
		});
	}
}

/*------------------------------------------------------------------------------------------------*/
//	--- Helper function ---
/*------------------------------------------------------------------------------------------------*/
function hasExpressRouter(route: ReactRouterRoute): bool {
	return route.type.hasRouter;
}

function dosentHaveExpressRouter(route: ReactRouterRoute): bool {
	return !hasExpressRouter(route);
}

function getPathOf(route: ReactRouterRoute, prefix?: string): string {
	return path.join(
		prefix? prefix: '/',
		route.props.path? route.props.path: (route.props.name? route.props.name: '')
	);
}

function getRouterFrom(route: ReactRouterRoute): ExpressRouter {
	if(dosentHaveExpressRouter(route)) {
		throw new Error("Routes passed to 'RouteParser._getRouterFrom' must have 'getRouter'.");
	}

	return route.type.getRouter(route.props);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = RouteParser;
