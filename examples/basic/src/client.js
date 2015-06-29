require('babel/polyfill');

var React = require('react');
var { client } = require('react-router-server');
var exampleRoute = require('./route');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Client ---
/*------------------------------------------------------------------------------------------------*/
window.React = React;
window.onload = () => {
	client.renderRoute({
		route: exampleRoute,
		element: window.getElementById('react'),
		getProps: function() {
			//TODO
			return null;
		},
		getContext: function() {
			//TODO
			return null;
		}
	});
};
