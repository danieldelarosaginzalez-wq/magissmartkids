import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui';
import { CheckCircle, XCircle, Star, Trophy, Clock, BookOpen } from 'lucide-react';

const StudentTaskView: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [isActive, setIsActive] = useState(false);

  const loadTasks = async () => {
    try {
      console.log('🔄 Cargando tareas para estudiante...');
      
      // 🎭 DATOS FALSOS PARA LA PRESENTACIÓN
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const fakeTasks = [
        {
          id: '1',
          title: '🐾 Aventura en el Reino Animal',
          description: '¡Descubre el fascinante mundo de los animales! Actividad interactiva con diferentes tipos de preguntas sobre nuestros amigos animales.',
          subjectName: 'Ciencias Naturales',
          createdAt: new Date().toISOString(), // Tarea recién creada
          difficulty: 'Fácil',
          timeLimit: 480, // 8 minutos
          type: 'animal-adventure',
          isNew: true, // Marcar como nueva
          questions: [
            {
              questionText: '🐱 ¿Qué sonido hace el gato?',
              options: JSON.stringify(['Guau guau', 'Miau miau', 'Muuu muuu', 'Oink oink']),
              correctAnswer: 'Miau miau',
              explanation: '¡Correcto! Los gatos hacen "miau miau" 🐱',
              visual: '🐱',
              type: 'multiple-choice',
              color: '#f97316'
            },
            {
              questionText: '🦁 ¿Cuál de estos animales es el rey de la selva?',
              options: JSON.stringify(['🐘 Elefante', '🦁 León', '🐯 Tigre', '🦒 Jirafa']),
              correctAnswer: '🦁 León',
              explanation: '¡Excelente! El león es conocido como el rey de la selva 🦁',
              visual: '🦁👑',
              type: 'multiple-choice',
              color: '#eab308'
            },
            {
              questionText: 'Escribe el nombre de un animal que vuela',
              correctAnswer: 'pájaro',
              explanation: '¡Perfecto! Los pájaros vuelan por el cielo 🐦',
              visual: '🐦✈️',
              type: 'short-answer',
              acceptedAnswers: ['pájaro', 'pajaro', 'ave', 'águila', 'aguila', 'paloma', 'loro', 'canario']
            },
            {
              questionText: '🐄 ¿Qué nos da la vaca?',
              options: JSON.stringify(['🥛 Leche', '🥚 Huevos', '🍯 Miel', '🧀 Solo queso']),
              correctAnswer: '🥛 Leche',
              explanation: '¡Correcto! Las vacas nos dan leche fresca 🐄🥛',
              visual: '🐄➡️🥛',
              type: 'multiple-choice',
              color: '#06b6d4'
            },
            {
              questionText: 'Une cada animal con su hogar',
              leftItems: ['🐝 Abeja', '🐻 Oso', '🐧 Pingüino', '🦅 Águila'],
              rightItems: ['🏔️ Montaña', '🧊 Polo Sur', '🌳 Cueva', '🍯 Colmena'],
              correctMatches: [3, 2, 1, 0], // Abeja->Colmena, Oso->Cueva, Pingüino->Polo Sur, Águila->Montaña
              explanation: '¡Fantástico! Cada animal tiene su hogar especial 🏠',
              visual: '🏠🐾',
              type: 'match-lines'
            },
            {
              questionText: '🐠 ¿Dónde viven los peces?',
              options: JSON.stringify(['🌳 En los árboles', '🌊 En el agua', '🏔️ En las montañas', '🏠 En las casas']),
              correctAnswer: '🌊 En el agua',
              explanation: '¡Correcto! Los peces viven en el agua del mar, ríos y lagos 🐠🌊',
              visual: '🐠🌊',
              type: 'multiple-choice',
              color: '#3b82f6'
            },
            {
              questionText: 'Escribe el nombre de un animal muy grande',
              correctAnswer: 'elefante',
              explanation: '¡Increíble! El elefante es uno de los animales más grandes 🐘',
              visual: '🐘📏',
              type: 'short-answer',
              acceptedAnswers: ['elefante', 'ballena', 'jirafa', 'hipopótamo', 'hipopotamo', 'rinoceronte']
            },
            {
              questionText: '🐸 ¿Cómo se mueve la rana?',
              options: JSON.stringify(['🏃 Corriendo', '🦘 Saltando', '🏊 Nadando solamente', '🕷️ Arrastrándose']),
              correctAnswer: '🦘 Saltando',
              explanation: '¡Perfecto! Las ranas se mueven saltando con sus patas traseras 🐸🦘',
              visual: '🐸💨',
              type: 'multiple-choice',
              color: '#22c55e'
            }
          ]
        },
        {
          id: '2',
          title: '📚 Aventura del Patito Feo',
          description: 'Vive la historia del Patito Feo de manera interactiva. Responde preguntas y descubre el final.',
          subjectName: 'Español',
          createdAt: '2025-10-24T14:30:00Z',
          difficulty: 'Medio',
          timeLimit: 240,
          type: 'story',
          questions: [
            {
              questionText: '🐣 Al principio de la historia, ¿cómo se sentía el patito?',
              options: JSON.stringify(['😊 Feliz', '😢 Triste', '😠 Enojado', '😨 Asustado']),
              correctAnswer: '😢 Triste',
              explanation: 'Correcto! El patito se sentía triste porque era diferente a los demás.',
              visual: '🐣💭😢'
            },
            {
              questionText: '🦢 ¿En qué hermoso animal se convirtió el patito al final?',
              options: JSON.stringify(['🦆 Pato', '🦢 Cisne', '🪿 Ganso', '🐓 Pollo']),
              correctAnswer: '🦢 Cisne',
              explanation: '¡Exacto! El patito se convirtió en un hermoso cisne blanco.',
              visual: '🐣➡️🦢✨'
            },
            {
              questionText: '💭 ¿Cuál es la moraleja principal del cuento?',
              options: JSON.stringify(['Ser diferente es malo', 'Todos somos especiales', 'Los cisnes son mejores', 'No importa la apariencia']),
              correctAnswer: 'Todos somos especiales',
              explanation: '¡Perfecto! La historia nos enseña que todos somos especiales y únicos.',
              visual: '🌟👥💖'
            }
          ]
        },
        {
          id: '3',
          title: '🌈 Quiz Colorido de Inglés',
          description: 'Aprende los colores en inglés de forma divertida con efectos visuales y sonidos.',
          subjectName: 'Inglés',
          createdAt: '2025-10-23T09:15:00Z',
          difficulty: 'Fácil',
          timeLimit: 180,
          type: 'colors',
          questions: [
            {
              questionText: '🔴 ¿Cómo se dice "rojo" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Red',
              explanation: '¡Correcto! Red significa rojo 🔴',
              visual: '🔴',
              color: '#ef4444'
            },
            {
              questionText: '🔵 ¿Cómo se dice "azul" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Blue',
              explanation: '¡Excelente! Blue significa azul 🔵',
              visual: '🔵',
              color: '#3b82f6'
            },
            {
              questionText: '🟢 ¿Cómo se dice "verde" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Green',
              explanation: '¡Fantástico! Green significa verde 🟢',
              visual: '🟢',
              color: '#22c55e'
            },
            {
              questionText: '🟡 ¿Cómo se dice "amarillo" en inglés?',
              options: JSON.stringify(['Blue', 'Red', 'Green', 'Yellow']),
              correctAnswer: 'Yellow',
              explanation: '¡Increíble! Yellow significa amarillo 🟡',
              visual: '🟡',
              color: '#eab308'
            }
          ]
        }
      ];
      
      setTasks(fakeTasks);
      console.log(`✅ ${fakeTasks.length} tareas cargadas (datos de presentación)`);
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      setTasks([]);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitTask();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startTask = (task: any) => {
    setSelectedTask(task);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(task.timeLimit || 300);
    setIsActive(true);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    // Auto advance to next question after a short delay for multiple choice
    const currentQ = selectedTask.questions[currentQuestion];
    if (currentQ.type === 'multiple-choice') {
      setTimeout(() => {
        if (currentQuestion < selectedTask.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          handleSubmitTask();
        }
      }, 1000);
    }
  };

  const handleTextAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
  };

  const handleSubmitTask = () => {
    setIsActive(false);
    
    // Calculate score
    let correctAnswers = 0;
    selectedTask.questions.forEach((question: any, index: number) => {
      const userAnswer = answers[index];
      
      if (question.type === 'short-answer' && question.acceptedAnswers) {
        // Check if answer is in accepted answers (case insensitive)
        const isCorrect = question.acceptedAnswers.some((accepted: string) => 
          accepted.toLowerCase() === userAnswer?.toLowerCase()
        );
        if (isCorrect) correctAnswers++;
      } else if (question.type === 'match-lines') {
        // For match-lines, check if the answer matches the pattern (simplified for demo)
        if (userAnswer === 'correct') correctAnswers++; // Placeholder logic
      } else {
        // Standard exact match
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      }
    });
    
    const finalScore = Math.round((correctAnswers / selectedTask.questions.length) * 100);
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

  useEffect(() => {
    loadTasks();
  }, []);

  if (selectedTask) {
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
                        answer === selectedTask.questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-green-600">Correctas</div>
                  </div>
                  
                  <div className="bg-red-100 rounded-lg p-3">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="font-semibold text-red-800">
                      {Object.values(answers).filter((answer, index) => 
                        answer !== selectedTask.questions[index]?.correctAnswer
                      ).length}
                    </div>
                    <div className="text-sm text-red-600">Incorrectas</div>
                  </div>
                  
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-800">
                      {formatTime(selectedTask.timeLimit - timeLeft)}
                    </div>
                    <div className="text-sm text-blue-600">Tiempo usado</div>
                  </div>
                </div>
              </div>

              {/* Review answers */}
              <div className="text-left mb-6">
                <h3 className="text-xl font-semibold mb-4">🔍 Revisión de Respuestas:</h3>
                {selectedTask.questions.map((question: any, index: number) => {
                  const userAnswer = answers[index];
                  let isCorrect = false;
                  
                  // Check correctness based on question type
                  if (question.type === 'short-answer' && question.acceptedAnswers) {
                    isCorrect = question.acceptedAnswers.some((accepted: string) => 
                      accepted.toLowerCase() === userAnswer?.toLowerCase()
                    );
                  } else if (question.type === 'match-lines') {
                    isCorrect = userAnswer === 'correct'; // Simplified for demo
                  } else {
                    isCorrect = userAnswer === question.correctAnswer;
                  }
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg mb-3 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{question.questionText}</p>
                            {question.visual && (
                              <span className="text-2xl">{question.visual}</span>
                            )}
                          </div>
                          
                          {question.type === 'match-lines' ? (
                            <div className="space-y-2">
                              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                Tu respuesta: {userAnswer === 'correct' ? '¡Conectaste correctamente!' : 'Sin respuesta'}
                              </p>
                              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                                <strong>Conexiones correctas:</strong>
                                <ul className="mt-1 space-y-1">
                                  {question.leftItems.map((left: string, i: number) => (
                                    <li key={i}>• {left} → {question.rightItems[question.correctMatches[i]]}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                Tu respuesta: {userAnswer || 'Sin respuesta'}
                              </p>
                              {!isCorrect && question.type !== 'short-answer' && (
                                <p className="text-sm text-green-700">
                                  Respuesta correcta: {question.correctAnswer}
                                </p>
                              )}
                              {!isCorrect && question.type === 'short-answer' && question.acceptedAnswers && (
                                <p className="text-sm text-green-700">
                                  Respuestas aceptadas: {question.acceptedAnswers.join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {question.explanation && (
                            <p className="text-sm text-gray-600 mt-2 italic bg-gray-50 p-2 rounded">
                              💡 {question.explanation}
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
                  onClick={() => startTask(selectedTask)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Intentar de Nuevo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTask(null)}
                >
                  Volver a Tareas
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = selectedTask.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedTask.questions.length) * 100;

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
                  {currentQuestion + 1} de {selectedTask.questions.length}
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
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              {currentQ.visual && (
                <div className="text-6xl mb-4" style={{ color: currentQ.color }}>
                  {currentQ.visual}
                </div>
              )}
              <h2 className="text-2xl font-bold mb-4">{currentQ.questionText}</h2>
            </div>

            {/* Render different question types */}
            {currentQ.type === 'multiple-choice' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JSON.parse(currentQ.options || '[]').map((option: string, index: number) => (
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
            ) : currentQ.type === 'match-lines' ? (
              // Match lines activity
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-blue-600 mb-4">Animales</h3>
                    {currentQ.leftItems.map((item: string, index: number) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 text-center">
                        <div className="text-xl font-medium">{item}</div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center text-green-600 mb-4">Sus Hogares</h3>
                    {currentQ.rightItems.map((item: string, index: number) => (
                      <div key={index} className="p-4 bg-green-50 rounded-xl border-2 border-green-200 text-center">
                        <div className="text-xl font-medium">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-lg text-gray-600 mb-4">
                    🎯 Observa bien y memoriza las conexiones correctas
                  </p>
                  <Button
                    onClick={() => handleAnswerSelect('correct')}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 text-lg"
                  >
                    ¡Ya sé las respuestas! ✨
                  </Button>
                </div>
              </div>
            ) : (
              // Short answer input
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => handleTextAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-center"
                  autoFocus
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  💡 Puedes escribir diferentes nombres de animales
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                onClick={() => setSelectedTask(null)}
                className="flex items-center gap-2"
              >
                Salir
              </Button>
              
              <div className="flex gap-2">
                {currentQuestion > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    Anterior
                  </Button>
                )}
                
                {currentQuestion < selectedTask.questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={!answers[currentQuestion]}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitTask}
                    disabled={!answers[currentQuestion]}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 Tareas Interactivas</h1>
          <p className="text-lg text-gray-600">Aprende de forma divertida con nuestras actividades interactivas</p>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <p className="text-blue-700 font-medium">✨ ¡Nueva actividad disponible sobre animales! 🐾</p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No hay tareas disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: any) => {
              const getDifficultyColor = (difficulty: string) => {
                switch (difficulty) {
                  case 'Fácil': return 'bg-green-100 text-green-800';
                  case 'Medio': return 'bg-yellow-100 text-yellow-800';
                  case 'Difícil': return 'bg-red-100 text-red-800';
                  default: return 'bg-gray-100 text-gray-800';
                }
              };

              const getTypeIcon = (type: string) => {
                switch (type) {
                  case 'animal-adventure': return '🐾';
                  case 'questionnaire': return '🎯';
                  case 'interactive': return '🧮';
                  case 'story': return '📚';
                  case 'colors': return '🌈';
                  default: return '📝';
                }
              };

              return (
                <div key={task.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
                  {task.isNew && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        ¡NUEVA!
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{getTypeIcon(task.type)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-gray-800">{task.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="w-4 h-4" />
                        <span>{task.subjectName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(task.timeLimit)} minutos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="w-4 h-4" />
                        <span>{task.questions.length} preguntas</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => startTask(task)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-xl transition-all duration-300"
                    >
                      🚀 Comenzar Tarea
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTaskView;