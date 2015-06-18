/**
 * @flow
 */
var React = require('react');

/*------------------------------------------------------------------------------------------------*/
//	--- React Http Classes Constructors ---
/*------------------------------------------------------------------------------------------------*/
/**
 *	//TODO
 */
function makeApiFunctionHandler(callback: Function): ?ReactRouterHandler {
	return null;
}

/**
 *	//TODO
 */
function makeApiRouterHandler(router: ExpressRouter): ?ReactRouterHandler {
	return null;
}

/**
 *	//TODO
 */
function makeStaticFileHandler(filePath: string): ?ReactRouterHandler {
	return null;
}

var Handler = React.createClass({
	statics: {
		isApiHandler: true,
		isStaticFileHandler: true,
		getApiRoute(): ExpressRouter {

		},
		getStaticFileRoute(): ExpressRouter {

		}
	},
	render() {
		throw new Error('Render of HTTP Handler should not be called');
	}
})

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.makeApiFunctionHandler = makeApiFunctionHandler;
module.exports.makeApiRouterHandler = makeApiRouterHandler;
module.exports.makeStaticFileHandler = makeStaticFileHandler;
