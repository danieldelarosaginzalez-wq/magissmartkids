export interface StudentTask {
  id: number;
  title: string;
  description: string;
  type: 'multimedia' | 'interactive';
  status: 'pending' | 'completed' | 'late';
  dueDate: string;
  subject: string;
  score?: number;
  maxScore: number;
  submissionType?: 'file' | 'text' | 'interactive';
  submissionUrl?: string;
  teacherFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubject {
  id: number;
  name: string;
  code: string;
  teacher: string;
  color: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  averageScore: number;
  nextTask?: {
    id: number;
    title: string;
    dueDate: string;
  };
}

export interface StudentGrade {
  id: number;
  taskId: number;
  taskTitle: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  type: 'task' | 'exam' | 'activity';
  teacherFeedback?: string;
  teacherName: string;
}