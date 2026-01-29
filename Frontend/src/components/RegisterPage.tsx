import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleRegisterUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		try {
			const response = await fetch(`${apiUrl}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ name, email, password, confirmPassword }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setError(errorData.message || errorData.error || 'Registration failed');
				return;
			}

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
						<h1 className='text-3xl font-bold text-slate-900'>
							Create Account
						</h1>
						<p className='text-slate-500'>Join TaskFlow and stay organized</p>
					</div>

					{error && (
						<div className='p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm'>
							{error}
						</div>
					)}

					<form
						onSubmit={handleRegisterUser}
						className='space-y-5'
					>
						<div className='space-y-2'>
							<label
								htmlFor='name'
								className='text-sm font-medium text-slate-700 ml-1'
							>
								Full Name
							</label>
							<input
								type='text'
								id='name'
								name='name'
								className='input-field'
								placeholder='John Doe'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

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

						<div className='space-y-2'>
							<label
								htmlFor='confirmPassword'
								title='Confirm Password'
								className='text-sm font-medium text-slate-700 ml-1'
							>
								Confirm Password
							</label>
							<input
								type='password'
								id='confirmPassword'
								name='confirmPassword'
								className='input-field'
								placeholder='••••••••'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>

						<button
							type='submit'
							className='btn-primary w-full py-4 text-lg mt-4'
						>
							Create Account
						</button>
					</form>

					<div className='pt-6 text-center border-t border-slate-100'>
						<p className='text-slate-600'>
							Already have an account?{' '}
							<Link
								to='/login'
								className='text-primary-600 font-semibold hover:text-primary-700 transition-colors'
							>
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
