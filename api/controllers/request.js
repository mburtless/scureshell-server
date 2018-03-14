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
	res.status(200).json({ message: 'Request recieved'  });
};

exports.readRequest = (req, res) => {
	res.status(200).json({ message: 'Reading request'  });
};

exports.updateRequest = (req, res) => {
	res.status(200).json({ message: 'Updating request'  });
};

exports.deleteRequest = (req, res) => {
	res.status(200).json({ message: 'Deleting request'  });
};
