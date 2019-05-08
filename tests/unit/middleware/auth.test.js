//* auth sa testovalo aj ako integracny test ale je potrebny aj jeden unit test pre token

const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose'); // pre generovanie validneho _id

describe('auth middleware', () => {
	it('Mal by naplnit req.user s payloadom spravneho JWT', () => {
		const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
		const token = new User(user).generateAuthToken();
		// mock funkcia pre req mala by mat header podla zapisu v middleware/auth.js
		const req = {
			header: jest.fn().mockReturnValue(token)
		};
		const res = {}; // nebudeme ho naplnat ale posleme len prazdny argument
		const next = jest.fn();

		auth(req, res, next);

		expect(req.user).toMatchObject(user);
	});
});
