//* modul pre validacie
const Joi = require('joi');

module.exports = function() {
	Joi.objectId = require('joi-objectid')(Joi); // aby sa nemusela stale includovat v kazdej
};
