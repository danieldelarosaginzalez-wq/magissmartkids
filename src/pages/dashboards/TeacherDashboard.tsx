import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, BookOpen, AlertCircle, FileText, School, Target, TrendingUp, Clock, RefreshCw, BarChart3 } from 'lucide-react';
import { teacherApi } from '../../services/api';

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
    loadStats();
    loadSubjects();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await teacherApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading teacher dashboard stats:', error);
      setStats({
        totalMaterias: 0,
        totalEstudiantes: 0,
        tareasPendientesCorreccion: 0,
        promedioGeneral: 0,
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
      const response = await teacherApi.getSubjects();
      
      const mappedSubjects = (response.data.subjects || []).map((subject: any) => ({
        id: subject.id?.toString() || '',
        nombre: subject.name || subject.subjectName || 'Sin nombre',
        grado: subject.grade || 'Sin grado',
        estudiantes: subject.totalStudents || subject.studentCount || 0,
        progresoPromedio: subject.progress || subject.averageProgress || 0,
        color: subject.color || '#3B82F6'
      }));
      
      setSubjects(mappedSubjects);
    } catch (error) {
      console.error('Error loading teacher subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const refreshData = () => {
    loadStats();
    loadSubjects();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            Bienvenido, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600 mt-2">
            Panel de control para gestionar tus clases y estudiantes
          </p>
          <Button
            onClick={refreshData}
            variant="outline"
            className="mt-4 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {user?.institution ? (
          <Card className="border-[#00368F]/20 bg-[#00368F]/5 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00368F]/10 rounded-lg">
                  <School className="h-8 w-8 text-[#00368F]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.institution.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Profesor
                  </p>
                  {user.institution.address && (
                    <p className="text-sm text-gray-500 mt-1">
                      {user.institution.address}
                    </p>
                  )}
                </div>
                {stats && stats.tareasPendientesCorreccion > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {stats.tareasPendientesCorreccion} por calificar
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-yellow-200 bg-yellow-50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Sin institución asignada</p>
                  <p className="text-sm text-gray-600">Contacta al administrador del sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#2E5BFF]/10 rounded-lg">
                  <Users className="h-8 w-8 text-[#2E5BFF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                  {loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-12"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalEstudiantes || 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#F5A623]/10 rounded-lg">
                  <BookOpen className="h-8 w-8 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Materias</p>
                  {loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-12"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalMaterias || 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00C764]/10 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-[#00C764]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Promedio General</p>
                  {loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{(stats?.promedioGeneral || 0).toFixed(1)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Clock className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Por Calificar</p>
                  {loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats?.tareasPendientesCorreccion || 0}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00368F]" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Link to="/profesor/materias">
                <Button className="w-full bg-[#00368F] hover:bg-[#2E5BFF] text-white flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Mis Materias
                </Button>
              </Link>
              <Link to="/profesor/tareas">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tareas
                </Button>
              </Link>
              <Link to="/profesor/calificaciones">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Calificaciones
                </Button>
              </Link>
              <Link to="/profesor/predicciones">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Predicciones IA
                </Button>
              </Link>
              <Link to="/actividades-interactivas">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Target className="h-4 w-4" />
                  Actividades
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2E5BFF]" />
                Mis Materias
              </h3>
              {loadingSubjects ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="font-medium">No hay materias asignadas</p>
                  <p className="text-sm">Contacta al coordinador</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {subject.nombre} - {subject.grado}
                          </h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {subject.estudiantes} estudiantes
                          </p>
                        </div>
                        <Link to={`/profesor/estudiantes?grade=${encodeURIComponent(subject.grado)}`}>
                          <Badge variant="outline" className="text-xs cursor-pointer">
                            Ver →
                          </Badge>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${subject.progresoPromedio}%`,
                              backgroundColor: subject.color
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-12 text-right">{subject.progresoPromedio}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00C764]" />
                Actividades Recientes
              </h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-3 bg-gray-100 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : !stats?.actividadesRecientes || stats.actividadesRecientes.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="font-medium">No hay actividades recientes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.actividadesRecientes.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">{task.titulo}</h4>
                        <Badge className="text-xs bg-green-100 text-green-800">
                          Reciente
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {task.grados?.join(', ')} • {task.tipo === 'traditional' ? 'Tradicional' : 'Interactiva'}
                      </p>
                      {task.fechaCreacion && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(task.fechaCreacion).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
