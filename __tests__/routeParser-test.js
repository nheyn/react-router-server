jest.dontMock('../src/routeParser.js');

var routeToRouterMock = jest.genMockFromModule('../src/routeToRouter.js');
routeToRouterMock.API_ROUTER = 'API_ROUTER';
routeToRouterMock.makeApiFunctionHandler = function() {
	var Handler = function() {};
	Handler.hasApiHandler = true;
	Handler.getRouter = jest.genMockFunction().mockReturnValue(routeToRouterMock.API_ROUTER);
	return Handler;
};

routeToRouterMock.FILE_ROUTER = 'FILE_ROUTER';
routeToRouterMock.makeStaticFileHandler = function() {
	var Handler = function() {};
	Handler.hasStaticFileHandler = true;
	Handler.getRouter = jest.genMockFunction().mockReturnValue(routeToRouterMock.FILE_ROUTER);
	return Handler;
};

jest.setMock('../src/routeToRouter.js', routeToRouterMock);

var React = require('react');
var { Route } = require('react-router');


var RouteParser = require('../src/routeParser.js');
var routeToRouter = require('../src/routeToRouter.js');

/*------------------------------------------------------------------------------------------------*/
// React Router Handler Mock
/*------------------------------------------------------------------------------------------------*/
var MockHandler = React.createClass({
	render() {
		throw new Error('SHOULD NOT BE RENDERED');
	}
});

