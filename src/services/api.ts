import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// IMPORTANTE: Usar rutas relativas para que funcione el proxy de Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance for protected endpoints
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for public endpoints (no auth required)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Lista de endpoints públicos que NO necesitan token
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/check-coordinator', // ✅ NUEVO ENDPOINT PÚBLICO
      '/school-grades/initialize',
      '/school-grades',
      '/student-validation/validate-student',
      '/institutions/validate-nit',
      '/institutions',
      '/health'
    ];

    // Verificar si el endpoint es público
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    // Solo agregar token para endpoints protegidos
    if (!isPublicEndpoint) {
      const token = useAuthStore.getState().token;
      console.log('🔑 Token obtenido del store:', token ? `${token.substring(0, 20)}...` : 'NULL');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token agregado al header Authorization');
      } else {
        console.warn('⚠️ No hay token disponible para endpoint protegido:', config.url);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo hacer logout si es un error 401 en endpoints de autenticación
    // No hacer logout automático en otros endpoints para evitar cerrar sesión innecesariamente
    if (error.response?.status === 401) {
      const url = error.config?.url || '';

      // Solo hacer logout si el error viene de endpoints críticos de autenticación
      const criticalAuthEndpoints = ['/auth/login', '/auth/refresh', '/users/profile'];
      const isCriticalAuthError = criticalAuthEndpoints.some(endpoint => url.includes(endpoint));

      if (isCriticalAuthError) {
        console.warn('Error de autenticación crítico, cerrando sesión');
        useAuthStore.getState().logout();
        window.location.href = '/';
      } else {
        // Para otros endpoints, solo registrar el error sin cerrar sesión
        console.warn('Error 401 en endpoint no crítico:', url);
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    publicApi.post('/auth/login', { email, password }), // PUBLIC

  register: (userData: any) =>
    publicApi.post('/auth/register', userData), // PUBLIC

  checkCoordinatorExists: () =>
    publicApi.get('/auth/check-coordinator'), // PUBLIC - ✅ NUEVO MÉTODO

  refreshToken: () =>
    api.post('/auth/refresh'), // Protected

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }), // Protected
};

// Users endpoints
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/password', data),
  getUsersByRole: (role: string) => api.get(`/users/role/${role}`),
  activateUser: (userId: string) => api.put(`/users/${userId}/activate`),
  deactivateUser: (userId: string) => api.put(`/users/${userId}/deactivate`),
};

// Subjects endpoints
export const subjectsApi = {
  getAll: () => api.get('/materias'),
  getById: (id: string) => api.get(`/materias/${id}`),
  create: (data: any) => api.post('/materias', data),
  update: (id: string, data: any) => api.put(`/materias/${id}`, data),
  delete: (id: string) => api.delete(`/materias/${id}`),
  getByTeacher: (teacherId: string) => api.get(`/materias/teacher/${teacherId}`),
};

// Assignments endpoints
export const assignmentsApi = {
  getAll: () => api.get('/tareas'),
  getById: (id: string) => api.get(`/tareas/${id}`),
  create: (data: any) => api.post('/tareas', data),
  update: (id: string, data: any) => api.put(`/tareas/${id}`, data),
  delete: (id: string) => api.delete(`/tareas/${id}`),
  getBySubject: (subjectId: string) => api.get(`/tareas/subject/${subjectId}`),
  getByStudent: (studentId: string) => api.get(`/tareas/student/${studentId}`),
  submit: (assignmentId: string, data: any) => api.post(`/tareas/${assignmentId}/submit`, data),
  grade: (submissionId: string, grade: number, feedback?: string) =>
    api.put(`/tareas/submissions/${submissionId}/grade`, { grade, feedback }),
};

// Grades endpoints
export const gradesApi = {
  getByStudent: (studentId: string) => api.get(`/notas/student/${studentId}`),
  getBySubject: (subjectId: string) => api.get(`/notas/subject/${subjectId}`),
  getAverageByPeriod: (studentId: string, period: string) =>
    api.get(`/notas/student/${studentId}/period/${period}/average`),
  getComparative: (studentId: string) => api.get(`/notas/student/${studentId}/comparative`),
};

