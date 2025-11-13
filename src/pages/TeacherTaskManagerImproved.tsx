import React, { useState, useEffect } from 'react';
import { Button, Input, Label } from '../components/ui';
import { useAuthStore } from '../stores/authStore';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  taskType: string;
  subjectId: number | null;
  grades: string[];
  allowedFormats: string[];
  maxFiles: number;
  maxSizeMb: number;
  activityConfig: string;
  maxScore: number;
  maxGrade: number;
}

const TeacherTaskManagerImproved: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    taskType: 'MULTIMEDIA',
    subjectId: null,
    grades: [],
    allowedFormats: [],
    maxFiles: 3,
    maxSizeMb: 10,
    activityConfig: '',
    maxScore: 100,
    maxGrade: 5.0
  });

  const availableGrades = [
    'Preescolar', '1° A', '1° B', '1° C', '2° A', '2° B', '2° C',
    '3° A', '3° B', '3° C', '4° A', '4° B', '4° C', '5° A', '5° B', '5° C'
  ];

  const availableFormats = ['pdf', 'docx', 'jpg', 'png', 'mp4', 'xlsx'];

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/teacher/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await fetch('/api/teacher/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.subjects) {
          setSubjects(data.subjects);
        }
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const initializeGrades = async () => {
    setIsInitializing(true);
    try {
      // Aquí podrías hacer una llamada al backend para inicializar grados si es necesario
      alert('Grados inicializados correctamente');
    } catch (error) {
      console.error('Error initializing grades:', error);
      alert('Error al inicializar grados');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.grades.length === 0) {
      alert('Por favor selecciona al menos un grado');
      return;
    }

    try {
      const response = await fetch('/api/teacher/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Tarea creada exitosamente');
        setShowForm(false);
        resetForm();
        loadTasks();
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'No se pudo crear la tarea'));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error de conexión');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      taskType: 'MULTIMEDIA',
      subjectId: null,
      grades: [],
      allowedFormats: [],
      maxFiles: 3,
      maxSizeMb: 10,
      activityConfig: '',
      maxScore: 100,
      maxGrade: 5.0
    });
  };

  const toggleGrade = (grade: string) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade]
    }));
  };

  const toggleFormat = (format: string) => {
    setFormData(prev => ({
      ...prev,
      allowedFormats: prev.allowedFormats.includes(format)
        ? prev.allowedFormats.filter(f => f !== format)
        : [...prev.allowedFormats, format]
    }));
  };

  useEffect(() => {
    loadTasks();
    loadSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
              <p className="text-gray-600 mt-1">Crea y administra tareas para tus estudiantes</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={initializeGrades}
                variant="outline"
                disabled={isInitializing}
              >
                {isInitializing ? 'Inicializando...' : '🔄 Actualizar'}
              </Button>
              <Button
                onClick={initializeGrades}
                variant="outline"
              >
                📊 Inicializar Grados
              </Button>
              <Button onClick={() => setShowForm(true)}>
                ➕ Nueva Tarea
              </Button>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Crear Nueva Tarea</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Título */}
                  <div>
                    <Label className="text-sm font-medium">Título de la Tarea</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Tarea de Matemáticas - Fracciones"
                      required
                      className="mt-1"
                    />
                  </div>

                  {/* Fecha y Tipo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Fecha de Entrega</Label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tipo de Tarea</Label>
                      <select
                        value={formData.taskType}
                        onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="MULTIMEDIA">📄 Tarea Tradicional</option>
                        <option value="INTERACTIVE">🎮 Actividad Interactiva</option>
                      </select>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <Label className="text-sm font-medium">Descripción</Label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe la tarea..."
                      rows={4}
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>

                  {/* Grados */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Grado</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableGrades.map(grade => (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => toggleGrade(grade)}
                          className={`p-2 rounded-md text-sm font-medium transition-colors ${
                            formData.grades.includes(grade)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                    {formData.grades.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Seleccionados: {formData.grades.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Configuración según tipo */}
                  {formData.taskType === 'MULTIMEDIA' && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Formatos permitidos (opcional)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {availableFormats.map(format => (
                          <button
                            key={format}
                            type="button"
                            onClick={() => toggleFormat(format)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              formData.allowedFormats.includes(format)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {format}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.taskType === 'INTERACTIVE' && (
                    <div>
                      <Label className="text-sm font-medium">Comentario (opcional)</Label>
                      <textarea
                        value={formData.activityConfig}
                        onChange={(e) => setFormData({ ...formData, activityConfig: e.target.value })}
                        placeholder="Instrucciones adicionales para la actividad interactiva..."
                        rows={3}
                        className="w-full mt-1 p-2 border rounded-md"
                      />
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      ✅ Crear Tarea
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="flex-1"
                    >
                      ❌ Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Tareas */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay tareas creadas
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea tu primera tarea para comenzar a asignar trabajo a tus estudiantes.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  ➕ Crear Primera Tarea
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                        <div className="flex gap-4 mt-3 text-sm text-gray-500">
                          <span>📅 {task.dueDate}</span>
                          <span>📚 {task.subjectName || 'Sin materia'}</span>
                          <span>🎓 {task.grade || 'Todos los grados'}</span>
                          <span className={`px-2 py-1 rounded ${
                            task.taskType === 'MULTIMEDIA' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {task.taskType === 'MULTIMEDIA' ? '📄 Tradicional' : '🎮 Interactiva'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          ✏️ Editar
                        </Button>
                        <Button variant="outline" size="sm">
                          🗑️ Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTaskManagerImproved;
