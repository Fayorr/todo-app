const AuthService = require('../services/auth.service');

const LoginUser = async (req, res, next) => {
	try {
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ error: 'Request body is required' });
		}
		const user = req.body;
		const token = await AuthService.login(user);
		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ token, message: 'Login successful' });
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
		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ token, message: 'Registration successful' });
	} catch (error) {
		next(error);
	}
};

const LogoutUser = (req, res, next) => {
	try {
		res.clearCookie('token', {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		});
		res.json({ message: 'Logout successful' });
	} catch (error) {
		next(error);
	}
};

module.exports = { LoginUser, RegisterUser, LogoutUser };
