import { StudentTask, StudentSubject, StudentGrade } from '../types/studentTypes';

// Mock de tareas del estudiante
export const mockStudentTasks: StudentTask[] = [
  {
    id: 1,
    title: "Presentación sobre el Sistema Solar",
    description: "Crear una presentación multimedia sobre los planetas del sistema solar",
    type: "multimedia",
    status: "pending",
    dueDate: "2025-11-05T23:59:59",
    subject: "Ciencias Naturales",
    maxScore: 5,
    submissionType: "file",
    createdAt: "2025-10-25T10:00:00",
    updatedAt: "2025-10-25T10:00:00"
  },
  {
    id: 2,
    title: "Ejercicios de Multiplicación",
    description: "Completar la actividad interactiva de multiplicaciones",
    type: "interactive",
    status: "completed",
    dueDate: "2025-10-28T23:59:59",
    subject: "Matemáticas",
    score: 4.5,
    maxScore: 5,
    submissionType: "interactive",
    teacherFeedback: "¡Excelente trabajo! Solo un pequeño error en la última multiplicación.",
    createdAt: "2025-10-20T10:00:00",
    updatedAt: "2025-10-27T15:30:00"
  },
  {
    id: 3,
    title: "Video de Exposición Oral",
    description: "Grabar un video explicando tu libro favorito",
    type: "multimedia",
    status: "completed",
    dueDate: "2025-10-25T23:59:59",
    subject: "Español",
    score: 5,
    maxScore: 5,
    submissionType: "file",
    submissionUrl: "https://storage.altius.edu/videos/exposicion-123.mp4",
    teacherFeedback: "¡Fantástica presentación! Me encantó tu análisis del libro.",
    createdAt: "2025-10-15T10:00:00",
    updatedAt: "2025-10-24T14:20:00"
  },
  {
    id: 4,
    title: "Juego de Vocabulario",
    description: "Completar el juego interactivo de vocabulario en inglés",
    type: "interactive",
    status: "late",
    dueDate: "2025-10-20T23:59:59",
    subject: "Inglés",
    maxScore: 5,
    submissionType: "interactive",
    createdAt: "2025-10-10T10:00:00",
    updatedAt: "2025-10-10T10:00:00"
  }
];

// Mock de materias del estudiante
export const mockStudentSubjects: StudentSubject[] = [
  {
    id: 1,
    name: "Matemáticas",
    code: "MAT-3A",
    teacher: "Prof. Ana García",
    color: "#4C51BF",
    progress: 85,
    completedTasks: 17,
    totalTasks: 20,
    averageScore: 4.7,
    nextTask: {
      id: 5,
      title: "Ejercicios de Fracciones",
      dueDate: "2025-11-02T23:59:59"
    }
  },
  {
    id: 2,
    name: "Español",
    code: "ESP-3A",
    teacher: "Prof. Carlos Pérez",
    color: "#ED64A6",
    progress: 92,
    completedTasks: 11,
    totalTasks: 12,
    averageScore: 4.9
  },
  {
    id: 3,
    name: "Ciencias Naturales",
    code: "CN-3A",
    teacher: "Prof. María Rodríguez",
    color: "#48BB78",
    progress: 75,
    completedTasks: 9,
    totalTasks: 12,
    averageScore: 4.5,
    nextTask: {
      id: 1,
      title: "Presentación sobre el Sistema Solar",
      dueDate: "2025-11-05T23:59:59"
    }
  },
  {
    id: 4,
    name: "Inglés",
    code: "ING-3A",
    teacher: "Prof. John Smith",
    color: "#F6AD55",
    progress: 60,
    completedTasks: 6,
    totalTasks: 10,
    averageScore: 4.2,
    nextTask: {
      id: 4,
      title: "Juego de Vocabulario",
      dueDate: "2025-10-20T23:59:59"
    }
  }
];

// Mock de calificaciones del estudiante
export const mockStudentGrades: StudentGrade[] = [
  {
    id: 1,
    taskId: 2,
    taskTitle: "Ejercicios de Multiplicación",
    subject: "Matemáticas",
    score: 4.5,
    maxScore: 5,
    date: "2025-10-27T15:30:00",
    type: "activity",
    teacherFeedback: "¡Excelente trabajo! Solo un pequeño error en la última multiplicación.",
    teacherName: "Prof. Ana García"
  },
  {
    id: 2,
    taskId: 3,
    taskTitle: "Video de Exposición Oral",
    subject: "Español",
    score: 5,
    maxScore: 5,
    date: "2025-10-24T14:20:00",
    type: "task",
    teacherFeedback: "¡Fantástica presentación! Me encantó tu análisis del libro.",
    teacherName: "Prof. Carlos Pérez"
  },
  {
    id: 3,
    taskId: 0,
    taskTitle: "Examen Parcial de Matemáticas",
    subject: "Matemáticas",
    score: 4.8,
    maxScore: 5,
    date: "2025-10-15T10:00:00",
    type: "exam",
    teacherFeedback: "Excelente dominio de los temas. ¡Felicitaciones!",
    teacherName: "Prof. Ana García"
  },
  {
    id: 4,
    taskId: 0,
    taskTitle: "Quiz de Vocabulario",
    subject: "Inglés",
    score: 4.2,
    maxScore: 5,
    date: "2025-10-10T09:30:00",
    type: "activity",
    teacherName: "Prof. John Smith"
  }
];

// Función helper para filtrar tareas por tipo
export const filterTasksByType = (tasks: StudentTask[], type: 'multimedia' | 'interactive'): StudentTask[] => {
  return tasks.filter(task => task.type === type);
};

// Función helper para filtrar tareas por estado
export const filterTasksByStatus = (tasks: StudentTask[], status: 'pending' | 'completed' | 'late'): StudentTask[] => {
  return tasks.filter(task => task.status === status);
};

// Función helper para obtener el progreso general del estudiante
export const getOverallProgress = (subjects: StudentSubject[]): number => {
  const totalProgress = subjects.reduce((sum, subject) => sum + subject.progress, 0);
  return Math.round(totalProgress / subjects.length);
};