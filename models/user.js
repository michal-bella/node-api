const Joi = require('joi');
const mongoose = require('mongoose');
//json web token - pre kryptovanie
const jwt = require('jsonwebtoken');
// config - premenne prostredia
const config = require('config');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minlength: 5,
		maxlength: 255
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024 // bude hashovane preto viac
    },
    // property pre kontolu ci je alebo nieje admin
    isAdmin: {
        type: Boolean
    }
});

//* metoda ktora bude genetovat tokeny podla user modelu
// nemoze byt arrow lebo nema svoj this
userSchema.methods.generateAuthToken = function() {
	// jwt - paytload + private key
	//! terminal:  export vidly_jwtPrivateKey=privatnyKluc
	//FIXME: envirnment variable NEFUNGUJE
	// const token = jwt.sign({_id : user._id}, config.get('jwtPrivateKey')); // private key ukladat do enviroment variables - custom-enviroment-variables.json
	// const token = jwt.sign({_id : user._id}, 'jwtPrivateKey');
	// aby zobralo ID z tohto modelu pouzit this miesto user
	//TODO: prerobit token aby bral hodnotu z environment variable
	const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, 'jwtPrivateKey'); // private key ukladat do enviroment variables - custom-enviroment-variables.json
	return token;
};

const User = mongoose.model('User', userSchema);

function validateuser(user) {
	const schema = {
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
		//TODO: pouzit: https://www.npmjs.com/package/joi-password-complexity
	};

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateuser;
