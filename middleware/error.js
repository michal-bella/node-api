const winston = require('winston'); // logovanie chyb

// specialna funkcia pre chyby musi byt na konci!
// zavolame ako poslednu cez next a err - je parameter ktory posleme do next() v jednotlivych routoch
// aby sa len na jednom mieste modifikovala a volala na viacerych
module.exports = function(err, req, res, next) {
	winston.error(err.message, err);
	// chyba na serveri
	res.status(500).send('nieco sa pokazilo'); // internal server error
};
