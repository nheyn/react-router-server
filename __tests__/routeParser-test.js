jest.dontMock('react');
jest.dontMock('../src/RouteParser.js');

var React = require('react');
var express = require('express');

describe('RouteParser' () => {
	var tests = (getRoute, createRouteParser, apiHandlers, staticFileHandlers) => {
		//TODO, make multi level tests
		
		it('can get route without api and static file handlers', () => {
			var route = getRoute();
			var routeParser = createRouteParser(route);

			var checkRoutes = (filteredRoutes) => {
				filteredRoutes.forEach((filteredRoute) => {
					//if(filteredRoute.props.children) checkRoutes(filteredRoute.props.children);

					var Handler = filteredRoute.props.handler;
					expect(Handler.isApiHandler).toBeFalsy();
					expect(Handler.isStaticFileHandler).toBeFalsy();
				});
			}

			checkRoutes(routeParser.getReactRouterRoute());
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
				}
				else if(router.type === 'staticFile') {
					expect(staticFileHandlers.keys()).toContain(router.path);
				}
				else {
					expect(router.type).toBe('api OR staticFile');
				}
			});
		});
	};

	describe('when empty' () => {
		tests(makeGetRouteFunction(), getRouteParser, new Map(), new Map());
	});

	describe('when has only react handlers' => {
		var reactHandlers = getReactHandlers();
		tests(
			makeGetRouteFunction(reactHandlers), 
			getRouteParser,
			new Map(), 
			new Map()
		);
	});

	describe('when has api handlers' => {
		var apiHandlers = getApiHandlers();
		tests(
			makeGetRouteFunction(null, apiHandlers),
			getRouteParser,
			apiHandlers,
			new Map()
		);
	});

	describe('when has static file handlers' => {
		var staticFileHandlers = getStaticFileHandlers();
		tests(
			makeGetRouteFunction(null, null, staticFileHandlers),
			getRouteParser,
			new Map(),
			staticFileHandlers
		);
	});

	describe('when has api handlers and static file handlers (no react handlers)' => {
		var apiHandlers = getApiHandlers();
		var staticFileHandlers = getStaticFileHandlers();
		tests(
			makeGetRouteFunction(null, apiHandlers, staticFileHandlers), 
			getRouteParser, 
			apiHandlers, 
			staticFileHandlers
		);
	});

	describe('when has react handlers, api handlers and static file handlers' => {
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
	var RouteParser = require('../src/RouteParser.js');
	return new RouteParser(route);
}

function getReactHandlers() {
	var handlers = new Map();

	for(var i=0; i<5; i++) handlers.set(`react_${i}`, <div id={i} />);
	
	return handlers;
}

function getApiHandlers() {
	var handlers = new Map();

	for(var i=0; i<5; i++) handlers.set(`api_${i}`, routeHandler.makeApiHandler(express.Router()));

	return handlers;
}

function getStaticFileHandlers() {
	var handlers = new Map();

	for(var i=0; i<5; i++) {
		handlers.set(`file_${i}`, routeHandler.makeStaticFileHandlers('path/to/file_${i}.txt'));
	}

	return handlers;
}