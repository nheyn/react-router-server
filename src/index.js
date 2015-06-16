/**
 * @flow
 */
var httpRoutes = require('../src/httpRoutes.js');

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.RouteParser = require('./routeParser');
module.exports.makeApiHandler = httpRoutes.makeApiHandler;
module.exports.makeStaticFileHandler = httpRoutes.makeStaticFileHandler;