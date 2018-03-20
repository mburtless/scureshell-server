'use strict';
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require('config'),
	fileHelper = require('../../helpers/file');

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

//Virtuals to compute full cert path
EnvironmentSchema.virtual('user_cert_priv_path').get(function() {
	return __basedir + "/" + config.CertDirectory + "/" + this.user_cert;
});
EnvironmentSchema.virtual('user_cert_pub_path').get(function() {
	return __basedir + "/" + config.CertDirectory + "/" + this.user_cert + ".pub";
});
EnvironmentSchema.virtual('host_cert_priv_path').get(function() {
	return __basedir + "/" + config.CertDirectory + "/" + this.host_cert;
});
EnvironmentSchema.virtual('host_cert_pub_path').get(function() {
	return __basedir + "/" + config.CertDirectory + "/" + this.host_cert + ".pub";
});

// Pre save middleware to verify that user_cert and host_cert exist on filesystem
EnvironmentSchema.pre('save', function (next) {
	//console.log("Verifying " + this.user_cert + " and " + this.host_cert + " exist within " + config.CertDirectory);
	var fullCertDirectory = __basedir + "/" + config.CertDirectory;
	var certs = [
		{
			path: fullCertDirectory + "/" + this.user_cert, 
			name: this.user_cert
		},
		{
			path: fullCertDirectory + "/" + this.user_cert + ".pub",
			name: this.user_cert + ".pub"
		},
		{
			path: fullCertDirectory + "/" + this.host_cert,
			name: this.host_cert
		},
		{
			path: fullCertDirectory + "/" + this.host_cert + ".pub",
			name: this.user_cert + ".pub"
		}
	];
	var itemsProcessed = 0; //Counter to make sure we only send done after all items are processed
	certs.forEach((cert) => {
		fileHelper.checkFileExists(cert.path).then((isFile) => {
			if (!isFile) {
				//console.error(cert.path + " does not exist or is not accessible")
				var errMsg = cert.name + " does not exist or is not accessible";
				return next(new Error(errMsg));
			}
			//Itterate our count of certs processed
			itemsProcessed++;
			//if we made it through all without error, send next()
			if(itemsProcessed == certs.length) {
				next();
			}
		}).catch((err) => {
			//console.error(err);
			var errMsg = cert.name + " does not exist or is not accessible";
			return next(new Error(errMsg));
		});
	});
});

module.exports = mongoose.model('Environments', EnvironmentSchema);
