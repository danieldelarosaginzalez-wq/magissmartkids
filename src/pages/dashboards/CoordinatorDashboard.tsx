import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Users, School, Settings, UserCheck, GraduationCap, TrendingUp, Calendar, UserPlus, BookOpen, ClipboardList, BarChart3 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { coordinatorApi } from '../../services/api';
import QuickActions from '../../components/coordinator/QuickActions';
import SubjectsSection from '../../components/coordinator/SubjectsSection';
import CreateSubjectModal from '../../components/coordinator/CreateSubjectModal';
import AcademicAnalytics from '../../components/coordinator/AcademicAnalytics';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  students: number;
  status: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  average: number;
  status: string;
}

const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalSubjects: 0,
    activeTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCreateSubject, setShowCreateSubject] = useState(false);

  useEffect(() => {
    loadUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsersData = async () => {
    try {
      setLoading(true);
      console.log('📊 Cargando datos del dashboard del coordinador...');

      const institutionId = user?.institution?.id ? parseInt(user.institution.id) : 1;

      // Cargar datos reales del backend
      let teachersData: any[] = [];
      let studentsData: any[] = [];
      let subjectsData: any = { subjects: [], total: 0 };

      try {
        const [teachersRes, studentsRes, subjectsRes] = await Promise.all([
          coordinatorApi.getTeachers(institutionId, 100),
          coordinatorApi.getStudents(institutionId, 100),
          coordinatorApi.getSubjects(institutionId)
        ]);

        teachersData = teachersRes.data || [];
        studentsData = studentsRes.data || [];
        subjectsData = subjectsRes || { subjects: [], total: 0 };

        console.log('✅ Datos cargados:', {
          profesores: teachersData.length,
          estudiantes: studentsData.length,
          materias: subjectsData.total || subjectsData.subjects?.length || 0
        });
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }

      // Actualizar estado con datos reales
      setTeachers(teachersData);
      setStudents(studentsData);
      setStats({
        totalTeachers: teachersData.length,
        totalStudents: studentsData.length,
        totalSubjects: subjectsData.total || subjectsData.subjects?.length || 0,
        activeTasks: 0 // TODO: Implementar endpoint para tareas activas
      });

    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header con gradiente */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <School className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    Panel de Coordinación
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Bienvenido, {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={loadUsersData}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 flex items-center gap-2"
              disabled={loading}
            >
              <Settings className="h-4 w-4" />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>

        {/* Institution Info */}
        {user?.institution && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <School className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {user.institution.name}
                </h3>
                <p className="text-gray-600">
                  {user.firstName} {user.lastName} - Coordinador
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards con gradientes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Usuarios */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-white">
                {loading ? '...' : stats.totalTeachers + stats.totalStudents}
              </p>
            </div>
          </div>

          {/* Profesores */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <UserPlus className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Profesores</p>
              <p className="text-3xl font-bold text-white">
                {loading ? '...' : stats.totalTeachers}
              </p>
            </div>
          </div>

          {/* Estudiantes */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <BookOpen className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Estudiantes</p>
              <p className="text-3xl font-bold text-white">
                {loading ? '...' : stats.totalStudents}
              </p>
            </div>
          </div>

          {/* Tareas Activas */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <Calendar className="h-5 w-5 text-white/60" />
              </div>
              <p className="text-amber-100 text-sm font-medium mb-1">Tareas Activas</p>
              <p className="text-3xl font-bold text-white">
                {loading ? '...' : stats.activeTasks}
              </p>
            </div>
          </div>
        </div>

        {/* Listas de Usuarios y Materias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profesores */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                </div>
                Profesores ({teachers.length})
              </h2>
              <Button
                onClick={() => navigate('/users')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              >
                Ver todos
              </Button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teachers.slice(0, 10).map((teacher: Teacher) => (
                  <div key={teacher.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {teacher.firstName[0]}{teacher.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{teacher.firstName} {teacher.lastName}</p>
                      <p className="text-sm text-gray-600 truncate">{teacher.email}</p>
                    </div>
                    <div className="text-emerald-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estudiantes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </div>
                Estudiantes ({students.length})
              </h2>
              <Button
                onClick={() => navigate('/users')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
              >
                Ver todos
              </Button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {students.slice(0, 10).map((student: Student) => (
                  <div key={student.id} className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                      <p className="text-sm text-gray-600 truncate">{student.email}</p>
                    </div>
                    <div className="text-purple-600">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Materias */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                Materias de la Institución
              </h2>
              <Button
                onClick={() => setShowCreateSubject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                + Nueva Materia
              </Button>
            </div>
            <SubjectsSection limit={15} />
          </div>
        </div>



        {/* Modal Crear Materia */}
        {showCreateSubject && (
          <CreateSubjectModal
            onClose={() => setShowCreateSubject(false)}
            onSuccess={() => {
              setShowCreateSubject(false);
              loadUsersData(); // Recargar datos
            }}
          />
        )}

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <QuickActions columns={3} maxItems={3} />
        </div>

        {/* Acceso Rápido a Funciones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Acceso Rápido
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/users')}
              className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Gestión de Usuarios</span>
              </div>
              <p className="text-sm text-gray-600">Administrar profesores y estudiantes</p>
            </button>

            <button
              onClick={() => navigate('/gestion-grados')}
              className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-600 rounded-lg">
                  <School className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Gestión de Grados</span>
              </div>
              <p className="text-sm text-gray-600">Asignar profesores a grados</p>
            </button>

            <button
              onClick={() => alert('Función de reportes próximamente disponible')}
              className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Reportes</span>
              </div>
              <p className="text-sm text-gray-600">Generar reportes institucionales</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoordinatorDashboard;