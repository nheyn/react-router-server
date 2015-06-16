declare module "express" {
}

type ExpressRouter = any; //TODO

type ReactRouteToExpressRouterObject = {
	path: string;
	type: string;
	router: ExpressRouter;
};