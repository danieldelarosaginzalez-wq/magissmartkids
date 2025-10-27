// 🚀 API Service para Admin Dashboard - DATOS REALES
// Conecta con los endpoints del backend que ya probamos

const API_BASE_URL = '/api/admin';

// Función helper para hacer requests con autenticación
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// 📊 Dashboard Stats - ENDPOINT PRINCIPAL
export const getDashboardStats = async () => {
  console.log('🚀 Fetching dashboard stats from /api/admin/dashboard/stats');
  return apiRequest('/dashboard/stats');
};

// 📈 Stats generales (endpoint original)
export const getAdminStats = async () => {
  console.log('📊 Fetching admin stats from /api/admin/stats');
  return apiRequest('/stats');
};

// 🏛️ Instituciones
export const getInstitutions = async () => {
  console.log('🏛️ Fetching institutions from /api/admin/institutions');
  return apiRequest('/institutions');
};

// 👥 Usuarios
export const getUsers = async () => {
  console.log('👥 Fetching users from /api/admin/users');
  return apiRequest('/users');
};

// 🖥️ Métricas del sistema
export const getSystemMetrics = async () => {
  console.log('🖥️ Fetching system metrics from /api/admin/system-metrics');
  return apiRequest('/system-metrics');
};

// 📋 Logs de auditoría
export const getAuditLogs = async (page = 0, size = 10) => {
  console.log(`📋 Fetching audit logs from /api/admin/audit-logs?page=${page}&size=${size}`);
  return apiRequest(`/audit-logs?page=${page}&size=${size}`);
};

// 🔍 Búsqueda de usuarios
export const searchUsers = async (params: {
  query?: string;
  role?: string;
  status?: string;
  institutionId?: number;
  page?: number;
  size?: number;
}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  console.log(`🔍 Searching users with params: ${searchParams.toString()}`);
  return apiRequest(`/users/search?${searchParams.toString()}`);
};

// 🔍 Búsqueda de instituciones
export const searchInstitutions = async (params: {
  query?: string;
  status?: string;
  page?: number;
  size?: number;
}) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  console.log(`🔍 Searching institutions with params: ${searchParams.toString()}`);
  return apiRequest(`/institutions/search?${searchParams.toString()}`);
};

// 🔄 Activación masiva de usuarios
export const bulkActivateUsers = async (userIds: number[]) => {
  console.log(`🔄 Bulk activating ${userIds.length} users`);
  return apiRequest('/users/bulk-activate', {
    method: 'POST',
    body: JSON.stringify({ userIds }),
  });
};

// 🔄 Desactivación masiva de usuarios
export const bulkDeactivateUsers = async (userIds: number[]) => {
  console.log(`🔄 Bulk deactivating ${userIds.length} users`);
  return apiRequest('/users/bulk-deactivate', {
    method: 'POST',
    body: JSON.stringify({ userIds }),
  });
};

// 📊 Función combinada para cargar todos los datos del dashboard
export const loadAllDashboardData = async () => {
  console.log('🚀 Loading ALL dashboard data from real APIs...');
  
  try {
    const [dashboardStats, institutions, users, systemMetrics] = await Promise.all([
      getDashboardStats(),
      getInstitutions(),
      getUsers(),
      getSystemMetrics(),
    ]);

    console.log('✅ All dashboard data loaded successfully!');
    console.log('📊 Dashboard Stats:', dashboardStats);
    console.log('🏛️ Institutions:', institutions.institutions?.length || 0);
    console.log('👥 Users:', users.users?.length || 0);
    console.log('🖥️ System Metrics:', systemMetrics);

    return {
      dashboardStats,
      institutions: institutions.institutions || [],
      users: users.users || [],
      systemMetrics,
    };
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getAdminStats,
  getInstitutions,
  getUsers,
  getSystemMetrics,
  getAuditLogs,
  searchUsers,
  searchInstitutions,
  bulkActivateUsers,
  bulkDeactivateUsers,
  loadAllDashboardData,
};