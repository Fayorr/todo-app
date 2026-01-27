const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const ValidateRegisterUser = (req, res, next) => {
	const schema = Joi.object({
		name: Joi.string().min(3).max(30).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		confirmPassword: Joi.string().min(6).required(),
	});
	const { error, value } = schema.validate(req.body);
	const { name, email, password, confirmPassword } = value;
	if (!name || !email || !password || !confirmPassword) {
		return res.status(400).json({ error: 'All fields are required' });
	}
	if (password !== confirmPassword) {
		return res.status(400).json({ error: 'Passwords do not match' });
	}
	next();
};
const ValidateLoginUser = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	});
	const { error, value } = schema.validate(req.body);
	const { email, password } = value;
	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}
	next();
};
const ValidateToken = (req, res, next) => {
	let token = req.headers['authorization'];
	if (token) {
		token = token.split(' ')[1];
	} else if (req.cookies && req.cookies.token) {
		token = req.cookies.token;
	}

	if (!token) {
		return res.redirect('/');
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.redirect('/');
	}
};

module.exports = {
	ValidateRegisterUser,
	ValidateLoginUser,
	ValidateToken,
};
