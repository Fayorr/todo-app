import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
	HomePage,
	LoginPage,
	RegisterPage,
	TaskListPage,
	CreateTaskPage,
	EditTaskPage,
} from './components/index';
import './App.css';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path='/'
						element={<HomePage />}
					/>
					<Route
						path='/login'
						element={<LoginPage />}
					/>
					<Route
						path='/register'
						element={<RegisterPage />}
					/>
					<Route
						path='/tasks'
						element={<TaskListPage />}
					/>
					<Route
						path='/tasks/:taskId'
						element={<EditTaskPage />}
					/>
					<Route
						path='/create'
						element={<CreateTaskPage />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
