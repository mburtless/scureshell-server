var requestModel = require('../api/models/requestModel');
var environmentModel = require('../api/models/environmentModel');
var mongoose = require('mongoose');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('./init.js');
var testEnvironmentId = ""; // hold id of environment to reference in requests
var testRequestId = ""; // hold id of request to reference for signing
//var testPublicKey = ""; // hold public key of test user
var testPublicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCuy1lbuEeb3ELW5/8jrFOXbVxv96dydz/um/bxaA4vlhEWdgl0vIHTbtFU7GkTzhF9+N3XgXEV4pTd4wiYZo37omRcH0yE6moYxqMT0PtX1vZQNhzo4TvLdmia7VEmJ1cqJgQjtGv5vGoSfTW81nHQfqZDNXs8X883HputICUga0td7JWlY5Jjx1rNG5iTx1r6LAtpboVoEC/IVODUCtO3+PrjbW14t5Zp9E2MopHehXo5gqczD4pO1/LU3Lg7IOWB+LVrX1+U1e8kYw0VUcUK4+jMSwkC785SQneGf3R+dx6tAUfVWX486OLium6jyBAz3hEusJ4bWZfpxuP64ASz test_user_key";
var fs = require('fs');
var config = require('config');
chai.use(chaiHttp);

let environment = new environmentModel({
	name: "test env",
	user_cert: "test_users_ca",
	host_cert: "test_server_ca"
});

let request = new requestModel({
	environment_id: environment._id,
	user_id: "testuser",
	status: "pending"
});


describe('Sign', () => {
	// before testing, add an environment and a request to reference in our signing request
	before((done) => {
		/*let environment = new environmentModel({
				name: "test env",
				user_cert: "test_users_ca",
				host_cert: "test_server_ca"
		});*/
		chai.request(server)
			.post('/environment')
			.send(environment)
			.end((err, res) => {
				testEnvironmentId = environment.id.toString();
				done();
			});
	});

	before((done) => {
		/*let request = new requestModel({
			environment_id: testEnvironmentId,
			user_id: "testuser",
			status: "pending"
		});*/
		chai.request(server)
			.post('/request')
			.send(request)
			.end((err, res) => {
				testRequestId = request.id.toString();
			  done()
			});
	});

	/*before((done) => {
		//testPublicKey = fs.readFileSync(__basedir + "/" + config.CertDirectory + "/" + "test_user_key.pub");
		testPublicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCuy1lbuEeb3ELW5/8jrFOXbVxv96dydz/um/bxaA4vlhEWdgl0vIHTbtFU7GkTzhF9+N3XgXEV4pTd4wiYZo37omRcH0yE6moYxqMT0PtX1vZQNhzo4TvLdmia7VEmJ1cqJgQjtGv5vGoSfTW81nHQfqZDNXs8X883HputICUga0td7JWlY5Jjx1rNG5iTx1r6LAtpboVoEC/IVODUCtO3+PrjbW14t5Zp9E2MopHehXo5gqczD4pO1/LU3Lg7IOWB+LVrX1+U1e8kYw0VUcUK4+jMSwkC785SQneGf3R+dx6tAUfVWX486OLium6jyBAz3hEusJ4bWZfpxuP64ASz test_user_key";
		console.log("Test public key is : " + testPublicKey);
		done();
	})*/

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
			let dummyRequest = new requestModel({
				environment_id: environment._id,
				user_id: "testuser",
				status: "pending"
			});

			let signingRequest = {
				public_key: testPublicKey,
				user_id: "testuser",
				request_id: dummyRequest._id
			}
			chai.request(server)
				.post('/sign')
				.set("Content-Type", "application/json")
				.send(JSON.stringify(signingRequest))
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
				request_id: request._id,
				public_key: testPublicKey,
				user_id: "testuser"
			};
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

		describe('/POST VALID sign', () => {
			before((done) => {
				// Before we can test valid requests, CA needs the request status to be signed
				chai.request(server)
					.put('/request/' + testRequestId) //sign the test request created in before()
					.send({environment_id: testEnvironmentId, user_id: "2", status: "signed"})
					.end((err, res) => {
						done();
					});
			});
			it('it should POST a certificate for a valid request', (done) => {
				let signingRequest = {
					request_id: request._id,
					public_key: testPublicKey,
					user_id: "testuser"
				};
				//console.log('Request is ', signingRequest)
				chai.request(server)
					.post('/sign')
					.set("Content-Type", "application/json")
					.send(JSON.stringify(signingRequest))
					.then((res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('status').eql(200);
						res.body.should.have.property('data');
						res.body.data.should.be.a('array');
						res.body.should.have.nested.property('data[0].signedkey');
					  	done();
					})
					.catch((err) => {
						console.log(err)
						done(err)
					});
			});
			it('it should delete public key from filesystem after public key has been signed', (done) => {
				pubKeyFilename = __basedir + "/" + config.CertDirectory + "/" + testRequestId + ".pub";
				fs.stat(pubKeyFilename, (err, stats) => {
					if(err){
						if(err.code == 'ENOENT') done();
						else done(err);
					} else if(stats.isFile()){
						done(new Error('File still exists'));
					}
				});
				
			});

			it('it should not POST a certificate for a request that has been compleated', (done) => {
				let signingRequest = {
					request_id: request._id,
					public_key: testPublicKey,
					user_id: "testuser"
				};
				chai.request(server)
					.post('/sign')
					.set("Content-Type", "application/json")
					.send(JSON.stringify(signingRequest))
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
	});
	// Empty the environment and request DB after tests
	after((done) => {
		requestModel.remove({}, (err) => {
				environmentModel.remove({}, (err) => {
					//fs.unlink(__basedir + "/" + config.CertDirectory + "/" + testRequestId + ".pub");
					done();
				});
		});
	});
});