// Files endpoints
export const filesApi = {
  upload: (file: FormData) =>
    api.post('/api/files/upload', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (filePath: string) => api.get(`/api/files/download/${filePath}`),
  delete: (folder: string, fileName: string) => api.delete(`/api/files/delete/${folder}/${fileName}`),
};

// Activities endpoints
export const activitiesApi = {
  getAll: () => api.get('/actividades'),
  getById: (id: string) => api.get(`/actividades/${id}`),
  create: (data: any) => api.post('/actividades', data),
  solve: (activityId: string, answers: any) =>
    api.post(`/actividades/${activityId}/solve`, { answers }),
};

// Reports endpoints
export const reportsApi = {
  getStudentsByGrade: () => api.get('/reportes/students-by-grade'),
  getAveragesBySubject: () => api.get('/reportes/averages-by-subject'),
  getTeacherStats: () => api.get('/reportes/teacher-stats'),
  getInstitutionStats: (institutionId: string) =>
    api.get(`/reportes/institution/${institutionId}`),
  getGlobalStats: () => api.get('/reportes/global'),
  exportReport: (type: string, params: any) =>
    api.post(`/reportes/export/${type}`, params, { responseType: 'blob' }),

  // New coordinator reporting endpoints
  generateSubjectPerformanceReport: (request: any) =>
    api.post('/coordinator/reports/subject-performance', request),

  generateTeacherActivityReport: (request: any) =>
    api.post('/coordinator/reports/teacher-activity', request),

  generateStudentParticipationReport: (request: any) =>
    api.post('/coordinator/reports/student-participation', request),

  exportSubjectPerformanceToExcel: (request: any) =>
    api.post('/coordinator/export/subject-performance', request, { responseType: 'blob' }),

  exportTeacherActivityToExcel: (request: any) =>
    api.post('/coordinator/export/teacher-activity', request, { responseType: 'blob' }),

  exportStudentParticipationToExcel: (request: any) =>
    api.post('/coordinator/export/student-participation', request, { responseType: 'blob' }),
};

// School Grades endpoints (PUBLIC - no auth required)
export const schoolGradesApi = {
  getAll: () => publicApi.get('/school-grades'),
  initialize: () => publicApi.post('/school-grades/initialize'),
  test: () => publicApi.get('/school-grades/test'),
  health: () => publicApi.get('/school-grades/health'),
  diagnostic: () => publicApi.get('/school-grades/diagnostic'),
  assignToUsers: () => publicApi.post('/school-grades/assign-to-users'),
  getById: (id: string) => api.get(`/school-grades/${id}`), // Protected
  create: (data: any) => api.post('/school-grades', data), // Protected
  update: (id: string, data: any) => api.put(`/school-grades/${id}`, data), // Protected
  delete: (id: string) => api.delete(`/school-grades/${id}`), // Protected
};

// Student Validation endpoints (PUBLIC - no auth required)
export const studentValidationApi = {
  validateStudent: (email: string) => publicApi.get(`/student-validation/validate-student?email=${encodeURIComponent(email)}`),
};

// Institution endpoints (PUBLIC - no auth required)
export const institutionApi = {
  getAll: () => publicApi.get('/institutions'),
  validateNit: (nit: string) => publicApi.get(`/institutions/validate-nit?nit=${encodeURIComponent(nit)}`),
  getById: (id: string) => api.get(`/institutions/${id}`), // Protected
  create: (data: any) => api.post('/institutions', data), // Protected
  update: (id: string, data: any) => api.put(`/institutions/${id}`, data), // Protected
};

// Calendar endpoints
export const calendarApi = {
  getEvents: (startDate: string, endDate: string) =>
    api.get(`/calendario/events?start=${startDate}&end=${endDate}`),
  createEvent: (data: any) => api.post('/calendario/events', data),
  updateEvent: (id: string, data: any) => api.put(`/calendario/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/calendario/events/${id}`),
};

export default api;

// Coordinator API functions - CONECTADO CON BACKEND REAL
export const coordinatorApi = {
  // Dashboard y estadísticas
  getDashboard: (institutionId: number) =>
    api.get(`/coordinator/dashboard?institutionId=${institutionId}`),

  getStats: (institutionId: number) =>
    api.get(`/coordinator/stats?institutionId=${institutionId}`),

  // Usuarios - Usando endpoints reales del backend
  getTeachers: async (institutionId: number, limit = 100) => {
    try {
      // Usar el endpoint de multi-institution que ya existe
      const response = await api.get(`/multi-institution/users/${institutionId}`);
      const teachers = response.data.users?.teachers || [];
      console.log(`✅ Profesores cargados: ${teachers.length}`);
      return { data: teachers.slice(0, limit) };
    } catch (error) {
      console.error('❌ Error cargando profesores:', error);
      return { data: [] };
    }
  },

  getStudents: async (institutionId: number, limit = 100) => {
    try {
      // Usar el endpoint de multi-institution que ya existe
      const response = await api.get(`/multi-institution/users/${institutionId}`);
      const students = response.data.users?.students || [];
      console.log(`✅ Estudiantes cargados: ${students.length}`);
      return { data: students.slice(0, limit) };
    } catch (error) {
      console.error('❌ Error cargando estudiantes:', error);
      return { data: [] };
    }
  },

  // Materias - Usando endpoints reales
  getSubjects: async (institutionId: number) => {
    try {
      const response = await api.get(`/subjects/institution/${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error cargando materias:', error);
      return { success: false, subjects: [], total: 0 };
    }
  },

  getSubjectStats: async (institutionId: number) => {
    try {
      const response = await api.get(`/subjects/stats/institution/${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error cargando estadísticas de materias:', error);
      return { success: false };
    }
  },

  assignTeacherToSubject: async (subjectId: number, teacherId: number) => {
    try {
      const response = await api.put(`/subjects/${subjectId}/assign-teacher`, { teacherId });
      return response.data;
    } catch (error) {
      console.error('❌ Error asignando profesor a materia:', error);
      throw error;
    }
  },

  // Rendimiento y actividades
  getSubjectPerformance: (institutionId: number) =>
    api.get(`/coordinator/subjects/performance?institutionId=${institutionId}`),

  getRecentActivities: (institutionId: number, limit = 20) =>
    api.get(`/coordinator/activities/recent?institutionId=${institutionId}&limit=${limit}`),

  // Gestión de usuarios
  createTeacher: async (data: any) => {
    try {
      // Crear usuario con rol TEACHER
      const userData = {
        ...data,
        role: 'TEACHER',
        isActive: true
      };
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando profesor:', error);
      throw error;
    }
  },

  updateTeacher: async (id: number, data: any) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando profesor:', error);
      throw error;
    }
  },

  deleteTeacher: async (id: number) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando profesor:', error);
      throw error;
    }
  },

  createStudent: async (data: any) => {
    try {
      // Crear usuario con rol STUDENT
      const userData = {
        ...data,
        role: 'STUDENT',
        isActive: true
      };
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando estudiante:', error);
      throw error;
    }
  },

  updateStudent: async (id: number, data: any) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando estudiante:', error);
      throw error;
    }
  },

  deleteStudent: async (id: number) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando estudiante:', error);
      throw error;
    }
  },

  // Reportes
  generateReport: (type: string, institutionId: number, startDate?: string, endDate?: string) =>
    api.get(`/coordinator/reports/${type}?institutionId=${institutionId}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`),

  exportTeachers: (institutionId: number) =>
    api.get(`/coordinator/export/teachers?institutionId=${institutionId}`, { responseType: 'blob' }),

  exportStudents: (institutionId: number) =>
    api.get(`/coordinator/export/students?institutionId=${institutionId}`, { responseType: 'blob' }),

  // Generación de datos masivos (desarrollo)
  generateMassiveData: (data: any) =>
    api.post('/coordinator/generate-data', data),

  // ==================== DETALLES DE PROFESORES ====================
  getTeacherStats: async (teacherId: number) => {
    try {
      const response = await api.get(`/coordinator/teachers/${teacherId}/stats`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del profesor:', error);
      throw error;
    }
  },

  getTeacherSubjects: async (teacherId: number) => {
    try {
      const response = await api.get(`/coordinator/teachers/${teacherId}/subjects`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo materias del profesor:', error);
      throw error;
    }
  },

  // ==================== DETALLES DE ESTUDIANTES ====================
  getStudentStats: async (studentId: number) => {
    try {
      const response = await api.get(`/coordinator/students/${studentId}/stats`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del estudiante:', error);
      throw error;
    }
  },

  getStudentTasks: async (studentId: number, status?: string) => {
    try {
      const url = `/coordinator/students/${studentId}/tasks${status ? `?status=${status}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo tareas del estudiante:', error);
      throw error;
    }
  },

  getStudentGrades: async (studentId: number, limit = 10) => {
    try {
      const response = await api.get(`/coordinator/students/${studentId}/grades?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo notas del estudiante:', error);
      throw error;
    }
  },

  // ==================== MONITOREO DE MATERIAS ====================
  getSubjectDetails: async (subjectId: number) => {
    try {
      const response = await api.get(`/coordinator/subjects/${subjectId}/details`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo detalles de la materia:', error);
      throw error;
    }
  },

  compareSubjects: async (institutionId: number) => {
    try {
      const response = await api.get(`/coordinator/subjects/comparison?institutionId=${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error comparando materias:', error);
      throw error;
    }
  },

  // ==================== MONITOREO DE GRADOS ====================
  getGradeStats: async (grade: string) => {
    try {
      const response = await api.get(`/coordinator/grades/${encodeURIComponent(grade)}/stats`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del grado:', error);
      throw error;
    }
  },

  compareGrades: async (institutionId: number) => {
    try {
      const response = await api.get(`/coordinator/grades/comparison?institutionId=${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error comparando grados:', error);
      throw error;
    }
  },

  // ==================== REPORTES AVANZADOS ====================
  getInstitutionalPerformance: async (institutionId: number) => {
    try {
      const response = await api.get(`/coordinator/reports/institutional-performance?institutionId=${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo rendimiento institucional:', error);
      throw error;
    }
  },

  getTeacherActivity: async (institutionId: number) => {
    try {
      const response = await api.get(`/coordinator/reports/teacher-activity?institutionId=${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo actividad de profesores:', error);
      throw error;
    }
  },

  getStudentParticipation: async (institutionId: number) => {
    try {
      const response = await api.get(`/coordinator/reports/student-participation?institutionId=${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo participación estudiantil:', error);
      throw error;
    }
  },

  // ==================== GESTIÓN DE ESTUDIANTES Y GRADOS ====================
  assignStudentsToGrade: async (studentIds: number[], schoolGradeId: number) => {
    try {
      const response = await api.post('/coordinator/students/assign-grade', {
        studentIds,
        schoolGradeId
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error asignando estudiantes a grado:', error);
      throw error;
    }
  },

  getStudentsWithoutGrade: async (institutionId: number) => {
    try {
      const response = await api.get(`/coordinator/students/without-grade?institutionId=${institutionId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo estudiantes sin grado:', error);
      throw error;
    }
  },

  // ==================== GESTIÓN DE MATERIAS ====================
  createSubject: async (subjectData: {
    name: string;
    description?: string;
    color: string;
    schoolGradeId: number;
    institutionId: number;
    isActive?: boolean;
  }) => {
    try {
      const response = await api.post('/coordinator/subjects', subjectData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando materia:', error);
      throw error;
    }
  }
};

// Unified Task API functions
export const unifiedTaskApi = {
  getAllTasks: () =>
    api.get('/tasks/unified'),

  getStudentTasks: (studentId: number) =>
    api.get(`/tasks/unified/student/${studentId}`),

  getTeacherTasks: (teacherId: number) =>
    api.get(`/tasks/unified/teacher/${teacherId}`),

  filterTasks: (filters: any) =>
    api.post('/tasks/unified/filter', filters)
};

// Parent API functions
export const parentApi = {
  getDashboardStats: () =>
    api.get('/parent/stats'),

  getChildren: () =>
    api.get('/parent/children'),

  getUpcomingEvents: () =>
    api.get('/parent/events'),

  getChildProgress: (childId: number) =>
    api.get(`/parent/children/${childId}/progress`),

  getChildGrades: (childId: number) =>
    api.get(`/parent/children/${childId}/grades`),

  getChildTasks: (childId: number) =>
    api.get(`/parent/children/${childId}/tasks`),

  sendMessageToTeacher: (teacherId: number, message: any) =>
    api.post(`/parent/messages/teacher/${teacherId}`, message),

  scheduleParentMeeting: (teacherId: number, meetingData: any) =>
    api.post(`/parent/meetings/teacher/${teacherId}`, meetingData)
};

// Teacher Grades API functions
export const teacherGradesApi = {
  assignTeacherToGrade: (data: {
    teacherId: number;
    gradeLevel: number;
    section: string;
    institutionId: number;
    academicYear?: string;
  }) => api.post('/teacher-grades', data),

  getTeacherGrades: (teacherId: number) =>
    api.get(`/teacher-grades/teacher/${teacherId}`),

  getGradesByInstitution: (institutionId: number) =>
    api.get(`/teacher-grades/institution/${institutionId}`),

  getGradesByLevel: (gradeLevel: number, institutionId: number) =>
    api.get(`/teacher-grades/level?gradeLevel=${gradeLevel}&institutionId=${institutionId}`),

  updateTeacherGrade: (teacherGradeId: number, data: any) =>
    api.put(`/teacher-grades/${teacherGradeId}`, data),

  removeTeacherFromGrade: (teacherGradeId: number) =>
    api.delete(`/teacher-grades/${teacherGradeId}`)
};

// Multi-Institution API functions
export const multiInstitutionApi = {
  getInstitutionStats: (institutionId: number) =>
    api.get(`/multi-institution/stats/${institutionId}`),

  getInstitutionUsers: (institutionId: number) =>
    api.get(`/multi-institution/users/${institutionId}`),

  getMyInstitutions: () =>
    api.get('/multi-institution/my-institutions'),

  assignUserToInstitution: (data: {
    userId: number;
    institutionId: number;
    role: string;
  }) => api.post('/multi-institution/assign', data)
};

// Teacher API functions
export const teacherApi = {
  // Dashboard
  getDashboardStats: () =>
    api.get('/teacher/dashboard/stats'),

  // Subjects
  getSubjects: () =>
    api.get('/teacher/subjects'),

  getSubjectById: (subjectId: number) =>
    api.get(`/teacher/subjects/${subjectId}`),

  getTasksBySubjectAndGrade: (subjectId: number, grade: string) =>
    api.get(`/teacher/subjects/${subjectId}/tasks?grade=${encodeURIComponent(grade)}`),

  // Tasks
  getTasks: () =>
    api.get('/teacher/tasks/overview'),

  createTask: (taskData: any) =>
    api.post('/teacher/tasks/template', taskData),

  deleteTask: (taskId: number) =>
    api.delete(`/teacher/subjects/tasks/${taskId}`),

  // Submissions & Grading
  getGradingTasks: (subjectId: number, grade: string) =>
    api.get(`/teacher/grades?subjectId=${subjectId}&grade=${encodeURIComponent(grade)}`),

  gradeTask: (taskId: number, gradeData: any) =>
    api.put(`/teacher/tasks/${taskId}/grade`, gradeData),

  updateSubmissionGrade: (submissionId: number, gradeData: { score?: number; feedback?: string }) =>
    api.put(`/teacher/submissions/${submissionId}/grade`, gradeData),

  // Students
  getStudentsByGrade: (grade: string) =>
    api.get(`/teacher/students?grade=${encodeURIComponent(grade)}`),

  // Test data initialization (development only)
  initTestSubjects: () =>
    api.post('/teacher/init-test-subjects')
};