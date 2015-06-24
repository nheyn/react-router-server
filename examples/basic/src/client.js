var { client } = require('react-router-server');
var exampleRoute = require('./route');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Client ---
/*------------------------------------------------------------------------------------------------*/
window.onload = () => {
	client.renderRoute({
		route: exampleRoute,
		element: window.getElementById('react'),
		getProps(): {
			//TODO
			return null;	
		}
		getContext(): {
			//TODO
			return null;
		}
	});
};