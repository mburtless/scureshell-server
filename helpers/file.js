var fs = require('fs'),
	config = require('config');

exports.checkDirExists = (dir) => {
	return new Promise((resolve, reject) => {
		fs.stat(dir, (err, stats) => {
			if(err){
				if(err.code == 'ENOENT') resolve(false);
				else reject(err);
			}
			else resolve(stats.isDirectory());
		});
	});
}

exports.checkDirExistsSync = (dir) => {
	try {
		return fs.statSync(dir).isDirectory();
	}
	catch(err) {
		if(err.code == 'ENOENT') return false;
		else throw err;
	}
}

exports.checkFileExists = (file) => {
	return new Promise((resolve, reject) => {
		fs.stat(file, (err, stats) => {
			if(err){
				if(err.code == 'ENOENT') resolve(false);
				else reject(err);
			}
			else resolve(stats.isFile());
		});
	});
}
exports.savePublicKey = (publicKey, request_id) => {
	var filename = __basedir + "/" + config.CertDirectory + "/" + request_id + ".pub"
	//console.log(publicKey);
	return new Promise((resolve, reject) => {
		fs.writeFile(filename, publicKey, (err) => {
			if(err) reject("Error saving public key");
			else resolve(filename);
		});
	});
}
