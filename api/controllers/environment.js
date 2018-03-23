'use strict';

var mongoose = require('mongoose'),
	Environment = mongoose.model('Environments');

exports.listEnvironments = (req, res) => {
	Environment.find({}, (err, environment) => {
		if (err) {
			//res.send(err);
			res.status(500).json({ status: 500, data: null, message: "Could not get all environments due to internal server error" });
		}
		res.json(environment);
	});
};

exports.createEnvironment = (req, res) => {
	var newEnvironment = new Environment(req.body);
	//console.log(newEnvironment);
	newEnvironment.save((err, environment) => {
		if (err) {
			//res.send(err);
			res.status(400).json({ status: 400, data: null, message: err.message })
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

/*exports.readEnvironmentById = (environmentId) => {
	var query = Environment.findById(environmentId);
	return query;
};*/

/*exports.readEnvironmentById = (environmentId) => {
	return Environment.findById(environmentId)
		.exec();
}*/
exports.readEnvironmentById = (environmentId) => {
	return new Promise((resolve, reject) => {
		Environment.findById(environmentId).exec()
		.then(environment => {
			if(environment == null){
				reject(new Error("Environment referenced in request could not be found"));
			} else {
				resolve(environment);
			}
		});
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
