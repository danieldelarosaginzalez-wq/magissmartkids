// Tipos para el frontend de MagicSmartKids

export type UserRole = 'student' | 'teacher' | 'coordinator' | 'super_admin';

export interface Institution {
  id: string;
  name: string;
  address?: string;
  nit?: string;
}

export interface SchoolGrade {
  id: string;
  gradeName: string;
  gradeLevel: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institution?: Institution | null;
  schoolGrade?: SchoolGrade | null;
  isActive: boolean;
  createdAt: string;
}

// Tipos para el dashboard del estudiante
export interface StudentStats {
  totalSubjects: number;
  pendingTasks: number;
  completedTasks: number;
  averageGrade: number;
  studyHours: string;
  completedActivities: number;
}

export interface StudentTask {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface StudentSubject {
  id: string;
  name: string;
  progress: number;
  grade: number;
  color: string;
}

export interface StudentGrade {
  id: string;
  subject: string;
  assignment: string;
  grade: number;
  maxGrade: number;
  date: string;
}