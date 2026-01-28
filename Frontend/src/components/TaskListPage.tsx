import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task, User } from '../types/index';

const TaskListPage = () => {
	const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
	const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
	const [user, setUser] = useState({} as User);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogout = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('http://localhost:8000/auth/logout', {
				method: 'POST',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
				},
			});
			if (!response.ok) {
				setError('Logout failed');
				return;
			}
		} catch (err) {
			console.error(err);
		}
		// Cookie cleared by backend, redirect the user
		navigate('/login');
	};

	const handleCreateTask = (e: React.FormEvent) => {
		e.preventDefault();
		navigate('/create');
	};

	const handleEditTask = (taskId: string) => {
		navigate(`/tasks/${taskId}`);
	};

	const handleMarkCompleted = async (taskId: string) => {
		const taskToMove = pendingTasks.find((t: Task) => t._id === taskId);
		try {
			const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({ status: 'completed' }),
			});

			if (!response.ok) {
				setError('Failed to mark task as completed');
				return;
			}

			setPendingTasks((prevTasks) =>
				prevTasks.filter((task: Task) => task._id !== taskId),
			);
			if (taskToMove) {
				setCompletedTasks((prevTasks) => [
					...prevTasks,
					{ ...taskToMove, status: 'completed' }, // Update status manually
				]);
			}
		} catch (err) {
			setError('An error occurred while marking the task as completed');
			console.error(err);
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		if (!window.confirm('Are you sure you want to delete this task?')) {
			return;
		}

		try {
			const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
				},
			});

			if (!response.ok) {
				setError('Failed to delete task');
				return;
			}

			// SUCCESS! Remove from UI locally
			// We try to remove it from BOTH lists just in case
			setPendingTasks((prev) =>
				prev.filter((task: Task) => task._id !== taskId),
			);
			setCompletedTasks((prev) =>
				prev.filter((task: Task) => task._id !== taskId),
			);
		} catch (err) {
			setError('An error occurred while deleting the task');
			console.error(err);
		}
	};
	const handleClearCompletedTasks = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!window.confirm('Are you sure you want to clear all completed tasks?')
		) {
			return;
		}
		try {
			const response = await fetch('http://localhost:8000/tasks/completed', {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					Accept: 'application/json',
				},
			});
			if (!response.ok) {
				setError('Failed to clear completed tasks');
				return;
			}
			setCompletedTasks([]);
		} catch (err) {
			setError('An error occurred while clearing completed tasks');
			console.error(err);
		}
	};
	useEffect(() => {
		// Fetch tasks from backend API
		const fetchedTasks = async (): Promise<void> => {
			try {
				const response: Response = await fetch('http://localhost:8000/tasks', {
					method: 'GET',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
					},
				});

				if (!response.ok) {
					if (response.status === 401) {
						navigate('/login');
						return;
					}
					setError(`Error: ${response.statusText}`);
					return;
				}

				const data = await response.json();
				setPendingTasks(data.tasks);
				setCompletedTasks(data.completedTasks);
				setUser(data.user);
			} catch (err) {
				console.error(err);
				// Network error or backend unreachable - redirect to login
				// since we can't verify authentication status
				navigate('/login');
			}
		};
		fetchedTasks();
	}, [navigate, setCompletedTasks]);
	return (
		<div>
			<h1>Your List of Tasks</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<p>Welcome, {user.name}!</p>
			<form onSubmit={handleCreateTask}>
				<button>Create New Task</button>
			</form>

			{pendingTasks.length === 0 ? (
				<p>No tasks available. Create a new task!</p>
			) : (
				<ul>
					{pendingTasks.map((task: Task) => (
						<li key={task._id}>
							<h3>{task.title}</h3>
							<p>{task.description}</p>
							<button onClick={() => handleEditTask(task._id)}>Edit</button>
							<button onClick={() => handleMarkCompleted(task._id)}>
								Mark as Completed
							</button>
							<button onClick={() => handleDeleteTask(task._id)}>Delete</button>
						</li>
					))}
				</ul>
			)}
			<div>
				<h2>Completed Tasks</h2>
				<form onSubmit={handleClearCompletedTasks}>
					<button type='submit'>Clear all tasks</button>
				</form>
			</div>
			{completedTasks.length === 0 ? (
				<p>No completed tasks yet.</p>
			) : (
				<ul>
					{completedTasks.map((task: Task) => (
						<li key={task._id}>
							<h3>{task.title}</h3>
							<p>{task.description}</p>
						</li>
					))}
				</ul>
			)}
			<form onSubmit={handleLogout}>
				<button type='submit'>Logout</button>
			</form>
		</div>
	);
};

export default TaskListPage;
