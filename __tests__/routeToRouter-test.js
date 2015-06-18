jest.dontMock('../src/routeToRouter.js');

var React = require('react');
var express = require('express');

var routeToRouter = require('../src/routeToRouter.js');

/*------------------------------------------------------------------------------------------------*/
// Router Parser Test
/*------------------------------------------------------------------------------------------------*/
describe('makeApiFunctionHandler', () => {
	it('has "isApiHandler" property', () => {
		var Handler = routeToRouter.makeApiFunctionHandler(() => {});

		expect(Handler.isApiHandler).toBeDefined();
		expect(Handler.isApiHandler).toBe(true);
		expect(Handler.isStaticFileHandler).toBeFalsy();
	});

	it('is given a functions and stores it as an express router', () => {
		var callback = jest.genMockFunction();
		var Handler = routeToRouter.makeApiFunctionHandler(callback);

		expect(Handler.getRouter).toBeDefined();
		//expect(Handler.getRouter().callbackFunction).toBe(callback);	//TODO, express needs mocked for this to work
	});
});

describe('makeApiRouterHandler', () => {
	it('has "isApiHandler" property', () => {
		var Handler = routeToRouter.makeApiRouterHandler(express.Router());

		expect(Handler.isApiHandler).toBeDefined();
		expect(Handler.isApiHandler).toBe(true);
		expect(Handler.isStaticFileHandler).toBeFalsy();
	});

	it('is given and stores an express router', () => {
		var router = express.Router();
		var Handler = routeToRouter.makeApiRouterHandler(router);

		expect(Handler.getRouter).toBeDefined();
		expect(Handler.getRouter()).toBe(router);
	});
});

describe('makeStaticFileHandler', () => {
	it('has "isStaticFileHandler" property', () => {
		var Handler = routeToRouter.makeStaticFileHandler('/path/to/file');

		expect(Handler.isStaticFileHandler).toBeDefined();
		expect(Handler.isStaticFileHandler).toBe(true);
		expect(Handler.isApiHandler).toBeFalsy();
	});

	it('is given an file and stores an express router to the file', () => {
		var filePath = 'path/to/file.html';
		var Handler = routeToRouter.makeStaticFileHandler(filePath);

		expect(Handler.getRouter).toBeDefined();
		//expect(Handler.getRouter().filePath).toBe(filePath);	//TODO, express needs mocked for this to work
	});
});

/*------------------------------------------------------------------------------------------------*/
// Helper Functions
/*------------------------------------------------------------------------------------------------*/