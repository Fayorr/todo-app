import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import process.env.API_URL;
const apiUrl = import.meta.env.VITE_API_URL;

const CreateTaskPage = () => {
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [error, setError] = useState<string>('');
	const navigate = useNavigate();

	const handleCreateTask = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const response = await fetch(`${apiUrl}/tasks`, {
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
						<h1 className='text-3xl font-bold text-slate-900'>
							Create New Task
						</h1>
					</div>

					{error && (
						<div className='p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm italic'>
							{error}
						</div>
					)}

					<form
						onSubmit={handleCreateTask}
						className='space-y-6'
					>
						<div className='space-y-2'>
							<label
								htmlFor='title'
								className='text-sm font-medium text-slate-700 ml-1'
							>
								Task Title
							</label>
							<input
								type='text'
								id='title'
								name='title'
								className='input-field'
								placeholder='What needs to be done?'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='description'
								className='text-sm font-medium text-slate-700 ml-1'
							>
								Description
							</label>
							<textarea
								id='description'
								name='description'
								className='input-field min-h-[150px] resize-none'
								placeholder='Add more details about this task...'
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
								Create Task
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateTaskPage;
