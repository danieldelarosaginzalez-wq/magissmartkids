import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, TrendingUp, RefreshCw, Award, Calendar, Users, Plus, X, CheckCircle, Clock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface TeacherSubject {
  id: string;
  name: string;
  teacher: string; // Para mostrar "Impartida por [Profesor]"
  progress: number;
  grade: number; // Promedio de calificaciones de estudiantes
  color: string;
  totalTasks: number;
  completedTasks: number; // Tareas asignadas
  nextTask?: string; // Próxima tarea por asignar
  nextTaskDate?: string;
}

const TeacherSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStudentsModal, setShowStudentsModal] = useState<TeacherSubject | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState<TeacherSubject | null>(null);
  const [taskForm, setTaskForm] = useState({
    titulo: '',
    descripcion: '',
    fechaEntrega: '',
    tipo: 'traditional'
  });
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      
      // 🎭 DATOS FALSOS PARA LA PRESENTACIÓN - Mismas materias que ve el estudiante
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const fakeSubjects: TeacherSubject[] = [
        {
          id: '1',
          name: 'Matemáticas',
          teacher: 'Impartida por ti', // Perspectiva del profesor
          progress: 75, // 3 de 4 tareas asignadas = 75%
          grade: 4.5, // Promedio de calificaciones de estudiantes
          color: '#3B82F6',
          totalTasks: 4,
          completedTasks: 3, // Tareas ya asignadas
          nextTask: 'Ejercicios de Sumas y Restas',
          nextTaskDate: '2025-10-28'
        },
        {
          id: '2',
          name: 'Español',
          teacher: 'Impartida por ti',
          progress: 67, // 2 de 3 tareas asignadas = 67%
          grade: 4.2,
          color: '#10B981',
          totalTasks: 3,
          completedTasks: 2,
          nextTask: 'Lectura del Cuento "El Patito Feo"',
          nextTaskDate: '2025-10-30'
        },
        {
          id: '3',
          name: 'Ciencias Naturales',
          teacher: 'Impartida por ti',
          progress: 100, // 3 de 3 tareas asignadas = 100% ✅
          grade: 4.2,
          color: '#8B5CF6',
          totalTasks: 3,
          completedTasks: 3,
          nextTask: undefined, // Todas las tareas asignadas
          nextTaskDate: undefined
        },
        {
          id: '4',
          name: 'Sociales',
          teacher: 'Impartida por ti',
          progress: 100, // 2 de 2 tareas asignadas = 100% ✅
          grade: 4.6,
          color: '#F59E0B',
          totalTasks: 2,
          completedTasks: 2,
          nextTask: undefined, // Todas las tareas asignadas
          nextTaskDate: undefined
        },
        {
          id: '5',
          name: 'Inglés',
          teacher: 'Impartida por ti',
          progress: 67, // 2 de 3 tareas asignadas = 67%
          grade: 4.0,
          color: '#EF4444',
          totalTasks: 3,
          completedTasks: 2,
          nextTask: 'Quiz de Colores en Inglés',
          nextTaskDate: '2025-11-02'
        }
      ];
      
      setSubjects(fakeSubjects);
    } catch (error) {
      console.error('Error loading teacher subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // 🎭 SIMULACIÓN: Ver estudiantes de una materia
  const handleViewStudents = (subject: TeacherSubject) => {
    setShowStudentsModal(subject);
  };

  // 🎭 SIMULACIÓN: Crear nueva tarea para una materia
  const handleCreateTask = (subject: TeacherSubject) => {
    setShowCreateTaskModal(subject);
    setTaskForm({
      titulo: '',
      descripcion: '',
      fechaEntrega: '',
      tipo: 'traditional'
    });
  };

  // 🎭 SIMULACIÓN: Procesar creación de tarea
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCreateTaskModal) return;

    setIsCreatingTask(true);
    
    // Simular delay de creación
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular éxito
    alert(`✅ Tarea "${taskForm.titulo}" creada exitosamente para ${showCreateTaskModal.name}!`);
    
    setIsCreatingTask(false);
    setShowCreateTaskModal(null);
    
    // Opcional: Actualizar el progreso de la materia
    setSubjects(prev => prev.map(s => 
      s.id === showCreateTaskModal.id 
        ? { ...s, completedTasks: s.completedTasks + 1, progress: Math.min(100, ((s.completedTasks + 1) / s.totalTasks) * 100) }
        : s
    ));
  };

  // Datos simulados de estudiantes
  const getStudentsForSubject = () => {
    return [
      { id: 1, name: 'Ana María García', grade: 4.8, tasksCompleted: 3, totalTasks: 4, lastActivity: '2025-10-26' },
      { id: 2, name: 'Carlos Rodríguez', grade: 4.2, tasksCompleted: 2, totalTasks: 4, lastActivity: '2025-10-25' },
      { id: 3, name: 'María González', grade: 4.6, tasksCompleted: 4, totalTasks: 4, lastActivity: '2025-10-27' },
      { id: 4, name: 'Juan Pérez', grade: 3.9, tasksCompleted: 2, totalTasks: 4, lastActivity: '2025-10-24' },
      { id: 5, name: 'Sofía López', grade: 4.7, tasksCompleted: 3, totalTasks: 4, lastActivity: '2025-10-26' },
      { id: 6, name: 'Diego Martínez', grade: 4.1, tasksCompleted: 3, totalTasks: 4, lastActivity: '2025-10-25' },
      { id: 7, name: 'Valentina Ruiz', grade: 4.9, tasksCompleted: 4, totalTasks: 4, lastActivity: '2025-10-27' },
      { id: 8, name: 'Andrés Castro', grade: 4.0, tasksCompleted: 2, totalTasks: 4, lastActivity: '2025-10-23' }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Materias"
          description="Gestiona tus materias y grados asignados"
          icon={BookOpen}
        />
        <LoadingSpinner />
      </div>
    );
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'bg-green-100 text-green-800 border-green-200';
    if (grade >= 4.0) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade >= 3.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return '#10B981'; // Verde
    if (progress >= 80) return '#3B82F6'; // Azul
    if (progress >= 70) return '#F59E0B'; // Amarillo
    return '#EF4444'; // Rojo
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Materias"
        description="Gestiona tus materias y grados asignados"
        icon={BookOpen}
        action={
          <Button 
            onClick={loadSubjects}
            variant="outline"
            className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {/* Resumen general - EXACTAMENTE IGUAL AL ESTUDIANTE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Materias</p>
                <p className="text-2xl font-bold text-gray-900">{subjects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(subjects.reduce((acc, s) => acc + s.grade, 0) / subjects.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de materias - EXACTAMENTE IGUAL AL ESTUDIANTE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <Card 
            key={subject.id} 
            className="border-secondary-200 hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-neutral-black flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    {subject.name}
                  </CardTitle>
                  <p className="text-sm text-secondary mt-1">
                    {subject.teacher}
                  </p>
                </div>
                <Badge className={getGradeColor(subject.grade)}>
                  {subject.grade.toFixed(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progreso - IGUAL AL ESTUDIANTE */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Progreso</span>
                  <span className="text-sm text-gray-500">{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${subject.progress}%`,
                      backgroundColor: getProgressColor(subject.progress)
                    }}
                  ></div>
                </div>
              </div>

              {/* Estadísticas de tareas - ADAPTADO PARA PROFESOR */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{subject.completedTasks}</p>
                  <p className="text-xs text-gray-600">Asignadas</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{subject.totalTasks - subject.completedTasks}</p>
                  <p className="text-xs text-gray-600">Por Asignar</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{subject.totalTasks}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>

              {/* Próxima tarea o estado completado - ADAPTADO PARA PROFESOR */}
              {subject.nextTask ? (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Próxima tarea por asignar</span>
                  </div>
                  <p className="text-sm text-blue-700">{subject.nextTask}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Fecha límite: {new Date(subject.nextTaskDate!).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">¡Todas asignadas!</span>
                  </div>
                  <p className="text-sm text-green-700">Todas las tareas han sido asignadas</p>
                </div>
              )}

              {/* Acciones - ADAPTADO PARA PROFESOR */}
              <div className="flex gap-2 pt-2 border-t border-secondary-200">
                <Button 
                  onClick={() => handleViewStudents(subject)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Ver Estudiantes
                </Button>
                <Button 
                  onClick={() => handleCreateTask(subject)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Crear Tarea
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🎭 MODAL: Ver Estudiantes */}
      {showStudentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  👥 Estudiantes de {showStudentsModal.name}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStudentsModal(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getStudentsForSubject().map((student) => (
                  <Card key={student.id} className="border-secondary-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{student.name}</h3>
                          <p className="text-xs text-gray-600">Grado 5° A</p>
                        </div>
                        <Badge className={getGradeColor(student.grade)}>
                          {student.grade.toFixed(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progreso:</span>
                          <span className="font-medium">{student.tasksCompleted}/{student.totalTasks}</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(student.tasksCompleted / student.totalTasks) * 100}%`,
                              backgroundColor: getProgressColor((student.tasksCompleted / student.totalTasks) * 100)
                            }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>Última actividad: {new Date(student.lastActivity).toLocaleDateString()}</span>
                        </div>
                        
                        {student.tasksCompleted === student.totalTasks && (
                          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                            <CheckCircle className="h-3 w-3" />
                            <span>¡Al día con todas las tareas!</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Resumen del Grupo</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-blue-900">8</p>
                    <p className="text-blue-700">Total Estudiantes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-green-900">3</p>
                    <p className="text-green-700">Al Día</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-yellow-900">5</p>
                    <p className="text-yellow-700">En Progreso</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-900">4.4</p>
                    <p className="text-blue-700">Promedio Grupo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🎭 MODAL: Crear Tarea */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  ✨ Nueva Tarea para {showCreateTaskModal.name}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateTaskModal(null)}
                  disabled={isCreatingTask}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmitTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Título de la Tarea
                  </label>
                  <input
                    type="text"
                    value={taskForm.titulo}
                    onChange={(e) => setTaskForm({...taskForm, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ej: Ejercicios de Fracciones"
                    required
                    disabled={isCreatingTask}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={taskForm.descripcion}
                    onChange={(e) => setTaskForm({...taskForm, descripcion: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Describe las instrucciones de la tarea..."
                    disabled={isCreatingTask}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Fecha de Entrega
                    </label>
                    <input
                      type="date"
                      value={taskForm.fechaEntrega}
                      onChange={(e) => setTaskForm({...taskForm, fechaEntrega: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                      disabled={isCreatingTask}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">
                      Tipo de Tarea
                    </label>
                    <select
                      value={taskForm.tipo}
                      onChange={(e) => setTaskForm({...taskForm, tipo: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      disabled={isCreatingTask}
                    >
                      <option value="traditional">📸 Tarea de Evidencia</option>
                      <option value="interactive">🎮 Actividad Interactiva</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Información de la Materia</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Materia:</span>
                      <span className="ml-2 font-medium">{showCreateTaskModal.name}</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Grado:</span>
                      <span className="ml-2 font-medium">5° A</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Estudiantes:</span>
                      <span className="ml-2 font-medium">25 estudiantes</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Progreso actual:</span>
                      <span className="ml-2 font-medium">{showCreateTaskModal.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                    disabled={isCreatingTask}
                  >
                    {isCreatingTask ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creando Tarea...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Crear Tarea
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateTaskModal(null)}
                    className="border-secondary-300 text-secondary hover:bg-secondary-50"
                    disabled={isCreatingTask}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherSubjectsPage;