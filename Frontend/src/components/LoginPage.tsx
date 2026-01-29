import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const response = await fetch(`${apiUrl}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message || errorData.error || 'Login failed');
				return;
			}

			// Login successful
			navigate('/tasks');
		} catch (err: unknown) {
			console.error(err);
			setError(
				'An error occurred. Make sure the backend server is running on port 8000.',
			);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12'>
			<div className='max-w-md w-full animate-slide-up'>
				<div className='card space-y-8'>
					<div className='text-center space-y-2'>
						<h1 className='text-3xl font-bold text-slate-900'>Welcome Back</h1>
						<p className='text-slate-500'>
							Please enter your details to sign in
						</p>
					</div>

					{error && (
						<div className='p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-shake'>
							{error}
						</div>
					)}

					<form
						onSubmit={handleSubmit}
						className='space-y-6'
					>
						<div className='space-y-2'>
							<label
								htmlFor='email'
								className='text-sm font-medium text-slate-700 ml-1'
							>
								Email Address
							</label>
							<input
								type='email'
								id='email'
								name='email'
								className='input-field'
								placeholder='name@example.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='password'
								title='Password'
								className='text-sm font-medium text-slate-700 ml-1'
							>
								Password
							</label>
							<input
								type='password'
								id='password'
								name='password'
								className='input-field'
								placeholder='••••••••'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<button
							type='submit'
							className='btn-primary w-full py-4 text-lg'
						>
							Sign In
						</button>
					</form>

					<div className='pt-6 text-center border-t border-slate-100'>
						<p className='text-slate-600'>
							Don't have an account?{' '}
							<a
								href='/register'
								className='text-primary-600 font-semibold hover:text-primary-700 transition-colors'
							>
								Register for free
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
