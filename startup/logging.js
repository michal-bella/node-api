//* modul pre logovanie chyb
const winston = require('winston');
// require('winston-mongodb'); //TODO: ODKOMENTOVAT
require('express-async-errors'); // zachytanie async errorov

module.exports = function() {
	process.on('uncaughtException', (ex) => {
		console.log('we got uncaught exception');
		// zachytiume uncaughtException pomcou winstonu a vypiseme
		winston.error(ex.message, ex);
		process.exit(1); // ukonci Node
	});

	process.on('unhandledRejection', (ex) => {
		console.log('we got unhandled rejection');
		// zachytiume unhandledRejection pomcou winstonu a vypiseme
		winston.error(ex.message, ex);
		process.exit(1); // ukonci Node
	});

	//* treba mat nainstalovany winston 2.4.0 a winston-mongodb 3.0.0
	// winston.configure({ transports: [ new winston.transports.File({ filename: 'logfile.log' }) ] });
	// winston.configure({ transports: [ new winston.transports.Console({ colorize: true, prettyPrint: true }) ] });
	winston.configure({
		transports: [ 
			// new winston.transports.MongoDB({ //TODO: ODKOMENTOVAT
			// 	db: 'mongodb://localhost/vidly',
			// 	level: 'info' // zobrazia sa len error, info a warning
			// }),
            //FIXME: winston.info() nefunguje
			// new winston.transports.Console({
			// 	colorize: true,
			// 	prettyPrint: true
			// }),

			// new winston.transports.File({
			// 	filename: 'logfile2.log'
			// })
		]
	});
};
