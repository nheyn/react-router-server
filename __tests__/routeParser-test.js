jest.dontMock('../src/routeParser.js');

var React = require('react');
var { Route } = require('react-router');
var express = require('express');


var RouteParser = require('../src/routeParser.js');
var httpRoutes = require('../src/httpRoutes.js');

describe('RouteParser', () => {
	var tests = (getRoute, createRouteParser, apiHandlers, staticFileHandlers) => {
		//TODO, make multi level tests
		it('can get route without api and static file handlers', () => {
			var route = getRoute();
			var routeParser = createRouteParser(route);

			var filteredRoute = routeParser.getReactRouterRoute();
			expect(filteredRoute.props.handler.hasApiHandler).toBeFalsy();
			expect(filteredRoute.props.handler.hasStaticFileHandler).toBeFalsy();

			React.Children.forEach(filteredRoute.props.children, (child) => {
				expect(child.props.name).toContain('react_');
			});
		});

		it('creates express routes from http handlers', () => {
			var route = getRoute();
			var routeParser = createRouteParser(route);

			var routers = routeParser.getExpressRouters();
			routers.forEach((router) => {
				expect(router.path).toBeDefined();
				expect(router.type).toBeDefined();
				expect(router.router).toBeDefined();	//NOTE, router.router is not checked if it
														//		is correct, just if it is defined

				if(router.type === 'api') {
					expect(apiHandlers.keys()).toContain(router.path);
					expect(router.path).toContain('api_');
				}
				else if(router.type === 'staticFile') {
					expect(staticFileHandlers.keys()).toContain(router.path);
					expect(router.path).toContain('file_');
				}
				else {
					expect(router.type).toBe('api OR staticFile');
				}
			});
		});
	};

	describe('when empty', () => {
		tests(makeGetRouteFunction(), getRouteParser, new Map(), new Map());
	});

	describe('when has only react handlers', () => {
		var reactHandlers = getReactHandlers();
		tests(
			makeGetRouteFunction(reactHandlers), 
			getRouteParser,
			new Map(), 
			new Map()
		);
	});

	describe('when has api handlers', () => {
		var apiHandlers = getApiHandlers();
		tests(
			makeGetRouteFunction(null, apiHandlers),
			getRouteParser,
			apiHandlers,
			new Map()
		);
	});

	describe('when has static file handlers', () => {
		var staticFileHandlers = getStaticFileHandlers();
		tests(
			makeGetRouteFunction(null, null, staticFileHandlers),
			getRouteParser,
			new Map(),
			staticFileHandlers
		);
	});

	describe('when has api handlers and static file handlers (no react handlers)', () => {
		var apiHandlers = getApiHandlers();
		var staticFileHandlers = getStaticFileHandlers();
		tests(
			makeGetRouteFunction(null, apiHandlers, staticFileHandlers), 
			getRouteParser, 
			apiHandlers, 
			staticFileHandlers
		);
	});

	describe('when has react handlers, api handlers and static file handlers', () => {
		var reactHandlers = getReactHandlers();
		var apiHandlers = getApiHandlers();
		var staticFileHandlers = getStaticFileHandlers();
		tests(
			makeGetRouteFunction(reactHandlers, apiHandlers, staticFileHandlers), 
			getRouteParser, 
			apiHandlers, 
			staticFileHandlers
		);
	});
});

/*------------------------------------------------------------------------------------------------*/
// Helper functions
/*------------------------------------------------------------------------------------------------*/
function makeGetRouteFunction(reactHandlers, apiHandlers, staticFileHandlers) {
	if(!reactHandlers) 		reactHandlers = new Map();
	if(!apiHandlers) 		apiHandlers = new Map();
	if(!staticFileHandlers)	staticFileHandlers = new Map();

	return () => {
		var handlers = [];
		reactHandlers.forEach((handler, name) => {
			handlers.push({ handler, name });
		});
		apiHandlers.forEach((handler, name) => {
			handlers.push({ handler, name });
		});
		staticFileHandlers.forEach((handler, name) => {
			handlers.push({ handler, name });
		});

		return (
			<Route>
				{handlers.map((handler, i) => {
					return <Route key={i} name={handler.name} handler={handler.handler} />;
				})}
			</Route>
		);
	}
}

function getRouteParser(route) {
	return new RouteParser(route);
}

function getReactHandlers(count = 5) {
	var handlers = new Map();

	var Handler = React.createClass({
		render() {
			return 'SHOULD NOT BE RENDERED';
		}
	});

	for(var i=0; i<count; i++) {
		handlers.set(`react_${i}`, Handler);
	}

	return handlers;
}

function getApiHandlers(count = 5) {
	var handlers = new Map();

	for(var i=0; i<count; i++) {
		handlers.set(
			`api_${i}`, 
			httpRoutes.makeApiHandler(express.Router())
		);
	}

	return handlers;
}

function getStaticFileHandlers(count = 5) {
	var handlers = new Map();

	for(var i=0; i<count; i++) {
		handlers.set(
			`file_${i}`, 
			httpRoutes.makeStaticFileHandler('path/to/file_${i}.txt')
		);
	}

	return handlers;
}