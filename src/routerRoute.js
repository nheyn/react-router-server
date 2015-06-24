/**
 * @flow
 */
var React = require('react');
var { Route } = require('react-router');
var routeToRouter = require('./routeToRouter');

/*------------------------------------------------------------------------------------------------*/
//	--- Router Route Handler Definitions ---
/*------------------------------------------------------------------------------------------------*/
/**
 * A React class, that can be use instead of React Router's Route class, that can
 */
var RouterRoute = React.createClass({
	propTypes: {
		name: React.PropTypes.string,
		path: React.PropTypes.string,
		src: React.PropTypes.string,
		callback: React.PropTypes.func,
		router: React.PropTypes.object
	},
	render(): ReactElement {
		return <Route name={this.props.name} path={this.props.path} handler={this.getHandler()} />;
	},
	getHandler(): ReactRouterHandler {
		if(this.props.callback) {
			return routeToRouter.makeApiFunctionHandler(this.props.callback);
		}
		else if(this.props.router) {
			return routeToRouter.makeApiRouterHandler(this.props.router);
		}
		else if(this.props.src) {
			return routeToRouter.makeStaticFileHandler(this.props.src);
		}

		throw new Error("RouterRoute must have 'callback', 'router' or 'src' prop.")
	}
});

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = RouterRoute;
