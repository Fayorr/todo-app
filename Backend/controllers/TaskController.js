const Task = require('../models/tasks');
const User = require('../models/users');

const getAllTasks = async (req, res, next) => {
	try {
		const userId = req.user.id; // From auth middleware
		const tasks = await Task.find({ status: 'pending', user: userId });
		const completedTasks = await Task.find({
			status: 'completed',
			user: userId,
		});
		const user = await User.findById(userId);
		res.render('tasks', { tasks, completedTasks, user });
	} catch (error) {
		next(error);
	}
};

const getTaskById = async (req, res, next) => {
	try {
		// Ensure user can only see their own tasks
		const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
		if (!task)
			return res.status(404).render('error', { error: 'Task not found' });
		res.render('edit', { task });
	} catch (error) {
		next(error);
	}
};

const createTask = async (req, res, next) => {
	try {
		const task = new Task({ ...req.body, user: req.user.id });
		await task.save();
		res.redirect('/tasks');
	} catch (error) {
		next(error);
	}
};

const updateTask = async (req, res, next) => {
	try {
		const task = await Task.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			req.body,
			{ new: true },
		);
		if (!task)
			return res.status(404).render('error', { error: 'Task not found' });
		res.redirect('/tasks');
	} catch (error) {
		next(error);
	}
};

const deleteTask = async (req, res, next) => {
	try {
		const task = await Task.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.id },
			{ status: 'deleted' },
			{ new: true },
		);
		if (!task)
			return res.status(404).render('error', { error: 'Task not found' });
		res.redirect('/tasks');
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
};
