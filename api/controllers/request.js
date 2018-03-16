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
			console.log("env id not foun!d");
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

exports.readRequestById = (requestId) => {
	var query = Request.findById(requestId);
	return query;
};

exports.completeRequest = (requestId) => {
	var query = Request.findOneAndUpdate({_id: requestId}, {$set: {status: 'compleated'}});
	return query;
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
