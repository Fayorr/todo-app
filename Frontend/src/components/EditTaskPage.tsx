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
		<div className='min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12'>
			<div className='max-w-xl w-full animate-slide-up'>
				<div className='card space-y-8'>
					<div className='flex items-center gap-4 border-b border-slate-100 pb-6'>
						<button
							onClick={() => navigate('/tasks')}
							className='p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='m15 18-6-6 6-6' />
							</svg>
						</button>
						<h1 className='text-3xl font-bold text-slate-900'>Edit Task</h1>
					</div>

					{error && (
						<div className='p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm italic'>
							{error}
						</div>
					)}

					<form
						onSubmit={handleSubmit}
						className='space-y-6'
					>
						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700 ml-1'>
								Task Title
							</label>
							<input
								type='text'
								className='input-field'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium text-slate-700 ml-1'>
								Description
							</label>
							<textarea
								className='input-field min-h-[150px] resize-none'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>

						<div className='flex gap-4 pt-4'>
							<button
								type='button'
								onClick={() => navigate('/tasks')}
								className='btn-secondary flex-1'
							>
								Cancel
							</button>
							<button
								type='submit'
								className='btn-primary flex-[2]'
							>
								Save Changes
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
export default EditTaskPage;
