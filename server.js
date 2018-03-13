var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	mongoDB = 'mongodb://localhost:27017/scureshelldb',
	Environment = require('./api/models/environmentModel'),
	Request = require('./api/models/requestModel'),
	routes = require('./api/routes');
	bodyParser = require('body-parser');

// Init mongoose instance
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB).then(
	() => { console.log('Mongoose is connected to ' + mongoDB)  },
	err => {console.log('Mongoose was not able to connect to ' + mongoDB + err)}
);


var db = mongoose.connection;
//Connection events
db.on('error', (err) => {
	console.error('MongoDB connection error: ' + err);
	process.exit(1);
});

db.on('disconnected', () => {
	console.error('MongoDB default connection disconnected');
	process.exit(1);
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

// register routes
app.use('/', routes);
app.listen(port);

console.log('scureshell server started, API listening on: ' + port);
