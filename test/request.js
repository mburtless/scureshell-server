var requestModel = require('../api/models/requestModel');
var environmentModel = require('../api/models/environmentModel');
var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('./init.js');
var testEnvironmentId = ""; // hold id of environment to reference in requests
chai.use(chaiHttp);

describe('Requests', () => {
	// before testing, add an environment to reference in our requests
	before((done) => {
		let environment = new environmentModel({
				name: "test env",
				user_cert: "user.ca",
				host_cert: "host.ca"
		});
		chai.request(server)
			.post('/environment')
			.send(environment)
			.end((err, res) => {
				testEnvironmentId = environment.id.toString();
				done();
			})
	});
	// Empty the DB before each test
	beforeEach((done) => {
		requestModel.remove({}, (err) => {
				done();
		});
	});

	describe('/GET request', () => {
		it('it should GET all the requests', (done) => {
			chai.request(server)
				.get('/request')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(0);
				   done();
				});
		});
	});
	
	describe('/POST request', () => {
		it('it should not POST a request without environment_id field', (done) => {
			let request = {
				user_id: "2",
				status: "pending"
			}

			chai.request(server)
				.post('/request')
				.send(request)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('environment_id');
					res.body.errors.environment_id.should.have.property('kind').eql('required');
				  done()
				});
		});
		it('it should POST a request', (done) => {
			// DEBUG - Checking to make sure environment is still present
			/*chai.request(server)
				.get('/environment');*/
				
			let request = {
				environment_id: testEnvironmentId,
				user_id: "2",
				status: "pending"
			};
			chai.request(server)
				.post('/request')
				.send(request)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Request added');
					res.body.request.should.have.property('environment_id');
					res.body.request.should.have.property('user_id');
					res.body.request.should.have.property('status');
				  done()
				});
		});
	});
	
	describe('/GET/:id request', () => {
		it('it should GET a request by the given id', (done) => {
			let request = new requestModel ({
				environment_id: testEnvironmentId,
				user_id: "2",
				status: "pending"
			});
			request.save((err, request) => {
				chai.request(server)
					.get('/request/' + request.id)
					.send(request)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('environment_id');
						res.body.should.have.property('user_id');
						res.body.should.have.property('status');
						res.body.should.have.property('_id').eql(request.id);
					  done();
					});
			});
		});
	});

	describe('/PUT/:id request', () => {
		it('it should UPDATE a request given the id', (done) => {
			let request = new requestModel ({
				environment_id: testEnvironmentId,
				user_id: "2",
				status: "pending"
			});
			request.save((err, request) => {
				chai.request(server)
					.put('/request/' + request.id)
					.send({environment_id: testEnvironmentId, user_id: "2", status: "signed"})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Request updated');
						res.body.request.should.have.property('status').that.is.an('array').that.deep.equals(['signed']);
						res.body.request.should.have.property('_id').eql(request.id);
					  done();
					});
			});
		});
	});
	
	describe('/DELETE/:id request', () => {
		it('it should DELETE a request given the id', (done) => {
			let request = new requestModel ({
				environment_id: testEnvironmentId,
				user_id: "2",
				status: "pending"
			});
			request.save((err, request) => {
				chai.request(server)
					.delete('/request/' + request.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Request deleted');
						res.body.result.should.have.property('ok').eql(1);
						res.body.result.should.have.property('n').eql(1);
					  done();
					});
			});
		});
	});
	// Empty the environment DB after tests
	after((done) => {
		environmentModel.remove({}, (err) => {
				done();
		});
	});
});
