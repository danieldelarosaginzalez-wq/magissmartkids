import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { 
  Users, 
  School, 
  BarChart3, 
  Settings, 
  Plus,
  AlertCircle,
  RefreshCw,
  Database,
  Shield,
  Activity,
  AlertTriangle,
  Crown,
  UserCheck,
  Building,
  PieChart,
  BarChart,
  Zap,
  Server,
  HardDrive,
  Wifi,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

import { translateRole, getRoleIcon } from '../../utils/roleTranslations';
import { useAuthStore } from '../../stores/authStore';
import adminApi from '../../services/adminApi';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface AdminStats {
  totalUsers: number;
  totalInstitutions: number;
  totalStudents: number;
  totalTeachers: number;
  totalCoordinators: number;
  totalParents: number;
  activeInstitutions: number;
  systemUptime: string;
  databaseSize: string;
  monthlyGrowth: string;
  activeSessions: number;
  pendingApprovals: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  loading: boolean;
}

interface InstitutionData {
  id: string;
  name: string;
  address: string;
  students: number;
  teachers: number;
  coordinators: number;
  avgGrade: number;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  subscriptionTier: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  institutionName?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  activeConnections: number;
  responseTime: number;
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'institution_added' | 'system_update' | 'report_generated';
  message: string;
  time: string;
  timestamp: Date;
}

interface InstitutionStat {
  id: string;
  name: string;
  students: number;
  teachers: number;
  avgGrade: number;
  status: 'active' | 'warning' | 'inactive';
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInstitutions: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCoordinators: 0,
    totalParents: 0,
    activeInstitutions: 0,
    systemUptime: '0%',
    databaseSize: '0 GB',
    monthlyGrowth: '+0%',
    activeSessions: 0,
    pendingApprovals: 0,
    systemHealth: 'good',
    loading: true
  });

  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkTraffic: 0,
    activeConnections: 0,
    responseTime: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [institutionStats, setInstitutionStats] = useState<InstitutionStat[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');

  useEffect(() => {
    loadAdminData();
    const interval = setInterval(loadSystemMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAdminData = async () => {
    try {
      console.log('🚀 Loading admin data with example data...');
      
      // Simular loading
      setStats(prev => ({ ...prev, loading: true }));
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ DATOS DE EJEMPLO REALISTAS
      setStats({
        totalUsers: 1247,
        totalInstitutions: 23,
        totalStudents: 892,
        totalTeachers: 156,
        totalCoordinators: 34,
        totalParents: 165,
        activeInstitutions: 21,
        systemUptime: '99.8%',
        databaseSize: '4.2 GB',
        monthlyGrowth: '+18.5%',
        activeSessions: 342,
        pendingApprovals: 12,
        systemHealth: 'excellent',
        loading: false
      });

      // ✅ USUARIOS RECIENTES DE EJEMPLO
      setRecentUsers([
        {
          name: 'María González',
          email: 'maria.gonzalez@colegio.edu.co',
          role: 'student',
          joinDate: '2025-10-22T10:30:00',
          institution: 'Colegio San José'
        },
        {
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@escuela.edu.co',
          role: 'teacher',
          joinDate: '2025-10-21T14:15:00',
          institution: 'Escuela Nueva Esperanza'
        },
        {
          name: 'Ana Martínez',
          email: 'ana.martinez@instituto.edu.co',
          role: 'coordinator',
          joinDate: '2025-10-20T09:45:00',
          institution: 'Instituto Técnico'
        },
        {
          name: 'Luis Pérez',
          email: 'luis.perez@gmail.com',
          role: 'parent',
          joinDate: '2025-10-19T16:20:00',
          institution: 'Colegio Central'
        },
        {
          name: 'Sofia Ramírez',
          email: 'sofia.ramirez@estudiante.edu.co',
          role: 'student',
          joinDate: '2025-10-18T11:10:00',
          institution: 'Liceo Moderno'
        }
      ]);
      
      // ✅ INSTITUCIONES DE EJEMPLO
      setInstitutions([
        {
          id: '1',
          name: 'Colegio San José',
          address: 'Calle 123 #45-67, Bogotá',
          students: 245,
          teachers: 28,
          coordinators: 4,
          avgGrade: 4.2,
          status: 'active',
          createdAt: '2024-01-15',
          subscriptionTier: 'Premium'
        },
        {
          id: '2',
          name: 'Escuela Nueva Esperanza',
          address: 'Carrera 45 #12-34, Medellín',
          students: 189,
          teachers: 22,
          coordinators: 3,
          avgGrade: 4.0,
          status: 'active',
          createdAt: '2024-02-20',
          subscriptionTier: 'Standard'
        },
        {
          id: '3',
          name: 'Instituto Técnico Industrial',
          address: 'Avenida 68 #89-12, Cali',
          students: 312,
          teachers: 35,
          coordinators: 6,
          avgGrade: 3.8,
          status: 'active',
          createdAt: '2023-11-10',
          subscriptionTier: 'Enterprise'
        },
        {
          id: '4',
          name: 'Colegio Central',
          address: 'Plaza Central #1-23, Barranquilla',
          students: 156,
          teachers: 18,
          coordinators: 2,
          avgGrade: 4.1,
          status: 'active',
          createdAt: '2024-03-05',
          subscriptionTier: 'Standard'
        }
      ]);
      
      // ✅ USUARIOS DE EJEMPLO
      setUsers([
        {
          id: '1',
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@colegio.edu.co',
          role: 'student',
          institutionName: 'Colegio San José',
          status: 'active',
          createdAt: '2025-10-22T10:30:00',
          lastLogin: '2025-10-23T08:15:00'
        },
        {
          id: '2',
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          email: 'carlos.rodriguez@escuela.edu.co',
          role: 'teacher',
          institutionName: 'Escuela Nueva Esperanza',
          status: 'active',
          createdAt: '2025-10-21T14:15:00',
          lastLogin: '2025-10-23T07:45:00'
        },
        {
          id: '3',
          firstName: 'Ana',
          lastName: 'Martínez',
          email: 'ana.martinez@instituto.edu.co',
          role: 'coordinator',
          institutionName: 'Instituto Técnico',
          status: 'active',
          createdAt: '2025-10-20T09:45:00',
          lastLogin: '2025-10-23T09:30:00'
        }
      ]);
      
      // ✅ MÉTRICAS DEL SISTEMA DE EJEMPLO
      setSystemMetrics({
        cpuUsage: 42,
        memoryUsage: 68,
        diskUsage: 75,
        networkTraffic: 125,
        activeConnections: 342,
        responseTime: 89
      });
      
      console.log('✅ Admin data loaded with example data!');
      
    } catch (error) {
      console.error('❌ Error loading admin data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const loadStats = async () => {
    // Esta función ahora es manejada por loadAdminData()
    console.log('📊 Stats loading handled by loadAdminData()');
  };

  const loadInstitutions = async () => {
    // Esta función ahora es manejada por loadAdminData()
    console.log('🏛️ Institutions loading handled by loadAdminData()');
  };

  const loadUsers = async () => {
    // Esta función ahora es manejada por loadAdminData()
    console.log('👥 Users loading handled by loadAdminData()');
  };

  const loadSystemMetrics = async () => {
    // Esta función ahora es manejada por loadAdminData()
    console.log('🖥️ System metrics loading handled by loadAdminData()');
  };

  const loadRecentActivity = async () => {
    try {
      setLoadingActivity(true);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // ✅ ACTIVIDADES RECIENTES DE EJEMPLO
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'user_created',
          message: 'Nuevo estudiante registrado: María González',
          time: 'Hace 5 minutos',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: '2',
          type: 'institution_added',
          message: 'Nueva institución agregada: Colegio Futuro',
          time: 'Hace 1 hora',
          timestamp: new Date(Date.now() - 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'system_update',
          message: 'Actualización del sistema completada',
          time: 'Hace 2 horas',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '4',
          type: 'report_generated',
          message: 'Reporte mensual generado automáticamente',
          time: 'Hace 3 horas',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        {
          id: '5',
          type: 'user_created',
          message: 'Nuevo profesor registrado: Carlos Rodríguez',
          time: 'Hace 4 horas',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ];
      
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
      setRecentActivity([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  const loadInstitutionStats = async () => {
    try {
      // ✅ ESTADÍSTICAS DE INSTITUCIONES DE EJEMPLO
      const institutionStats: InstitutionStat[] = [
        {
          id: '1',
          name: 'Colegio San José',
          students: 245,
          teachers: 28,
          avgGrade: 4.2,
          status: 'active'
        },
        {
          id: '2',
          name: 'Escuela Nueva Esperanza',
          students: 189,
          teachers: 22,
          avgGrade: 4.0,
          status: 'active'
        },
        {
          id: '3',
          name: 'Instituto Técnico Industrial',
          students: 312,
          teachers: 35,
          avgGrade: 3.8,
          status: 'warning'
        },
        {
          id: '4',
          name: 'Colegio Central',
          students: 156,
          teachers: 18,
          avgGrade: 4.1,
          status: 'active'
        }
      ];
      
      setInstitutionStats(institutionStats);
    } catch (error) {
      console.error('Error loading institution stats:', error);
      setInstitutionStats([]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Activo</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactivo</Badge>;
      case 'warning':
        return <Badge variant="warning">Atención</Badge>;
      case 'pending':
        return <Badge variant="warning">Pendiente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspendido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'institution_added':
        return <School className="w-4 h-4 text-green-600" />;
      case 'system_update':
        return <Settings className="w-4 h-4 text-purple-600" />;
      case 'report_generated':
        return <BarChart3 className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesInstitution = selectedInstitution === 'all' || user.institutionName === selectedInstitution;

    return matchesSearch && matchesRole && matchesInstitution;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                Panel de Administración Completo
              </h1>
              <p className="text-gray-600">
                Control total del sistema Altius Academy - {stats.totalInstitutions} instituciones, {stats.totalUsers} usuarios
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={loadAdminData}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                <Settings className="w-4 h-4 mr-2" />
                Configuración Global
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Alert */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {stats.systemHealth === 'critical' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Alerta Crítica del Sistema</p>
                  <p className="text-sm text-red-700">Se requiere atención inmediata del administrador</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Institution Info */}
      {user?.institution ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                  <School className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-black">
                    {user.institution.name}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary flex items-center gap-2">
                    <span>{getRoleIcon(user.role)}</span>
                    <span>{translateRole(user.role)}</span>
                  </p>
                  {user.institution.address && (
                    <p className="text-xs sm:text-sm text-secondary mt-1">
                      📍 {user.institution.address}
                    </p>
                  )}
                </div>
                {stats.pendingApprovals > 0 && (
                  <Badge variant="warning" className="text-xs">
                    {stats.pendingApprovals} pendientes
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <Card className="border-accent-yellow/30 bg-accent-yellow/5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-accent-yellow" />
                <div>
                  <p className="font-medium text-neutral-black">Sin institución asignada</p>
                  <p className="text-sm text-secondary">Contacta al administrador del sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="institutions" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Instituciones
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Actividad
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                      {stats.loading ? (
                        <div className="animate-pulse">
                          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
                          <p className="text-sm text-green-600 mt-1">{stats.monthlyGrowth} este mes</p>
                        </>
                      )}
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Instituciones</p>
                      {stats.loading ? (
                        <div className="animate-pulse">
                          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-green-600">{stats.totalInstitutions}</p>
                          <p className="text-sm text-gray-600 mt-1">{stats.activeInstitutions} activas</p>
                        </>
                      )}
                    </div>
                    <School className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                      {stats.loading ? (
                        <div className="animate-pulse">
                          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-purple-600">{stats.totalStudents.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-1">Sistema educativo</p>
                        </>
                      )}
                    </div>
                    <UserCheck className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
                      <p className={`text-2xl font-bold ${getHealthColor(stats.systemHealth)}`}>
                        {stats.systemUptime}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Uptime</p>
                    </div>
                    <Server className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Profesores</p>
                      <p className="text-xl font-semibold">{stats.totalTeachers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Coordinadores</p>
                      <p className="text-xl font-semibold">{stats.totalCoordinators}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Padres</p>
                      <p className="text-xl font-semibold">{stats.totalParents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Activity className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sesiones Activas</p>
                      <p className="text-xl font-semibold">{stats.activeSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center gap-2" variant="outline">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Nueva Institución</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center gap-2" variant="outline">
                    <Users className="w-6 h-6" />
                    <span className="text-sm">Gestionar Usuarios</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center gap-2" variant="outline">
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-sm">Ver Reportes</span>
                  </Button>
                  <Button className="h-20 flex flex-col items-center gap-2" variant="outline">
                    <Shield className="w-6 h-6" />
                    <span className="text-sm">Monitoreo</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ✅ USUARIOS RECIENTES CON DATOS REALES */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Usuarios Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentUsers.length > 0 ? (
                  <div className="space-y-3">
                    {recentUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            {user.institution && (
                              <div className="text-xs text-gray-500">{user.institution}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            user.role === 'student' ? 'default' :
                            user.role === 'teacher' ? 'success' :
                            user.role === 'coordinator' ? 'warning' :
                            'secondary'
                          }>
                            {translateRole(user.role)}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay usuarios recientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutions Tab */}
          <TabsContent value="institutions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Gestión de Instituciones
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Institución
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Institución</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Ubicación</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Estudiantes</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Personal</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Promedio</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutions.map((institution) => (
                        <tr key={institution.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{institution.name}</p>
                              <p className="text-sm text-gray-500">{institution.subscriptionTier}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{institution.address}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <Badge variant="secondary">{institution.students}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm">
                              <p>{institution.teachers} profesores</p>
                              <p>{institution.coordinators} coordinadores</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={institution.avgGrade >= 4.0 ? 'success' : institution.avgGrade >= 3.0 ? 'warning' : 'destructive'}>
                              {institution.avgGrade.toFixed(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(institution.status)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Gestión de Usuarios Global
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <option value="all">Todos los roles</option>
                    <option value="student">Estudiantes</option>
                    <option value="teacher">Profesores</option>
                    <option value="coordinator">Coordinadores</option>
                    <option value="parent">Padres</option>
                    <option value="admin">Administradores</option>
                  </Select>
                  <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                    <option value="all">Todas las instituciones</option>
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.name}>{inst.name}</option>
                    ))}
                  </Select>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Rol</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Institución</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Último Acceso</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="secondary">{translateRole(user.role)}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm">{user.institutionName || 'Sin institución'}</span>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Crecimiento de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Line
                      data={{
                        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                        datasets: [{
                          label: 'Usuarios',
                          data: [
                            872,  // Enero
                            945,  // Febrero  
                            1023, // Marzo
                            1156, // Abril
                            1198, // Mayo
                            1247  // Junio (actual)
                          ],
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Distribución por Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie
                      data={{
                        labels: ['Estudiantes', 'Profesores', 'Coordinadores', 'Padres'],
                        datasets: [{
                          data: [
                            stats.totalStudents,
                            stats.totalTeachers,
                            stats.totalCoordinators,
                            stats.totalParents
                          ],
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(139, 92, 246, 0.8)'
                          ],
                          borderColor: [
                            'rgb(59, 130, 246)',
                            'rgb(16, 185, 129)',
                            'rgb(245, 158, 11)',
                            'rgb(139, 92, 246)'
                          ],
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ✅ REPORTES Y ESTADÍSTICAS ADICIONALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Instituciones por Región</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bogotá</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm font-medium">15</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Medellín</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="text-sm font-medium">8</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Otras</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <span className="text-sm font-medium">5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actividad Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nuevos Registros</span>
                      <span className="text-sm font-medium text-green-600">+49</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tareas Creadas</span>
                      <span className="text-sm font-medium text-blue-600">+156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Calificaciones</span>
                      <span className="text-sm font-medium text-purple-600">+342</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reportes Generados</span>
                      <span className="text-sm font-medium text-orange-600">+23</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rendimiento Académico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">4.1</div>
                      <div className="text-sm text-gray-600">Promedio General</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-blue-600">78%</div>
                        <div className="text-xs text-gray-600">Aprobación</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-purple-600">92%</div>
                        <div className="text-xs text-gray-600">Asistencia</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Server className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">CPU</p>
                      <p className="text-2xl font-bold text-blue-600">{systemMetrics.cpuUsage}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${systemMetrics.cpuUsage}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <HardDrive className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Memoria</p>
                      <p className="text-2xl font-bold text-green-600">{systemMetrics.memoryUsage}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${systemMetrics.memoryUsage}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Database className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Disco</p>
                      <p className="text-2xl font-bold text-purple-600">{systemMetrics.diskUsage}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${systemMetrics.diskUsage}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Wifi className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Red</p>
                      <p className="text-2xl font-bold text-orange-600">{systemMetrics.networkTraffic} MB/s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Activity className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Conexiones</p>
                      <p className="text-2xl font-bold text-red-600">{systemMetrics.activeConnections}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">Respuesta</p>
                      <p className="text-2xl font-bold text-yellow-600">{systemMetrics.responseTime}ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-secondary-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
                    <div className="p-1 bg-primary/10 rounded">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span>Actividad Reciente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loadingActivity ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                          <div className="w-8 h-8 bg-secondary-200 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                            <div className="h-3 bg-secondary-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                        <div className="p-1 bg-neutral-white rounded">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-neutral-black">{activity.message}</p>
                          <p className="text-xs text-secondary mt-1">Hace {activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <Button
                    className="w-full border-secondary-300 text-secondary hover:bg-secondary-50"
                    variant="outline"
                  >
                    Ver Actividad Completa
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-secondary-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
                    <div className="p-1 bg-primary/10 rounded">
                      <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <span>Acciones Rápidas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3">
                  <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Gestionar Usuarios
                  </Button>
                  <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
                    <School className="w-4 h-4 mr-2" />
                    Administrar Instituciones
                  </Button>
                  <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generar Reportes
                  </Button>
                  <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Monitoreo del Sistema
                  </Button>
                  <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Backup y Restauración
                  </Button>
                  <Button className="w-full justify-start border-secondary-300 text-secondary hover:bg-secondary-50" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Datos
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Institution Overview */}
            <Card className="border-secondary-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
                  <div className="p-1 bg-accent-green/10 rounded">
                    <School className="w-4 h-4 sm:w-5 sm:h-5 text-accent-green" />
                  </div>
                  <span>Resumen de Instituciones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary-200">
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Institución</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Estudiantes</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Profesores</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Promedio</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Estado</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-secondary text-sm">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {institutionStats.map((institution) => (
                        <tr key={institution.id} className="border-b border-secondary-100 hover:bg-secondary-50 transition-colors">
                          <td className="py-3 px-2 sm:px-4">
                            <div className="font-medium text-neutral-black text-sm">{institution.name}</div>
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-secondary text-sm">{institution.students}</td>
                          <td className="py-3 px-2 sm:px-4 text-secondary text-sm">{institution.teachers}</td>
                          <td className="py-3 px-2 sm:px-4">
                            <Badge
                              variant={
                                institution.avgGrade >= 4.0 ? 'success' :
                                institution.avgGrade >= 3.0 ? 'warning' :
                                'destructive'
                              }
                              className="text-xs"
                            >
                              {institution.avgGrade.toFixed(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            {getStatusBadge(institution.status)}
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-secondary-300 text-secondary hover:bg-secondary-50 text-xs"
                            >
                              Ver Detalles
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;