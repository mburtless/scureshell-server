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
				user_cert: "user.ca",
				host_cert: "host.ca"
			}

			chai.request(server)
				.post('/environment')
				.send(environment)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('errors');
					res.body.errors.should.have.property('name');
					res.body.errors.name.should.have.property('kind').eql('required');
				  done()
				});
		});
		it('it should POST an environment', (done) => {
			let environment = {
				name: "test env",
				user_cert: "user.ca",
				host_cert: "host.ca"
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
		it('it should GET an environment by the given id', (done) => {
			let environment = new environmentModel({ name: "test env", user_cert: "user.ca", host_cert: "host.ca" })
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
		it('it should UPDATE a book given the id', (done) => {
			let environment = new environmentModel({name: "foo env", user_cert: "user.ca", host_cert: "host.ca"});
			environment.save((err, environment) => {
				chai.request(server)
					.put('/environment/' + environment.id)
					.send({name: "bar env", user_cert: "user.ca", host_cert: "host.ca"})
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
		it('it should DELETE a book given the id', (done) => {
			let environment = new environmentModel({name: "test env", user_cert: "user.ca", host_cert: "host.ca"});
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