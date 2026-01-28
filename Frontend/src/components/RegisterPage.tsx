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
					'Accept': 'application/json',
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
		<div>
			<h1>Register Page</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleRegisterUser}>
				<label htmlFor='name'>Name:</label>
				<input
					type='text'
					id='name'
					name='name'
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<br />
				<br />
				<label htmlFor='email'>Email:</label>
				<input
					type='email'
					id='email'
					name='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<br />
				<br />

				<label htmlFor='password'>Password:</label>
				<input
					type='password'
					id='password'
					name='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<br />
				<br />
				<label htmlFor='confirmPassword'>Confirm Password:</label>
				<input
					type='password'
					id='confirmPassword'
					name='confirmPassword'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				<br />
				<br />
				<button type='submit'>Sign Up</button>
			</form>

			<p>
				Already have an account? <Link to='/login'>Login</Link>
			</p>
		</div>
	);
};

export default RegisterPage;
