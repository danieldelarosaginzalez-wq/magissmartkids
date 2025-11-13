import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  FileText, 
  Camera, 
  Play, 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle,
  // AlertCircle, // No usado
  Image,
  Video,
  FileIcon,
  X,
  Star,
  Trophy,
  XCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { tasksApi, type TaskResponse } from '../services/tasksApi';
// import { useUserInfo } from '../hooks/useUserInfo'; // No usado
// import StudentTaskView from './StudentTaskView'; // No usado en esta implementación

type StudentTask = any; // Temporalmente any para evitar errores de tipos

type TaskFilter = 'todos' | 'multimedia' | 'interactive' | 'pending' | 'completed';

const TareasPage: React.FC = () => {
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('todos');
  const [selectedTask, setSelectedTask] = useState<StudentTask | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');
  
  // Estados para tareas interactivas
  const [showInteractiveTask, setShowInteractiveTask] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [showInteractiveView, setShowInteractiveView] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  // const { userInfo } = useUserInfo(); // No usado
  

  
  const loadTasks = async () => {
    try {
      setLoading(true);
      
      // 🎭 DATOS FALSOS PARA LA PRESENTACIÓN - Consistentes con el dashboard
      await new Promise(resolve => setTimeout(resolve, 800)); // Simular loading
      
      // 🔄 CARGAR TAREAS DEL PROFESOR Y CONVERTIRLAS A FORMATO ESTUDIANTE
      const teacherTasks = localStorage.getItem('altiusv3-teacher-tasks');
      let teacherActivities: StudentTask[] = [];
      
      if (teacherTasks) {
        try {
          const parsedTeacherTasks = JSON.parse(teacherTasks);
          console.log('📚 Tareas del profesor encontradas:', parsedTeacherTasks);
          
          // Convertir tareas del profesor a formato de estudiante
          teacherActivities = parsedTeacherTasks.map((teacherTask: any, index: number) => ({
            id: `teacher-${teacherTask.id || index}`,
            title: teacherTask.titulo,
            description: teacherTask.descripcion || 'Actividad creada por el profesor',
            subject: teacherTask.materia || 'Actividad Interactiva',
            dueDate: teacherTask.fechaEntrega || '2025-11-15',
            priority: 'MEDIUM',
            status: 'pending',
            taskType: 'interactive',
            hasSubmission: false,
            maxScore: 100,
            timeLimit: 480, // 8 minutos
            activityConfig: teacherTask.activityConfig || teacherTask.activity || {
              type: 'custom',
              questions: teacherTask.questions || []
            }
          }));
          
          console.log('✅ Actividades del profesor convertidas:', teacherActivities);
        } catch (error) {
          console.warn('Error parsing teacher tasks:', error);
        }
      }
      
      // Intentar cargar datos guardados del localStorage del estudiante
      const savedTasks = localStorage.getItem('altiusv3-student-tasks');
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          // Combinar tareas del estudiante con las del profesor
          const combinedTasks = [...teacherActivities, ...parsedTasks];
          setTasks(combinedTasks);
          setLoading(false);
          return;
        } catch (error) {
          console.warn('Error parsing saved tasks, using default data');
        }
      }
      
      // Si hay actividades del profesor, combinarlas con las tareas por defecto
      const fakeTasks: StudentTask[] = [
        // Primero agregar las actividades del profesor
        ...teacherActivities,
        // Luego las tareas por defecto (solo si no hay actividades del profesor)
        {
          id: '1',
          title: 'Ejercicios de Sumas y Restas',
          description: 'Resolver los ejercicios de la página 45 del libro de matemáticas',
          subject: 'Matemáticas',
          dueDate: '2025-10-28',
          priority: 'HIGH',
          status: 'pending',
          taskType: 'multimedia',
          hasSubmission: false,
          allowedFormats: ['jpg', 'png', 'pdf'],
          maxFiles: 3,
          maxSizeMb: 5
        },
        {
          id: '2',
          title: 'Lectura del Cuento "El Patito Feo"',
          description: 'Leer el cuento y hacer un dibujo de la parte que más te gustó',
          subject: 'Español',
          dueDate: '2025-10-30',
          priority: 'MEDIUM',
          status: 'pending',
          taskType: 'multimedia',
          hasSubmission: false,
          allowedFormats: ['jpg', 'png'],
          maxFiles: 2,
          maxSizeMb: 3
        },
        {
          id: '3',
          title: '🧮 Aventura Matemática Interactiva',
          description: 'Resuelve problemas matemáticos divertidos con animaciones y efectos visuales. ¡Cada respuesta correcta te da puntos!',
          subject: 'Matemáticas',
          dueDate: '2025-11-02',
          priority: 'HIGH',
          status: 'pending',
          taskType: 'interactive',
          hasSubmission: false,
          maxScore: 100,
          timeLimit: 300,
          activityConfig: {
            type: 'math_adventure',
            questions: [
              {
                questionText: '🍎 María tiene 5 manzanas y compra 3 más. ¿Cuántas manzanas tiene en total?',
                options: ['6', '7', '8', '9'],
                correctAnswer: '8',
                explanation: '¡Correcto! 5 + 3 = 8 manzanas 🍎',
                visual: '🍎🍎🍎🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎🍎🍎🍎'
              },
              {
                questionText: '🚗 En el estacionamiento hay 10 carros, se van 4. ¿Cuántos carros quedan?',
                options: ['5', '6', '7', '8'],
                correctAnswer: '6',
                explanation: '¡Excelente! 10 - 4 = 6 carros 🚗',
                visual: '🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗 - 🚗🚗🚗🚗 = 🚗🚗🚗🚗🚗🚗'
              },
              {
                questionText: '⭐ Si tienes 2 estrellas y encuentras 7 más, ¿cuántas estrellas tienes?',
                options: ['8', '9', '10', '11'],
                correctAnswer: '9',
                explanation: '¡Fantástico! 2 + 7 = 9 estrellas ⭐',
                visual: '⭐⭐ + ⭐⭐⭐⭐⭐⭐⭐ = ⭐⭐⭐⭐⭐⭐⭐⭐⭐'
              },
              {
                questionText: '🎈 Ana tiene 15 globos y regala 8. ¿Cuántos globos le quedan?',
                options: ['6', '7', '8', '9'],
                correctAnswer: '7',
                explanation: '¡Perfecto! 15 - 8 = 7 globos 🎈',
                visual: '🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 - 🎈🎈🎈🎈🎈🎈🎈🎈 = 🎈🎈🎈🎈🎈🎈🎈'
              },
              {
                questionText: '🍪 En una caja hay 6 galletas, en otra hay 5. ¿Cuántas galletas hay en total?',
                options: ['10', '11', '12', '13'],
                correctAnswer: '11',
                explanation: '¡Increíble! 6 + 5 = 11 galletas 🍪',
                visual: '🍪🍪🍪🍪🍪🍪 + 🍪🍪🍪🍪🍪 = 🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪'
              }
            ]
          }
        },
        // 12 TAREAS COMPLETADAS
        {
          id: '4',
          title: 'Dibujo de mi Familia',
          description: 'Dibujar a todos los miembros de tu familia',
          subject: 'Sociales',
          dueDate: '2025-10-20',
          priority: 'MEDIUM',
          status: 'completed',
          taskType: 'multimedia',
          hasSubmission: true,
          allowedFormats: ['jpg', 'png'],
          maxFiles: 1,
          maxSizeMb: 2
        },
        {
          id: '5',
          title: 'Experimento con Plantas',
          description: 'Plantar una semilla y observar su crecimiento',
          subject: 'Ciencias Naturales',
          dueDate: '2025-10-18',
          priority: 'HIGH',
          status: 'completed',
          taskType: 'multimedia',
          hasSubmission: true,
          allowedFormats: ['jpg', 'png', 'mp4'],
          maxFiles: 5,
          maxSizeMb: 10
        },
        {
          id: '6',
          title: 'Tabla del 2',
          description: 'Memorizar y recitar la tabla de multiplicar del 2',
          subject: 'Matemáticas',
          dueDate: '2025-10-15',
          priority: 'HIGH',
          status: 'completed',
          taskType: 'interactive',
          hasSubmission: true,
          maxScore: 50
        },
        {
          id: '7',
          title: 'Escribir mi Nombre',
          description: 'Practicar escribir mi nombre completo 10 veces',
          subject: 'Español',
          dueDate: '2025-10-12',
          priority: 'MEDIUM',
          status: 'completed',
          taskType: 'multimedia',
          hasSubmission: true,
          allowedFormats: ['jpg', 'png'],
          maxFiles: 1,
          maxSizeMb: 2
        },
        {
          id: '8',
          title: '🔗 Conecta: Animales y sus Sonidos',
          description: 'Conecta cada animal con el sonido que hace. Actividad de unir líneas.',
          subject: 'Ciencias Naturales',
          dueDate: '2025-10-10',
          priority: 'LOW',
          status: 'completed',
          taskType: 'interactive',
          hasSubmission: true,
          maxScore: 25,
          activityConfig: {
            type: 'match-lines',
            question: 'Une cada animal con su sonido',
            leftItems: ['🐄 Vaca', '🐶 Perro', '🐱 Gato', '🐷 Cerdo'],
            rightItems: ['Muu', 'Guau', 'Miau', 'Oink'],
            correctMatches: [0, 1, 2, 3]
          }
        },
        {
          id: '9',
          title: 'Mi Ciudad',
          description: 'Dibujar el lugar donde vivo',
          subject: 'Sociales',
          dueDate: '2025-10-08',
          priority: 'MEDIUM',
          status: 'completed',
          taskType: 'multimedia',
          hasSubmission: true,
          allowedFormats: ['jpg', 'png'],
          maxFiles: 1,
          maxSizeMb: 3
        },
        {
          id: '10',
          title: 'Números del 1 al 10',
          description: 'Escribir los números del 1 al 10',
          subject: 'Matemáticas',
          dueDate: '2025-10-05',
          priority: 'HIGH',
          status: 'completed',
          taskType: 'multimedia',
          hasSubmission: true,
          allowedFormats: ['jpg', 'png'],
          maxFiles: 1,
          maxSizeMb: 2
        },
        {
          id: '11',
          title: '🎥 Video: Saludos en Inglés',
          description: 'Mira el video sobre saludos básicos y responde las preguntas',
          subject: 'Inglés',
          dueDate: '2025-10-03',
          priority: 'LOW',
          status: 'completed',
          taskType: 'interactive',
          hasSubmission: true,
          maxScore: 30,
          activityConfig: {
            type: 'video',
            question: 'Mira el video y aprende los saludos básicos',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            followUpQuestions: [
              {
                type: 'multiple-choice',
                question: '¿Cómo se dice "Hola" en inglés?',
                options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
                correctAnswer: 0
              }
            ]
          }
        },
        {
          id: '12',
          title: 'Vocales',
          description: 'Identificar y escribir las 5 vocales',
          subject: 'Español',
          dueDate: '2025-10-01',
          priority: 'HIGH',
          status: 'completed',
          taskType: 'multimedia',
          hasSubmission: true,
          allowedFormats: ['jpg', 'png'],
          maxFiles: 1,
          maxSizeMb: 2
        },
        {
          id: '13',
          title: 'Partes del Cuerpo',
          description: 'Señalar las partes básicas del cuerpo humano',
          subject: 'Ciencias Naturales',
          dueDate: '2025-09-28',
          priority: 'MEDIUM',
          status: 'completed',
          taskType: 'interactive',
          hasSubmission: true,
          maxScore: 40
        },
        {
          id: '14',
          title: 'Mi Escuela',
          description: 'Dibujar mi salón de clases favorito',
          subject: 'Sociales',
          dueDate: '2025-09-25',
          priority: 'LOW',
          status: 'completed',
          taskType: 'multimedia',
          hasSubmission: true,
          allowedFormats: ['jpg', 'png'],
          maxFiles: 1,
          maxSizeMb: 2
        },
        {
          id: '15',
          title: 'Contar hasta 20',
          description: 'Contar del 1 al 20 sin equivocarse',
          subject: 'Matemáticas',
          dueDate: '2025-09-22',
          priority: 'MEDIUM',
          status: 'completed',
          taskType: 'interactive',
          hasSubmission: true,
          maxScore: 20
        }
      ];
      
      setTasks(fakeTasks);
      
      // Guardar solo las tareas por defecto (no las del profesor) en localStorage del estudiante
      const studentOnlyTasks = fakeTasks.filter(task => !task.id.startsWith('teacher-'));
      localStorage.setItem('altiusv3-student-tasks', JSON.stringify(studentOnlyTasks));
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'multimedia':
        return task.taskType === 'multimedia';
      case 'interactive':
        return task.taskType === 'interactive';
      case 'pending':
        return task.status === 'pending';
      case 'completed':
        return task.hasSubmission;
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    return taskType === 'multimedia' ? Camera : Play;
  };

  const getTaskTypeBadge = (taskType: string) => {
    return taskType === 'multimedia' 
      ? <Badge className="bg-blue-100 text-blue-800 border-blue-200">📸 Evidencia</Badge>
      : <Badge className="bg-purple-100 text-purple-800 border-purple-200">🎮 Interactiva</Badge>;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const task = selectedTask;
    
    if (!task) return;
    
    // Validar número de archivos
    if (task.maxFiles && files.length > task.maxFiles) {
      alert(`Solo puedes subir máximo ${task.maxFiles} archivos`);
      return;
    }
    
    // Validar formatos
    if (task.allowedFormats) {
      const invalidFiles = files.filter(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return !task.allowedFormats!.includes(extension || '');
      });
      
      if (invalidFiles.length > 0) {
        alert(`Formatos no permitidos: ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }
    }
    
    // Validar tamaño
    if (task.maxSizeMb) {
      const oversizedFiles = files.filter(file => file.size > (task.maxSizeMb! * 1024 * 1024));
      if (oversizedFiles.length > 0) {
        alert(`Archivos muy grandes: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }
    }
    
    setUploadFiles(files);
  };

  const submitMultimediaTask = async () => {
    if (!selectedTask) return;
    
    try {
      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));
      formData.append('submissionText', submissionText);
      
      await tasksApi.submitTask(selectedTask.id, formData);
      
      setShowUploadModal(false);
      setUploadFiles([]);
      setSubmissionText('');
      setSelectedTask(null);
      loadTasks();
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Error al enviar la tarea');
    }
  };

  // Timer effect para tareas interactivas
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitInteractiveTask();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startInteractiveTask = (task: TaskResponse) => {
    setSelectedTask(task);
    setShowInteractiveTask(true);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft((task as any).timeLimit || 300);
    setIsActive(true);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    // Auto advance to next question after a short delay
    setTimeout(() => {
      if (selectedTask?.activityConfig?.questions && currentQuestion < selectedTask.activityConfig.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitInteractiveTask();
      }
    }, 1000);
  };

  const handleSubmitInteractiveTask = () => {
    setIsActive(false);
    
    if (!selectedTask?.activityConfig?.questions) return;
    
    // Calculate score
    let correctAnswers = 0;
    selectedTask.activityConfig.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / selectedTask.activityConfig.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '¡Excelente trabajo! 🌟';
    if (score >= 80) return '¡Muy bien! 👏';
    if (score >= 70) return '¡Buen trabajo! 👍';
    if (score >= 60) return 'Puedes mejorar 💪';
    return 'Sigue practicando 📚';
  };

  const closeInteractiveTask = () => {
    // Si se completó la tarea, marcarla como entregada
    if (showResults && selectedTask) {
      const updatedTasks = tasks.map(task => {
        if (task.id === selectedTask.id) {
          return {
            ...task,
            hasSubmission: true,
            status: 'completed' as const,
            submissionScore: score,
            submissionDate: new Date().toISOString()
          };
        }
        return task;
      });
      setTasks(updatedTasks);
      
      // 💾 GUARDAR EN LOCALSTORAGE PARA PERSISTENCIA
      // Separar tareas del profesor de las del estudiante
      const studentTasks = updatedTasks.filter(task => !task.id.startsWith('teacher-'));
      
      // Guardar solo las tareas del estudiante
      localStorage.setItem('altiusv3-student-tasks', JSON.stringify(studentTasks));
      
      // Actualizar las tareas del profesor si es una tarea del profesor completada
      if (selectedTask.id.startsWith('teacher-')) {
        const teacherSubmission = {
          studentId: 'student-1',
          studentName: 'Estudiante Estudiante',
          submissionDate: new Date().toISOString(),
          score: score,
          timeUsed: (selectedTask.timeLimit || 300) - timeLeft,
          answers: selectedTask.activityConfig?.questions?.map((question: any, index: number) => ({
            question: question.questionText,
            userAnswer: answers[index] || 'Sin respuesta',
            correctAnswer: question.correctAnswer,
            isCorrect: answers[index] === question.correctAnswer
          })) || []
        };
        
        const teacherTasksStorage = localStorage.getItem('altiusv3-teacher-tasks');
        if (teacherTasksStorage) {
          try {
            const teacherTasksData = JSON.parse(teacherTasksStorage);
            const updatedTeacherTasks = teacherTasksData.map((task: any) => {
              if (`teacher-${task.id}` === selectedTask.id || task.titulo === selectedTask.title) {
                return {
                  ...task,
                  submissions: [teacherSubmission]
                };
              }
              return task;
            });
            localStorage.setItem('altiusv3-teacher-tasks', JSON.stringify(updatedTeacherTasks));
          } catch (error) {
            console.warn('Error updating teacher tasks');
          }
        }
      }
      

      
      // Mostrar mensaje de éxito
      setTimeout(() => {
        alert(`🎉 ¡Tarea guardada exitosamente!\n\n` +
              `📊 Puntaje obtenido: ${score}%\n` +
              `✅ Estado: Completada\n` +
              `📅 Fecha de entrega: ${new Date().toLocaleDateString()}\n\n` +
              `💾 Los datos se han guardado y persistirán entre sesiones.`);
      }, 500);
    }
    
    setShowInteractiveTask(false);
    setSelectedTask(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setIsActive(false);
    setTimeLeft(300);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-4 w-4 text-blue-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="h-4 w-4 text-purple-600" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Tareas"
          description="Gestiona tus tareas multimedia e interactivas"
          icon={FileText}
        />
        <LoadingSpinner />
      </div>
    );
  }

  // Renderizar tarea interactiva
  if (showInteractiveTask && selectedTask) {
    if (showResults) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                {score >= 80 ? (
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
                ) : (
                  <Star className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-pulse" />
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">¡Tarea Completada!</h1>
              <h2 className="text-2xl font-semibold mb-6">{selectedTask.title}</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
                <div className="text-xl text-gray-600 mb-4">{getScoreMessage(score)}</div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-100 rounded-lg p-3">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-green-800">
                      {Object.values(answers).filter((answer, index) => 
                        answer === selectedTask.activityConfig?.questions?.[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-green-600">Correctas</div>
                  </div>
                  
                  <div className="bg-red-100 rounded-lg p-3">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="font-semibold text-red-800">
                      {Object.values(answers).filter((answer, index) => 
                        answer !== selectedTask.activityConfig?.questions?.[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-red-600">Incorrectas</div>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-800">
                      {formatTime((selectedTask.timeLimit || 300) - timeLeft)}
                    </div>
                    <div className="text-sm text-blue-600">Tiempo usado</div>
                  </div>
                </div>
              </div>

              {/* Review answers */}
              <div className="text-left mb-6">
                <h3 className="text-xl font-semibold mb-4">Revisión de Respuestas:</h3>
                {selectedTask.activityConfig?.questions?.map((question: any, index: number) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg mb-3 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.questionText}</p>
                          <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Tu respuesta: {userAnswer || 'Sin respuesta'}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-700">
                              Respuesta correcta: {question.correctAnswer}
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => startInteractiveTask(selectedTask)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Intentar de Nuevo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={closeInteractiveTask}
                >
                  Volver a Tareas
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = selectedTask.activityConfig?.questions?.[currentQuestion];
    const progress = selectedTask.activityConfig?.questions ? 
      ((currentQuestion + 1) / selectedTask.activityConfig.questions.length) * 100 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with progress and timer */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{selectedTask.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {currentQuestion + 1} de {selectedTask.activityConfig?.questions?.length || 0}
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question card */}
          {currentQ && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                {currentQ.visual && (
                  <div className="text-4xl mb-4">
                    {currentQ.visual}
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-4">{currentQ.questionText}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options?.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      answers[currentQuestion] === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-lg font-medium">{option}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="outline"
                  onClick={closeInteractiveTask}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Salir
                </Button>
                
                <div className="flex gap-2">
                  {currentQuestion > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                  )}
                  
                  {selectedTask.activityConfig?.questions && currentQuestion < selectedTask.activityConfig.questions.length - 1 ? (
                    <Button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      disabled={!answers[currentQuestion]}
                    >
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitInteractiveTask}
                      disabled={!answers[currentQuestion]}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Finalizar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Si se selecciona la vista interactiva, mostrar vista de prueba
  if (showInteractiveView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Botón de volver */}
          <div className="mb-6">
            <Button 
              onClick={() => setShowInteractiveView(false)}
              variant="outline"
              className="bg-white shadow-lg border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              ← Volver a Mis Tareas
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Tareas Interactivas</h1>
            <p className="text-lg text-gray-600">Aprende de forma divertida con nuestras actividades interactivas</p>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-blue-700 font-medium">✨ ¡Nueva actividad disponible sobre animales! 🐾</p>
            </div>
          </div>

          {/* Actividad de animales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
              {/* Badge de nueva */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                  ¡NUEVA!
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🐾</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Fácil
                  </span>
                </div>
                
                <h3 className="font-bold text-xl mb-3 text-gray-800">🐾 Aventura en el Reino Animal</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">¡Descubre el fascinante mundo de los animales! Actividad interactiva con diferentes tipos de preguntas sobre nuestros amigos animales.</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>Ciencias Naturales</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>8 minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="w-4 h-4" />
                    <span>8 preguntas</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => alert('🎉 ¡Actividad sobre animales!\n\n🐾 Incluye:\n• 🐱 Preguntas de opción múltiple\n• ✍️ Respuestas cortas\n• 🔗 Unir animales con sus hogares\n\n🚀 ¡Lista para jugar!')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-xl transition-all duration-300"
                >
                  🚀 Comenzar Aventura Animal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Tareas"
        description="Gestiona tus tareas multimedia e interactivas"
        icon={FileText}
        action={
          <Button 
            onClick={() => setShowInteractiveView(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex items-center gap-2"
          >
            🎯 Tareas Interactivas
          </Button>
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
              <Camera className="h-4 w-4" />
              📸 Evidencias
            </Button>
            <Button
              variant={filter === 'interactive' ? 'default' : 'outline'}
              onClick={() => setFilter('interactive')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              🎮 Interactivas
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Pendientes
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Completadas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="file"
          title="No hay tareas"
          description={
            filter === 'todos' 
              ? "No tienes tareas asignadas en este momento."
              : `No hay tareas ${filter === 'multimedia' ? 'multimedia' : filter === 'interactive' ? 'interactivas' : filter}.`
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => {
            const TaskIcon = getTaskTypeIcon(task.taskType);
            
            return (
              <Card 
                key={task.id} 
                className="border-secondary-200 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TaskIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg font-bold text-neutral-black">
                          {task.title}
                        </CardTitle>
                      </div>
                      <p className="text-sm text-secondary">
                        {task.subject}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getTaskTypeBadge(task.taskType)}
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Descripción */}
                  <p className="text-sm text-neutral-black">
                    {task.description}
                  </p>

                  {/* Información específica por tipo */}
                  {task.taskType === 'multimedia' && task.allowedFormats && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        📎 Formatos permitidos:
                      </p>
                      <p className="text-xs text-blue-600">
                        {task.allowedFormats.join(', ')} • Máx. {task.maxFiles} archivos • {task.maxSizeMb}MB
                      </p>
                    </div>
                  )}

                  {task.taskType === 'interactive' && task.activityConfig && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800 font-medium mb-1">
                        🎯 Actividad interactiva
                      </p>
                      <p className="text-xs text-purple-600">
                        Puntaje máximo: {task.maxScore} puntos
                      </p>
                    </div>
                  )}

                  {/* Fecha de entrega */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-secondary" />
                    <span className="text-secondary">Entrega:</span>
                    <span className="text-neutral-black font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Estado de entrega */}
                  {task.hasSubmission && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          Entregada
                        </span>
                      </div>
                      {task.taskType === 'interactive' && (task as any).submissionScore && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-bold text-green-800">
                            {(task as any).submissionScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2 border-t border-secondary-200">
                    {task.taskType === 'multimedia' && !task.hasSubmission && (
                      <Button 
                        onClick={() => {
                          setSelectedTask(task);
                          setShowUploadModal(true);
                        }}
                        className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                        size="sm"
                      >
                        <Upload className="h-4 w-4" />
                        📤 Subir Evidencias
                      </Button>
                    )}
                    
                    {task.taskType === 'interactive' && !task.hasSubmission && (
                      <Button 
                        onClick={() => startInteractiveTask(task)}
                        className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0 flex items-center gap-2"
                        size="sm"
                      >
                        <Play className="h-4 w-4" />
                        🎯 Comenzar Actividad
                      </Button>
                    )}

                    {task.hasSubmission && (
                      <Button 
                        variant="outline"
                        className="flex-1 border-secondary-300 text-secondary hover:bg-secondary-50 flex items-center gap-2"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Ver Entrega
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de subida de evidencias */}
      {showUploadModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  📸 Subir evidencias: {selectedTask.title}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles([]);
                    setSubmissionText('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Descripción de la tarea */}
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-sm text-neutral-black">
                  {selectedTask.description}
                </p>
              </div>

              {/* Zona de arrastre y suelta */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple={selectedTask.maxFiles !== 1}
                  accept={selectedTask.allowedFormats?.map((f: string) => `.${f}`).join(',')}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">
                    Formatos: {selectedTask.allowedFormats?.join(', ')} • 
                    Máx. {selectedTask.maxFiles} archivos • 
                    {selectedTask.maxSizeMb}MB por archivo
                  </p>
                </label>
              </div>

              {/* Vista previa de archivos */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-neutral-black">Archivos seleccionados:</h4>
                  {uploadFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      {getFileIcon(file.name)}
                      <span className="text-sm flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== index))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Texto de entrega */}
              <div>
                <label className="block text-sm font-medium text-neutral-black mb-2">
                  Comentarios adicionales (opcional)
                </label>
                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder="Describe tu evidencia o agrega comentarios..."
                />
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={submitMultimediaTask}
                  disabled={uploadFiles.length === 0}
                  className="flex-1 bg-primary hover:bg-primary-600 text-neutral-white border-0"
                >
                  ✅ Enviar Evidencias
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFiles([]);
                    setSubmissionText('');
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
    </div>
  );
};

export default TareasPage;