var path = require('path');
var express = require('express');
var React = require('react');
var { DefaultRoute, Route, RouteHandler } = require('react-router');
var { RouterRoute } = require('react-router-server');

//var faviconSrc = path.join(__dirname, '../public/favicon.ico');
var appSrc = path.join(__dirname, '../app.js');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Route ---
/*------------------------------------------------------------------------------------------------*/
function createRoute() {
	return (
		<Route>
			{/*<RouterRoute name="favicon.ico" src={faviconSrc} />*/}
			<RouterRoute name="app.js" src={appSrc} />
		</Route>
	);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createRoute = createRoute;
