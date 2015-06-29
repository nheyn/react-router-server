var path = require('path');
var express = require('express');
var React = require('react');
var { DefaultRoute, Route, RouteHandler } = require('react-router');
var { RouterRoute } = require('react-router-server');

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Handlers ---
/*------------------------------------------------------------------------------------------------*/
var PageWrapper =	React.createClass({ render() { return <RouteHandler />; } });		//TODO
var PageOne =		React.createClass({ render() { return <div>PageOne</div>; } });		//TODO
var PageTwo =		React.createClass({ render() { return <div>PageTwo</div>; } });		//TODO
var SubPageOne = 	React.createClass({ render() { return <div>SubPageOne</div>; } });	//TODO
var SubPageTwo = 	React.createClass({ render() { return <div>SubPageTwo</div>; } });	//TODO

/*------------------------------------------------------------------------------------------------*/
//	--- Router Router / Func / Files---
/*------------------------------------------------------------------------------------------------*/
var func = (req, res) => {
	console.log('func called');
	res.json({'error': ['NYI']});					//TODO
};
var router = express.Router(); 			//TODO
router.use(func);

var faviconSrc = path.join(__dirname, '../staticFiles/favicon.ico');
var appSrc = path.join(__dirname, '../app.js');
var filesSrc = path.join(__dirname, '../staticFiles/');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Route ---
/*------------------------------------------------------------------------------------------------*/
var route = (
	<Route handler={PageWrapper}>
		<DefaultRoute name="pageOne" handler={PageOne} />
		<Route name="pageTwo" handler={PageTwo}>
			<Route name="subPageOne" handler={SubPageOne} />
			<Route name="subPageTwo" handler={SubPageTwo} />
			<RouterRoute name="indenticon.png" src="../staticFiles/indenticon.png" />
		</Route>
		<RouterRoute name="favicon.ico" src={faviconSrc} />
		<RouterRoute name="app.js" src={appSrc} />
		<RouterRoute name="files" src={filesSrc} />
		<RouterRoute name="func" callback={func} />
		<RouterRoute name="router" router={router} />
	</Route>
);

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = route;
