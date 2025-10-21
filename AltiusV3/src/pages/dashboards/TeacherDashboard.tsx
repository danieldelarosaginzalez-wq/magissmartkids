import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, BookOpen, AlertCircle, FileText, School, Target, TrendingUp, Clock, RefreshCw, BarChart3 } from 'lucide-react';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';
import api from '../../services/api';

interface TeacherDashboardStats {
  totalMaterias: number;
  totalEstudiantes: number;
  tareasPendientesCorreccion: number;
  promedioGeneral: number;
  proximasEntregas: TeacherTask[];
  actividadesRecientes: TeacherTask[];
}

interface TeacherSubject {
  id: string;
  nombre: string;
  grado: string;
  estudiantes: number;
  progresoPromedio: number;
  color: string;
}

interface TeacherTask {
  id: number;
  titulo: string;
  descripcion?: string;
  materiaId?: number;
  grados?: string[];
  fechaEntrega?: string;
  tipo?: string;
  fechaCreacion?: string;
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<TeacherDashboardStats | null>(null);
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([
      loadStats(),
      loadSubjects()
    ]);
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teacher/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading teacher dashboard stats:', error);
      // Datos de fallback
      setStats({
        totalMaterias: 0,
        totalEstudiantes: 0,
        tareasPendientesCorreccion: 0,
        promedioGeneral: 0.0,
        proximasEntregas: [],
        actividadesRecientes: []
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const response = await api.get('/teacher/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error loading teacher subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-magic text-neutral-black flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              👨‍🏫
            </div>
            Bienvenido, Profesor {user?.firstName}
          </h1>
          <p className="text-sm sm:text-base text-secondary font-body">
            Panel de control para gestionar tus clases y estudiantes
          </p>
        </div>
        <Button 
          onClick={loadDashboardData}
          variant="outline"
          className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Actualizar</span>
        </Button>
      </div>

      {/* Institution Info */}
      {user?.institution ? (
        <Card className="border-accent-green/20 bg-accent-green/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-green/10 rounded-lg">
                <School className="h-5 w-5 text-accent-green" />
              </div>
              <div className="flex-1">
                <p className="text-neutral-black font-bold text-base sm:text-lg">
                  {user.institution.name}
                </p>
                <p className="text-accent-green text-sm">
                  {getRoleIcon(user.role)} {translateRole(user.role)}
                </p>
                {user.institution.address && (
                  <p className="text-secondary text-sm mt-1">
                    📍 {user.institution.address}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-accent-yellow/20 bg-accent-yellow/5">
          <CardContent className="p-4 sm:p-6">
            <p className="text-neutral-black font-medium flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent-yellow" />
              Sin institución asignada
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Estudiantes</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    stats?.totalEstudiantes || 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-green/10 rounded-lg">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-accent-green" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Materias</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    stats?.totalMaterias || 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-accent-yellow/10 rounded-lg">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Promedio General</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    `${(stats?.promedioGeneral || 0).toFixed(1)}`
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary-200 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Por Calificar</p>
                <p className="text-xl sm:text-2xl font-bold text-neutral-black">
                  {loading ? (
                    <div className="animate-pulse bg-secondary-200 h-6 w-8 rounded"></div>
                  ) : (
                    stats?.tareasPendientesCorreccion || 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-secondary-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link to="/profesor/materias" className="block">
              <Button className="w-full bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2 py-3 sm:py-4">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm sm:text-base">Mis Materias</span>
              </Button>
            </Link>
            <Link to="/profesor/tareas" className="block">
              <Button 
                variant="outline" 
                className="w-full border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 py-3 sm:py-4"
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm sm:text-base">Tareas</span>
              </Button>
            </Link>
            <Link to="/profesor/calificaciones" className="block">
              <Button 
                variant="outline" 
                className="w-full border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 py-3 sm:py-4"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm sm:text-base">Calificaciones</span>
              </Button>
            </Link>
            <Link to="/actividades-interactivas" className="block">
              <Button 
                variant="outline" 
                className="w-full border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2 py-3 sm:py-4"
              >
                <Target className="h-4 w-4" />
                <span className="text-sm sm:text-base">Actividades</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Mis Materias */}
        <Card className="border-secondary-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              Mis Materias
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSubjects ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-secondary-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="h-4 bg-secondary-200 rounded w-32"></div>
                        <div className="h-3 bg-secondary-200 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-secondary-200 rounded-full w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-secondary mx-auto mb-4" />
                <p className="text-secondary">No hay materias asignadas</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {subjects.map((subject) => (
                  <div 
                    key={subject.id} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-secondary-50 rounded-lg border border-secondary-200 hover:border-primary-200 transition-all duration-200"
                    style={{ borderLeftColor: subject.color, borderLeftWidth: '4px' }}
                  >
                    <div>
                      <p className="font-medium text-neutral-black text-sm sm:text-base">
                        {subject.nombre} - {subject.grado}
                      </p>
                      <p className="text-xs sm:text-sm text-secondary">
                        {subject.estudiantes} estudiantes • {subject.progresoPromedio.toFixed(1)}% progreso
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-secondary-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent-green transition-all duration-300"
                          style={{ width: `${subject.progresoPromedio}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actividades Recientes */}
        <Card className="border-secondary-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Actividades Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 border-l-4 border-secondary-200 bg-secondary-50">
                      <div className="space-y-2">
                        <div className="h-4 bg-secondary-200 rounded w-40"></div>
                        <div className="h-3 bg-secondary-200 rounded w-32"></div>
                      </div>
                      <div className="h-5 bg-secondary-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !stats?.actividadesRecientes || stats.actividadesRecientes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-secondary mx-auto mb-4" />
                <p className="text-secondary">No hay actividades recientes</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {stats.actividadesRecientes.map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-l-4 border-primary bg-secondary-50 rounded-r-lg gap-2 sm:gap-0">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-black text-sm sm:text-base">{task.titulo}</p>
                      <p className="text-xs sm:text-sm text-secondary">
                        {task.grados?.join(', ')} • {task.tipo === 'traditional' ? 'Tarea tradicional' : 'Actividad interactiva'}
                      </p>
                      {task.fechaCreacion && (
                        <p className="text-xs text-secondary">
                          Creada: {new Date(task.fechaCreacion).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge variant="default" className="text-xs self-start sm:self-center">
                      Reciente
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;