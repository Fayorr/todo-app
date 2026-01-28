import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const EditTaskPage = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');
	const { taskId } = useParams<{ taskId: string }>();
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch existing task data to populate the form for editing
		// This is a placeholder; actual implementation would depend on routing and task ID
		const fetchTaskData = async () => {
			try {
				const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
					method: 'GET',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
					},
				});
				if (!response.ok) {
					setError('Failed to fetch task data');
					return;
				}
				const data = await response.json();
					setTitle(data.title);
				setDescription(data.description || '');
			} catch (err) {
				console.error(err);
				setError('An error occurred while fetching the task data');
			}
		};
		if (taskId) {
			// Ensure taskId is defined before calling fetchTaskData
			fetchTaskData();
		}
	}, [taskId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ title, description }),
			});
			if (!response.ok) {
				setError('Failed to create task');
				return;
			}
			// Handle successful task creation (e.g., navigate to task list)
			navigate('/tasks');
		} catch (err) {
			console.error(err);
			setError('An error occurred while creating the task');
		}
	};
	return (
		<div>
			<h1>Edit Task</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<label>Title:</label>
				<input
					type='text'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<br />
				<br />
				<label>Description:</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					
				/>
				<br />
				<br />
				<button type='submit'>Save Task</button>
			</form>
		</div>
	);
};
export default EditTaskPage;
