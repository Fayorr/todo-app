const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/users');

describe('Authentication Flow Redirects', () => {
	beforeAll(async () => {
		// Connect to a test database if not already connected
		// Assuming app.js connects to DB.
		// We might want to clear users before testing
		await User.deleteMany({ email: 'test@example.com' });
	});

	afterAll(async () => {
		await User.deleteMany({ email: 'test@example.com' });
		await mongoose.connection.close();
	});

	test('POST /auth/register should redirect to /tasks', async () => {
		const res = await request(app).post('/auth/register').send({
			name: 'Test User',
			email: 'test@example.com',
			password: 'password123',
			confirmPassword: 'password123',
		});

		expect(res.statusCode).toEqual(302);
		expect(res.headers.location).toBe('/tasks');
		expect(res.headers['set-cookie']).toBeDefined();
	});

	test('POST /auth/login should redirect to /tasks', async () => {
		const res = await request(app).post('/auth/login').send({
			email: 'test@example.com',
			password: 'password123',
		});

		expect(res.statusCode).toEqual(302);
		expect(res.headers.location).toBe('/tasks');
		expect(res.headers['set-cookie']).toBeDefined();
	});

	test('accessing /tasks/page/tasks with cookie should succeed', async () => {
		// Login first to get cookie
		const loginRes = await request(app).post('/auth/login').send({
			email: 'test@example.com',
			password: 'password123',
		});

		const cookie = loginRes.headers['set-cookie'];

		const res = await request(app).get('/tasks').set('Cookie', cookie);

		expect(res.statusCode).toEqual(200);
		// Should return HTML
		expect(res.type).toBe('text/html');
	});
});
