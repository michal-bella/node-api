const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const router = express.Router();
// lodash
const _ = require('lodash');
// pre hashovanie password npm i bcrypt
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
	const users = await User.find().sort('name');
	res.send(users);
});

//* endpoint pre sucastneho pouzivatela
// ale nie pomocou ID, ale pomocou web tokenu

router.get('/me', auth, async (req, res) => {
	//ziskame ID z request jsonu a najdeme podla neho Usera + bez hesla
	const currentUser = await User.findById(req.user._id).select('-password');
	res.send(currentUser);
});

// autentifikacia userov musi byt post lebo posielame request na usera
// vyhodnotime ci je alebo neni autentifikovany / autorizovany
router.post('/', async (req, res) => {
	//* ak email, neme alebo password neni validne hodi 400vku
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	//* validacia ci rovnaky pouzivatel neni uz registrovany
	let user = await User.findOne({ email: req.body.email }); // findOne najde podla jedneho z properties
	if (user) return res.status(400).send('User already registered'); // ak najde usera podla mailu
	//* ak neexistuje ulozime ho do DB
	user = new User(
		_.pick(req.body, [ 'name', 'email', 'password', 'isAdmin' ])
		// pouzijeme pick() aby sme to nemuseli pisat nasledovne:
		/*
        {
        name: req.body.name,
		email: req.body.email,
        password: req.body.password
        }
        */
	);
	//* HASHOVANIE PASSWORDU
	// salt = random string ktory sa prida pred/za password a zahashuje ho
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	//* poslanie do DB
	user = await user.save();

	//* generovanie tokenu pomocou metody generateAuthToken v modely user
	const token = user.generateAuthToken();
	res.header('x-auth-token', token).send(_.pick(user, [ '_id', 'name', 'email' ]));

	// pick vrati objekt len properties ktore definujeme
	// zamedzime aby sa odosielalo heslo do frontendu
	// v POSTMAN v body response bude len id name a email bez passwordu
	// v POSTMAN v Headers bude vygenerovany token pre id-ecko
});

module.exports = router;
