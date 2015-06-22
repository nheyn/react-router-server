declare module "async-react-router" {
	declare var AsyncReact: {
		render(	element: ReactElement, 
				container: any, 
				context: ?MaybePromise	):	Promise<ReactComponent>;
		renderToString(element: ReactElement, context: ?MaybePromise): Promise<string>;
		renderToStaticMarkup(element: ReactElement, context: ?MaybePromise): Promise<string>;
	}

	declare var AsyncRouter: {
		run(route: ReactRouterRoute, location: any, callback: ReactRouterCallback): void;
	}
}