import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<div>
            <h1>Welcome to the Task Manager!</h1>
            <p>Manage your tasks efficiently and effectively.</p>
            <button><Link to="/login">Login</Link></button>
            <button><Link to="/register">Register</Link></button>
		</div>
	);
};

export default HomePage;
