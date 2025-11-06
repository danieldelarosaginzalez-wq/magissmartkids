export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  institutionId?: string | null;
  institution?: Institution | null; // ✅ INSTITUCIÓN COMPLETA (puede ser null)
  academicGrade?: AcademicGrade | null; // ✅ GRADO ACADÉMICO (puede ser null)
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}

export interface AcademicGrade {
  id: string;
  name: string;
  description: string;
  level: number;
}

export type UserRole = 'super_admin' | 'coordinator' | 'teacher' | 'student' | 'visitor';

export interface Institution {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  isActive: boolean;
  studentsCount: number;
  teachersCount: number;
  averageGrade: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  gradeLevel: string;
  teacherId: string;
  institutionId: string;
  color: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  teacherId: string;
  type: 'quiz' | 'file_upload' | 'both';
  dueDate: string;
  totalPoints: number;
  questions?: Question[];
  isActive: boolean;
  submissions: Submission[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  answers?: Answer[];
  files?: File[];
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'late';
}

export interface Answer {
  questionId: string;
  answer: string | number;
  isCorrect?: boolean;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  assignmentId: string;
  value: number;
  maxValue: number;
  period: string;
  date: string;
  type: 'assignment' | 'exam' | 'participation';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'assignment' | 'exam' | 'meeting' | 'holiday';
  subjectId?: string;
  institutionId: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalInstitutions: number;
  averageImprovement: number;
  pendingAssignments: number;
  completedAssignments: number;
  gradeDistribution: {
    excellent: number;
    good: number;
    regular: number;
    poor: number;
  };
}

export interface StudentProgress {
  studentId: string;
  subjectId: string;
  beforeGrade: number;
  afterGrade: number;
  improvement: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  lastActivity: string;
}