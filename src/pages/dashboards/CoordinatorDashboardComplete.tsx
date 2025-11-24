import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Section } from '../../components/ui/Section';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { UserManagementPanel } from '../../components/coordinator/UserManagementPanel';
import { UnifiedTaskList } from '../../components/coordinator/UnifiedTaskList';
import ReportsGenerator from '../../components/coordinator/ReportsGenerator';
import AdvancedReportsPanel from '../../components/coordinator/AdvancedReportsPanel';
import { api } from '../../services/api';

interface InstitutionStats {
  totalTeachers: number;
  totalStudents: number;
  totalSubjects: number;
  totalGrades: number;
  activeTasks: number;
  completedTasks: number;
  averagePerformance: number;
  gradeDistribution: Record<string, number>;
  subjectAverages: Record<string, number>;
  totalActivities: number;
  pendingSubmissions: number;
}

interface TeacherSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  totalStudents: number;
  activeTasks: number;
  averageGrade: number;
  isActive: boolean;
  lastLoginAt: string;
}

interface StudentSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gradeName: string;
  averageGrade: number;
  completedTasks: number;
  pendingTasks: number;
  isActive: boolean;
  lastLoginAt: string;
}

interface SubjectStats {
  subjectId: number;
  subjectName: string;
  teacherName: string;
  totalStudents: number;
  totalTasks: number;
  completedTasks: number;
  averageGrade: number;
  completionRate: number;
  gradeName: string;
}

interface RecentActivity {
  id: number;
  activityType: string;
  description: string;
  userName: string;
  userRole: string;
  timestamp: string;
  subjectName?: string;
  gradeName?: string;
  status: string;
}

interface CoordinatorDashboardData {
  institutionStats: InstitutionStats;
  recentTeachers: TeacherSummary[];
  recentStudents: StudentSummary[];
  subjectPerformance: SubjectStats[];
  recentActivities: RecentActivity[];
  quickActions: Record<string, string>;
}

