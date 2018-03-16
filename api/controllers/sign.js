'use strict';

var mongoose = require('mongoose'),
	requestController = require('./request'),
	Request = mongoose.model('Requests');

exports.index = (req, res) => {
	res.status(200).send('NOT IMPLEMENTED: sign home page');
}

exports.signSigningRequest = (req, res) => {
	// TODO: Implement a model here validating incomging JSON against a schema before processing
	var requestQuery = requestController.readRequestById(req.body.request_id);
	var completeQuery = requestController.completeRequest(req.body.request_id);
	requestQuery.exec((err, request) => {
		if(err) {
			//res.send(err);
			res.status(400).json({ status: 400, data: null, message: "Request_id submitted is invalid or does not exist" });
		} else if(request.status == "pending") {
			res.status(400).json({ status: 400, data: null, message: "Request has not yet been signed by certificate signing authority." });
		} else if(request.status == "compleated") {
			res.status(400).json({ status: 400, data: null, message: "Request has already been compleated.  Please submit a new request." });
		} else {
			// TODO: call function to sign request.publickey here
			
			// change status of request to signed
			completeQuery.exec((err, result) => {
				if(err) {
					res.status(500).json({ status: 500, data: null, message: "Request could not be marked complete" });
				}
			});
			var result = [];
			result.push({signedkey: 'dummy signed key'})
			res.status(200).json({ status: 200, data: result });
		}
	});
}
