'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EnvironmentSchema = new Schema({
	/*_id: {
		type: Schema.Types.ObjectID
	},*/
	name: {
		type: String,
		required: 'Please enter the name of this environment'
	},
	user_cert: {
		type: String,
		required: 'Please enter a path for the user signing certificate for this environment'
	},
	host_cert: {
		type: String,
		required: 'Please enter a path for the host signing certificate for this environment'
	}

});

module.exports = mongoose.model('Environments', EnvironmentSchema);
