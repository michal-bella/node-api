//* testovanie auth tokenov
const request = require('supertest');
let server;
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

describe('auth middleware', () => {
	// server by sa mal vzdy zavolat pred kazdym testom
	beforeAll((done) => {
		server = require('../../index');
		server.listen(done);
	});

	// a potom ukoncit za testami, aby nebol obsadeny port pri reloade servera
	afterAll(async (done) => {
        await Genre.remove({}); // aby vzdy na konci zmazal objekty potom by ocakavalo vzdy o 2 viac pri dalsom spusteni
		await server.close(done); // await aby sme vedeli ze server je zatvoreny
	});

	//! najskor definujeme HAPPY PATH a ten potom prepisujeme v 400vkach
	let token;
	const exec = () => {
		return request(server).post('/api/genres').set('x-auth-token', token).send({ name: 'genre1' });
	};

	//! casto opakujuce sa da sem aby sa neopakovalo v kazdom teste
	beforeEach(() => {
		token = new User().generateAuthToken();
	});

	// 400-vky
	it('vrati 401 ak neni ziadny token poskytnuty', async () => {
		token = ''; // nieje poskytnuty
		const response = await exec();
		expect(response.status).toBe(401);
	});

	it('vrati 400 ak je token invalid', async () => {
		token = 'invalidTokenString'; // nieje spravny
		const response = await exec();
		expect(response.status).toBe(400);
	});

	// 200-vky 
	it('vrati 200 ak je token valid', async () => {
		// valid token je nastaveny uz vo funckii exec v beforeEach -> token = new User().generateAuthToken();
		const response = await exec();
		expect(response.status).toBe(200);
	});
});