export const CoordinatorDashboardComplete: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<CoordinatorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingData, setGeneratingData] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tasks'>('dashboard');

  const institutionId = 1; // This should come from auth context
  const institutionNit = "900123456"; // This should come from auth context

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/coordinator/dashboard?institutionId=${institutionId}`);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Error cargando datos del dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMassiveData = async () => {
    try {
      setGeneratingData(true);
      const response = await api.post('/coordinator/generate-data', {
        teacherCount: 20,
        studentCount: 20,
        generateTasks: true,
        generateActivities: true,
        generateGrades: true,
        institutionId: institutionId
      });

      if (response.data.status === 'SUCCESS') {
        alert('¡Datos generados exitosamente! 🎉\n' +
          `Profesores: ${response.data.teachersCreated}\n` +
          `Estudiantes: ${response.data.studentsCreated}\n` +
          `Tareas: ${response.data.tasksCreated}\n` +
          `Entregas: ${response.data.submissionsCreated}`);
        loadDashboardData(); // Reload dashboard
      } else {
        alert('Error generando datos: ' + response.data.message);
      }
    } catch (err) {
      alert('Error generando datos masivos');
      console.error('Data generation error:', err);
    } finally {
      setGeneratingData(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Cargando dashboard completo...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard Coordinador Completo"
          subtitle="Sistema integral de gestión institucional"
        />
        <EmptyState message={error || "No se pudieron cargar las estadísticas"} />
        <div className="text-center space-x-4">
          <Button onClick={loadDashboardData} variant="primary">
            Reintentar Carga
          </Button>
          <Button onClick={generateMassiveData} variant="secondary" disabled={generatingData}>
            {generatingData ? 'Generando...' : 'Generar Datos de Prueba'}
          </Button>
        </div>
      </div>
    );
  }

  const { institutionStats, recentTeachers, recentStudents, subjectPerformance, recentActivities } = dashboardData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="🏫 Dashboard Coordinador Completo"
        subtitle="Sistema integral de gestión - MagicSmartKids"
      />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'users'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            👥 Gestión de Usuarios
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            📝 Sistema Unificado de Tareas
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            📊 Reportes
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <UserManagementPanel institutionNit={institutionNit} />
      )}

      {activeTab === 'tasks' && (
        <UnifiedTaskList institutionNit={institutionNit} />
      )}

      {activeTab === 'reports' && (
        <ReportsGenerator institutionId={1} />
      )}

      {activeTab === 'advanced-reports' && (
        <AdvancedReportsPanel />
      )}

      {activeTab === 'dashboard' && (
        <>
          {/* Estadísticas Principales */}
          <Section title="📊 Estadísticas Institucionales">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {institutionStats.totalTeachers}
                  </div>
                  <div className="text-gray-700 font-medium">👩‍🏫 Profesores</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {institutionStats.totalStudents}
                  </div>
                  <div className="text-gray-700 font-medium">👨‍🎓 Estudiantes</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {institutionStats.totalSubjects}
                  </div>
                  <div className="text-gray-700 font-medium">📚 Materias</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {institutionStats.totalGrades}
                  </div>
                  <div className="text-gray-700 font-medium">🎓 Grados</div>
                </div>
              </Card>
            </div>
          </Section>

          {/* Métricas de Rendimiento */}
          <Section title="📈 Métricas de Rendimiento Académico">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {institutionStats.activeTasks}
                  </div>
                  <div className="text-gray-600">📝 Tareas Activas</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {institutionStats.completedTasks}
                  </div>
                  <div className="text-gray-600">✅ Completadas</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-rose-50 to-rose-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-rose-600 mb-2">
                    {institutionStats.averagePerformance.toFixed(1)}
                  </div>
                  <div className="text-gray-600">⭐ Promedio General</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">
                    {institutionStats.pendingSubmissions}
                  </div>
                  <div className="text-gray-600">⏳ Pendientes</div>
                </div>
              </Card>
            </div>
          </Section>

          {/* Profesores Recientes */}
          <Section title="👩‍🏫 Profesores Activos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTeachers.map((teacher) => (
                <Card key={teacher.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {teacher.firstName} {teacher.lastName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {teacher.isActive ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{teacher.email}</p>
                  <div className="text-sm text-gray-500 space-y-2">
                    <div className="flex justify-between">
                      <span>📚 Materias:</span>
                      <span className="font-medium">{teacher.subjects.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>👨‍🎓 Estudiantes:</span>
                      <span className="font-medium">{teacher.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>📝 Tareas activas:</span>
                      <span className="font-medium">{teacher.activeTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⭐ Promedio:</span>
                      <span className="font-medium">{teacher.averageGrade.toFixed(1)}</span>
                    </div>
                    {teacher.lastLoginAt && (
                      <div className="text-xs text-gray-400 mt-2">
                        Último acceso: {formatDate(teacher.lastLoginAt)}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Materias: {teacher.subjects.join(', ')}
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          {/* Estudiantes Recientes */}
          <Section title="👨‍🎓 Estudiantes Activos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentStudents.map((student) => (
                <Card key={student.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {student.firstName} {student.lastName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {student.isActive ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{student.email}</p>
                  <div className="text-sm text-gray-500 space-y-2">
                    <div className="flex justify-between">
                      <span>🎓 Grado:</span>
                      <span className="font-medium">{student.gradeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⭐ Promedio:</span>
                      <span className="font-medium">{student.averageGrade.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>✅ Completadas:</span>
                      <span className="font-medium">{student.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>⏳ Pendientes:</span>
                      <span className="font-medium">{student.pendingTasks}</span>
                    </div>
                    {student.lastLoginAt && (
                      <div className="text-xs text-gray-400 mt-2">
                        Último acceso: {formatDate(student.lastLoginAt)}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          {/* Rendimiento por Materia */}
          <Section title="📊 Rendimiento por Materia">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📚 Materia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      👩‍🏫 Profesor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🎓 Grado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      👨‍🎓 Estudiantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📝 Tareas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ⭐ Promedio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📈 Completado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjectPerformance.map((subject) => (
                    <tr key={subject.subjectId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.subjectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.teacherName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.gradeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.totalStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.totalTasks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${subject.averageGrade >= 4.0 ? 'bg-green-100 text-green-800' :
                          subject.averageGrade >= 3.0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {subject.averageGrade.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${subject.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{subject.completionRate.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Actividades Recientes */}
          <Section title="🔔 Actividades Recientes">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivities.map((activity) => (
                <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{activity.userName}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {activity.userRole === 'STUDENT' ? '👨‍🎓' :
                            activity.userRole === 'TEACHER' ? '👩‍🏫' : '👤'} {activity.userRole}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      {activity.subjectName && (
                        <p className="text-xs text-gray-500 mt-1">
                          📚 {activity.subjectName} - 🎓 {activity.gradeName}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDate(activity.timestamp)}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${activity.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        activity.status === 'GRADED' ? 'bg-blue-100 text-blue-800' :
                          activity.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {activity.status === 'COMPLETED' ? '✅ Completado' :
                          activity.status === 'GRADED' ? '📊 Calificado' :
                            activity.status === 'ACTIVE' ? '🟢 Activo' :
                              activity.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          {/* Acciones Rápidas */}
          <Section title="⚡ Acciones Rápidas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary" className="p-6 h-auto bg-blue-600 hover:bg-blue-700">
                <div className="text-center">
                  <div className="text-2xl mb-2">👩‍🏫</div>
                  <div className="font-semibold">Gestionar Profesores</div>
                  <div className="text-sm opacity-75">Agregar, editar profesores</div>
                </div>
              </Button>

              <Button variant="secondary" className="p-6 h-auto bg-green-600 hover:bg-green-700">
                <div className="text-center">
                  <div className="text-2xl mb-2">👨‍🎓</div>
                  <div className="font-semibold">Gestionar Estudiantes</div>
                  <div className="text-sm opacity-75">Administrar estudiantes</div>
                </div>
              </Button>

              <Button variant="outline" className="p-6 h-auto border-purple-300 text-purple-700 hover:bg-purple-50">
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold">Ver Reportes</div>
                  <div className="text-sm opacity-75">Generar reportes</div>
                </div>
              </Button>

              <Button
                variant="accent"
                className="p-6 h-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                onClick={generateMassiveData}
                disabled={generatingData}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {generatingData ? '⏳' : '🚀'}
                  </div>
                  <div className="font-semibold">
                    {generatingData ? 'Generando...' : 'Generar Datos'}
                  </div>
                  <div className="text-sm opacity-75">
                    {generatingData ? 'Creando usuarios...' : '20 profesores + 20 estudiantes'}
                  </div>
                </div>
              </Button>
            </div>
          </Section>

          {/* Footer con información del sistema */}
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                🎯 Sistema MagicSmartKids - Dashboard Coordinador Completo
              </h3>
              <p className="text-sm text-gray-600">
                Sistema integral de gestión educativa con datos en tiempo real y funcionalidad completa
              </p>
              <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-500">
                <span>📊 {institutionStats.totalActivities} actividades totales</span>
                <span>⏱️ Actualizado en tiempo real</span>
                <span>🔒 Sistema seguro</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default CoordinatorDashboardComplete;