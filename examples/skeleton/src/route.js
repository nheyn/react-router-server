var path = require('path');
var express = require('express');
var React = require('react');
var { DefaultRoute, Route } = require('react-router');
var { RouterRoute } = require('react-router-server');

var publicFilesSrc = path.join(__dirname, '../public/');
var appSrc = path.join(__dirname, '../app.js');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Route ---
/*------------------------------------------------------------------------------------------------*/
function createRoute() {
	return (
		<Route>
			{/* <DefaultRoute handler={HomePageHandler} /> */}
			<RouterRoute name="public" src={publicFilesSrc} />
			<RouterRoute name="app.js" src={appSrc} />
		</Route>
	);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.createRoute = createRoute;
