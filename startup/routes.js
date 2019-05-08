//* modul pre routy, ktore sa do index.js importnu

const genres = require('../routes/genres');
const users = require('../routes/users');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const auth = require('../routes/auth');
const returns = require('../routes/returns');

const express = require('express');

const error = require('../middleware/error');

module.exports = function(app) {
	// pouzit app argument
	app.use(express.json());
	app.use('/api/genres', genres);
	app.use('/api/customers', customers);
	app.use('/api/movies', movies);
	app.use('/api/rentals', rentals);
	app.use('/api/users', users);
	app.use('/api/auth', auth);
	app.use('/api/returns', returns);
	// error.js -> index.js -> jednotlive routy
	app.use(error);
};
