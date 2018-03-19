var requestModel = require('../api/models/requestModel');
var environmentModel = require('../api/models/environmentModel');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('./init.js');
var testEnvironmentId = ""; // hold id of environment to reference in requests
var testRequestId = ""; // hold id of request to reference for signing
chai.use(chaiHttp);

describe('Sign', () => {
	// before testing, add an environment and a request to reference in our signing request
	before((done) => {
		let environment = new environmentModel({
				name: "test env",
				user_cert: "test_users_ca",
				host_cert: "test_server_ca"
		});
		chai.request(server)
			.post('/environment')
			.send(environment)
			.end((err, res) => {
				testEnvironmentId = environment.id.toString();
				done();
			});
	});

	before((done) => {
		let request = new requestModel({
			environment_id: testEnvironmentId,
			user_id: "2",
			status: "pending"
		});
		chai.request(server)
			.post('/request')
			.send(request)
			.end((err, res) => {
				testRequestId = request.id.toString();
			  done()
			});
	});

	describe('/GET sign', () => {
		it('it should GET certificate signing request webpage', (done) => {
			chai.request(server)
				.get('/sign')
				.end((err, res) => {
					//console.log("Environment id is " + testEnvironmentId + " and request id is " + testRequestId);
					res.should.have.status(200);
					res.should.be.html;
				  done();
				});
		});
	});

	describe('/POST sign', () => {
		it('it should not POST a certificate for a request whose request_id does not exist', (done) => {
			let signingRequest = {
				publickey: 'some_dumb_key',
				user_id: "2",
				request_id: 'dummyrequestid'
			}
			chai.request(server)
				.post('/sign')
				.send(signingRequest)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('data').eql(null);
					res.body.should.have.property('message');
					res.body.message.should.not.eql(null);
				  done();
				});
		});
		it('it should not POST a certificate for a request that has not been signed', (done) => {
			let signingRequest = {
				publickey: 'some_dumb_key',
				user_id: "2",
				request_id: testRequestId
			}
			chai.request(server)
				.post('/sign')
				.send(signingRequest)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('data').eql(null);
					res.body.should.have.property('message');
					res.body.message.should.not.eql(null);
				  done();
				});
		});
		it('it should POST a certificate for a valid request', (done) => {
			let signingRequest = {
				publickey: 'some_dumb_key',
				user_id: "2",
				request_id: testRequestId
			}
			chai.request(server)
				.put('/request/' + testRequestId) //sign the test request created in before()
				.send({environment_id: testEnvironmentId, user_id: "2", status: "signed"})
				.end((err, res) => {
					// Now that request is signed, we can POST signing request
					chai.request(server)
						.post('/sign')
						.send(signingRequest)
						.end((err, res) => {
							res.should.have.status(200);
							res.body.should.be.a('object');
							res.body.should.have.property('status').eql(200);
							res.body.should.have.property('data');
							res.body.data.should.be.a('array');
							res.body.should.have.nested.property('data[0].signedkey');
						  done();
						});
				});
		});
		it('it should not POST a certificate for a request that has been compleated', (done) => {
			let signingRequest = {
				publickey: 'some_dumb_key',
				user_id: "2",
				request_id: testRequestId
			}
			chai.request(server)
				.post('/sign')
				.send(signingRequest)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('data').eql(null);
					res.body.should.have.property('message');
					res.body.message.should.not.eql(null);
				  done();
				});
		});

	});
	// Empty the environment and request DB after tests
	after((done) => {
		requestModel.remove({}, (err) => {
				environmentModel.remove({}, (err) => {
					done();
				});
		});
	});
});
