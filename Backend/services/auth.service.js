const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (user) => {
	const { email, password } = user;
	const foundUser = await User.findOne({ email });
	if (!foundUser || !(await foundUser.comparePassword(password))) {
		const error = new Error('Invalid email or password');
		error.statusCode = 400;
		throw error;
	}
	const token = jwt.sign({ id: foundUser._id }, JWT_SECRET, {
		expiresIn: '1h',
	});
	return token;
};

const register = async (userData) => {
	const { name, email, password, confirmPassword } = userData;
	if (password !== confirmPassword) {
		const error = new Error('Passwords do not match');
		error.statusCode = 400;
		throw error;
	}
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		const error = new Error('User already exists');
		error.statusCode = 400;
		throw error;
	}
	const newUser = new User({ name, email, password });
	await newUser.save();
	const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
	return token;
};

module.exports = { login, register };
