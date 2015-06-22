/**
 * @flow
 */
var React = require('react');
var Router = require('react-router');
var { AsyncReact, AsyncRouter } = require('async-react-router');

var RouteParser = require('./routeParser');

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Client Class ---
/*------------------------------------------------------------------------------------------------*/
class ReactRouterClient {
	_route: ReactRouterRoute;
	_getProps: () => Promise;
	_getContext: () => Promise;

	/**
	 * Create a Server that uses the given route and calls the given callback when every request
	 * is received.
	 *
	 * @note The 'getProps' and 'getContext' arguments are called each time the page is changed
	 *
	 * @param route			{ReactRouterRoute}	The route for this server
	 * @param [getProps]	{GetMaybePromise}	A function to get the props (maybe in a promise) 
	 * @param [getContext]	{GetMaybePromise}	A function to get the context (maybe in a promise)
	 */
	constructor(route: ReactRouterRoute, getProps?: GetMaybePromise, getContext?: GetMaybePromise) {
		this._parseRoute(route);

		if(getProps)	this._getProps = wrapMaybePromiseFunction(getProps);
		if(getContext)	this._getContext = wrapMaybePromiseFunction(getContext);
	}

/*------------------------------------------------------------------------------------------------*/
//	Public Methods
/*------------------------------------------------------------------------------------------------*/
	/**
	 * Renders this app in the given element.
	 *
	 * @param reactElement	{HTMLElement}				The html element to render the react app in
	 *
	 * @return				{Promise<ReactComponent>}	The rendered react component in an Promise
	 */
	renderApp(reactElement: HTMLElement): Promise<ReactComponent> {
		return new Promise((resolve, reject) => {
			AsyncRouter.run(this._route, Router.HistoryLocation, (Handler, state) => {
				this._getPropsAndContext()
					.then((propsAndContext) => {
						var {props, context} = propsAndContext;
						resolve(AsyncReact.render(<Handler {...props} />,  reactElement, context));
					})
					.catch((err) => {
						reject(err);
					});
			});
		});
	}

/*------------------------------------------------------------------------------------------------*/
//	Private Methods
/*------------------------------------------------------------------------------------------------*/
	_parseRoute(route: ReactRouterRoute) {
		var parser = new RouteParser(route);

		this._route = parser.getReactRouterRoute();
	}

	_getPropsAndContext(): Promise<{props: any, context: any}> {
		return Promise.all([this._getProps(), this._getContext()]).then((resolved) => {
			var [props, context] = resolved;
			return {
				props: resolved[0],
				context: resolved[1]
			};
		});
	}
}

/*------------------------------------------------------------------------------------------------*/
//	Helper functions
/*------------------------------------------------------------------------------------------------*/
function wrapMaybePromiseFunction<T>(func: GetMaybePromise<T>): () => Promise<T> {
	return  () => Promise.resolve(func());
}

/*------------------------------------------------------------------------------------------------*/
//	Exports
/*------------------------------------------------------------------------------------------------*/
module.exports = ReactRouterClient;