const jwt = require('jsonwebtoken');
const config = require('config');

//* MIDDLEWARE FUNKCIE
// autorizacia podla tokenu v headeri
function auth(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token) return res.status(401).send('access denied - not token provided'); // nema prava na citanie

	try {
		//FIXME: config get nefunguje premenna prostredia
		const decoded = jwt.verify(token, 'jwtPrivateKey'); // private key je len ako string zatial
		//jwt.verify(token, 'jwtPrivateKey');
		req.user = decoded; 
		next();
	} catch (error) {
		res.status(400).send('Invalid token');
	}
}

module.exports = auth;