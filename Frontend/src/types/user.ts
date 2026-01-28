import type { Task } from './tasks';

export interface User {
	_id: string;
	name: string;
	email: string;
	password: string;
	tasks: Task[];
	createdAt: Date;
	updatedAt: Date;
}
