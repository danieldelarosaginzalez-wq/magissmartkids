import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Trophy, FileText, School, Play, RefreshCw, AlertTriangle, User, CheckSquare, GraduationCap, BarChart3 } from 'lucide-react';
import api from '../../services/api';

interface StudentStats {
  totalSubjects: number;
  pendingTasks: number;
  completedTasks: number;
  averageGrade: number;
  studyHours: string;
  completedActivities: number;
  loading: boolean;
}

interface Task {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'in_progress' | 'completed';
}

interface Subject {
  id: string;
  name: string;
  progress: number;
  grade: number;
  color: string;
}

interface RecentGrade {
  id: string;
  subject: string;
  assignment: string;
  grade: number;
  maxGrade: number;
  date: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<StudentStats>({
    totalSubjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    averageGrade: 0,
    studyHours: '0h',
    completedActivities: 0,
    loading: true
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentGrades, setRecentGrades] = useState<RecentGrade[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(true);

  useEffect(() => {
    loadStudentStats();
    loadPendingTasks();
    loadSubjectsProgress();
    loadRecentGrades();
  }, []);

  // Cargar estadísticas del estudiante
  const loadStudentStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Usar API real del backend
      const response = await api.get('/students/dashboard/stats');

      if (response?.data) {
        setStats({
          totalSubjects: response.data.totalSubjects || 0,
          pendingTasks: response.data.pendingTasks || 0,
          completedTasks: response.data.completedTasks || 0,
          averageGrade: response.data.averageGrade || 0,
          studyHours: response.data.studyHours || '0h',
          completedActivities: response.data.completedActivities || 0,
          loading: false
        });
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error loading student stats:', error);
      // Fallback solo en caso de error
      setStats({
        totalSubjects: 0,
        pendingTasks: 0,
        completedTasks: 0,
        averageGrade: 0,
        studyHours: '0h',
        completedActivities: 0,
        loading: false
      });
    }
  };

  // Cargar tareas pendientes
  const loadPendingTasks = async () => {
    try {
      setLoadingTasks(true);

      // Usar API real del backend
      const response = await api.get('/students/tasks?status=pending');

      if (response?.data) {
        // Transformar fechas del backend
        const transformedTasks = response.data.map((task: any) => ({
          ...task,
          dueDate: task.dueDate || new Date().toISOString().split('T')[0]
        }));
        setTasks(transformedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Cargar progreso de materias
  const loadSubjectsProgress = async () => {
    try {
      setLoadingSubjects(true);

      // Usar API real del backend
      const response = await api.get('/students/subjects/progress');

      if (response?.data) {
        setSubjects(response.data);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Cargar notas recientes
  const loadRecentGrades = async () => {
    try {
      setLoadingGrades(true);

      // Usar API real del backend
      const response = await api.get('/students/grades/recent?limit=5');

      if (response?.data) {
        // Transformar fechas del backend
        const transformedGrades = response.data.map((grade: any) => ({
          ...grade,
          date: grade.date || new Date().toISOString().split('T')[0]
        }));
        setRecentGrades(transformedGrades);
      } else {
        setRecentGrades([]);
      }
    } catch (error) {
      console.error('Error loading recent grades:', error);
      setRecentGrades([]);
    } finally {
      setLoadingGrades(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* DASHBOARD CONTENT - Sin navbar duplicado */}
      <main className="container mx-auto px-4 py-8">
        {/* Header del dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white-900 flex items-center gap-3">
            <div className="p-2 bg-[#00368F]/10 rounded-lg">
              <User className="h-6 w-6 text-[#00368F]" />
            </div>
            ¡Hola, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a tu dashboard de estudiante
          </p>
          <Button
            onClick={() => {
              loadStudentStats();
              loadPendingTasks();
              loadSubjectsProgress();
              loadRecentGrades();
            }}
            variant="outline"
            className="mt-4 flex items-center gap-2"
            disabled={stats.loading}
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
                    <GraduationCap className="w-4 h-4" />
                    {user.academicGrade ? `${user.academicGrade.name} - Estudiante` : 'Estudiante'}
                  </p>
                  {user.institution.address && (
                    <p className="text-sm text-gray-500 mt-1">
                      {user.institution.address}
                    </p>
                  )}
                </div>
                {stats.pendingTasks > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {stats.pendingTasks} pendientes
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-yellow-200 bg-yellow-50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Sin institución asignada</p>
                  <p className="text-sm text-gray-600">Contacta al administrador del sistema</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards - Grid organizado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#2E5BFF]/10 rounded-lg">
                  <BookOpen className="h-8 w-8 text-[#2E5BFF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Materias</p>
                  {stats.loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-12"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#F5A623]/10 rounded-lg">
                  <CheckSquare className="h-8 w-8 text-[#F5A623]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tareas Pendientes</p>
                  {stats.loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-12"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00C764]/10 rounded-lg">
                  <Trophy className="h-8 w-8 text-[#00C764]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Promedio</p>
                  {stats.loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.averageGrade.toFixed(1)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CheckSquare className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Tareas Completadas</p>
                  {stats.loading ? (
                    <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de tarjetas organizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Tareas Pendientes - Datos reales */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-[#F5A623]" />
                Tareas Pendientes
              </h3>
              {loadingTasks ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-3 bg-gray-100 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <Badge
                          className={
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{task.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">Vence: {task.dueDate}</p>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      ¡No tienes tareas pendientes!
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mis Materias - Datos reales */}
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
              ) : (
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{subject.name}</span>
                        <Badge
                          className={
                            subject.grade >= 4.0 ? 'bg-green-100 text-green-800' :
                              subject.grade >= 3.0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                          }
                        >
                          {subject.grade.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${subject.progress}%`,
                              backgroundColor: subject.color
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-12 text-right">{subject.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notas Recientes - Datos reales */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00C764]" />
                Notas Recientes
              </h3>
              {loadingGrades ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-3 bg-gray-100 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentGrades.map((grade) => (
                    <div key={grade.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                        <Badge
                          className={
                            grade.grade >= 4.0 ? 'bg-green-100 text-green-800' :
                              grade.grade >= 3.0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                          }
                        >
                          {grade.grade.toFixed(1)}/{grade.maxGrade.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{grade.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">{grade.date}</p>
                    </div>
                  ))}
                  {recentGrades.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No hay notas recientes
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actividades Interactivas - Sección final */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mb-4">
                  <GraduationCap className="h-16 w-16 text-[#00368F] mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Actividades Interactivas
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Accede a las nuevas actividades interactivas y evaluaciones diseñadas especialmente para ti.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/actividades-interactivas">
                    <Button className="bg-[#00368F] hover:bg-[#2E5BFF] text-white flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Acceder a Actividades
                    </Button>
                  </Link>
                  <Link to="/tareas">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Ver Todas las Tareas
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;