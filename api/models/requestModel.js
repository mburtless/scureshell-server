'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Environments = mongoose.model('Environments');
var RequestSchema = new Schema({
	/*_id: {
		type: Schema.Types.ObjectID
	},*/
	environment_id: {
		type: Schema.Types.ObjectId,
		ref: 'Environments',
		required: 'Please enter environment ID user is requesting access to'
	},
	user_id: {
		type: String,
		required: 'Please enter ID of user creating request'
	},
	status: {
		type: [{
			type: String,
			enum: ['pending', 'ongoing', 'compleated']
		}],
		default: ['pending']
	}
});

module.exports = mongoose.model('Requests', RequestSchema);
