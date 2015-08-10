# React Router Server
*A http server for isomorphic React Router Applications*

A http server that uses [express][0], [react][1] and [react-router][2] to create isomorphic web sites/applications.

[0]: http://expressjs.com
[1]: http://facebook.github.io/react/
[2]: http://rackt.github.io/react-router/

### Features
* The structure of the site is defined in a reat-router route
* Non-html http request use express routers/callbacks
* Server-side rendering, including asynchronous initial state for react-router handlers (see https://github.com/nheyn/async-react-router)

### Usage
To use react-router-server

* Copy skeleton project from /examples/skeleton
* Update package.json
* Add web pages by updateing the react-router route in src/route.js (see http://rackt.github.io/react-router/)
* And props and context to the top level react-router handler using
  * CLIENT: update getProps and getContext functions in /src/client.js
  * SERVER: add .props and .context to req.server in the initialCallback function in /src/server.js
* Add express routers/callbacks by adding *\<RouterRoute name="URI" callback={EXPRESS_CALLBACK} />* or *<RouterRoute name="URI" router={EXPRESS_ROUTER} /\>* to the route in src/route.js (see http://expressjs.com/4x/api.html)
* Add static files by adding files/directories to /public
  * The can be found at example.com/public/FILE_PATH
  * A diffrent url can be chosen by adding *\<RouterRoute name="FILE_NAME" src={FILE_PATH} /\>* to the route in src/route.js
* Add css or javascript files to /public/template.html
* Run index.js file to start server

### Example
A basic example is in /examples/basic. Run /examples/basic/index.js to start the example server.

### Tests
TODO: Update tests for new route parser

### Documentation
Detailed documentation is included in the code.

### Plans
* Update tests for new route parser
* Get documentation from code
* Update template.html to use a templates engine (see http://expressjs.com/guide/using-template-engines.html)
* Simplify adding props and context to react-router components
