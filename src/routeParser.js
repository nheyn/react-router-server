/**
 * @flow
 */
var path = require('path');
var express = require('express');
var React = require('react');
var { NotFoundRoute } = require('react-router');

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
			this._getReactRouterRoutesChildren()
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
				router.use(routerSettings.path, routerSettings.router);
			}
		);
		return router;
	}

/*------------------------------------------------------------------------------------------------*/
//	Private Methods
/*------------------------------------------------------------------------------------------------*/
	_getExpressRouters(): Array<{ path: string; router: ExpressRouter; }> {
		return this._flattenAndFilteredChildren(hasExpressRouterRecursive)
				.filter(hasExpressRouter)
				.map((route) => {
					return {
						path: getPathOf(route),
						router: getRouterFrom(route)
					};
				});
	}

	_getReactRouterRoutesChildren(): Array<ReactRouterRoute> {
		// Make the 404 route
		var MissingPageHandler = React.createClass({
			render(): ReactElement {
				throw new Error('404: Page Not Found');
			}
		});

		// Get filtered childrend with added 404 route
		var children = this._filterRoutesChildren(doesntHaveExpressRouter);
		children.push(<NotFoundRoute key={children.length} handler={MissingPageHandler} />);

		return children;
	}

	_filterRoutesChildren(shouldKeep: RouteFilter): Array<ReactRouterRoute> {
		return filterChildren(this._route.props.children, shouldKeep);
	}

	_flattenAndFilteredChildren(shouldKeep: RouteFilter) : Array<ReactRouterRoute> {
		return flattenRoutes(
			getPathOf(this._route),
			this._filterRoutesChildren(shouldKeep)
		);
	}
}

/*------------------------------------------------------------------------------------------------*/
//	--- Helper function ---
/*------------------------------------------------------------------------------------------------*/
function hasExpressRouter(route: ReactRouterRoute): bool {
	return route.type.hasRouter? true: false;
}

function doesntHaveExpressRouter(route: ReactRouterRoute): bool {
	return !hasExpressRouter(route);
}

function hasExpressRouterRecursive(route: ReactRouterRoute): bool {
	if(hasExpressRouter(route)) return true;
	if(!route.props.children) return false;

	// Check if any child has router
	var numberOfChildrenWithRouter = filterChildren(
		route.props.children,
		hasExpressRouterRecursive
	).length;
	return numberOfChildrenWithRouter > 0;
}

function filterChildren(children: ReactRouterChildren, shouldKeep: RouteFilter)
																		: Array<ReactRouterRoute> {
	//NOTE, Should use React.Children.filter, but github.com/facebook/react/issues/2956
	var filteredChildren = [];
	React.Children.forEach(children, (child, i) => {
		// Don't include null children
		if(!child) return;

		// Filter children and their children by should keep
		if(shouldKeep(child)) {
			filteredChildren.push(
				React.cloneElement(
					child,
					{key: i},
					child.props.children?
						filterChildren(child.props.children, shouldKeep):
						null
				)
			);
		}
	});
	return filteredChildren;
}

function flattenRoutes(startPath: string, routes: Array<ReactRouterRoute>)
																		: Array<ReactRouterRoute> {
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
	flattener(routes, startPath);

	return flattenedRoutes;
}

function getPathOf(route: ReactRouterRoute, prefix?: string): string {
	return path.join(
		prefix? prefix: '/',
		route.props.path? route.props.path: (route.props.name? route.props.name: '')
	);
}

function getRouterFrom(route: ReactRouterRoute): ExpressRouter {
	if(doesntHaveExpressRouter(route)) {
		throw new Error("Routes passed to 'getRouterFrom' must have 'getRouter'.");
	}

	return route.type.getRouter(route.props);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = RouteParser;
