declare module "react-router" {
	declare function run(routes: ReactRouterRoute, loc: any, callback: ReactRouterCallback): void;
	declare var RouteHandler: any; //RouteHandler;
}

type ReactRouterHandler = ReactClass;
type ReactRouterRoute = ReactElement;
type ReactRouterCallback<D,P,S> = (Handler: ReactClass<D,P,S>, state: ReactRouterState) => void;
type ReactRouterState = any; //TODO