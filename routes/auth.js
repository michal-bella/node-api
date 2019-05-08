const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
// lodash
const _ = require('lodash');
// pre hashovanie password npm i bcrypt
const bcrypt = require('bcrypt');

// autentifikacia userov musi byt post lebo posielame request na usera
// vyhodnotime ci je alebo neni autentifikovany / autorizovany
router.post('/', async (req, res) => {
	//* ak email, neme alebo password neni validne hodi 400vku
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//* validacia ci rovnaky pouzivatel neni uz registrovany
	let user = await User.findOne({ email: req.body.email }); // findOne najde podla jedneho z properties
	if (!user) return res.status(400).send('Invalid email or password'); // ak neexistuje user

	//* validacia zakryptovaneho hesla v users.js
	// porovna hesla (normalne a hashove kryptovane)
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	// ak heslo neni validne vrati 400vku
	if (!validPassword) return res.status(400).send('Invalid email or password');
	
	//* generovanie tokenu pomocou metody generateAuthToken v modely user
	const token = user.generateAuthToken();
	// Ak je validacia dobra vrati token
	res.send(token);
});

function validate(req) {
	const schema = {
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required()
	};

	return Joi.validate(req, schema);
}

module.exports = router;
