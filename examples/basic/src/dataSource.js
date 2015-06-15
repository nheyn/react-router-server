/*------------------------------------------------------------------------------------------------*/
//	--- Simple Data Source ---
/*------------------------------------------------------------------------------------------------*/
function DataSource() {
	this._onUpdate = null;
	this._dataStores = {
		'ds1': {article: 'Page one content (from Data Source)'},
		'ds2': {article: 'Page two content (from Data Source)'},
		'ds3': {article: 'Page three content (from Data Source)'}
	};
}

DataSource.prototype.getData = function(query) {
	return query.from && this._dataStores[query.from]?
			this._dataStores[query.from]:
			null;
};

DataSource.prototype.getDataAsync = function(query) {
	var data = this.getData(query);
	return data? Promise.resolve(data): Promise.reject(new Error('Invalid Query'));
};

DataSource.prototype.set = function(dsName, data) {
	this._dataStores[dsName] = data;
};

DataSource.prototype.on = function(event, callback) {
	if(event !== 'update') return;
	this._onUpdate = callback;
};

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = DataSource;