// pre hashovanie password npm i bcrypt

const bcrypt = require('bcrypt');

async function run() {
	// salt = random string ktory sa prida pred/za password a zahashuje ho
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash('asdasd', salt);
	console.log(salt);
	console.log(hash);
}

run();
