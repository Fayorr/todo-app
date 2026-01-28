const express = require('express');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/auth.middleware');
const Task = require('../models/tasks');

const taskRouter = express.Router();
taskRouter.use(authMiddleware.ValidateToken);

taskRouter.get('/', TaskController.getAllTasks);
taskRouter.get('/:id', TaskController.getTaskById);
taskRouter.post('/', TaskController.createTask);
taskRouter.put('/:id', TaskController.updateTask);
taskRouter.delete('/completed', TaskController.deleteCompletedTasks);
taskRouter.delete('/:id', TaskController.deleteTask);

module.exports = taskRouter;
