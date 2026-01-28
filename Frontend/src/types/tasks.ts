export interface Task {
	_id: string; // MongoDB uses '_id', not 'id' by default
	title: string;
	description?: string; // Optional because it wasn't required in backend
	status: 'pending' | 'completed' | 'deleted';
	createdAt: string; // received as ISO string from API
	updatedAt: string;
}
