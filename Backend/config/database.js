const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const connectToDB = async () => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false, // Disable Mongoose buffering
		};
		console.log('Connecting to MongoDB...');
		cached.promise = mongoose.connect(mongoURI, opts).then((mongoose) => {
			console.log('Connected to MongoDB Successfully');
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		console.error('Error connecting to MongoDB:', e);
		throw e;
	}

	return cached.conn;
};

module.exports = { connectToDB };
