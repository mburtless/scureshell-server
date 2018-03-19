var fs = require('fs');

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
