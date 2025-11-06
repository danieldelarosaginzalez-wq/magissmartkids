import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileText, Plus, Calendar, Users, RefreshCw, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, Star, Trophy, BookOpen } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { activityStorage } from '../../services/activityStorage';
import ActivityEditor, { Activity } from '../../components/activities/ActivityEditor';

interface TeacherTask {
  id: number;
  titulo: string;
  descripcion?: string;
  materiaId?: number;
  materia?: string; // Nombre de la materia para mostrar
  grados?: string[];
  fechaEntrega?: string;
  tipo?: string;
  fechaCreacion?: string;
  submissions?: TaskSubmission[];
  activityConfig?: {
    type: string;
    questions: any[];
  };
}

interface TaskSubmission {
  studentId: string;
  studentName: string;
  submissionDate: string;
  score?: number;
  timeUsed?: number;
  files?: string[]; // Para tareas tradicionales
  comments?: string; // Comentarios del estudiante
  answers?: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

interface CreateTaskForm {
  titulo: string;
  descripcion: string;
  materiaId: number;
  grados: string[];
  fechaEntrega: string;
  tipo: string;
  actividadInteractivaId?: string;
  formatosPermitidos?: string[];
  comentario?: string;
  archivosAdjuntos: string[];
}

const TeacherTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [interactiveLibrary, setInteractiveLibrary] = useState<any[]>([]); // Mantener para funcionalidad básica
  const [showActivityEditor, setShowActivityEditor] = useState(false);
  const [draftActivities, setDraftActivities] = useState<Activity[]>([]);
  const [editingDraft, setEditingDraft] = useState(false);
  // const [manageLibraryOpen, setManageLibraryOpen] = useState(false); // Ya no se usa
  const [editingLibraryId, setEditingLibraryId] = useState<string | null>(null);
  const [editingLibraryTask, setEditingLibraryTask] = useState<any | null>(null);
  const [selectedTaskSubmissions, setSelectedTaskSubmissions] = useState<TeacherTask | null>(null);
  const [filter, setFilter] = useState<'todos' | 'multimedia' | 'interactive' | 'pending' | 'completed'>('todos');
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState<CreateTaskForm>({
    titulo: '',
    descripcion: '',
    materiaId: 0,
    grados: [],
    fechaEntrega: '',
    tipo: 'traditional',
    actividadInteractivaId: undefined,
    formatosPermitidos: [],
    comentario: '',
    archivosAdjuntos: []
  });

  const { /* token, */ user } = useAuthStore();
  


  useEffect(() => {
    loadTasks();
    loadAvailableGrades();
    // load interactive activities from local storage
    const lib = activityStorage.getTasks();
    console.log('📚 Biblioteca interactiva cargada:', lib);
    setInteractiveLibrary(lib);
  }, []);

  const handleAddDraftActivity = (activity: Activity) => {
    setDraftActivities(prev => [...prev, activity]);
    // keep editor open so teacher can add more
    setShowActivityEditor(true);
  };

  const handleSaveSingleActivity = (activity: Activity) => {
    // Save single activity immediately as before
    const id = `custom-${Date.now()}`;
    const title = activity.question || `Actividad ${new Date().toLocaleString()}`;
    const newTask = {
      id,
      title,
      description: activity.question || '',
      activities: [activity],
      createdAt: new Date().toISOString()
    } as any;

    try {
      activityStorage.saveTask(newTask);
      const updated = activityStorage.getTasks();
      setInteractiveLibrary(updated);
      setCreateForm({...createForm, actividadInteractivaId: id});
      setShowActivityEditor(false);
    } catch (err) {
      console.error('Error saving new activity:', err);
      alert('No se pudo guardar la actividad. Revisa la consola.');
    }
  };

  const handleSaveDraftAsLibrary = () => {
    if (draftActivities.length === 0) {
      alert('Agrega al menos una pregunta antes de guardar.');
      return;
    }

    const id = `custom-${Date.now()}`;
    const title = `Actividad ${new Date().toLocaleString()}`;
    const newTask = {
      id,
      title,
      description: draftActivities[0]?.question || title,
      activities: draftActivities,
      createdAt: new Date().toISOString()
    } as any;

    try {
      activityStorage.saveTask(newTask);
      const updated = activityStorage.getTasks();
      setInteractiveLibrary(updated);
      // select the newly created activity for the task
      setCreateForm({...createForm, actividadInteractivaId: id});
      // reset draft state
      setDraftActivities([]);
      setShowActivityEditor(false);
      setEditingDraft(false);
    } catch (err) {
      console.error('Error saving draft activities:', err);
      alert('No se pudo guardar la actividad. Revisa la consola.');
    }
  };

