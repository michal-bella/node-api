//* Autorizacia pouzivatela ci je alebo neni admin

module.exports = function(req, res, next) {
	// kontrola ci je alebo neni admin = true
    if (!req.user.isAdmin) return res.status(403).send('Acces Denied only admins'); // Forbidden
    next();
};
