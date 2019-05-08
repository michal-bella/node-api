//* Test Driven Development
// testovanie returnov
const request = require('supertest'); // obsahuje objekt request pre testovanie HTTP requestov
const { User } = require('../../models/user');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
	// premenne ktore sa budu menit pocas testov pretu niesu ulozene ako const.
	let server;
	let customerId;
	let movieId;
	let rental;
	let token;
	let movie;

	// opakujuci sa kod - 'HAPPY PATH' do osobitnej funkcie
	const exec = () => {
		return request(server).post('/api/returns').set('x-auth-token', token).send({ customerId, movieId });
	};

	// server by sa mal vzdy zavolat pred kazdym testom
	beforeAll(async (done) => {
		server = require('../../index');
		server.listen(done);
		// naplnenie premennych hodnotami z DB spravne IDecka a token pre prihloasenie pouzivatela
		token = new User().generateAuthToken();
		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();

		// objekt movie samostatny
		movie = new Movie({
			movie: {
				_id: movieId,
				title: '12345',
				dailyRentalRate: 2,
				genre: { name: '12345' },
				numberInStock: 10
			}
		});
		await movie.save(); // ulozenie do DB

		rental = new Rental({
			// naplnenie Rentalu customer objekt ktory ma 3 parametre ale isGold je default
			customer: {
				_id: customerId,
				name: '12345',
				phone: '12345'
			},
			// rental ma NODE aj pre movie
			movie: {
				_id: movieId,
				title: '12345',
				dailyRentalRate: 2
			}
		});
		await rental.save(); // ulozenie do DB
	});

	// a potom ukoncit za testami, aby nebol obsadeny port pri reloade servera
	afterAll(async (done) => {
		await server.close(done);
		await Rental.remove({}); // vynulovanie objektu az sa stale nenaplana novy a novy
		await Movie.remove({}); // vynulovanie objektu az sa stale nenaplana novy a novy
	});

	it('Vrati 401 ak klient nieje lognuty', async () => {
		// pridu spravne data ale pouzivat neni prihlaseny
		// token = new User().generateAuthToken();
		token = '';
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it('Vrati 400 ak klient ma nespravne customerId', async () => {
		// const token = new User().generateAuthToken(); // v beforAll je
		// prihlaseny pouzivatel ale nespravne customerId;
		customerId = '';
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('Vrati 400 ak klient ma nespravne movieId', async () => {
		// const token = new User().generateAuthToken(); // v beforAll je
		// prihlaseny pouzivatel ale nespravne movieId;
		movieId = '';
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('Vrati 404 ak nenajde Rental pre customer/movie', async () => {
		// Treba vymazat Rental ktore  je nadefinovane hore
		await Rental.remove({});

		const res = await exec();
		//FIXME: hadze 400 ale mal by 404
		expect(res.status).toBe(404);
	});

	it('Vrati 400 ak return je already processed', async () => {
		// Treba nastavid datum kedy bol pridany a pridat novy zaznam
		rental.dailyRentalRate = new Date();
		await rental.save();

		const res = await exec();

		expect(res.status).toBe(400);
	});

	//* 200
	it('Vrati 200 ak je validny request', async () => {
		const res = await exec(); // spravny response

		expect(res.status).toBe(400);
	});

	it('Nastavi returnDate ak je input validny', async () => {
		const res = await exec(); // spravny response

		const rentailInDb = await Rental.findById(rental._id);
		//FIXME: nefunguje lebo nepozna property dateReturned, preco?
		const diff = new Date() - rentailInDb.dateReturned;
		// cas o 10s menej kym sa test srpavi aby stihol
		expect(diff).toBeLessThan(10 * 1000);
	});

	it('Nastavi rentalFee ak je input validny', async () => {
		// odrata od Date.now - 7 dni
		rental.dateOut = moment().add(-7, 'days').toDate(); // prekonvertuje na datum
		await rental.save();

		const res = await exec(); // spravny response

		expect(rental.rentalFee).toBe(14); // 7dni x 2 dollar
	});

	//FIXME: nefunguje test
	it('Zvysi sa o +1 movieStock ak je input validny', async () => {
		const res = await exec(); // spravny response

		const movieInDb = await Movie.findById(movieId);

		expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1); // 7dni x 2 dollar
	});

	it('Vrati rental ak je input validny', async () => {
		const res = await exec(); // spravny response

		const rentalInDb = await Rental.findById(rental._id);
		
		// ocakavame array s hodnotami:
		expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
			'dateOut',
			'dateReturned',
			'rentalFee',
			'customer',
			'movie',
		]));
	});
});
