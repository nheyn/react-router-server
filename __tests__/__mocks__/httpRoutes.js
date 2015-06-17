var httpRoutesMock = jest.genMockFromModule('../../src/httpRoutes.js');

httpRoutesMock.makeApiHandler = function() {
	var Handler = function() {};
	Handler.hasApiHandler = true;
	return Handler;
};

httpRoutesMock.makeStaticFileHandler = function() {
	var Handler = function() {};
	Handler.hasStaticFileHandler = true;
	return Handler;
};

module.exports = httpRoutesMock;