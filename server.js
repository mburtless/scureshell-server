var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	Environment = require('./api/models/environmentModel'),
	Request = require('./api/models/requestModel'),
	routes = require('./api/routes'),
	morgan = require('morgan'),
	config = require('config'),
	bodyParser = require('body-parser');

// Init mongoose instance
mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost).then(
	() => { 
		console.log('Mongoose is connected to ' + config.DBHost);
		app.emit("db_connected"); // Intercepted by testing
	},
	err => {console.log('Mongoose was not able to connect to ' + config.DBHost + err)}
);


var db = mongoose.connection;
//Connection events
db.on('error', (err) => {
	console.error('MongoDB connection error: ' + err);
	process.exit(1);
});

db.on('disconnected', () => {
	console.error('MongoDB default connection disconnected');
	process.exit(0);
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

//Don't show morgan log in test env
if(config.util.getEnv('NODE_ENV') !== 'test' && config.util.getEnv('NODE_ENV') !== 'docker-test') {
	// Use morgan to log at cli
	app.use(morgan('combined'));
}

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

// register routes
app.use('/', routes);
app.listen(port);
console.log('scureshell server started, API listening on: ' + port);

module.exports = app; // for testing
