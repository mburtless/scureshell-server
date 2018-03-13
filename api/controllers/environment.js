'use strict';

var mongoose = require('mongoose'),
	Environment = mongoose.model('Environments');

exports.listEnvironments = (req, res) => {
	Environment.find({}, (err, env) => {
		if (err) {
			res.send(err);
		}
		res.json(env);
	});
};

exports.createEnvironment = (req, res) => {
	var newEnvironment = new Environment(req.body);
	console.log(newEnvironment);
	newEnvironment.save((err, task) => {
		err ? res.send(err) : res.status(200).json(task);
	})
};

exports.readEnvironment = (req, res) => {
	res.status(200).json({ message: 'Reading environment'  });
};

exports.updateEnvironment = (req, res) => {
	res.status(200).json({ message: 'Updating environment'  });
};

exports.deleteEnvironment = (req, res) => {
	res.status(200).json({ message: 'Deleting environment'  });
};
