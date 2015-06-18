declare module "react-router" {
	declare function run(routes: ReactRouterRoute, loc: any, callback: ReactRouterCallback): void;
	declare var RouteHandler: any; //RouteHandler;
}

type ReactRouterHandler<D,P,S> = ReactClass<D,P,S>;
type ReactRouterRoute<D,P,S> = ReactElement<D,P,S>;
type ReactRouterChildren<D,P,S> = ?(ReactRouterRoute<D,P,S> | Array<ReactRouterRoute<D,P,S>>);
type ReactRouterCallback<D,P,S> = (Handler: ReactClass<D,P,S>, state: ReactRouterState) => void;
type ReactRouterState = any; //TODO