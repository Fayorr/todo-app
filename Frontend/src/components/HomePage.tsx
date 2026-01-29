import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4'>
			<div className='max-w-2xl w-full text-center space-y-8 animate-fade-in'>
				<div className='space-y-4'>
					<h1 className='text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900'>
						Master Your Day with{' '}
						<span className='text-primary-600'>TaskFlow</span>
					</h1>
					<p className='text-xl text-slate-600 max-w-lg mx-auto leading-relaxed'>
						The simple, elegant, and efficient way to manage your daily tasks
						and boost your productivity.
					</p>
				</div>

				<div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'>
					<Link
						to='/login'
						className='btn-primary w-full sm:w-auto text-lg px-10'
					>
						Get Started
					</Link>
					<Link
						to='/register'
						className='btn-secondary w-full sm:w-auto text-lg px-10'
					>
						Create Account
					</Link>
				</div>

				<div className='pt-12 grid grid-cols-3 gap-8 border-t border-slate-100 italic text-slate-400 text-sm'>
					<div>Simple UI</div>
					<div>Fast Sync</div>
					<div>Safe & Secure</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
