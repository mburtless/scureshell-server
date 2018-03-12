'use strict';

var mongoose = require('mongoose'),
	Environment = mongoose.model('Environments');

exports.listEnvironments = (req, res) => {
	res.status(200).json({ message: 'List of environments'  });
}
