import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task, User } from '../types/index';
const apiUrl = import.meta.env.VITE_API_URL;

const TaskListPage = () => {
	const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
	const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
	const [user, setUser] = useState({} as User);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogout = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch(`${apiUrl}/auth/logout`, {
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
			const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
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
			const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
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
			const response = await fetch(`${apiUrl}/tasks/completed`, {
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
				const response: Response = await fetch(`${apiUrl}/tasks`, {
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
		<div className='min-h-screen bg-slate-50 pb-12'>
			{/* Header/Navbar */}
			<nav className='glass sticky top-0 z-10 border-b border-slate-200 px-4 py-4 mb-8'>
				<div className='max-w-5xl mx-auto flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold'>
							T
						</div>
						<span className='text-xl font-bold text-slate-900'>TaskFlow</span>
					</div>
					<div className='flex items-center gap-4'>
						<span className='hidden sm:inline text-sm text-slate-500'>
							Welcome,{' '}
							<span className='font-semibold text-slate-900'>{user.name}</span>
						</span>
						<form onSubmit={handleLogout}>
							<button
								type='submit'
								className='text-sm font-medium text-red-600 hover:text-red-700 transition-colors'
							>
								Logout
							</button>
						</form>
					</div>
				</div>
			</nav>

			<main className='max-w-5xl mx-auto px-4 space-y-8 animate-fade-in'>
				{error && (
					<div className='p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm italic'>
						{error}
					</div>
				)}

				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold text-slate-900 tracking-tight'>
						Your Tasks
					</h1>
					<button
						onClick={handleCreateTask}
						className='btn-primary gap-2'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M5 12h14' />
							<path d='M12 5v14' />
						</svg>
						New Task
					</button>
				</div>

				{/* Pending Tasks */}
				<section>
					{pendingTasks.length === 0 ? (
						<div className='card text-center py-12 space-y-4'>
							<div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='32'
									height='32'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-slate-300'
								>
									<path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
									<path d='M12 11h4' />
									<path d='M12 16h4' />
									<path d='M8 11h.01' />
									<path d='M8 16h.01' />
									<path d='M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z' />
								</svg>
							</div>
							<p className='text-slate-600 font-medium'>
								No tasks available yet.
							</p>
							<button
								onClick={handleCreateTask}
								className='text-primary-600 font-semibold hover:underline'
							>
								Create your first task
							</button>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{pendingTasks.map((task: Task) => (
								<div
									key={task._id}
									className='card group hover:border-primary-200 transition-all duration-300 flex flex-col h-full !p-6'
								>
									<div className='flex-1 space-y-3'>
										<h3 className='text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2'>
											{task.title}
										</h3>
										<p className='text-slate-600 text-sm leading-relaxed line-clamp-3'>
											{task.description}
										</p>
									</div>
									<div className='pt-6 mt-6 border-t border-slate-50 flex items-center justify-between'>
										<div className='flex items-center gap-1'>
											<button
												onClick={() => handleEditTask(task._id)}
												className='p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all'
												title='Edit Task'
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='18'
													height='18'
													viewBox='0 0 24 24'
													fill='none'
													stroke='currentColor'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												>
													<path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
													<path d='m15 5 4 4' />
												</svg>
											</button>
											<button
												onClick={() => handleDeleteTask(task._id)}
												className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all'
												title='Delete Task'
											>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													width='18'
													height='18'
													viewBox='0 0 24 24'
													fill='none'
													stroke='currentColor'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'
												>
													<path d='M3 6h18' />
													<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
													<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
													<line
														x1='10'
														x2='10'
														y1='11'
														y2='17'
													/>
													<line
														x1='14'
														x2='14'
														y1='11'
														y2='17'
													/>
												</svg>
											</button>
										</div>
										<button
											onClick={() => handleMarkCompleted(task._id)}
											className='px-3 py-1.5 text-xs font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-full transition-colors'
										>
											Mark Done
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</section>

				{/* Completed Tasks */}
				<section className='pt-8 border-t border-slate-200'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-2xl font-bold text-slate-900'>Completed</h2>
						{completedTasks.length > 0 && (
							<button
								onClick={handleClearCompletedTasks}
								className='text-sm font-medium text-slate-500 hover:text-red-600 transition-colors'
							>
								Clear All
							</button>
						)}
					</div>

					{completedTasks.length === 0 ? (
						<p className='text-slate-400 italic'>No completed tasks yet.</p>
					) : (
						<div className='space-y-4'>
							{completedTasks.map((task: Task) => (
								<div
									key={task._id}
									className='flex items-center gap-4 bg-white/60 p-4 rounded-xl border border-slate-100 opacity-70 group hover:opacity-100 transition-opacity'
								>
									<div className='w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='14'
											height='14'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='3'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<path d='M20 6 9 17l-5-5' />
										</svg>
									</div>
									<div className='flex-1'>
										<h3 className='font-semibold text-slate-700 line-through decoration-slate-400'>
											{task.title}
										</h3>
										<p className='text-sm text-slate-400 line-clamp-1'>
											{task.description}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</main>
		</div>
	);
};

export default TaskListPage;
