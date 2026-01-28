import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTaskPage = () => {
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [error, setError] = useState<string>('');
	const navigate = useNavigate();

	const handleCreateTask = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const response = await fetch('http://localhost:8000/tasks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ title, description }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setError(
					errorData.message || errorData.error || 'Task creation failed',
				);
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
			<h1>Create a new task!</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleCreateTask}>
				<label htmlFor='title'>Title:</label>
				<input
					type='text'
					id='title'
					name='title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<br />
				<br />
				<label htmlFor='description'>Description:</label>
				<textarea
					id='description'
					name='description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<br />
				<br />
				<button type='submit'>Create Task</button>
			</form>
		</div>
	);
};

export default CreateTaskPage;
