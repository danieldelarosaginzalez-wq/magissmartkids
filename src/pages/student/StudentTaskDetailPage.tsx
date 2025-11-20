import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MultipleChoiceActivity from '../../components/activities/MultipleChoiceActivity';
import InteractiveMatchLinesActivity from '../../components/activities/InteractiveMatchLinesActivity';
import InteractiveShortAnswerActivity from '../../components/activities/InteractiveShortAnswerActivity';
import { Activity } from '../../components/activities/ActivityEditor';

interface TaskDetail {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  taskType: string;
  maxScore: number;
  maxGrade: number;
  grade: string;
  createdAt: string;
  activityConfig?: string;
  allowedFormats?: string;
  maxFiles?: number;
  maxSizeMb?: number;
  teacher: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  submission?: {
    id: number;
    submissionText: string;
    submissionFileUrl: string;
    submittedAt: string;
    status: string;
    score?: number;
    feedback?: string;
    gradedAt?: string;
  };
}

// Componente para manejar tareas interactivas
function InteractiveTaskView({ task, onComplete }: { task: TaskDetail; onComplete: () => void }) {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const activities: Activity[] = task.activityConfig ? JSON.parse(task.activityConfig) : [];
  const currentActivity = activities[currentActivityIndex];
  const progress = ((currentActivityIndex + 1) / activities.length) * 100;

  const handleAnswer = async (answer: any, correct: boolean) => {
    const currentQuestion = currentActivity.question;
    let studentAnswer = '';
    let correctAnswer = '';
    
    // Extraer respuesta del estudiante y respuesta correcta según el tipo
    if (currentActivity.type === 'multiple-choice') {
      studentAnswer = currentActivity.options[answer];
      correctAnswer = currentActivity.options[currentActivity.correctAnswer];
    } else if (currentActivity.type === 'short-answer') {
      studentAnswer = answer;
      correctAnswer = currentActivity.correctAnswer;
    } else if (currentActivity.type === 'match-lines') {
      studentAnswer = JSON.stringify(answer);
      correctAnswer = JSON.stringify(currentActivity.correctMatches);
    }
    
    const newAnswers = [...answers, { 
      question: currentQuestion,
      studentAnswer,
      correctAnswer,
      isCorrect: correct 
    }];
    
    setAnswers(newAnswers);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(async () => {
      setShowFeedback(false);
      
      if (currentActivityIndex < activities.length - 1) {
        setCurrentActivityIndex(currentActivityIndex + 1);
      } else {
        // Enviar resultados al backend
        const finalScore = correct ? score + 1 : score;
        const percentage = (finalScore / activities.length) * 100;
        const finalGrade = (percentage / 100) * task.maxGrade;
        
        const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
        const token = authState?.state?.token;
        
        const submissionData = {
          totalQuestions: activities.length,
          correctAnswers: finalScore,
          incorrectAnswers: activities.length - finalScore,
          percentage: percentage.toFixed(2),
          answers: newAnswers,
          timeSpent: 'N/A'
        };

        try {
          await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/student/grade-tasks/${task.id}/submit`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                submissionText: JSON.stringify(submissionData),
                submissionFileUrl: null,
              }),
            }
          );
        } catch (error) {
          console.error('Error al enviar resultados:', error);
        }
        
        setCompleted(true);
      }
    }, 2000);
  };

  const renderActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'multiple-choice':
        return <MultipleChoiceActivity activity={activity} onAnswer={handleAnswer} />;
      case 'match-lines':
        return <InteractiveMatchLinesActivity activity={activity} onAnswer={handleAnswer} />;
      case 'short-answer':
        return <InteractiveShortAnswerActivity activity={activity} onAnswer={handleAnswer} />;
      default:
        return <div>Tipo de actividad no soportado</div>;
    }
  };

  if (completed) {
    const percentage = Math.round((score / activities.length) * 100);
    return (
      <div className="text-center py-12">
        <div className="text-7xl mb-6 animate-bounce">
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '🎉'}
        </div>
        <h2 className="text-3xl font-bold mb-4">¡Actividad Completada!</h2>
        <div className="bg-blue-50 rounded-lg p-8 max-w-md mx-auto mb-6">
          <p className="text-lg font-semibold mb-2">Tu puntuación</p>
          <p className="text-4xl font-bold text-blue-600 mb-4">
            {score} / {activities.length}
          </p>
          <p className="text-2xl font-bold text-green-600">
            {percentage}%
          </p>
        </div>
        {percentage >= 80 && (
          <p className="text-lg text-green-600 font-semibold">¡Excelente trabajo! 🌟</p>
        )}
        {percentage >= 60 && percentage < 80 && (
          <p className="text-lg text-blue-600 font-semibold">¡Muy bien! Sigue practicando 💪</p>
        )}
        {percentage < 60 && (
          <p className="text-lg text-yellow-600 font-semibold">¡Buen intento! Sigue aprendiendo 📚</p>
        )}
        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ver resultados
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Pregunta {currentActivityIndex + 1} de {activities.length}
          </span>
          <span className="text-sm font-semibold">
            Puntuación: {score}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white p-6 rounded-lg border">
        {renderActivity(currentActivity)}
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`${isCorrect ? 'bg-green-500' : 'bg-yellow-500'} text-white p-12 rounded-lg text-center max-w-md`}>
            <div className="text-7xl mb-4 animate-bounce">
              {isCorrect ? '🎉' : '💪'}
            </div>
            <p className="text-3xl font-bold mb-2">
              {isCorrect ? '¡Muy bien!' : '¡Sigue intentando!'}
            </p>
            <p className="text-lg">
              {isCorrect ? 'Respuesta correcta' : 'Puedes hacerlo mejor'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFileUrl, setSubmissionFileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      // Obtener token del authStore
      const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      const token = authState?.state?.token;
      
      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        navigate('/student/grade-tasks');
        return;
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/student/grade-tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTask(data);
        if (data.submission) {
          setSubmissionText(data.submission.submissionText || '');
          setSubmissionFileUrl(data.submission.submissionFileUrl || '');
        }
      } else {
        alert('Error al cargar la tarea');
        navigate('/student/grade-tasks');
      }
    } catch (error) {
      console.error('Error al cargar tarea:', error);
      alert('Error al cargar la tarea');
      navigate('/student/grade-tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño
      const maxSize = (task?.maxSizeMb || 10) * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`El archivo es muy grande. Tamaño máximo: ${task?.maxSizeMb || 10}MB`);
        return;
      }
      
      // Validar formato
      const extension = file.name.split('.').pop()?.toLowerCase();
      const allowedFormats = task?.allowedFormats ? JSON.parse(task.allowedFormats) : ['jpg', 'png', 'pdf', 'doc', 'docx'];
      if (extension && !allowedFormats.includes(extension)) {
        alert(`Formato no permitido. Formatos aceptados: ${allowedFormats.join(', ')}`);
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File, token: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Error al subir el archivo');
    }
    
    const data = await response.json();
    return data.fileUrl || data.url || data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!submissionText.trim() && !selectedFile) {
      alert('Por favor escribe tu respuesta o sube un archivo');
      return;
    }

    setSubmitting(true);

    try {
      // Obtener token del authStore
      const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
      const token = authState?.state?.token;
      
      if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión nuevamente.');
        setSubmitting(false);
        return;
      }
      
      let fileUrl = submissionFileUrl;
      
      // Si hay un archivo seleccionado, subirlo primero
      if (selectedFile) {
        try {
          fileUrl = await uploadFile(selectedFile, token);
        } catch (error) {
          console.error('Error al subir archivo:', error);
          alert('Error al subir el archivo. Intenta de nuevo.');
          setSubmitting(false);
          return;
        }
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/student/grade-tasks/${taskId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            submissionText,
            submissionFileUrl: fileUrl,
          }),
        }
      );

      if (response.ok) {
        alert('Tarea entregada exitosamente');
        loadTask();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al entregar la tarea');
      }
    } catch (error) {
      console.error('Error al entregar tarea:', error);
      alert('Error al entregar la tarea');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando tarea...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Tarea no encontrada</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/student/grade-tasks')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Volver a mis tareas
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Encabezado */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{task.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <span className="font-semibold">Profesor:</span> {task.teacher.firstName} {task.teacher.lastName}
            </div>
            <div>
              <span className="font-semibold">Grado:</span> {task.grade}
            </div>
            <div>
              <span className="font-semibold">Fecha de entrega:</span>{' '}
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">Tipo:</span>{' '}
              {task.taskType === 'INTERACTIVE' ? 'Interactiva' : 'Tradicional'}
            </div>
            <div>
              <span className="font-semibold">Puntos:</span> {task.maxScore}
            </div>
            <div>
              <span className="font-semibold">Nota máxima:</span> {task.maxGrade}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Descripción</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
        </div>

        {/* Entrega del estudiante */}
        {task.submission ? (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Tu Entrega</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="mb-4">
                <span className="text-sm text-gray-600">Entregado el:</span>
                <span className="ml-2 font-semibold">
                  {new Date(task.submission.submittedAt).toLocaleString()}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Respuesta:</h3>
                {(() => {
                  try {
                    const parsed = JSON.parse(task.submission.submissionText);
                    if (parsed.totalQuestions && parsed.answers) {
                      // Es un resultado de quiz
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{parsed.correctAnswers}/{parsed.totalQuestions}</div>
                              <div className="text-sm text-gray-600">Respuestas correctas</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{parsed.incorrectAnswers}</div>
                              <div className="text-sm text-gray-600">Incorrectas</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">{parsed.timeSpent || 'N/A'}</div>
                              <div className="text-sm text-gray-600">Tiempo</div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800">Detalle de respuestas:</h4>
                            {parsed.answers.map((answer: any, index: number) => (
                              <div key={index} className={`p-4 rounded-lg border-2 ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex items-start gap-2">
                                  <span className={`text-xl ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {answer.isCorrect ? '✓' : '✗'}
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800 mb-2">{index + 1}. {answer.question}</p>
                                    <div className="space-y-1 text-sm">
                                      <p className="text-gray-700">
                                        <span className="font-medium">Tu respuesta:</span> {answer.studentAnswer}
                                      </p>
                                      {!answer.isCorrect && (
                                        <p className="text-green-700">
                                          <span className="font-medium">Respuesta correcta:</span> {answer.correctAnswer}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    // Si no es un quiz, mostrar JSON formateado
                    return <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">{JSON.stringify(parsed, null, 2)}</pre>;
                  } catch {
                    // Si no es JSON, mostrar como texto normal
                    return <p className="text-gray-700 whitespace-pre-wrap">{task.submission.submissionText}</p>;
                  }
                })()}
              </div>

              {task.submission.submissionFileUrl && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Archivo adjunto:</h3>
                  <a
                    href={(() => {
                      // Si la URL ya es completa (http/https), usarla directamente
                      if (task.submission.submissionFileUrl.startsWith('http')) {
                        return task.submission.submissionFileUrl;
                      }
                      // Si es una ruta relativa, construir la URL del backend
                      return `${import.meta.env.VITE_API_BASE_URL}/files/download/${task.submission.submissionFileUrl}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <span>📎</span>
                    <span>Ver archivo PDF</span>
                  </a>
                </div>
              )}
            </div>

            {/* Calificación */}
            {task.submission.score !== undefined && task.submission.score !== null ? (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Calificación</h3>
                <div className={`text-4xl font-bold mb-3 ${getScoreColor(task.submission.score)}`}>
                  {task.submission.score.toFixed(2)} / {task.maxGrade}
                </div>

                {task.submission.feedback && (
                  <div>
                    <h4 className="font-semibold mb-2">Retroalimentación del profesor:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{task.submission.feedback}</p>
                  </div>
                )}

                <div className="mt-3 text-sm text-gray-600">
                  Calificado el: {new Date(task.submission.gradedAt!).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-6 rounded-lg">
                <p className="text-yellow-800 font-semibold">
                  ⏳ Tu tarea está pendiente de calificación
                </p>
              </div>
            )}
          </div>
        ) : task.taskType === 'INTERACTIVE' ? (
          /* Vista de actividad interactiva */
          <div className="border-t pt-6">
            <InteractiveTaskView 
              task={task}
              onComplete={() => {
                alert('¡Actividad completada exitosamente!');
                loadTask();
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Entregar Tarea</h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Tu respuesta <span className="text-red-500">*</span>
              </label>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="Escribe tu respuesta aquí..."
                required
              />
            </div>

            {/* Subir archivo */}
            {task.taskType === 'MULTIMEDIA' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Subir archivo {!submissionFileUrl && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept={task.allowedFormats ? JSON.parse(task.allowedFormats).map((f: string) => `.${f}`).join(',') : '.jpg,.png,.pdf,.doc,.docx'}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {selectedFile ? (
                        <div>
                          <p className="text-sm font-semibold text-green-600">✓ {selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Haz clic para seleccionar un archivo</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Formatos: {task.allowedFormats ? JSON.parse(task.allowedFormats).join(', ') : 'jpg, png, pdf, doc, docx'}
                          </p>
                          <p className="text-xs text-gray-500">Tamaño máximo: {task.maxSizeMb || 10}MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                O pega una URL del archivo (opcional)
              </label>
              <input
                type="url"
                value={submissionFileUrl}
                onChange={(e) => setSubmissionFileUrl(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/mi-archivo.pdf"
              />
              <p className="text-sm text-gray-500 mt-1">
                Si tienes un archivo en Google Drive, Dropbox u otro servicio, pega aquí el enlace
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Entregando...' : 'Entregar Tarea'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/grade-tasks')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
