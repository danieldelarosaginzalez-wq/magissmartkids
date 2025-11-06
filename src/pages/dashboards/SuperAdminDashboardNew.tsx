import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../stores/authStore';
import { 
  Building2, Users, Shield, Activity, RefreshCw, BarChart3, ExternalLink, 
  CheckCircle2, AlertTriangle, Database, Settings, Plus, FileText, 
  Monitor, HardDrive, UserPlus, TrendingUp, TrendingDown 
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCoordinators: number;
  totalInstitutions: number;
  activeInstitutions: number;
  growthPercentage: number;
  systemStatus: string;
  uptime: string;
  lastUpdated: string;
}

interface InstitutionSummary {
  id: number;
  name: string;
  nit?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  studentsCount: number;
  teachersCount: number;
  coordinatorsCount: number;
  averageGrade: number;
  status: string;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  status: string;
}

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [institutions, setInstitutions] = useState<InstitutionSummary[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        loadStats(),
        loadInstitutions(),
        loadRecentActivity()
      ]);
    } catch (e: any) {
      setError(e?.message || 'Error cargando datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const res = await fetch('/api/dashboard/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      setStats(json.stats);
    }
  };

  const loadInstitutions = async () => {
    const res = await fetch('/api/dashboard/institutions-summary', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      setInstitutions(json.institutions || []);
    }
  };

  const loadRecentActivity = async () => {
    const res = await fetch('/api/dashboard/recent-activity', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      setActivities(json.activities || []);
    }
  };

  const toggleInstitutionStatus = async (institutionId: number) => {
    try {
      const res = await fetch(`/api/dashboard/institutions/${institutionId}/toggle-status`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (res.ok) {
        await loadInstitutions(); // Recargar datos
      } else {
        throw new Error('Error al cambiar estado de institución');
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">⚙️</div>
            Panel Super Admin
          </h1>
          <p className="text-sm sm:text-base text-secondary">
            Control total del sistema - Gestión de instituciones, usuarios y configuración
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadDashboardData} 
            variant="outline" 
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2" 
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualizar Configuración</span>
          </Button>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Institución</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Total Usuarios</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? '...' : stats?.totalUsers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Instituciones</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? '...' : stats?.totalInstitutions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Estudiantes</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? '...' : stats?.totalStudents || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Profesores</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? '...' : stats?.totalTeachers || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                {stats?.growthPercentage >= 0 ? (
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Crecimiento</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? '...' : `${stats?.growthPercentage || 0}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-secondary/10 rounded-lg">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Uptime</p>
                <div className="flex items-center gap-2">
                  {stats?.systemStatus === 'UP' ? (
                    <Badge variant="success" className="text-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {stats?.uptime || 'UP'}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">DOWN</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 border-secondary-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
                <Activity className="h-4 w-4 text-primary" />
                Actividad Reciente
              </CardTitle>
              <Button variant="outline" size="sm" className="text-xs">
                Ver Actividad Completa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-secondary text-sm">Sin actividad reciente</div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-1 bg-primary/10 rounded">
                      <Activity className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-black">{activity.description}</p>
                      <p className="text-xs text-secondary">
                        {activity.user} • {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    <Badge 
                      variant={activity.status === 'success' ? 'success' : 'destructive'} 
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-secondary-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
              <Settings className="h-4 w-4 text-primary" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                <UserPlus className="h-4 w-4" />
                <span className="text-xs">Gestionar Usuarios</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">Administrar Instituciones</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Generar Reportes</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                <Settings className="h-4 w-4" />
                <span className="text-xs">Configuración del Sistema</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                <Monitor className="h-4 w-4" />
                <span className="text-xs">Monitoreo del Sistema</span>
              </Button>
              <Button variant="outline" size="sm" className="flex flex-col items-center gap-1 h-auto py-3">
                <HardDrive className="h-4 w-4" />
                <span className="text-xs">Backup y Restauración</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Instituciones */}
      <Card className="border-secondary-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-neutral-black">
            <Building2 className="h-4 w-4 text-primary" />
            Resumen de Instituciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {institutions.length === 0 ? (
            <div className="text-secondary text-sm">Sin instituciones para mostrar</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-2 font-medium text-secondary">Institución</th>
                    <th className="text-left py-2 font-medium text-secondary">Estudiantes</th>
                    <th className="text-left py-2 font-medium text-secondary">Profesores</th>
                    <th className="text-left py-2 font-medium text-secondary">Promedio</th>
                    <th className="text-left py-2 font-medium text-secondary">Estado</th>
                    <th className="text-left py-2 font-medium text-secondary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((institution) => (
                    <tr key={institution.id} className="border-b border-secondary-100">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-neutral-black">{institution.name}</p>
                          <p className="text-xs text-secondary">{institution.nit || 'Sin NIT'}</p>
                        </div>
                      </td>
                      <td className="py-3 text-neutral-black">{institution.studentsCount}</td>
                      <td className="py-3 text-neutral-black">{institution.teachersCount}</td>
                      <td className="py-3 text-neutral-black">{institution.averageGrade.toFixed(1)}</td>
                      <td className="py-3">
                        <Badge 
                          variant={institution.isActive ? 'success' : 'secondary'} 
                          className="text-xs"
                        >
                          {institution.status}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleInstitutionStatus(institution.id)}
                          className="text-xs"
                        >
                          {institution.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
