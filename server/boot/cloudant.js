module.exports = function attachModel(app) {
	var //modules
		cfenv = require("cfenv"),
		loopback = require('loopback'),

		// variables
		appEnv = cfenv.getAppEnv(),
		cloudant = appEnv.getServiceCreds(/.+cloudantNoSQLDB$/)
	;

	if (!cloudant) {
		throw new Error("Failed to retrieve information from service with name=cloudant");
	}

	//DataSource Configuration
	var datasource = loopback.createDataSource({
		connector: 'couch',
		database: 'todo',
		host: cloudant.host,
		port: cloudant.port,
		protocol: "https",
		auth: {
			admin: cloudant,
			reader: cloudant,
			writer: cloudant
		}
	});
	datasource.attach(app.models.Item);
};