  const handleCancelDraft = () => {
    setDraftActivities([]);
    setShowActivityEditor(false);
    setEditingDraft(false);
  };

  // Funciones eliminadas - Ya no se usa gestión de biblioteca de actividades existentes

  // 🗑️ Eliminar tarea
  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?\n\n⚠️ Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeletingTaskId(taskId);
      
      // Simular procesamiento en el servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Eliminar de la lista
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Actualizar almacenamiento
      const savedTasks = localStorage.getItem('altiusv3-teacher-tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const updatedTasks = parsedTasks.filter((task: any) => task.id !== taskId);
        localStorage.setItem('altiusv3-teacher-tasks', JSON.stringify(updatedTasks));
      }
      
      setDeletingTaskId(null);
      alert('✅ Tarea eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      setDeletingTaskId(null);
      alert('❌ Error al eliminar la tarea. Inténtalo de nuevo.');
    }
  };

  // ✏️ Editar tarea
  const handleEditTask = (task: TeacherTask) => {
    alert(`📝 Editor de tareas\n\nTarea: ${task.titulo}\nTipo: ${task.tipo === 'interactive' ? 'Actividad Interactiva' : 'Tarea Tradicional'}\nFecha de entrega: ${task.fechaEntrega ? new Date(task.fechaEntrega).toLocaleDateString() : 'No definida'}\n\n🚧 Funcionalidad próximamente disponible`);
  };

  // Función eliminada - Ya no se usa biblioteca de actividades existentes

  const loadAvailableGrades = async () => {
    try {
      console.log('🎓 Cargando grados disponibles...');
      // 🎭 COMENTADO TEMPORALMENTE - Solo frontend para presentación
      // const response = await fetch('/api/teacher/tasks/grades');
      // console.log('📡 Response status:', response.status);
      
      // Usar datos falsos directamente
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay
      const fallback = [
        'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      ];
      setAvailableGrades(fallback);
      
      // if (response.ok) {
      //   const data = await response.json();
      //   console.log('📥 Response data:', data);
      //   // Backend returns { success: true, grades: [...] } but keep fallback
      //   if (data && Array.isArray(data)) {
      //     setAvailableGrades(data);
      //   } else if (data && data.success && Array.isArray(data.grades)) {
      //     setAvailableGrades(data.grades);
      //   } else {
      //     console.warn('❌ Respuesta inesperada al pedir grados, usando fallback');
      //     const fallback = [
      //       'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      //     ];
      //     setAvailableGrades(fallback);
      //   }
      // } else {
      //   console.error('❌ Error HTTP:', response.status);
      //   const fallback = [
      //     'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      //   ];
      //   setAvailableGrades(fallback);
      // }
    } catch (error) {
      console.error('❌ Error loading grades:', error);
      const fallback = [
        'Preescolar','1° A','1° B','1° C','2° A','2° B','2° C','3° A','3° B','3° C','4° A','4° B','4° C','5° A','5° B','5° C'
      ];
      setAvailableGrades(fallback);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      
      // 🎭 DATOS FALSOS PARA LA PRESENTACIÓN - Mostrar tareas con entregas
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 🎭 COMENTADO TEMPORALMENTE - Forzar datos nuevos para mostrar la tarea de animales
      // const savedTasks = localStorage.getItem('altiusv3-teacher-tasks');
      // if (savedTasks) {
      //   try {
      //     const parsedTasks = JSON.parse(savedTasks);
      //     setTasks(parsedTasks);
      //     setLoading(false);
      //     return;
      //   } catch (error) {
      //     console.warn('Error parsing saved teacher tasks, using default data');
      //   }
      // }
      
      // 📚 TAREAS EXACTAMENTE IGUALES A LAS DEL ESTUDIANTE - Vista del Profesor
      const fakeTasks: TeacherTask[] = [
        // TAREAS PENDIENTES (que ve el estudiante)
        {
          id: 1,
          titulo: 'Ejercicios de Sumas y Restas',
          descripcion: `Resolver los ejercicios de la página 45 del libro de matemáticas - Asignada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-28',
          fechaCreacion: '2025-10-20T14:30:00Z',
          tipo: 'traditional',
          materia: 'Matemáticas',
          submissions: []
        },
        {
          id: 2,
          titulo: 'Lectura del Cuento "El Patito Feo"',
          descripcion: `Leer el cuento y hacer un dibujo de la parte que más te gustó - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-30',
          fechaCreacion: '2025-10-22T09:15:00Z',
          tipo: 'traditional',
          materia: 'Español',
          submissions: []
        },
        {
          id: 3,
          titulo: '🐾 Aventura en el Reino Animal',
          descripcion: `Descubre el fascinante mundo de los animales con preguntas divertidas y educativas - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-11-05',
          fechaCreacion: '2025-10-26T10:00:00Z',
          tipo: 'interactive',
          materia: 'Ciencias Naturales',
          activityConfig: {
            type: 'animal_adventure',
            questions: [
              {
                questionText: '🐱 ¿Qué sonido hace el gato?',
                type: 'short-answer',
                correctAnswer: 'Miau miau',
                explanation: '¡Correcto! Los gatos hacen "miau miau" 🐱',
                visual: '🐱'
              },
              {
                questionText: '🦁 ¿Cuál de estos animales es el rey de la selva?',
                type: 'multiple-choice',
                options: ['🐯 Tigre', '🦁 León', '🐻 Oso', '🐺 Lobo'],
                correctAnswer: '🦁 León',
                explanation: '¡Excelente! El león es conocido como el rey de la selva 🦁',
                visual: '🦁👑'
              },
              {
                questionText: '🐄 ¿Qué nos da la vaca?',
                type: 'multiple-choice',
                options: ['🥛 Leche', '🍯 Miel', '🥚 Huevos', '🧀 Solo queso'],
                correctAnswer: '🥛 Leche',
                explanation: '¡Perfecto! Las vacas nos dan leche fresca 🥛',
                visual: '🐄🥛'
              },
              {
                questionText: '🐠 ¿Dónde viven los peces?',
                type: 'multiple-choice',
                options: ['🌳 En los árboles', '🌊 En el agua', '🏠 En casas', '☁️ En las nubes'],
                correctAnswer: '🌊 En el agua',
                explanation: '¡Genial! Los peces viven en el agua 🌊',
                visual: '🐠🌊'
              },
              {
                questionText: '🐸 ¿Cómo se mueve la rana?',
                type: 'multiple-choice',
                options: ['🏃 Corriendo', '🦘 Saltando', '🚶 Caminando', '🏊 Nadando'],
                correctAnswer: '🦘 Saltando',
                explanation: '¡Muy bien! Las ranas se mueven saltando 🦘',
                visual: '🐸🦘'
              },
              {
                questionText: 'Une cada animal con su hogar',
                type: 'match-lines',
                leftItems: ['🐝 Abeja', '🐻 Oso', '🐧 Pingüino', '🦅 Águila'],
                rightItems: ['🏔️ Montañas', '🧊 Hielo', '🍯 Colmena', '🌲 Bosque'],
                correctMatches: [2, 3, 1, 0],
                explanation: '¡Fantástico! Cada animal tiene su hogar especial'
              },
              {
                questionText: '🦋 ¿Qué animal sale de una oruga?',
                type: 'short-answer',
                correctAnswer: 'Mariposa',
                explanation: '¡Increíble! De la oruga sale una hermosa mariposa 🦋',
                visual: '🐛➡️🦋'
              },
              {
                questionText: '🐘 ¿Cuál es el animal terrestre más grande?',
                type: 'multiple-choice',
                options: ['🦏 Rinoceronte', '🐘 Elefante', '🦒 Jirafa', '🐻 Oso'],
                correctAnswer: '🐘 Elefante',
                explanation: '¡Excelente! El elefante es el animal terrestre más grande 🐘',
                visual: '🐘📏'
              }
            ]
          },
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: new Date().toISOString(),
              score: 85,
              timeUsed: 240, // 4 minutos
              answers: [
                { question: '🐱 ¿Qué sonido hace el gato?', userAnswer: 'Miau miau', correctAnswer: 'Miau miau', isCorrect: true },
                { question: '🦁 ¿Cuál de estos animales es el rey de la selva?', userAnswer: '🦁 León', correctAnswer: '🦁 León', isCorrect: true },
                { question: '🐄 ¿Qué nos da la vaca?', userAnswer: '🥛 Leche', correctAnswer: '🥛 Leche', isCorrect: true },
                { question: '🐠 ¿Dónde viven los peces?', userAnswer: '🌊 En el agua', correctAnswer: '🌊 En el agua', isCorrect: true },
                { question: '🐸 ¿Cómo se mueve la rana?', userAnswer: '🏃 Corriendo', correctAnswer: '🦘 Saltando', isCorrect: false }
              ]
            }
          ]
        },
        {
          id: 4,
          titulo: '🧮 Aventura Matemática Interactiva',
          descripcion: `Resuelve problemas matemáticos divertidos con animaciones y efectos visuales - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-11-02',
          fechaCreacion: '2025-10-25T10:00:00Z',
          tipo: 'interactive',
          materia: 'Matemáticas',
          activityConfig: {
            type: 'math_adventure',
            questions: [
              {
                questionText: '🍎 María tiene 5 manzanas y compra 3 más. ¿Cuántas manzanas tiene en total?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: '8',
                explanation: '¡Correcto! 5 + 3 = 8 manzanas 🍎',
                visual: '🍎🍎🍎🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎🍎🍎🍎'
              },
              {
                questionText: '🚗 En el estacionamiento hay 10 carros, se van 4. ¿Cuántos carros quedan?',
                type: 'multiple-choice',
                options: ['5', '6', '7', '8'],
                correctAnswer: '6',
                explanation: '¡Excelente! 10 - 4 = 6 carros 🚗',
                visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗 - 🚗🚗🚗🚗 = 🚗🚗🚗🚗🚗🚗'
              },
              {
                questionText: '⭐ Si tienes 2 estrellas y encuentras 7 más, ¿cuántas estrellas tienes?',
                type: 'multiple-choice',
                options: ['8', '9', '10', '11'],
                correctAnswer: '9',
                explanation: '¡Fantástico! 2 + 7 = 9 estrellas ⭐',
                visual: '⭐⭐ + ⭐⭐⭐⭐⭐⭐⭐ = ⭐⭐⭐⭐⭐⭐⭐⭐⭐'
              },
              {
                questionText: '🎈 Ana tiene 15 globos y regala 8. ¿Cuántos globos le quedan?',
                type: 'multiple-choice',
                options: ['6', '7', '8', '9'],
                correctAnswer: '7',
                explanation: '¡Perfecto! 15 - 8 = 7 globos 🎈',
                visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 - 🎈🎈🎈🎈🎈🎈🎈🎈 = 🎈🎈🎈🎈🎈🎈🎈'
              },
              {
                questionText: '🍪 En una caja hay 6 galletas, en otra hay 5. ¿Cuántas galletas hay en total?',
                type: 'multiple-choice',
                options: ['10', '11', '12', '13'],
                correctAnswer: '11',
                explanation: '¡Increíble! 6 + 5 = 11 galletas 🍪',
                visual: '🍪🍪🍪🍪🍪🍪 + 🍪🍪🍪🍪🍪 = 🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'
              }
            ]
          },
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: new Date().toISOString(),
              score: 80,
              timeUsed: 180, // 3 minutos
              answers: [
                { question: '🍎 María tiene 5 manzanas y compra 3 más. ¿Cuántas manzanas tiene en total?', userAnswer: '8', correctAnswer: '8', isCorrect: true },
                { question: '🚗 En el estacionamiento hay 10 carros, se van 4. ¿Cuántos carros quedan?', userAnswer: '6', correctAnswer: '6', isCorrect: true },
                { question: '⭐ Si tienes 2 estrellas y encuentras 7 más, ¿cuántas estrellas tienes?', userAnswer: '8', correctAnswer: '9', isCorrect: false },
                { question: '🎈 Ana tiene 15 globos y regala 8. ¿Cuántos globos le quedan?', userAnswer: '7', correctAnswer: '7', isCorrect: true },
                { question: '🍪 En una caja hay 6 galletas, en otra hay 5. ¿Cuántas galletas hay en total?', userAnswer: '11', correctAnswer: '11', isCorrect: true }
              ]
            }
          ]
        },
        
        // TAREAS COMPLETADAS (que ve el estudiante como completadas)
        {
          id: 5,
          titulo: 'Dibujo de mi Familia',
          descripcion: `Dibujar a todos los miembros de tu familia - Asignada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-20',
          fechaCreacion: '2025-10-15T14:30:00Z',
          tipo: 'traditional',
          materia: 'Sociales',
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: '2025-10-19T15:30:00Z',
              files: ['familia_dibujo.jpg'],
              comments: 'Dibujé a toda mi familia en el parque'
            }
          ]
        },
        {
          id: 6,
          titulo: 'Experimento con Plantas',
          descripcion: `Plantar una semilla y observar su crecimiento - Creada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-18',
          fechaCreacion: '2025-10-10T09:00:00Z',
          tipo: 'traditional',
          materia: 'Ciencias Naturales',
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: '2025-10-17T16:45:00Z',
              files: ['planta_dia1.jpg', 'planta_dia7.jpg', 'planta_dia14.jpg'],
              comments: 'Mi planta creció mucho! Adjunto fotos del progreso'
            }
          ]
        },
        {
          id: 7,
          titulo: 'Tabla del 2',
          descripcion: `Memorizar y recitar la tabla de multiplicar del 2 - Asignada por ${user?.firstName} ${user?.lastName}`,
          grados: ['5° A'],
          fechaEntrega: '2025-10-15',
          fechaCreacion: '2025-10-08T11:00:00Z',
          tipo: 'traditional',
          materia: 'Matemáticas',
          submissions: [
            {
              studentId: 'student-1',
              studentName: 'Estudiante Estudiante',
              submissionDate: '2025-10-14T14:20:00Z',
              files: ['tabla_del_2.mp4'],
              comments: 'Video recitando la tabla del 2 completa'
            }
          ]
        }
      ];
      
      setTasks(fakeTasks);
      
      // 🎭 LIMPIAR Y GUARDAR DATOS NUEVOS - Para mostrar la tarea de animales
      localStorage.removeItem('altiusv3-teacher-tasks'); // Limpiar datos viejos
      localStorage.setItem('altiusv3-teacher-tasks', JSON.stringify(fakeTasks));
    } catch (error) {
      console.error('Error loading teacher tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 🎭 SIMPLIFICADO: No requerir actividad interactiva para crear tarea
      // if (createForm.tipo === 'interactive' && !createForm.actividadInteractivaId) {
      //   alert('Selecciona o crea una actividad interactiva antes de crear la tarea.');
      //   return;
      // }
      
      // 🎭 COMENTADO TEMPORALMENTE - Solo frontend para presentación
      // Simular creación de tarea
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 🎯 CUESTIONARIOS: Si es interactiva, usar las preguntas del borrador o crear básicas
      if (createForm.tipo === 'interactive') {
        if (draftActivities.length > 0) {
          // Usar las preguntas creadas en el borrador
          const questionnaireActivity = {
            id: `questionnaire-${Date.now()}`,
            title: `Cuestionario: ${createForm.titulo}`,
            description: createForm.descripcion || createForm.titulo,
            activities: draftActivities,
            createdAt: new Date().toISOString()
          };
          
          // Guardar en biblioteca local
          activityStorage.saveTask(questionnaireActivity);
          setInteractiveLibrary(activityStorage.getTasks());
          
          // Limpiar borrador después de usar
          setDraftActivities([]);
        } else {
          // Crear cuestionario básico con múltiples preguntas de ejemplo
          const basicQuestionnaire = {
            id: `basic-questionnaire-${Date.now()}`,
            title: `Cuestionario: ${createForm.titulo}`,
            description: createForm.descripcion || createForm.titulo,
            activities: [
              {
                type: 'multiple-choice' as const,
                question: '¿Cuál es la respuesta correcta para esta pregunta de ejemplo?',
                options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
                correctAnswer: 0
              },
              {
                type: 'short-answer' as const,
                question: '¿Puedes escribir una respuesta corta de ejemplo?',
                correctAnswer: 'Respuesta de ejemplo'
              },
              {
                type: 'multiple-choice' as const,
                question: '¿Esta es otra pregunta de opción múltiple?',
                options: ['Sí', 'No', 'Tal vez', 'No estoy seguro'],
                correctAnswer: 0
              }
            ],
            createdAt: new Date().toISOString()
          };
          
          // Guardar en biblioteca local
          activityStorage.saveTask(basicQuestionnaire);
          setInteractiveLibrary(activityStorage.getTasks());
        }
      }

      // Crear nueva tarea localmente
      const newTask: TeacherTask = {
        id: Date.now(),
        titulo: createForm.titulo,
        descripcion: createForm.descripcion,
        grados: createForm.grados,
        fechaEntrega: createForm.fechaEntrega,
        fechaCreacion: new Date().toISOString(),
        tipo: createForm.tipo,
        materia: 'Nueva Materia', // Placeholder
        submissions: []
      };
      
      // Agregar a la lista local
      setTasks(prev => [newTask, ...prev]);
      
      // Guardar en localStorage
      const savedTasks = localStorage.getItem('altiusv3-teacher-tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const updatedTasks = [newTask, ...parsedTasks];
        localStorage.setItem('altiusv3-teacher-tasks', JSON.stringify(updatedTasks));
      }
      
      setShowCreateForm(false);
      setCreateForm({
        titulo: '',
        descripcion: '',
        materiaId: 0,
        grados: [],
        fechaEntrega: '',
        tipo: 'traditional',
        formatosPermitidos: [],
        comentario: '',
        archivosAdjuntos: []
      });
      
      const message = createForm.tipo === 'interactive'
        ? draftActivities.length > 0 
          ? `✅ Cuestionario creado con ${draftActivities.length} preguntas!`
          : '✅ Cuestionario creado con preguntas de ejemplo!'
        : '✅ Tarea creada exitosamente!';
      alert(message);
      
      // CÓDIGO ORIGINAL COMENTADO:
      // const response = await fetch('/api/teacher/tasks', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token || ''}`
      //   },
      //   body: JSON.stringify({
      //     title: createForm.titulo,
      //     description: createForm.descripcion,
      //     grades: createForm.grados,
      //     dueDate: createForm.fechaEntrega,
      //     taskType: createForm.tipo === 'interactive' ? 'INTERACTIVE' : 'MULTIMEDIA',
      //     priority: 'MEDIUM',
      //     activityConfig: createForm.actividadInteractivaId || null,
      //     allowedFormats: createForm.formatosPermitidos || [],
      //     maxFiles: 3,
      //     maxSizeMb: 10,
      //     maxGrade: 5.0
      //   })
      // });
      
    } catch (error) {
      console.error('Error creating task:', error);
      alert('❌ Error de conexión. Verifica tu conexión a internet.');
    }
  };



  const getTaskTypeBadge = (tipo: string) => {
    return tipo === 'traditional' 
      ? <Badge variant="secondary" className="bg-blue-100 text-blue-800">📸 Evidencia</Badge>
      : <Badge variant="secondary" className="bg-purple-100 text-purple-800">🎮 Interactiva</Badge>;
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'multimedia':
        return task.tipo === 'traditional';
      case 'interactive':
        return task.tipo === 'interactive';
      case 'pending':
        return !task.submissions || task.submissions.length === 0;
      case 'completed':
        return task.submissions && task.submissions.length > 0;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Gestión de Tareas"
          description="Crea y administra tareas para tus estudiantes"
          icon={FileText}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Tareas"
        description="Crea y administra tareas para tus estudiantes"
        icon={FileText}
        action={
          <div className="flex gap-2">

            <Button 
              onClick={loadTasks}
              variant="outline"
              className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
            <Button
              onClick={async () => {
                try {
                  // 🎭 COMENTADO TEMPORALMENTE - Solo frontend para presentación
                  // const resp = await fetch('/api/school-grades/initialize', { method: 'POST' });
                  // const data = await resp.json();
                  // console.log('Inicializar grados:', data);
                  
                  // Simular inicialización
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  await loadAvailableGrades();
                  alert('✅ Grados académicos inicializados correctamente.');
                } catch (err) {
                  console.error('Error inicializando grados:', err);
                  alert('❌ Error al inicializar grados. Inténtalo de nuevo.');
                }
              }}
              variant="outline"
              className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
            >
              Inicializar Grados
            </Button>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </div>
        }
      />

      {/* Filtros */}
      <Card className="border-secondary-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'todos' ? 'default' : 'outline'}
              onClick={() => setFilter('todos')}
              size="sm"
            >
              Todas las Tareas
            </Button>
            <Button
              variant={filter === 'multimedia' ? 'default' : 'outline'}
              onClick={() => setFilter('multimedia')}
              size="sm"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              📸 Evidencias
            </Button>
            <Button
              variant={filter === 'interactive' ? 'default' : 'outline'}
              onClick={() => setFilter('interactive')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              🎮 Interactivas
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Sin Entregas
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Con Entregas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de creación */}
      {showCreateForm && (
        <Card className="border-primary-200 bg-primary-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Crear Nueva Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Título de la Tarea
                  </label>
                  <input
                    type="text"
                    value={createForm.titulo}
                    onChange={(e) => setCreateForm({...createForm, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Ej: Ejercicios de Álgebra"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={createForm.fechaEntrega}
                    onChange={(e) => setCreateForm({...createForm, fechaEntrega: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Descripción
                </label>
                <textarea
                  value={createForm.descripcion}
                  onChange={(e) => setCreateForm({...createForm, descripcion: e.target.value})}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Describe la tarea y las instrucciones..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Tipo de Tarea
                  </label>
                  <select
                    value={createForm.tipo}
                    onChange={(e) => setCreateForm({...createForm, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="traditional">Tarea Tradicional</option>
                    <option value="interactive">Actividad Interactiva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">
                    Grado
                  </label>
                  <select
                    value={createForm.grados[0] || ''}
                    onChange={(e) => setCreateForm({
                      ...createForm, 
                      grados: e.target.value ? [e.target.value] : []
                    })}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  >
                    <option value="">Seleccionar grado</option>
                    {availableGrades.map((grade) => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Opciones según tipo de tarea - CUESTIONARIOS INTERACTIVOS */}
              {createForm.tipo === 'interactive' ? (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-purple-800">Cuestionario Interactivo</h3>
                      <p className="text-sm text-purple-600">Crea un cuestionario con múltiples preguntas variadas</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg">📝</div>
                        <span className="font-medium text-purple-700">Configurar Preguntas</span>
                      </div>
                      <p className="text-sm text-purple-600 mb-3">
                        Agrega diferentes tipos de preguntas para crear un cuestionario completo
                      </p>
                      
                      {draftActivities.length > 0 && (
                        <div className="mb-3 p-2 bg-purple-50 rounded border">
                          <p className="text-sm font-medium text-purple-700">
                            ✅ {draftActivities.length} pregunta{draftActivities.length !== 1 ? 's' : ''} agregada{draftActivities.length !== 1 ? 's' : ''}
                          </p>
                          <ul className="text-xs text-purple-600 mt-1">
                            {draftActivities.slice(0, 3).map((activity, index) => (
                              <li key={index}>• {activity.question.substring(0, 50)}...</li>
                            ))}
                            {draftActivities.length > 3 && (
                              <li>• Y {draftActivities.length - 3} pregunta{draftActivities.length - 3 !== 1 ? 's' : ''} más...</li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        onClick={() => { 
                          setEditingDraft(true); 
                          setShowActivityEditor(true); 
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {draftActivities.length === 0 ? 'Crear Cuestionario' : 'Agregar Más Preguntas'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Formatos permitidos (opcional)</label>
                    <div className="flex gap-2 flex-wrap">
                      {['pdf','docx','jpg','png'].map(fmt => (
                        <label key={fmt} className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={(createForm.formatosPermitidos || []).includes(fmt)}
                            onChange={(e) => {
                              const set = new Set(createForm.formatosPermitidos || []);
                              if (e.target.checked) set.add(fmt); else set.delete(fmt);
                              setCreateForm({...createForm, formatosPermitidos: Array.from(set)});
                            }}
                          />
                          <span className="capitalize">{fmt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Comentario (opcional)</label>
                    <input
                      type="text"
                      value={createForm.comentario}
                      onChange={(e) => setCreateForm({...createForm, comentario: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Instrucciones o comentario para la entrega"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary-600 text-neutral-white border-0"
                >
                  Crear Tarea
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-secondary-300 text-secondary hover:bg-secondary-50"
                >
                  Cancelar
                </Button>
              </div>
            </form>

            {showActivityEditor && (
              <div className="mt-4 space-y-4">
                <ActivityEditor
                  key={draftActivities.length + (editingLibraryId ? 100000 : 0)}
                  activity={editingLibraryTask ? editingLibraryTask.activities && editingLibraryTask.activities[0] : undefined}
                  onSave={(act) => {
                    if (editingLibraryId) {
                      // Save edited activity into existing library task
                      const task = activityStorage.getTask(editingLibraryId);
                      if (task) {
                        // Replace first activity by default
                        const updated = { ...task };
                        if (Array.isArray(updated.activities) && updated.activities.length > 0) {
                          updated.activities[0] = act;
                        } else {
                          updated.activities = [act];
                        }
                        updated.title = act.question || updated.title;
                        activityStorage.saveTask(updated);
                        setInteractiveLibrary(activityStorage.getTasks());
                        setEditingLibraryId(null);
                        setEditingLibraryTask(null);
                        setShowActivityEditor(false);
                        return;
                      }
                    }

                    if (editingDraft) {
                      handleAddDraftActivity(act);
                    } else {
                      handleSaveSingleActivity(act);
                    }
                  }}
                  onCancel={() => { setShowActivityEditor(false); setEditingDraft(false); setDraftActivities([]); setEditingLibraryId(null); setEditingLibraryTask(null); }}
                />

                {draftActivities.length > 0 && (
                  <div className="p-4 border rounded space-y-3">
                    <h3 className="font-semibold">Preguntas agregadas ({draftActivities.length})</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {draftActivities.map((d, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{d.question}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setDraftActivities(prev => prev.filter((_, idx) => idx !== i))}>Eliminar</Button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveDraftAsLibrary} className="bg-primary text-neutral-white">Guardar actividad(s) en biblioteca</Button>
                      <Button variant="outline" onClick={handleCancelDraft}>Cancelar borrador</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Panel de administración de biblioteca eliminado - Ya no se usa */}

          </CardContent>
        </Card>
      )}

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="file"
          title="No hay tareas creadas"
          description="Crea tu primera tarea para comenzar a asignar trabajo a tus estudiantes."
          action={{
            label: "Crear Primera Tarea",
            onClick: () => setShowCreateForm(true),
            variant: "primary"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className="border-secondary-200 hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-neutral-black">
                      {task.titulo}
                    </CardTitle>
                    <p className="text-sm text-secondary mt-1">
                      {task.descripcion}
                    </p>
                  </div>
                  {task.tipo && getTaskTypeBadge(task.tipo)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Información específica por tipo */}
                {task.tipo === 'traditional' && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium mb-1">
                      📎 Tarea de Evidencia
                    </p>
                    <p className="text-xs text-blue-600">
                      Los estudiantes deben subir archivos como evidencia
                    </p>
                  </div>
                )}

                {task.tipo === 'interactive' && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800 font-medium mb-1">
                      🎯 Actividad interactiva
                    </p>
                    <p className="text-xs text-purple-600">
                      Actividad con preguntas y puntaje automático
                    </p>
                  </div>
                )}

                {/* Información de la tarea */}
                <div className="space-y-2">
                  {(task as any).materia && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Materia:</span>
                      <span className="text-neutral-black font-medium">
                        {(task as any).materia}
                      </span>
                    </div>
                  )}
                  
                  {task.grados && task.grados.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Grados:</span>
                      <span className="text-neutral-black font-medium">
                        {task.grados.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {task.fechaEntrega && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Entrega:</span>
                      <span className="text-neutral-black font-medium">
                        {new Date(task.fechaEntrega).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {task.fechaCreacion && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">Creada:</span>
                      <span className="text-neutral-black font-medium">
                        {new Date(task.fechaCreacion).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Estadísticas de entregas */}
                {task.submissions && task.submissions.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          {task.submissions.length} entrega{task.submissions.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {task.tipo === 'interactive' && task.submissions[0]?.score && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-bold text-green-800">
                            Promedio: {Math.round(task.submissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / task.submissions.length)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t border-secondary-200">
                  {task.submissions && task.submissions.length > 0 && (
                    <Button 
                      onClick={() => setSelectedTaskSubmissions(task)}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-300 text-green-600 hover:bg-green-50 flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Entregas ({task.submissions.length})
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleEditTask(task)}
                    variant="outline"
                    size="sm"
                    className="border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    onClick={() => handleDeleteTask(task.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    disabled={deletingTaskId === task.id}
                  >
                    {deletingTaskId === task.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de entregas */}
      {selectedTaskSubmissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  📊 Entregas: {selectedTaskSubmissions.titulo}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTaskSubmissions(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {selectedTaskSubmissions.submissions?.map((submission, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  {/* Header del estudiante */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{submission.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          Entregado: {new Date(submission.submissionDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {submission.score !== undefined && (
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {submission.score >= 80 ? (
                            <Trophy className="w-6 h-6 text-yellow-500" />
                          ) : (
                            <Star className="w-6 h-6 text-blue-500" />
                          )}
                          <span className={`text-2xl font-bold ${
                            submission.score >= 80 ? 'text-green-600' : 
                            submission.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {submission.score}%
                          </span>
                        </div>
                        {submission.timeUsed && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{Math.floor(submission.timeUsed / 60)}:{(submission.timeUsed % 60).toString().padStart(2, '0')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Estadísticas rápidas */}
                  {submission.answers && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-800">
                            {submission.answers.filter(a => a.isCorrect).length}
                          </span>
                        </div>
                        <div className="text-sm text-green-600">Correctas</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-800">
                            {submission.answers.filter(a => !a.isCorrect).length}
                          </span>
                        </div>
                        <div className="text-sm text-red-600">Incorrectas</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-blue-800">
                            {submission.answers.length}
                          </span>
                        </div>
                        <div className="text-sm text-blue-600">Total</div>
                      </div>
                    </div>
                  )}

                  {/* Detalle de respuestas */}
                  {submission.answers && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Detalle de Respuestas:</h4>
                      {submission.answers.map((answer, answerIndex) => (
                        <div 
                          key={answerIndex} 
                          className={`p-4 rounded-lg border ${
                            answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {answer.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium mb-2">{answer.question}</p>
                              <div className="space-y-1">
                                <p className={`text-sm ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                  <strong>Respuesta del estudiante:</strong> {answer.userAnswer}
                                </p>
                                {!answer.isCorrect && (
                                  <p className="text-sm text-green-700">
                                    <strong>Respuesta correcta:</strong> {answer.correctAnswer}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {selectedTaskSubmissions.submissions?.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">No hay entregas para esta tarea</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherTasksPage;