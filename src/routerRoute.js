/**
 * @flow
 */
var React = require('react');
var { Route } = require('react-router');
var express = require('express');

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
		router: React.PropTypes.any // Because ExpressRouter is a func with props
	},
	render(): ReactElement {
		throw new Error('RouterRoute should never be rendered');
	},
	getRouter(): ExpressRouter {
		if(this.props.router) {
			return this.props.router;
		}
		else if(this.props.callback) {
			return this.getRouterFromCallback(this.props.callback);
		}
		else if(this.props.src) {
			return this.getRouterFromSrc(this.props.src);
		}
		else {
			throw new Error("RouterRoute must have 'callback', 'router' or 'src' prop.");
		}
	},
	getRouterFromCallback(callback: ExpressCallback): ExpressRouter {
		var router = express.Router();
		router.use(callback);
		return router;
	},
	getRouterFromSrc(src: string): ExpressRouter {
		return express.static(src);
	}
});

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = RouterRoute;
