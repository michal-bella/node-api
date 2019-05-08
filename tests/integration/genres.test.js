//* integracne testy pre genres endpoint

const request = require('supertest'); // obsahuje objekt request pre testovanie HTTP requestov
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

//* Test Suite pre api/genres Http requesty
describe('/api/genres', () => {
	// server by sa mal vzdy zavolat pred kazdym testom
	beforeAll((done) => {
		server = require('../../index');
		server.listen(done);
	});

	// a potom ukoncit za testami, aby nebol obsadeny port pri reloade servera
	afterAll(async (done) => {
		await server.close(done);
		await Genre.remove({}); // aby vzdy na konci zmazal objekty potom by ocakavalo vzdy o 2 viac pri dalsom spusteni
	});

	describe('GET /', () => {
		it('mal by vratit vsetky zanre', async () => {
			// vlozime do Genre objektu nove objekty
			await Genre.collection.insert([ { name: 'genre1' }, { name: 'genre2' } ]);
			// posleme GET request na dany endpoint
			const response = await request(server).get('/api/genres');
			// ked posleme GET request ocakavame status 200 - success
			expect(response.status).toBe(200);
			expect(response.body.length).toBe(2);

			// funkcia ktora zisti z body ci je v requeste name == 'genre1'
			expect(response.body.some((g) => g.name === 'genre1')).toBeTruthy();
			expect(response.body.some((g) => g.name === 'genre2')).toBeTruthy();
		});
	});
	describe('GET /:id', () => {
		it('mal by vratit zaner podla IDecka ak existuje', async () => {
			const genre = new Genre({ name: 'genre1' });
			await genre.save();
			const response = await request(server).get('/api/genres/' + genre._id);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('name', genre.name);
		});

		it('mal by vratit 404 ak je invalid ID poslane do endpointu', async () => {
			let invalidId = '1234';
			const response = await request(server).get('/api/genres/' + invalidId); // posleme zle IDcko

			expect(response.status).toBe(404);
		});

		it('mal by vratit 404 ak zaner s danym ID neexistuje', async () => {
			let validId = mongoose.Types.ObjectId();

			const response = await request(server).get('/api/genres/' + validId); // posleme zle IDcko

			expect(response.status).toBe(404);
		});
	});
	describe('POST /', () => {
		//! tieto premenne sa budu menit v zavislosti od testu
		let token;
		let name;

		//! pomocna funkcia pre casto opakujuci sa kod
		const exec = async () => {
			// posleme validny zaner 5-50 znakov
			return await request(server).post('/api/genres').set('x-auth-token', token).send({ name: name });
			//name:name lebo sa bude vzdy menit v kazsom teste
		};

		//! casto opakujuce sa da sem aby sa neopakovalo v kazdom teste
		beforeEach(() => {
			token = new User().generateAuthToken();
			name = 'genre1';
		});

		it('Vrati 401 ak klient nieje prihlaseny', async () => {
			token = ''; // nebude pouzivat token preto '' - nieje prihlaseny
			const response = await exec(); // funkcia spravi to co je pod nou ale bez tokenu preto posleme prazdny tokent
			// const response = await request(server).post('/api/genres').send({ name: 'genre1' });
			expect(response.status).toBe(401);
		});
		it('Vrati 400 ak je zaner invalidny - ma menej ako 5 pismen', async () => {
			// najskor treba aby bol pouzivatel prihlaseny
			// const token = new User().generateAuthToken();
			// const response = await request(server)
			// 	.post('/api/genres')
			// 	.set('x-auth-token', token)
			// 	.send({ name: '1234' });

			name = '1234'; // ma menej ako 5 chars
			const response = await exec();
			expect(response.status).toBe(400);
		});

		it('Vrati 400 ak je zaner invalidny - ma viac ako 50 pismen', async () => {
			// najskor treba aby bol pouzivatel prihlaseny
			// const token = new User().generateAuthToken();
			//token = '';
			// const response = await request(server)
			// 	.post('/api/genres')
			// 	.set('x-auth-token', token)
			// 	.send({ name: longName });

			name = new Array(52).join('a'); // 52 pismen aciek pre generovanie dlheho stringu
			const response = await exec();
			expect(response.status).toBe(400);
		});
		//* Happy paths tohto testu
		it('Ulozi novy zaner ak je validny', async () => {
			// najskor treba aby bol pouzivatel prihlaseny
			//const token = new User().generateAuthToken();

			await exec();
			const genre = await Genre.find({ name: 'genre1' }); // najdeme v DB ulozeny zaner z response
			expect(genre).not.toBeNull(); // nebude null cize existuje
		});

		it('Ulozi novy zaner ak je validnys', async () => {
			// najskor treba aby bol pouzivatel prihlaseny
			//const token = new User().generateAuthToken();
			// const response = await request(server)
			// 	.post('/api/genres')
			// 	.set('x-auth-token', token)
			// 	.send({ name: 'genre1' }); // posleme validny zaner 5-50 znakov

			const response = await exec();
			expect(response.body).toHaveProperty('_id'); // ci ma ID ale hodnota nas nezaujima
			expect(response.body).toHaveProperty('name', 'genre1'); // ci ma name s hodnotou genre1
		});
	});
});



// 