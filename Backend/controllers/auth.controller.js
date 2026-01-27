const AuthService = require('../services/auth.service');

const LoginUser = async (req, res, next) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ error: 'Request body is required' });
		}
		const user = req.body;
		const token = await AuthService.login(user);
		res.cookie('token', token, { httpOnly: true });
		// res.json({ token, message: 'Login successful' });
		res.redirect('/tasks');
	} catch (error) {
		next(error);
	}
};

const RegisterUser = async (req, res, next) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ error: 'Request body is required' });
		}
		const user = req.body;
		const token = await AuthService.register(user);
		res.cookie('token', token, { httpOnly: true });
		// res.json({ token, message: 'Registration successful' });
		res.redirect('/tasks');
	} catch (error) {
		next(error);
	}
};

const LogoutUser = (req, res, next) => {
	try {
		res.clearCookie('token');
		res.redirect('/');
	} catch (error) {
		next(error);
	}
};

module.exports = { LoginUser, RegisterUser, LogoutUser };