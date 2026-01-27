const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

const connectToDB = async () => {
	await mongoose
		.connect(mongoURI)
		.then(() => {
			console.log('Connected to MongoDB Successfully');
		})
		.catch((err) => {
			console.error('Error connecting to MongoDB:', err);
		});
};

module.exports = { connectToDB };
