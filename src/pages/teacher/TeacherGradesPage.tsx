import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Award, Users, CheckCircle, Clock, TrendingUp, RefreshCw, BookOpen } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface StudentGrade {
  id: number;
  name: string;
  email: string;
  grade: string;
  averageGrade: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  submissions: {
    taskTitle: string;
    score: number;
    submittedAt: string;
  }[];
}

const TeacherGradesPage: React.FC = () => {
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    loadAvailableGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      loadStudentGrades();
    }
  }, [selectedGrade]);

  const loadAvailableGrades = async () => {
    try {
      if (!token) return;

      const response = await fetch('/api/teacher/tasks/grades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const grades = Array.isArray(data) ? data : (data.grades || []);
        setAvailableGrades(grades);
        if (grades.length > 0) {
          setSelectedGrade(grades[0]);
        }
      }
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  const loadStudentGrades = async () => {
    try {
      setLoading(true);
      if (!token || !selectedGrade) return;

      const response = await fetch(`/api/teacher/grades/students?grade=${encodeURIComponent(selectedGrade)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || data || []);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error loading student grades:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'text-green-600 bg-green-50';
    if (grade >= 4.0) return 'text-blue-600 bg-blue-50';
    if (grade >= 3.0) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeBadge = (grade: number) => {
    if (grade >= 4.5) return { text: 'Excelente', color: 'bg-green-100 text-green-800' };
    if (grade >= 4.0) return { text: 'Bueno', color: 'bg-blue-100 text-blue-800' };
    if (grade >= 3.0) return { text: 'Aceptable', color: 'bg-orange-100 text-orange-800' };
    return { text: 'Bajo', color: 'bg-red-100 text-red-800' };
  };

  const calculateClassAverage = () => {
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, student) => acc + student.averageGrade, 0);
    return (sum / students.length).toFixed(2);
  };

  const getCompletionRate = () => {
    if (students.length === 0) return 0;
    const totalTasks = students.reduce((acc, s) => acc + s.totalTasks, 0);
    const completedTasks = students.reduce((acc, s) => acc + s.completedTasks, 0);
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  if (loading && !selectedGrade) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Calificaciones"
          description="Consulta las calificaciones de tus estudiantes"
          icon={Award}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calificaciones"
        description="Consulta las calificaciones y progreso de tus estudiantes"
        icon={Award}
        action={
          <Button
            onClick={loadStudentGrades}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        }
      />

      {/* Selector de grado */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Seleccionar Grado:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableGrades.map((grade) => (
                <Button
                  key={grade}
                  variant={selectedGrade === grade ? 'default' : 'outline'}
                  onClick={() => setSelectedGrade(grade)}
                  size="sm"
                  className={selectedGrade === grade ? 'bg-primary text-white' : ''}
                >
                  {grade}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">{calculateClassAverage()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasa de Entrega</p>
                <p className="text-2xl font-bold text-gray-900">{getCompletionRate()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.averageGrade >= 3.0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de estudiantes */}
      {loading ? (
        <LoadingSpinner />
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay estudiantes
            </h3>
            <p className="text-gray-600">
              No se encontraron estudiantes para el grado seleccionado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Estudiantes de {selectedGrade}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Estudiante</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Promedio</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Desempeño</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Entregas</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Pendientes</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const badge = getGradeBadge(student.averageGrade);
                    const progressPercentage = student.totalTasks > 0
                      ? Math.round((student.completedTasks / student.totalTasks) * 100)
                      : 0;

                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getGradeColor(student.averageGrade)}`}>
                            <span className="text-2xl font-bold">
                              {student.averageGrade.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={badge.color}>
                            {badge.text}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-lg font-semibold text-gray-900">
                              {student.completedTasks}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <span className="text-lg font-semibold text-gray-900">
                              {student.pendingTasks}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-primary h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">
                              {progressPercentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherGradesPage;