/*------------------------------------------------------------------------------------------------*/
// Router Parser Test
/*------------------------------------------------------------------------------------------------*/
describe('RouteParser', () => {
	var tests = (getRoute, createRouteParser, apiHandlers, staticFileHandlers) => {
		if(!apiHandlers) apiHandlers = new Map();
		if(!staticFileHandlers) staticFileHandlers = new Map();

		it('can get route without api and static file handlers', () => {
			var route = getRoute();
			var routeParser = createRouteParser(route);

			var filteredRoute = routeParser.getReactRouterRoute();
			expect(filteredRoute.props.handler.hasApiHandler).toBeFalsy();
			expect(filteredRoute.props.handler.hasStaticFileHandler).toBeFalsy();
			
			var checkAllChildrenAreReact = (children) => {
				React.Children.forEach(children, (child, i) => {
					expect(child.props.name).toContain('react_');

					if(React.Children.count(child.props.children) > 0) {
						checkAllChildrenAreReact(child.props.children);
					}
				});
			};
			
			checkAllChildrenAreReact(filteredRoute.props.children);
		});

		it('creates function routes from http handlers', () => {
			var route = getRoute();
			var routeParser = createRouteParser(route);

			var routers = routeParser.getExpressRouters();

			var numberOfApiHandlers = 0;
			var numberOfStaticFileHandlers = 0;

			routers.forEach((router) => {
				expect(router.path).toBeDefined();
				expect(router.type).toBeDefined();
				expect(router.router).toBeDefined();

				if(router.type === 'api') {
					expect(router.router).toBe(routeToRouter.API_ROUTER);
					expect(apiHandlers.has(router.path)).toBe(true);
					numberOfApiHandlers++;
				}
				else if(router.type === 'file') {
					expect(router.router).toBe(routeToRouter.FILE_ROUTER);
					expect(staticFileHandlers.has(router.path)).toBe(true);
					numberOfStaticFileHandlers++;
				}
				else {
					expect(router.type).toBe('api OR staticFile');
				}
			});

			expect(numberOfApiHandlers).toBe(apiHandlers.size);
			expect(numberOfStaticFileHandlers).toBe(staticFileHandlers.size);
		});
	};

	describe('when empty', () => {
		tests(makeGetRouteFunction(), getRouteParser);
	});

	describe('when has only react handlers', () => {
		var reactHandlers = getReactHandlers();
		tests(
			makeGetRouteFunction(reactHandlers), 
			getRouteParser
		);
	});

	describe('when has api handlers', () => {
		var apiHandlers = getApiHandlers();
		tests(
			makeGetRouteFunction(null, apiHandlers),
			getRouteParser,
			apiHandlers
		);
	});

	describe('when has static file handlers', () => {
		var staticFileHandlers = getStaticFileHandlers();
		tests(
			makeGetRouteFunction(null, null, staticFileHandlers),
			getRouteParser,
			null,
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

	describe('when react handlers has sub routes', () => {
		//TODO, update to be generated (see other test)
		tests(
			() => {
				return (
					<Route>
						<Route name="react_0" handler={MockHandler}>
							<Route name="react_0_0" handler={MockHandler} />
							<Route name="react_0_1" handler={MockHandler} />
						</Route>
						<Route name="react_1" handler={MockHandler}>
							<Route name="react_1_0" handler={MockHandler} />
							<Route name="react_1_1" handler={MockHandler} />
						</Route>
					</Route>
				);
			},
			getRouteParser
		);
	});

	describe('when api handlers has sub routes', () => {
		//TODO, update to be generated (see other test)
		var makeRouterHandler = () => routeToRouter.makeApiFunctionHandler(() => {});
		var apiHandlers = new Map();
		apiHandlers.set('api_0', makeRouterHandler());
		apiHandlers.set('api_0/api_0_0', makeRouterHandler());
		apiHandlers.set('api_0/api_0_1', makeRouterHandler());
		apiHandlers.set('api_1', makeRouterHandler());
		apiHandlers.set('api_1/api_1_0', makeRouterHandler());
		apiHandlers.set('api_1/api_1_1', makeRouterHandler());

		tests(
			() => {
				return (
					<Route>
						<Route name="api_0" handler={apiHandlers.get('api_0')}>
							<Route name="api_0_0" handler={apiHandlers.get('api_0/api_0_0')} />
							<Route name="api_0_1" handler={apiHandlers.get('api_0/api_0_1')} />
						</Route>
						<Route name="api_1" handler={apiHandlers.get('api_1')}>
							<Route name="api_1_0" handler={apiHandlers.get('api_1/api_1_0')} />
							<Route name="api_1_1" handler={apiHandlers.get('api_1/api_1_1')} />
						</Route>
					</Route>
				);
			},
			getRouteParser,
			apiHandlers
		);
	});

	describe('when file handlers has sub routes', () => {
		//TODO, update to be generated (see other test)
		var makeRouterHandler = () => routeToRouter.makeStaticFileHandler('path/to/file');
		var fileHandlers = new Map();
		fileHandlers.set('file_0', makeRouterHandler());
		fileHandlers.set('file_0/file_0_0', makeRouterHandler());
		fileHandlers.set('file_0/file_0_1', makeRouterHandler());
		fileHandlers.set('file_1', makeRouterHandler());
		fileHandlers.set('file_1/file_1_0', makeRouterHandler());
		fileHandlers.set('file_1/file_1_1', makeRouterHandler());

		tests(
			() => {
				return (
					<Route>
						<Route name="file_0" handler={fileHandlers.get('file_0')}>
							<Route name="file_0_0" handler={fileHandlers.get('file_0/file_0_0')} />
							<Route name="file_0_1" handler={fileHandlers.get('file_0/file_0_1')} />
						</Route>
						<Route name="file_1" handler={fileHandlers.get('file_1')}>
							<Route name="file_1_0" handler={fileHandlers.get('file_1/file_1_0')} />
							<Route name="file_1_1" handler={fileHandlers.get('file_1/file_1_1')} />
						</Route>
					</Route>
				);
			},
			getRouteParser,
			null,
			fileHandlers
		);
	});

	describe('when react handlers has sub routes that are http handlers', () => {
		//TODO, update to be generated (see other test)
		var makeApiFunctionHandler = () => routeToRouter.makeApiFunctionHandler(() => {});
		var apiHandlers = new Map();
		apiHandlers.set('api_0', makeApiFunctionHandler());
		apiHandlers.set('api_1', makeApiFunctionHandler());


		var makeFileHandler = () => routeToRouter.makeStaticFileHandler('path/to/file');
		var fileHandlers = new Map();
		fileHandlers.set('file_0', makeFileHandler());
		fileHandlers.set('file_0/file_0_0', makeFileHandler());
		fileHandlers.set('file_0/file_0_1', makeFileHandler());

		tests(
			() => {
				return (
					<Route>
						<Route name="react_0" handler={MockHandler}>
							<Route name="api_0" handler={apiHandlers.get('api_0')} />
							<Route name="api_1" handler={apiHandlers.get('api_1')} />
						</Route>
						<Route name="react_1" handler={MockHandler}>
							<Route name="react_1_0" handler={MockHandler} />
							<Route name="react_1_1" handler={MockHandler} />
						</Route>
						<Route name="react_2" handler={MockHandler}>
							<Route name="file_0" handler={fileHandlers.get('file_0')}>
								<Route
									name="file_0_0" 
									handler={fileHandlers.get('file_0/file_0_0')}
								/>			{/***/}
								<Route
									name="file_0_1"
									handler={fileHandlers.get('file_0/file_0_1')}
								/>			{/***/}
							</Route>
						</Route>
					</Route>
				);
			},
			getRouteParser
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
	};
}

function getRouteParser(route) {
	return new RouteParser(route);
}

function getReactHandlers(count = 5) {
	var handlers = new Map();

	for(var i=0; i<count; i++) {
		handlers.set(`react_${i}`, MockHandler);
	}

	return handlers;
}

function getApiHandlers(count = 5) {
	var handlers = new Map();

	for(var i=0; i<count; i++) {
		handlers.set(
			`api_${i}`, 
			routeToRouter.makeApiFunctionHandler(() => {})
		);
	}

	return handlers;
}

function getStaticFileHandlers(count = 5) {
	var handlers = new Map();

	for(var i=0; i<count; i++) {
		handlers.set(
			`file_${i}`, 
			routeToRouter.makeStaticFileHandler('path/to/file_${i}.txt')
		);
	}

	return handlers;
}
