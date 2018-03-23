'use strict';

var mongoose = require('mongoose'),
	requestController = require('./request'),
	environmentController = require('./environment.js'),
	Request = mongoose.model('Requests'),
	keygen = require('ssh-keygen'),
	fileHelper = require('../../helpers/file');

exports.index = (req, res) => {
	res.status(200).send('NOT IMPLEMENTED: sign home page');
}

function signPublicUserKey(publicKey, userCa) {
	return new Promise((resolve, reject) => {
		keygen({
			comment: 'test',
			read: true,
			sign: true,
			cakey: userCa,
			publickey: publicKey,
			identity: 'test user root',
			validity: '+52w',
			destroy: true
		}, function(err, out){
			if(err) {
				console.log(err);
				reject(new Error("Public key could not be signed by CA"));
			} else {
				resolve(out.key)
			}
		})
	})
}

exports.signSigningRequest = (req, res) => {
	var userCa = "";
	var hostCa = "";
	var result = [];
	var signedKey = "";
	//console.log("Request in body is ", req.body.request_id)
	//verify request exists and has valid status
	requestController.verifyRequest(req.body.request_id)
		//verify environment referenced in request still exists
		.then((request) => { return environmentController.readEnvironmentById(request.environment_id); })
		//save public key to file
		.then((environment) => { 
			userCa = environment.user_cert_priv_path;
			hostCa = environment.host_cert_priv_path;
			//console.log("User CA is ", environment.user_cert_priv_path, " and pub key is ", req.body.public_key);
			return fileHelper.savePublicKey(req.body.public_key, req.body.request_id);
		})
		//sign this thing
		.then((certFileName) => { return signPublicUserKey(certFileName, userCa) })
		//mark the request as complete
		.then((returnedKey) => { 
			//console.log("Key signed, pushing result to stack");
			signedKey = returnedKey;
			return requestController.completeRequest(req.body.request_id);
		})
		.then(() => {
			res.status(200).json({ status: 200, data: [{"signedkey" : signedKey}] });
		})
		.catch((err) => { res.status(400).json({ status: 400, data: null, message: err.message }); });
}
