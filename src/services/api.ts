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
    api.post('/archivos/upload', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  download: (fileId: string) => api.get(`/archivos/${fileId}`),
  delete: (fileId: string) => api.delete(`/archivos/${fileId}`),
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

// Coordinator API functions
export const coordinatorApi = {
  getDashboard: (institutionId: number) => 
    api.get(`/coordinator/dashboard?institutionId=${institutionId}`),
  
  getStats: (institutionId: number) => 
    api.get(`/coordinator/stats?institutionId=${institutionId}`),
  
  getTeachers: async (institutionId: number, limit = 10) => {
    const response = await api.get(`/multi-institution/users/${institutionId}`);
    return { data: response.data.users?.teachers || [] };
  },
  
  getStudents: async (institutionId: number, limit = 10) => {
    const response = await api.get(`/multi-institution/users/${institutionId}`);
    return { data: response.data.users?.students || [] };
  },
  
  getSubjectPerformance: (institutionId: number) => 
    api.get(`/coordinator/subjects/performance?institutionId=${institutionId}`),
  
  getRecentActivities: (institutionId: number, limit = 20) => 
    api.get(`/coordinator/activities/recent?institutionId=${institutionId}&limit=${limit}`),
  
  generateMassiveData: (data: any) => 
    api.post('/coordinator/generate-data', data),
  
  createTeacher: (data: any) => 
    api.post('/coordinator/teachers', data),
  
  updateTeacher: (id: number, data: any) => 
    api.put(`/coordinator/teachers/${id}`, data),
  
  deleteTeacher: (id: number) => 
    api.delete(`/coordinator/teachers/${id}`),
  
  createStudent: (data: any) => 
    api.post('/coordinator/students', data),
  
  updateStudent: (id: number, data: any) => 
    api.put(`/coordinator/students/${id}`, data),
  
  deleteStudent: (id: number) => 
    api.delete(`/coordinator/students/${id}`),
  
  generateReport: (type: string, institutionId: number, startDate?: string, endDate?: string) => 
    api.get(`/coordinator/reports/${type}?institutionId=${institutionId}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`),
  
  exportTeachers: (institutionId: number) => 
    api.get(`/coordinator/export/teachers?institutionId=${institutionId}`, { responseType: 'blob' }),
  
  exportStudents: (institutionId: number) => 
    api.get(`/coordinator/export/students?institutionId=${institutionId}`, { responseType: 'blob' })
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