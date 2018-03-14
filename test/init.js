process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var server = require('../server');


// Make sure mongo is connected before begining tests
before((done) => {
	process.env.NODE_ENV = 'test';
	server.on('db_connected', () => {
		done();
	});
});

after((done) => {
	mongoose.connection.close(done);
});

module.exports = server;
