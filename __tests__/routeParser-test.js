jest.dontMock('../src/routeParser.js');

var React = require('react');
var { Route } = require('react-router');
var express = require('express');


var RouteParser = require('../src/routeParser.js');
//var httpRoutes = require('../src/httpRoutes.js');

/*------------------------------------------------------------------------------------------------*/
// Http mock
/*------------------------------------------------------------------------------------------------*/
var httpRoutes = jest.genMockFromModule('../src/httpRoutes.js');
httpRoutes.makeApiHandler = function() {
	var Handler = function() {};
	Handler.hasApiHandler = true;
	return Handler;
};

httpRoutes.makeStaticFileHandler = function() {
	var Handler = function() {};
	Handler.hasStaticFileHandler = true;
	return Handler;
};

/*------------------------------------------------------------------------------------------------*/
// React Router handler mock
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
				React.Children.forEach(children, (child) => {
					expect(child.props.name).toContain('react_');

					if(React.Children.count(child.props.children) > 0) {
						checkAllChildrenAreReact(child.props.children);
					}
				});
			};
			
			checkAllChildrenAreReact(filteredRoute.props.children);
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
					expect(apiHandlers.has(router.path)).toBe(true);
				}
				else if(router.type === 'file') {
					expect(staticFileHandlers.has(router.path)).toBe(true);
				}
				else {
					expect(router.type).toBe('api OR staticFile');
				}
			});
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

	//TODO, make multi level tests
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
		var makeRouterHandler = httpRoutes.makeApiHandler(express.Router());
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
		var makeRouterHandler = httpRoutes.makeApiHandler(express.Router());
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
		var makeRouterHandler = httpRoutes.makeApiHandler(express.Router());
		var apiHandlers = new Map();
		apiHandlers.set('api_0', makeRouterHandler());
		apiHandlers.set('api_1', makeRouterHandler());

		var fileHandlers = new Map();
		fileHandlers.set('file_0', makeRouterHandler());
		fileHandlers.set('file_0/file_0_0', makeRouterHandler());
		fileHandlers.set('file_0/file_0_1', makeRouterHandler());

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
						<Route name="ract_2" handler={MockHandler}>
							<Route name="file_0" handler={fileHandlers.get('file_0')}>
								<Route
									name="file_0_0" 
									handler={fileHandlers.get('file_0/file_0_0')}
								/>								{/***/}
								<Route
									name="file_0_1"
									handler={fileHandlers.get('file_0/file_0_1')}
								/>								{/***/}
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
	}
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
