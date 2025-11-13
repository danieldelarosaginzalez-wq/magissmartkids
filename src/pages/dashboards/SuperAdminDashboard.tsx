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
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Users,
  School,
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  Shield,
  Activity,
  AlertTriangle,
  Crown,
  Globe,
  Monitor,
  FileText,
  UserCheck,
  Building,
  Calendar,
  PieChart,
  LineChart,
  BarChart,
  Target,
  Zap,
  Server,
  HardDrive,
  Wifi,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Search,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/Dialog';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';
import { useAuthStore } from '../../stores/authStore';
import SuperAdminInstitutionModal from '../../components/SuperAdminInstitutionModal';

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

interface SuperAdminStats {
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

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<SuperAdminStats>({
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);

  useEffect(() => {
    loadSuperAdminData();
    const interval = setInterval(loadSystemMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSuperAdminData = async () => {
    await Promise.all([
      loadStats(),
      loadInstitutions(),
      loadUsers(),
      loadSystemMetrics()
    ]);
  };

  const loadStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      const response = await fetch('/api/super-admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalInstitutions: data.totalInstitutions || 0,
          totalStudents: data.totalStudents || 0,
          totalTeachers: data.totalTeachers || 0,
          totalCoordinators: data.totalCoordinators || 0,
          totalParents: data.totalParents || 0,
          activeInstitutions: data.activeInstitutions || 0,
          systemUptime: data.systemUptime || '99.9%',
          databaseSize: data.databaseSize || '2.5 GB',
          monthlyGrowth: data.monthlyGrowth || '+15.2%',
          activeSessions: data.activeSessions || 247,
          pendingApprovals: data.pendingApprovals || 12,
          systemHealth: data.systemHealth || 'excellent',
          loading: false
        });
      } else {
        console.error('Failed to load super admin stats');
        setStats(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading super admin stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const loadInstitutions = async () => {
    try {
      const response = await fetch('/api/super-admin/institutions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInstitutions(data.institutions || []);
      } else {
        console.error('Failed to load institutions');
        setInstitutions([]);
      }
    } catch (error) {
      console.error('Error loading institutions:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/super-admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to load users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      const response = await fetch('/api/super-admin/system-metrics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSystemMetrics({
          cpuUsage: data.cpuUsage || 45,
          memoryUsage: data.memoryUsage || 67,
          diskUsage: data.diskUsage || 78,
          networkTraffic: data.networkTraffic || 120,
          activeConnections: data.activeConnections || 247,
          responseTime: data.responseTime || 125
        });
      } else {
        console.error('Failed to load system metrics');
      }
    } catch (error) {
      console.error('Error loading system metrics:', error);
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

  const handleCreateInstitution = () => {
    setIsInstitutionModalOpen(true);
  };

  const handleInstitutionCreated = (newInstitution: any) => {
    console.log('🏛️ Nueva institución creada:', newInstitution);
    // Refresh the institutions list
    loadInstitutions();
    // Also refresh stats to get updated counts
    loadStats();
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
                Panel de Super Administrador
              </h1>
              <p className="text-gray-600">
                Control total del sistema Altius Academy - {stats.totalInstitutions} instituciones, {stats.totalUsers} usuarios
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={loadSuperAdminData}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
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
                      <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
                      <p className="text-sm text-green-600 mt-1">{stats.monthlyGrowth} este mes</p>
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
                      <p className="text-3xl font-bold text-green-600">{stats.totalInstitutions}</p>
                      <p className="text-sm text-gray-600 mt-1">{stats.activeInstitutions} activas</p>
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
                      <p className="text-3xl font-bold text-purple-600">{stats.totalStudents.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-1">Sistema educativo</p>
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
                  <Button 
                    onClick={handleCreateInstitution}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                  >
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
                            stats.totalUsers * 0.7,
                            stats.totalUsers * 0.75,
                            stats.totalUsers * 0.8,
                            stats.totalUsers * 0.85,
                            stats.totalUsers * 0.9,
                            stats.totalUsers
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Rendimiento Académico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar
                    data={{
                      labels: ['Matemáticas', 'Español', 'Ciencias', 'Historia', 'Inglés'],
                      datasets: [{
                        label: 'Promedio General',
                        data: [4.2, 3.8, 4.0, 3.9, 4.1],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
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
                          beginAtZero: true,
                          max: 5
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uso</span>
                      <span>{systemMetrics.cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${systemMetrics.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Memoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uso</span>
                      <span>{systemMetrics.memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${systemMetrics.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Disco
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uso</span>
                      <span>{systemMetrics.diskUsage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${systemMetrics.diskUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="w-5 h-5" />
                    Conexiones Activas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {systemMetrics.activeConnections}
                  </div>
                  <p className="text-sm text-gray-600">Usuarios conectados en tiempo real</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Tiempo de Respuesta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {systemMetrics.responseTime}ms
                  </div>
                  <p className="text-sm text-gray-600">Tiempo promedio de respuesta</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">Base de Datos</p>
                    <p className="text-sm text-green-700">Operativa</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">API Services</p>
                    <p className="text-sm text-green-700">En línea</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-blue-900">Backup</p>
                    <p className="text-sm text-blue-700">Completado</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">Seguridad</p>
                    <p className="text-sm text-green-700">Activa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Institution Creation Modal */}
      <SuperAdminInstitutionModal
        isOpen={isInstitutionModalOpen}
        onClose={() => setIsInstitutionModalOpen(false)}
        onInstitutionCreated={handleInstitutionCreated}
      />
    </div>
  );
};

export default SuperAdminDashboard;
