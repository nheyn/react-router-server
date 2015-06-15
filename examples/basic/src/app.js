require('babel/polyfill');

var React = require('react');
var Router = require('react-router');
var { AsyncReact, AsyncRouter, contextWrapper } = require('async-react-router');
var route = require('./route.js');
var DataSource = require('./dataSource.js');

// Sever connection
var send = (url, payload, errorMessage = 'Ajax Error') => {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if(request.readyState !== 4) return;

			if(request.status === 200) {
				if(!request.responseText) {
					resolve({});
					return;
				}

				var responseJson = JSON.parse(request.responseText);
				if(responseJson.data)	resolve(responseJson.data);
				else					reject(new Error(errorMessage));
			} 
			else {
				reject(new Error(errorMessage));
			}
		};

		// Send Request
		request.open('POST', url, true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify(payload));
	});
};

// Data Lookup / Action Dispatcher
var dataSource = new DataSource();
var lookup = (query) => send('/lookup', query, 'Error looking up data');
var dispatch = (payload) => send('/action', payload, 'Error performing action');

// Render the page for the given route
window.onload = () => {
	var reactElement = document.getElementById('react-element')
	var props = { dataSource, lookup, dispatch };
	var currRoute = route.makeRoute({lookupHandler: () => null, actionHanlder: () => null});
	AsyncRouter.run(currRoute, Router.HistoryLocation, (Handler, state) => {
		AsyncReact.render(<Handler {...props} />, reactElement, { url: window.location.pathname })
			.then(() => {/* If the component is needed */})
			.catch((err) => { console.log('Render Error:', err, err.stack); });
	});
};