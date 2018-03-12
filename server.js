var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require('mongoose'),
	Environment = require('./api/models/environmentModel'),
	Request = require('./api/models/requestModel'),
	routes = require('./api/routes'); // import routes
	bodyParser = require('body-parser');

// Init mongoose instance
mongoose.Promise = global.Promise;
mongoose.connect =('mongoosedb://localhost:27017/scureshelldb');

app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());

//routes(app); // register routes
app.use('/', routes);
app.listen(port);

console.log('scureshell server started, API listening on: ' + port);
