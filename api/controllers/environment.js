'use strict';

var mongoose = require('mongoose'),
	Environment = mongoose.model('Environments');

exports.listEnvironments = (req, res) => {
	Environment.find({}, (err, environment) => {
		if (err) {
			res.send(err);
		}
		res.json(environment);
	});
};

exports.createEnvironment = (req, res) => {
	var newEnvironment = new Environment(req.body);
	//console.log(newEnvironment);
	newEnvironment.save((err, environment) => {
		if (err) {
			res.send(err);
		} else {
			res.json({message: "Environment added", environment});
		}
		//err ? res.send(err) : res.status(200).json({env});
	})
};

exports.readEnvironment = (req, res) => {
	Environment.findById(req.params.environmentId, (err, environment) => {
		if (err) {
			res.send(err);
		} else {
			res.json(environment);
		}
	});
};

exports.updateEnvironment = (req, res) => {
	Environment.findOneAndUpdate({_id: req.params.environmentId}, req.body, {new: true}, (err, environment) => {
		if (err) {
			res.send(err);
		} else {
			res.json({message: "Environment updated", environment});
		}
	});
};

exports.deleteEnvironment = (req, res) => {
	Environment.remove({_id: req.params.environmentId}, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.json({message: "Environment deleted", result});
		}
	});
};
