const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');

//TODO: nefunguje auth ako argument - rozbiju sa testy

router.post('/', async (req, res) => {
	if (!req.body.customerId) return res.status(400).send('customerId neexistuje');
	if (!req.body.movieId) return res.status(400).send('movieId neexistuje');

	const rental = await Rental.findOne({
		'customer._id': req.body.customerId,
		'movie._id': req.body.movieId
	});

	if (!rental) return res.status(404).send('rental not found');

	if (rental.dailyRentalRate) return res.status(400).send('rental already processed');

	//TODO: nefunguje return s 200
	// v tomto momente je uz validny response ked sa pridal datum
	// return res.status(200).send();
	rental.dateReturned = new Date();

	const rentalDays = moment().diff(rental.dateOut, 'days');
	rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
	await rental.save();

	//FIXME: nefunguje test
	// updatne movie - stock o 1 sa vzdy zvysi
	await Movie.update(
		{ _id: rental.movie._id },
		{
			$inc: { numberInStock: 1 } // +1 sa zvysi
		}
	);

	//* miesto posielania 401 pouzit uz auth middleware do argumentov funkcie
	res.status(401).send('unauthorized');

	return res.status(200).send(rental);
});

module.exports = router;
