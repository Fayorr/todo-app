const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock connectToDB to do nothing
jest
	.spyOn(require('../config/database'), 'connectToDB')
	.mockImplementation(() => {
		console.log('Mocked connectToDB called');
	});

const app = require('../app');
const User = require('../models/users');
require('dotenv').config();

let mongoServer;

describe('Error Sanitization', () => {
	beforeAll(async () => {
		mongoServer = await MongoMemoryServer.create();
		const uri = mongoServer.getUri();
		await mongoose.connect(uri);

		await User.deleteMany({ email: 'sanitizer@example.com' });
		// Create a user for login test
		await request(app).post('/auth/register').send({
			name: 'Sanitizer',
			email: 'sanitizer@example.com',
			password: 'password123',
			confirmPassword: 'password123',
		});
	}, 30000);

	afterAll(async () => {
		await mongoose.disconnect();
		await mongoServer.stop();
	});

	test('Operational Error: Login with wrong password should return 400 and specific message', async () => {
		const res = await request(app)
			.post('/auth/login')
			.send({
				email: 'sanitizer@example.com',
				password: 'wrongpassword',
			})
			.set('Accept', 'application/json');
		// set Accept json to force json response from errorHandler

		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toBe('Invalid email or password');
	});

	test('System Error: DB Failure should return 500 and GENERIC message', async () => {
		// Login first
		const loginRes = await request(app).post('/auth/login').send({
			email: 'sanitizer@example.com',
			password: 'password123',
		});

		const cookie = loginRes.headers['set-cookie'];

		const Task = require('../models/tasks');
		const spy = jest
			.spyOn(Task, 'find')
			.mockRejectedValue(new Error('Database exploded'));

		const res = await request(app)
			.get('/tasks')
			.set('Cookie', cookie)
			.set('Accept', 'application/json');

		spy.mockRestore();

		expect(res.statusCode).toEqual(500);
		expect(res.body.message).toBe(
			'Something went wrong, please try again later',
		);
		// Ensure explicit internal error is NOT present
		expect(res.body.message).not.toContain('Database exploded');
	});
});
