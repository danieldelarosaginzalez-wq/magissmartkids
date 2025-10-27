import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, BookOpen, AlertCircle, FileText, School, Target, TrendingUp, Clock, RefreshCw, BarChart3 } from 'lucide-react';
import { translateRole, getRoleIcon } from '../../utils/roleTranslations';

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

      // 🎭 SIMULACIÓN DE LOADING PARA LA PRESENTACIÓN
      await new Promise(resolve => setTimeout(resolve, 800));

      // ✅ DATOS FICTICIOS REALISTAS PARA LA PRESENTACIÓN
      setStats({
        totalMaterias: 4,
        totalEstudiantes: 89,
        tareasPendientesCorreccion: 12,
        promedioGeneral: 4.2,
        proximasEntregas: [
          {
            id: 1,
            titulo: 'Examen de Matemáticas - Fracciones',
            descripcion: 'Evaluación sobre suma y resta de fracciones',
            materiaId: 1,
            grados: ['3° A', '3° B'],
            fechaEntrega: '2025-10-28',
            tipo: 'traditional',
            fechaCreacion: '2025-10-20'
          },
          {
            id: 2,
            titulo: 'Tarea de Español - Comprensión Lectora',
            descripcion: 'Lectura del cuento "El patito feo" y preguntas',
            materiaId: 2,
            grados: ['2° A'],
            fechaEntrega: '2025-10-30',
            tipo: 'traditional',
            fechaCreacion: '2025-10-22'
          }
        ],
        actividadesRecientes: [
          {
            id: 3,
            titulo: 'Actividad Interactiva - Los Colores',
            descripcion: 'Juego educativo sobre colores primarios',
            materiaId: 3,
            grados: ['1° A', '1° B'],
            fechaEntrega: '2025-10-25',
            tipo: 'interactive',
            fechaCreacion: '2025-10-23'
          },
          {
            id: 4,
            titulo: 'Dibujo de la Familia',
            descripcion: 'Actividad artística sobre la familia',
            materiaId: 4,
            grados: ['2° B'],
            fechaEntrega: '2025-10-26',
            tipo: 'traditional',
            fechaCreacion: '2025-10-21'
          }
        ]
      });
    } catch (error) {
      console.error('Error loading teacher dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);

      // 🎭 SIMULACIÓN DE LOADING PARA LA PRESENTACIÓN
      await new Promise(resolve => setTimeout(resolve, 600));

      // ✅ MATERIAS FICTICIAS REALISTAS PARA LA PRESENTACIÓN
      setSubjects([
        {
          id: '1',
          nombre: 'Matemáticas',
          grado: '3° A',
          estudiantes: 25,
          progresoPromedio: 78,
          color: '#3B82F6'
        },
        {
          id: '2',
          nombre: 'Español',
          grado: '2° A',
          estudiantes: 22,
          progresoPromedio: 85,
          color: '#10B981'
        },
        {
          id: '3',
          nombre: 'Ciencias Naturales',
          grado: '1° A',
          estudiantes: 20,
          progresoPromedio: 72,
          color: '#8B5CF6'
        },
        {
          id: '4',
          nombre: 'Sociales',
          grado: '2° B',
          estudiantes: 22,
          progresoPromedio: 80,
          color: '#F59E0B'
        }
      ]);
    } catch (error) {
      console.error('Error loading teacher subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              👨‍🏫
            </div>
            Bienvenido, Profesor {user?.firstName}
          </h1>
          <p className="text-gray-600 mt-2">
            Panel de control para gestionar tus clases y estudiantes
          </p>
          <Button
            onClick={loadDashboardData}
            variant="outline"
            className="mt-4 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* Institution Info */}
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
                    {getRoleIcon(user.role)} {translateRole(user.role)}
                  </p>
                  {user.institution.address && (
                    <p className="text-sm text-gray-500 mt-1">
                      {user.institution.address}
                    </p>
                  )}
                </div>
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

        {/* Stats Cards */}
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

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00368F]" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/profesor/materias" className="block">
                <Button className="w-full bg-[#00368F] hover:bg-[#2E5BFF] text-white flex items-center gap-2 py-3">
                  <BookOpen className="h-4 w-4" />
                  Mis Materias
                </Button>
              </Link>
              <Link to="/profesor/tareas" className="block">
                <Button variant="outline" className="w-full flex items-center gap-2 py-3">
                  <FileText className="h-4 w-4" />
                  Tareas
                </Button>
              </Link>
              <Link to="/profesor/calificaciones" className="block">
                <Button variant="outline" className="w-full flex items-center gap-2 py-3">
                  <BarChart3 className="h-4 w-4" />
                  Calificaciones
                </Button>
              </Link>
              <Link to="/actividades-interactivas" className="block">
                <Button variant="outline" className="w-full flex items-center gap-2 py-3">
                  <Target className="h-4 w-4" />
                  Actividades
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mis Materias */}
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
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No hay materias asignadas</p>
                  <p className="text-xs text-gray-400">
                    Contacta al coordinador para que te asigne materias
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <Link
                      key={subject.id}
                      to={`/profesor/materias/${subject.id}`}
                      className="block"
                    >
                      <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-l-4" style={{ borderLeftColor: subject.color }}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{subject.nombre} - {subject.grado}</h4>
                          <Badge variant="outline" className="text-xs">
                            Ver detalles
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {subject.estudiantes} estudiantes
                        </p>
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
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actividades Recientes */}
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
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay actividades recientes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.actividadesRecientes.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-[#00368F]">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">{task.titulo}</h4>
                        <Badge className="text-xs bg-green-100 text-green-800">
                          Reciente
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {task.grados?.join(', ')} • {task.tipo === 'traditional' ? 'Tarea tradicional' : 'Actividad interactiva'}
                      </p>
                      {task.fechaCreacion && (
                        <p className="text-xs text-gray-500 mt-1">
                          Creada: {new Date(task.fechaCreacion).toLocaleDateString()}
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