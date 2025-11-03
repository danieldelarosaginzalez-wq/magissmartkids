import { TaskDocument } from './tasksMongo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface TaskResponse extends TaskDocument {
  id: string; // MongoDB _id formatted as string
}

// Transform MongoDB document to API response format
function transformTask(task: TaskDocument): TaskResponse {
  const { _id, ...rest } = task;
  return {
    ...rest,
    id: _id?.toString() || '',
  };
}

export const tasksApi = {
  getStudentTasks: async (studentId: string): Promise<TaskResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/student/${studentId}`);
    if (!response.ok) {
      throw new Error('Error fetching tasks');
    }
    const tasks = await response.json();
    return tasks.map(transformTask);
  },

  submitTask: async (taskId: string, formData: FormData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/submit`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Error submitting task');
    }
  },

  startInteractiveTask: async (taskId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/start`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Error starting interactive task');
    }
  }
};