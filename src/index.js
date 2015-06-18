/**
 * @flow
 */
var routeToRouter = require('./routeToRouter.js');

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.RouteParser = require('./routeParser');
module.exports.makeApiFunctionHandler = routeToRouter.makeApiFunctionHandler;
module.exports.makeApiRouterHandler = routeToRouter.makeApiRouterHandler;
module.exports.makeStaticFileHandler = routeToRouter.makeStaticFileHandler;
