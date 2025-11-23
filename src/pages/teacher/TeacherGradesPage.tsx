import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Award, Users, CheckCircle, Clock, TrendingUp, RefreshCw, BookOpen, Edit, X, Save } from 'lucide-react';
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
    id: number;
    taskTitle: string;
    score: number;
    submittedAt: string;
    status: string;
  }[];
}

const TeacherGradesPage: React.FC = () => {
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const { token } = useAuthStore();

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
        // FILTRAR SOLO CUARTO C
        const filteredGrades = grades.filter((g: string) => g === 'Cuarto C');
        setAvailableGrades(filteredGrades);
        if (filteredGrades.length > 0) {
          setSelectedGrade(filteredGrades[0]);
        }
      }
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  };

  const loadStudentGrades = useCallback(async () => {
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
        const studentsData = data.students || data || [];
        console.log('📊 Datos de estudiantes recibidos:', studentsData);
        if (studentsData.length > 0) {
          console.log('📝 Primera submission de ejemplo:', studentsData[0].submissions?.[0]);
        }
        setStudents(studentsData);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error loading student grades:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [token, selectedGrade]);

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

  const handleEditScore = (submissionIndex: number, currentScore: number) => {
    setEditingSubmission(submissionIndex);
    setEditScore(currentScore.toString());
  };

  // useEffects después de declarar todas las funciones
  useEffect(() => {
    loadAvailableGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      loadStudentGrades();
    }
  }, [selectedGrade, loadStudentGrades]);

  const handleSaveScore = async (submissionIndex: number) => {
    if (!selectedStudent || !token) return;

    const newScore = parseFloat(editScore);
    if (isNaN(newScore) || newScore < 0 || newScore > 5) {
      alert('La nota debe estar entre 0 y 5');
      return;
    }

    try {
      setSaving(true);
      
      // Encontrar la submission correcta (puede estar en pendientes o calificadas)
      const allSubmissions = selectedStudent.submissions;
      const submission = allSubmissions[submissionIndex];
      
      if (!submission || !submission.id) {
        alert('Error: No se encontró el ID de la entrega');
        setSaving(false);
        return;
      }
      
      const response = await fetch(`/api/teacher/submissions/${submission.id}/grade`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: newScore,
          feedback: 'Nota actualizada'
        })
      });

      if (response.ok) {
        // Actualizar localmente
        const updatedStudent = { ...selectedStudent };
        updatedStudent.submissions[submissionIndex].score = newScore;
        
        // Recalcular promedio
        const totalScore = updatedStudent.submissions.reduce((sum, s) => sum + s.score, 0);
        updatedStudent.averageGrade = totalScore / updatedStudent.totalTasks;
        
        setSelectedStudent(updatedStudent);
        
        // Actualizar en la lista
        setStudents(students.map(s => 
          s.id === updatedStudent.id ? updatedStudent : s
        ));
        
        setEditingSubmission(null);
      } else {
        alert('Error al actualizar la nota');
      }
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Error al guardar la nota');
    } finally {
      setSaving(false);
    }
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
                      <tr 
                        key={student.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                      >
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

      {/* Modal de edición de notas */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                <p className="text-sm text-gray-600">{selectedStudent.email}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setEditingSubmission(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Promedio</p>
                  <p className="text-3xl font-bold text-blue-900">{selectedStudent.averageGrade.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Completadas</p>
                  <p className="text-3xl font-bold text-green-900">{selectedStudent.completedTasks}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-900">{selectedStudent.pendingTasks}</p>
                </div>
              </div>

              {/* Entregas pendientes de calificar */}
              {selectedStudent.submissions.filter(s => !s.score || s.score === 0).length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Pendientes de Calificar ({selectedStudent.submissions.filter(s => !s.score || s.score === 0).length})
                  </h3>
                  <div className="space-y-3 mb-6">
                    {selectedStudent.submissions
                      .filter(s => !s.score || s.score === 0)
                      .map((submission, index) => (
                        <div key={`pending-${index}`} className="border-2 border-orange-200 bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{submission.taskTitle}</p>
                              <p className="text-sm text-gray-500">
                                Entregado: {new Date(submission.submittedAt).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {editingSubmission === index ? (
                                <>
                                  <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={editScore}
                                    onChange={(e) => setEditScore(e.target.value)}
                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    disabled={saving}
                                    placeholder="0.0"
                                  />
                                  <Button
                                    onClick={() => handleSaveScore(index)}
                                    size="sm"
                                    disabled={saving}
                                    className="flex items-center gap-1"
                                  >
                                    <Save className="h-4 w-4" />
                                    {saving ? 'Guardando...' : 'Calificar'}
                                  </Button>
                                  <Button
                                    onClick={() => setEditingSubmission(null)}
                                    variant="outline"
                                    size="sm"
                                    disabled={saving}
                                  >
                                    Cancelar
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Badge className="bg-orange-100 text-orange-800">
                                    Sin calificar
                                  </Badge>
                                  <Button
                                    onClick={() => handleEditScore(index, 0)}
                                    size="sm"
                                    className="flex items-center gap-1"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Calificar
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Entregas Calificadas ({selectedStudent.submissions.filter(s => s.score && s.score > 0).length})
              </h3>
              
              {selectedStudent.submissions.filter(s => s.score && s.score > 0).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay entregas calificadas</p>
              ) : (
                <div className="space-y-3">
                  {selectedStudent.submissions
                    .filter(s => s.score && s.score > 0)
                    .map((submission, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{submission.taskTitle}</p>
                          <p className="text-sm text-gray-500">
                            Entregado: {new Date(submission.submittedAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {editingSubmission === index ? (
                            <>
                              <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={editScore}
                                onChange={(e) => setEditScore(e.target.value)}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                disabled={saving}
                              />
                              <Button
                                onClick={() => handleSaveScore(index)}
                                size="sm"
                                disabled={saving}
                                className="flex items-center gap-1"
                              >
                                <Save className="h-4 w-4" />
                                {saving ? 'Guardando...' : 'Guardar'}
                              </Button>
                              <Button
                                onClick={() => setEditingSubmission(null)}
                                variant="outline"
                                size="sm"
                                disabled={saving}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getGradeColor(submission.score)}`}>
                                {submission.score.toFixed(1)}
                              </div>
                              <Button
                                onClick={() => handleEditScore(index, submission.score)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                Editar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => {
                  setSelectedStudent(null);
                  setEditingSubmission(null);
                  loadStudentGrades(); // Recargar datos
                }}
                variant="outline"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherGradesPage;
