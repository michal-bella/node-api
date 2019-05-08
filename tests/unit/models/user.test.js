//* testovanie model/user.js web tokenu

// object destructuring syntax - lebo modul exportuje objekt s viacerymi properties
// exports.User = User;
// exports.validate = validateuser;
const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
	it('mal by vratit platny JWT ', () => {
        // pomocona premenna aby bol vsade rovnaky payload a nie vzdy ine vygenerovane ID
		const payload = {
			_id: new mongoose.Types.ObjectId().toHexString(), // objekt na string
			isAdmin: true
		};
		const user = new User(payload);
        const token = user.generateAuthToken();
        // ak je privateKey ulozeny v environment premmenych treba pouzit config.get()
		const decoded = jwt.verify(token, 'jwtPrivateKey'); // tu je uz string po dekodovani 
		expect(decoded).toMatchObject(payload);
	});
});
