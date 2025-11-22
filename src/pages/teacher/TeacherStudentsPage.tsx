import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, ArrowLeft, Mail, Award, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { teacherApi } from '../../services/api';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  grade: string;
  avatarUrl?: string;
  averageScore: number;
  completedTasks: number;
  pendingTasks: number;
  isActive: boolean;
}

const TeacherStudentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const grade = searchParams.get('grade') || '';

  useEffect(() => {
    if (grade) {
      loadStudents();
    }
  }, [grade]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando estudiantes para el grado:', grade);
      console.log('🔍 URL completa:', window.location.href);
      
      const response = await teacherApi.getStudentsByGrade(grade);
      console.log('✅ Respuesta del servidor:', response);
      console.log('✅ Estudiantes cargados:', response.data);
      console.log('✅ Cantidad de estudiantes:', response.data?.length || 0);
      
      // Eliminar duplicados basándose en el ID del estudiante
      const uniqueStudents = (response.data || []).reduce((acc: Student[], current: Student) => {
        const exists = acc.find(item => item.id === current.id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      
      console.log('✅ Estudiantes únicos:', uniqueStudents);
      console.log('✅ Cantidad de estudiantes únicos:', uniqueStudents.length);
      setStudents(uniqueStudents);
    } catch (error) {
      console.error('❌ Error loading students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getDemoStudents = (): Student[] => {
    return [
      {
        id: 1,
        firstName: 'Ana',
        lastName: 'García',
        fullName: 'Ana García',
        email: 'ana.garcia@estudiante.com',
        grade: grade,
        averageScore: 4.5,
        completedTasks: 8,
        pendingTasks: 2,
        isActive: true
      },
      {
        id: 2,
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        fullName: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@estudiante.com',
        grade: grade,
        averageScore: 4.2,
        completedTasks: 7,
        pendingTasks: 3,
        isActive: true
      },
      {
        id: 3,
        firstName: 'María',
        lastName: 'López',
        fullName: 'María López',
        email: 'maria.lopez@estudiante.com',
        grade: grade,
        averageScore: 4.8,
        completedTasks: 10,
        pendingTasks: 0,
        isActive: true
      },
      {
        id: 4,
        firstName: 'Juan',
        lastName: 'Martínez',
        fullName: 'Juan Martínez',
        email: 'juan.martinez@estudiante.com',
        grade: grade,
        averageScore: 3.9,
        completedTasks: 6,
        pendingTasks: 4,
        isActive: true
      },
      {
        id: 5,
        firstName: 'Sofía',
        lastName: 'Hernández',
        fullName: 'Sofía Hernández',
        email: 'sofia.hernandez@estudiante.com',
        grade: grade,
        averageScore: 4.6,
        completedTasks: 9,
        pendingTasks: 1,
        isActive: true
      }
    ];
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 4.0) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (score >= 3.5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Estudiantes de ${grade}`}
          description="Lista de estudiantes del grado"
          icon={Users}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Estudiantes de ${grade}`}
        description="Todos los estudiantes del grado"
        icon={Users}
        action={
          <Button
            onClick={() => navigate('/profesor/materias')}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Materias
          </Button>
        }
      />

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
                <p className="text-2xl font-bold text-primary">{students.length}</p>
              </div>
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Promedio General</p>
                <p className="text-2xl font-bold text-orange-600">
                  {students.length > 0 
                    ? (students.reduce((acc, s) => acc + s.averageScore, 0) / students.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tareas Completadas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {students.reduce((acc, s) => acc + s.completedTasks, 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-gray-700">
                  {students.reduce((acc, s) => acc + s.pendingTasks, 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de estudiantes */}
      {students.length === 0 ? (
        <Card className="border-secondary-200">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-neutral-black mb-2">
              No hay estudiantes en este grado
            </h3>
            <p className="text-secondary">
              No se encontraron estudiantes asignados a {grade}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card 
              key={student.id}
              className="border-secondary-200 hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {student.avatarUrl ? (
                      <img 
                        src={student.avatarUrl} 
                        alt={student.fullName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(student.firstName, student.lastName)
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-neutral-black mb-1">
                      {student.fullName}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{student.email}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Calificación promedio */}
                <div className={`flex items-center justify-between p-3 rounded-lg border ${getScoreColor(student.averageScore)}`}>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="text-sm font-medium">Promedio</span>
                  </div>
                  <span className="text-xl font-bold">
                    {student.averageScore.toFixed(1)}
                  </span>
                </div>

                {/* Estadísticas de tareas */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-blue-600">{student.completedTasks}</p>
                    <p className="text-xs text-blue-700">Completadas</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-700">{student.pendingTasks}</p>
                    <p className="text-xs text-gray-600">Pendientes</p>
                  </div>
                </div>

                {/* Estado */}
                <div className="pt-2 border-t border-secondary-200">
                  <Badge 
                    variant={student.isActive ? "success" : "secondary"}
                    className="w-full justify-center"
                  >
                    {student.isActive ? '✓ Activo' : '○ Inactivo'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsPage;
