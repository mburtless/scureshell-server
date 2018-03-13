process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var environmentModel = require('../api/models/environmentModel');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);
// Make sure mongo is connected before begining tests
before((done) => {
	server.on('db_connected', () => {
		done();
	});
});

describe('Environments', () => {
	// Empty the DB before each test
	beforeEach((done) => {
		environmentModel.remove({}, (err) => {
				done();
		});
	});

	// Describe the /GET route
	describe('/GET environment', () => {
		it('it should GET all the environments', (done) => {
			chai.request(server)
				.get('/environment')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
				   done();
				});
		});
	});
});
