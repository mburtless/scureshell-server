var environmentModel = require('../api/models/environmentModel');

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('./init.js')
chai.use(chaiHttp);

describe('Environments', () => {
	// Empty the DB before each test
	beforeEach((done) => {
		environmentModel.remove({}, (err) => {
				done();
		});
	});

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

	describe('/POST environment', () => {
		it('it should not POST an environment without name field', (done) => {
			let environment = {
				user_cert: "test_users_ca",
				host_cert: "test_server_ca"
			}

			chai.request(server)
				.post('/environment')
				.send(environment)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('data').eql(null);
					res.body.should.have.property('message');
					res.body.message.should.not.eql(null);
				  done()
				});
		});
		it('it should not POST an environment if user or host cert does not exist', (done) => {
			let environment = {
				name: "fake env",
				user_cert: "fakeuser.ca",
				host_cert: "fakehost.ca"
			}

			chai.request(server)
				.post('/environment')
				.send(environment)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql(400);
					res.body.should.have.property('data').eql(null);
					res.body.should.have.property('message');
					res.body.message.should.not.eql(null);
				  done()
				});
		});
		it('it should POST an environment', (done) => {
			let environment = {
				name: "test env",
				user_cert: "test_users_ca",
				host_cert: "test_server_ca"
			}

			chai.request(server)
				.post('/environment')
				.send(environment)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('message').eql('Environment added');
					res.body.environment.should.have.property('name');
					res.body.environment.should.have.property('user_cert');
					res.body.environment.should.have.property('host_cert');
				  done()
				});
		});
	});
	
	describe('/GET/:id environment', () => {
		it('it should not GET an environment with an invalid id', (done) => {
			let environment = new environmentModel({ name: "fake env", user_cert: "fake_ca", host_cert: "fake_ca" })
			environment.save((err, environment) => {
				chai.request(server)
					.get('/environment/' + "fakeid")
					.send(environment)
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
		it('it should GET an environment by the given id', (done) => {
			let environment = new environmentModel({ name: "test env", user_cert: "test_users_ca", host_cert: "test_server_ca" })
			environment.save((err, environment) => {
				chai.request(server)
					.get('/environment/' + environment.id)
					.send(environment)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name');
						res.body.should.have.property('user_cert');
						res.body.should.have.property('host_cert');
						res.body.should.have.property('_id').eql(environment.id);
					  done();
					});
			});
		});
	});

	describe('/PUT/:id environment', () => {
		it('it should UPDATE an environment given the id', (done) => {
			let environment = new environmentModel({name: "foo env", user_cert: "test_users_ca", host_cert: "test_server_ca"});
			environment.save((err, environment) => {
				chai.request(server)
					.put('/environment/' + environment.id)
					.send({name: "bar env", user_cert: "test_users_ca", host_cert: "test_server_ca"})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Environment updated');
						res.body.environment.should.have.property('name').eql('bar env');
						res.body.environment.should.have.property('_id').eql(environment.id);
					  done();
					});
			});
		});
	});
	
	describe('/DELETE/:id environment', () => {
		it('it should DELETE an environment given the id', (done) => {
			let environment = new environmentModel({name: "test env", user_cert: "test_users_ca", host_cert: "test_server_ca"});
			environment.save((err, environment) => {
				chai.request(server)
					.delete('/environment/' + environment.id)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('message').eql('Environment deleted');
						res.body.result.should.have.property('ok').eql(1);
						res.body.result.should.have.property('n').eql(1);
					  done();
					});
			});
		});
	});
});
