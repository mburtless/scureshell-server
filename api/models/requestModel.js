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
			enum: ['pending', 'signed', 'compleated']
		}],
		default: ['pending']
	}
});

// Pre save middleware to verify that environment_id submitted exists in environment collection
RequestSchema.pre('save', function (next) {
	console.log("Verifying env id exists: ", this.environment_id);
	Environments.findById(this.environment_id, (err, environment) => {
		if (environment) {
			return next();
		} else {
			var err = new Error('Invalid environment_id'); 
			return next(err);
		}
	});
});

module.exports = mongoose.model('Requests', RequestSchema);
