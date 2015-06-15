/*------------------------------------------------------------------------------------------------*/
//	--- Simple Dispatcher ---
/*------------------------------------------------------------------------------------------------*/
function Dispatcher(dataSource) {
	this._dataSource = dataSource;
}

Dispatcher.prototype.dispatch = function(payload) {
	switch(payload.actionType) {
		case 'a3':
			if(!payload.data) return Promise.reject(new Error('No Data to store'));
			this._dataSource.set('ds3', payload.data);
			break;
		default:
			var actionType = payload.actionType? payload.actionType: '[NONE]';
			return Promise.reject(new Error('Invalid action type: ' + actionType));
	}

	return Promise.resolve(payload); // On Success
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = Dispatcher;