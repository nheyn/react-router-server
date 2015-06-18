declare module "express" {
	declare function Router(): ExpressRouter;
	declare function static(filePath: string): ExpressRouter;
}

type ExpressReq = any; //TODO
type ExpressRes = any; //TODO
type ExpressCallback = (req: ExpressReq, res: ExpressRes, next?: () => void) => void;

declare class ExpressRouter {
	use(callback: ExpressCallback): void;
};

type ReactRouteToExpressRouterObject = {
	path: string;
	type: string;
	router: ExpressRouter;
};