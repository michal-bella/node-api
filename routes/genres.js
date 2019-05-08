const { Genre, validate } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
// const asyncMiddleware = require('../middleware/async');

// asyncmiddleware je funkcia ktora ma try catch template a nemusime ho potom stale opkoavat
router.get('/', async (req, res) => {
	//throw new Error('nemohlo getnut zanre');
	const genres = await Genre.find().sort('name');
	res.send(genres);
});

// auth vlastna middleware funkcia pre autentifikaciu
// bude len v niektorycg routeroch preto sa nedava do index.js
// je odpalena este pred req,res middleware funkciou
router.post(
	'/',
	auth,
	/* FIXME: orpavit auth - auth, */ async (req, res) => {
		const { error } = validate(req.body);

		if (error) return res.status(400).send(error.details[0].message);

		let genre = new Genre({ name: req.body.name });
		genre = await genre.save();

		res.send(genre);
	}
);

router.put('/:id', async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findByIdAndUpdate(
		req.params.id,
		{ name: req.body.name },
		{
			new: true
		}
	);

	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

// dve funkcie na kontrolu - ci poslal dobry token a ci je admin
router.delete('/:id', [ auth, admin ], async (req, res) => {
	const genre = await Genre.findByIdAndRemove(req.params.id);

	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
	const genre = await Genre.findById(req.params.id);

	if (!genre) return res.status(404).send('The genre with the given ID was not found.');

	res.send(genre);
});

module.exports = router;
