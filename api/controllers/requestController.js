'use strict';

var mongoose = require('mongoose'),
	Request = mongoose.model('Requests');

exports.listRequests = (req, res) => {
	res.status(200).json({ message: 'Connected!'  });
	/*Request.find({}, (err, request) => {
		if (err) {
			res.send(err);
		}
		res.status(200).json({ message: 'Connected!'  });
	});*/
};

exports.createRequest = (req, res) => {
	res.status(200).json({ message: 'Request recieved'  });
};

exports.readRequest = (req, res) => {
	res.status(200).json({ message: 'Updating request'  });
};
