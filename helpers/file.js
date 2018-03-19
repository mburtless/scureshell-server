var fs = require('fs');

exports.checkDir = (dir) => {
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

exports.checkDirSync = (dir) => {
	try {
		return fs.statSync(dir).isDirectory();
	}
	catch(err) {
		if(err.code == 'ENOENT') return false;
		else throw err;
	}
}
