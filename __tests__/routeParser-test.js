var React = require.requireActual('react');

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
		var staticFileHandlers = getStaticApiHandlers();
		tests(
			makeGetRouteFunction(null, null, staticFileHandlers),
			getRouteParser,
			new Map(),
			staticFileHandlers
		);
	});

	describe('when has api handlers and static file handlers (no react handlers)' => {
		var apiHandlers = getApiHandlers();
		var staticFileHandlers = getStaticApiHandlers();
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
		var staticFileHandlers = getStaticApiHandlers();
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
		//TODO
		return null;
	}
}

function getRouteParser(route) {
	//TODO
	return null;
}

function getReactHandlers() {
	//TODO
	return new Map();
}

function getApiHandlers() {
	//TODO
	return new Map();
}

function getStaticApiHandlers() {
	//TODO
	return new Map();
}