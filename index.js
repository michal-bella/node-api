const express = require('express');
const app = express();

require('./startup/logging')(); // modul pre logovanie chyb + volanie funkcie bez parametrov
require('./startup/routes')(app); // modul pre Routing + app nacitanie expressu
require('./startup/db')(); // modul pre DB + volanie funkcie bez parametrov
require('./startup/config')(); // modul pre konfiguracne nastavenia + volanie funkcie bez parametrov
require('./startup/validation')(); // modul pre validaciu + volanie funkcie bez parametrov
require('./startup/prod')(app); // modul pre deploy aplikacie do heroku

//* testovanie chyb
// throw new Error('Nieco sa pokazilo pri startovani programu');
// const p = Promise.reject(new Error('asynchronna chyba - PROMISE REJECTED'));
// p.then(() => console.log('DONE')); // nezavolam catch

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

//export kvoli testovaniu servera v integracnych testoch
module.exports = server;
