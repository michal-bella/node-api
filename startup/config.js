//* modul pre konfiguracne nastavenia

const config = require('config');

module.exports = function() {
    //FIXME: nefugnuje
    // ak eni nastaveny private key vyhodi sa chyba 
	// if (!config.get('jwtPrivateKey')) {
	//     throw new Error('FATAL ERROR - private key neni definovany');
	// }
};
