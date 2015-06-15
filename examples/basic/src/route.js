var React = require('react');
var { Link, Route, DefaultRoute } = require('react-router');
var AsyncReactRouter = require('async-react-router');

// Test Site's Handlers
var Page = React.createClass({
	// CONTEXT, test setting context
	mixins: [AsyncReactRouter.AsyncInitialStateHandlerMixin, AsyncReactRouter.AsyncContextMixin],
	render() {
		return (
			<div>
				<h2>Site Heading</h2>
				{/*<img alt="Some Image" src="/staticFiles?path=identicon.png" />*/}
				<nav>
					<ul>
						<li><Link to="p1">P1</Link></li>
						<li><Link to="p2">P2</Link></li>
						<li><Link to="p3">P3</Link></li>
						<li><a href="/staticFiles?path=app.js">Javascript File</a></li>
					</ul>
				</nav>
				{this.getSubRouteHandler(this.props)}
			</div>
		);
	}
});

var PageOne = React.createClass({
	statics: {
		// INITIAL DATA, use local synchronous data
		getAsyncInitialState(props) {
			return props.dataSource? 
					props.dataSource.getData({from: 'ds1'}):
					{};
		}
	},
	mixins: [AsyncReactRouter.AsyncInitialStateHandlerMixin],
	render() {
		return (
			<div>
				<h4>Page One Header</h4>
				<article>
					{this.state.article? this.state.article: 'NO DATA'}
				</article>
			</div>
		);
	}
});

var PageTwo = React.createClass({
	statics: {
		// INITIAL DATA, use local asynchronous data
		getAsyncInitialState(props) {
			return props.dataSource? 
					props.dataSource.getDataAsync({from: 'ds2'}):
					Promise.resolve({});
		}
	},
	mixins: [AsyncReactRouter.AsyncInitialStateHandlerMixin],
	render() {
		return (
			<div>
				<h4>Page Two Header</h4>
				<article>
					{this.state.article? this.state.article: 'NO DATA'}
				</article>
			</div>
		);
	}
});

var PageThree = React.createClass({
	statics: {
		// INITIAL DATA, use data from the server(asynchronously)
		getAsyncInitialState(props) {
			return props.lookup?
					props.lookup({from: 'ds3'}): 
					Promise.reject(new Error('No lookup function to use'));
		}
	},
	contextTypes: {
		// CONTEXT, test getting context
		async: React.PropTypes.shape({
			url: React.PropTypes.string.isRequired
		}).isRequired
	},
	mixins: [AsyncReactRouter.AsyncInitialStateHandlerMixin],
	render() {
		return (
			<div>
				<h4>Page Three Header <small>{this.context.async.url}</small></h4>
				<article>
					<textarea 
						value={this.state.article? this.state.article: 'NO DATA'}
						ref="articleText"
						onChange={this.updateLocal}
					/>																		{/**/}
					<button onClick={this.updateServer}>Save</button>
				</article>
			</div>
		);
	},
	getArticleTextValue() {
		var node = React.findDOMNode(this.refs.articleText);
		return node.value;
	},
	updateLocal() {
		this.setState({article: this.getArticleTextValue()});
	},
	updateServer() {
		var payload = {
			actionType: 'a3',
			data: {article: this.getArticleTextValue()}
		};
		this.props.dispatch(payload)
			.then(() => this.props.lookup({from: 'ds3'}))
			.then((newState) => this.setState(newState));
	}
});

// Make Route
function makeRoute(settings) { 
	// Load file
	var mimeTypes = new Map();
	mimeTypes.set('js', 'application/javascript');
	mimeTypes.set('png', 'image/png'); //ERROR, this is not bing applied correctly
	mimeTypes.set('ico', 'image/x-icon');

	var LoadApp = AsyncReactRouter.createFileRequestClass({
		path: './staticFiles/app.js',
		mimeType: mimeTypes.get('js')
	});
	var LoadFavicon = AsyncReactRouter.createFileRequestClass({
		path: './staticFiles/favicon.ico',
		mimeType: mimeTypes.get('ico')
	});
	var LoadFiles = AsyncReactRouter.createDirectoryRequestClass({
		path: './staticFiles',
		mimeTypes: mimeTypes
	});
	var Lookup = AsyncReactRouter.createRequestHandlerClass(settings.lookupHandler);
	var Action = AsyncReactRouter.createRequestHandlerClass(settings.actionHandler);
	
	return (
		<Route path="/" handler={Page}>
			<DefaultRoute name="p1" handler={PageOne} />
			<Route name="p2" handler={PageTwo} />
			<Route name="p3" handler={PageThree} />

			<Route name="lookup" handler={Lookup} />
			<Route name="action" handler={Action} />

			<Route name="staticFiles" handler={LoadFiles} />
			<Route name="app.js" handler={LoadApp} />
			<Route name="favicon.ico" handler={LoadFavicon} />
		</Route>
	);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports.makeRoute = makeRoute;