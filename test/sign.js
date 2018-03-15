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
				user_cert: "user.ca",
				host_cert: "host.ca"
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
					console.log("Environment id is " + testEnvironmentId + " and request id is " + testRequestId);
					res.should.have.status(200);
					res.should.be.html;
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
