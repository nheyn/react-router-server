describe('RouteParser' () => {
	var tests = (getRoute, createRouteParser, apiHandlers, staticFileHandlers) => {	
		it('can get route without api and static file handlers', () => {
			var route = getRoute();
			var routeParser = createRouteParser(route);

			var checkRoutes = (filteredRoutes) => {
				filteredRoutes.forEach((filteredRoute) => {
					if(filteredRoute.props.children) checkRoutes(filteredRoute.props.children);

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
					expect(router.type).toBe('api');
					// OR
					expect(router.type).toBe('staticFile');
				}
			});
		});
	};

	describe('when empty' () => {
		tests(() => null, () => null, new Map(), new Map());
	});

	describe('when has only react handlers' => {
		tests(() => null, () => null, new Map(), new Map());
	});

	describe('when has api handlers' => {
		tests(() => null, () => null, new Map(), new Map());
	});

	describe('when has static file handlers' => {
		tests(() => null, () => null, new Map(), new Map());
	});

	describe('when has api handlers and static file handlers' => {
		tests(() => null, () => null, new Map(), new Map());
	});

	describe('when has api handlers and static file handlers' => {
		tests(() => null, () => null, new Map(), new Map());
	});
});

/*------------------------------------------------------------------------------------------------*/
// Helper functions
/*------------------------------------------------------------------------------------------------*/