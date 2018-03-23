'use strict';
 
var mongoose = require('mongoose'),
	Request = mongoose.model('Requests');

exports.listRequests = (req, res) => {
	Request.find({}, (err, request) => {
		if (err) {
			res.send(err);
		}
		res.json(request);
	});

};

exports.createRequest = (req, res) => {
	var newRequest = new Request(req.body);
	newRequest.save((err, request) => {
		if (err) {
			res.status(400).json({ status: 400, data: null, message: "Environment_id submitted is invalid or does not exist" });
		} else {
			res.json({message: "Request added", request});
		}
	});
};

exports.readRequest = (req, res) => {
	Request.findById(req.params.requestId, (err, request) => {
		if (err) {
			res.send(err);
		} else {
			res.json(request);
		}
	});
};

exports.verifyRequest = (requestId) => {
	return new Promise((resolve, reject) => {
		Request.findById(requestId).exec()
		.then(request => {
			if(request == null){
				reject(new Error("Request_id referenced in request could not be found"));
			} else if(request.status == "pending") {
				reject(new Error("Request has not yet been signed by certificate signing authority."));
			} else if(request.status == "compleated") {
				reject(new Error("Request has already been compleated.  Please submit a new request."));
			} else {
				resolve(request);
			}
		});
	});
};

exports.completeRequest = (requestId) => {
	return new Promise((resolve, reject) => {
		Request.findOneAndUpdate({_id: requestId}, {$set: {status: 'compleated'}}).exec()
			.then(request => {
				if(request == null) {
					reject(new Error("Request could not be marked as complete"));
				} else {
					resolve(request);
				}
			});
	});
};

exports.updateRequest = (req, res) => {
	Request.findOneAndUpdate({_id: req.params.requestId}, req.body, {new: true}, (err, request) => {
		if (err) {
			res.send(err);
		} else {
			res.json({message: "Request updated", request});
		}
	});
};

exports.deleteRequest = (req, res) => {
	Request.remove({_id: req.params.requestId}, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.json({message: "Request deleted", result});
		}
	});
};
