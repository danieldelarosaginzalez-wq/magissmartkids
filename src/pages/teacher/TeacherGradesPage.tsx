import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BarChart3, User, FileText, Save, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

interface GradeTask {
  taskId: number;
  studentId: number;
  studentName: string;
  taskTitle: string;
  submissionText?: string;
  submissionFileUrl?: string;
  submittedAt?: string;
  currentScore?: number;
  maxScore: number;
  feedback?: string;
  status: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  grade: string;
  avatarUrl?: string;
  isActive: boolean;
  averageScore: number;
  completedTasks: number;
  pendingTasks: number;
}

const TeacherGradesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [gradingTasks, setGradingTasks] = useState<GradeTask[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingMode, setGradingMode] = useState<'tasks' | 'students'>('tasks');
  const [selectedTask, setSelectedTask] = useState<GradeTask | null>(null);
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });

  const materia = searchParams.get('materia');
  const grado = searchParams.get('grado');

  useEffect(() => {
    if (materia && grado) {
      loadGradingData();
    } else {
      loadStudents();
    }
  }, [materia, grado]);

  const loadGradingData = async () => {
    if (!materia || !grado) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/teacher/grades?subjectId=${materia}&grade=${encodeURIComponent(grado)}`);
      setGradingTasks(response.data);
    } catch (error) {
      console.error('Error loading grading tasks:', error);
      setGradingTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    if (!grado) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/teacher/students?grade=${encodeURIComponent(grado)}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeTask = async (taskId: number) => {
    try {
      await api.put(`/teacher/tasks/${taskId}/grade`, {
        newScore: parseFloat(gradeForm.score),
        newFeedback: gradeForm.feedback
      });
      
      setSelectedTask(null);
      setGradeForm({ score: '', feedback: '' });
      loadGradingData();
    } catch (error) {
      console.error('Error grading task:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      case 'GRADED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Calificada</Badge>;
      case 'PENDING':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Sin Entregar</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'GRADED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Calificaciones"
          description="Revisa y califica las tareas de tus estudiantes"
          icon={BarChart3}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calificaciones"
        description={materia && grado ? `${grado} - Tareas por calificar` : "Gestión de calificaciones"}
        icon={BarChart3}
        action={
          <div className="flex gap-2">
            <Button 
              onClick={() => setGradingMode(gradingMode === 'tasks' ? 'students' : 'tasks')}
              variant="outline"
              className="border-secondary-300 text-secondary hover:bg-secondary-50"
            >
              {gradingMode === 'tasks' ? 'Ver Estudiantes' : 'Ver Tareas'}
            </Button>
            <Button 
              onClick={materia && grado ? loadGradingData : loadStudents}
              variant="outline"
              className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        }
      />

      {/* Modal de calificación */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Calificar Tarea: {selectedTask.taskTitle}
              </CardTitle>
              <p className="text-sm text-secondary">
                Estudiante: {selectedTask.studentName}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Entrega del estudiante */}
              <div className="space-y-2">
                <h4 className="font-medium text-neutral-black">Entrega del Estudiante:</h4>
                {selectedTask.submissionText ? (
                  <div className="p-3 bg-secondary-50 rounded-lg border">
                    <p className="text-sm text-neutral-black whitespace-pre-wrap">
                      {selectedTask.submissionText}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-secondary italic">Sin texto de entrega</p>
                )}
                
                {selectedTask.submissionFileUrl && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      📎 Archivo adjunto: 
                      <a 
                        href={selectedTask.submissionFileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 underline hover:text-blue-600"
                      >
                        Ver archivo
                      </a>
                    </p>
                  </div>
                )}
                
                {selectedTask.submittedAt && (
                  <p className="text-xs text-secondary">
                    Entregado: {new Date(selectedTask.submittedAt).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Formulario de calificación */}
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Calificación (máximo: {selectedTask.maxScore})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedTask.maxScore}
                    step="0.1"
                    value={gradeForm.score}
                    onChange={(e) => setGradeForm({...gradeForm, score: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder={`0 - ${selectedTask.maxScore}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Retroalimentación
                  </label>
                  <textarea
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={4}
                    placeholder="Escribe comentarios y sugerencias para el estudiante..."
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => handleGradeTask(selectedTask.taskId)}
                  className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                  disabled={!gradeForm.score}
                >
                  <Save className="h-4 w-4" />
                  Guardar Calificación
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedTask(null);
                    setGradeForm({ score: '', feedback: '' });
                  }}
                  className="border-secondary-300 text-secondary hover:bg-secondary-50"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contenido principal */}
      {gradingMode === 'tasks' ? (
        /* Vista de tareas por calificar */
        gradingTasks.length === 0 ? (
          <EmptyState
            icon="file"
            title="No hay tareas por calificar"
            description={materia && grado ? "Todas las tareas han sido calificadas." : "Selecciona una materia y grado para ver las tareas."}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gradingTasks.map((task) => (
              <Card 
                key={`${task.taskId}-${task.studentId}`} 
                className="border-secondary-200 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-neutral-black flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        {task.taskTitle}
                      </CardTitle>
                      <p className="text-sm text-secondary mt-1">
                        Estudiante: {task.studentName}
                      </p>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Información de la entrega */}
                  <div className="space-y-2">
                    {task.submittedAt && (
                      <p className="text-sm text-secondary">
                        📅 Entregado: {new Date(task.submittedAt).toLocaleString()}
                      </p>
                    )}
                    
                    {task.currentScore !== undefined && task.currentScore !== null ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary">Calificación:</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {task.currentScore}/{task.maxScore}
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-sm text-yellow-600">⏳ Pendiente de calificación</p>
                    )}
                  </div>

                  {/* Vista previa de la entrega */}
                  {task.submissionText && (
                    <div className="p-3 bg-secondary-50 rounded-lg border">
                      <p className="text-sm text-neutral-black line-clamp-3">
                        {task.submissionText}
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2 border-t border-secondary-200">
                    <Button 
                      onClick={() => {
                        setSelectedTask(task);
                        setGradeForm({
                          score: task.currentScore?.toString() || '',
                          feedback: task.feedback || ''
                        });
                      }}
                      className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                      size="sm"
                    >
                      <BarChart3 className="h-4 w-4" />
                      {task.currentScore ? 'Editar Calificación' : 'Calificar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* Vista de estudiantes */
        students.length === 0 ? (
          <EmptyState
            icon="users"
            title="No hay estudiantes"
            description="No se encontraron estudiantes para este grado."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card 
                key={student.id} 
                className="border-secondary-200 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {student.avatarUrl ? (
                        <img 
                          src={student.avatarUrl} 
                          alt={student.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-neutral-black">
                        {student.fullName}
                      </CardTitle>
                      <p className="text-sm text-secondary">
                        {student.grade}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Estadísticas del estudiante */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-800">
                        {student.averageScore.toFixed(1)}
                      </p>
                      <p className="text-xs text-green-600">Promedio</p>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-800">
                        {student.completedTasks}
                      </p>
                      <p className="text-xs text-blue-600">Completadas</p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <p className="text-lg font-bold text-yellow-800">
                        {student.pendingTasks}
                      </p>
                      <p className="text-xs text-yellow-600">Pendientes</p>
                    </div>
                  </div>

                  {/* Estado del estudiante */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary">Estado:</span>
                    <Badge className={student.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {student.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default TeacherGradesPage;