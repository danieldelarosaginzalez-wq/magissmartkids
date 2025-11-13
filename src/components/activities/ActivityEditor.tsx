import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ArrowLeft, Plus, Trash2, Check, Play } from 'lucide-react';

export type ActivityType = 'multiple-choice' | 'drag-drop' | 'match-lines' | 'short-answer' | 'video';

export interface BaseActivity {
  type: ActivityType;
  question: string;
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

export interface DragDropActivity extends BaseActivity {
  type: 'drag-drop';
  items: string[];
  correctOrder: number[];
}

export interface MatchLinesActivity extends BaseActivity {
  type: 'match-lines';
  leftItems: string[];
  rightItems: string[];
  correctMatches: number[];
}

export interface ShortAnswerActivity extends BaseActivity {
  type: 'short-answer';
  correctAnswer: string;
}

export interface VideoActivity extends BaseActivity {
  type: 'video';
  videoUrl: string;
}

export type Activity = 
  | MultipleChoiceActivity 
  | DragDropActivity 
  | MatchLinesActivity 
  | ShortAnswerActivity 
  | VideoActivity;

interface ActivityEditorProps {
  activity?: Activity;
  onSave: (activity: Activity) => void;
  onCancel: () => void;
}

export default function ActivityEditor({ activity, onSave, onCancel }: ActivityEditorProps) {
  const [activityType, setActivityType] = useState<ActivityType>(activity?.type || 'multiple-choice');
  const [question, setQuestion] = useState(activity?.question || '');
  const [isSaving, setIsSaving] = useState(false);

  const [mcOptions, setMcOptions] = useState<string[]>(
    activity?.type === 'multiple-choice' ? activity.options : ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4']
  );
  const [mcCorrect, setMcCorrect] = useState(
    activity?.type === 'multiple-choice' ? activity.correctAnswer : 0
  );

  const [ddItems, setDdItems] = useState<string[]>(
    activity?.type === 'drag-drop' ? activity.items : ['Elemento 1', 'Elemento 2', 'Elemento 3']
  );

  const [mlLeft, setMlLeft] = useState<string[]>(
    activity?.type === 'match-lines' ? activity.leftItems : ['Pregunta 1', 'Pregunta 2', 'Pregunta 3']
  );
  const [mlRight, setMlRight] = useState<string[]>(
    activity?.type === 'match-lines' ? activity.rightItems : ['Respuesta 1', 'Respuesta 2', 'Respuesta 3']
  );
  const [mlMatches, setMlMatches] = useState<number[]>(
    activity?.type === 'match-lines' ? activity.correctMatches : [0, 1, 2]
  );

  const [saAnswer, setSaAnswer] = useState(
    activity?.type === 'short-answer' ? activity.correctAnswer : ''
  );

  const [videoUrl, setVideoUrl] = useState(
    activity?.type === 'video' ? activity.videoUrl : ''
  );

  const handleSave = async () => {
    if (!question.trim()) {
      alert('Por favor, ingresa una pregunta o instrucción');
      return;
    }

    setIsSaving(true);
    
    // 🎭 SIMULACIÓN: Delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    let newActivity: Activity;

    switch (activityType) {
      case 'multiple-choice':
        const validOptions = mcOptions.filter(o => o.trim() !== '');
        if (validOptions.length < 2) {
          alert('Necesitas al menos 2 opciones para una pregunta de opción múltiple');
          setIsSaving(false);
          return;
        }
        newActivity = {
          type: 'multiple-choice',
          question,
          options: validOptions,
          correctAnswer: mcCorrect
        };
        break;

      case 'drag-drop':
        const validItems = ddItems.filter(i => i.trim() !== '');
        if (validItems.length < 2) {
          alert('Necesitas al menos 2 elementos para arrastrar y soltar');
          setIsSaving(false);
          return;
        }
        newActivity = {
          type: 'drag-drop',
          question,
          items: validItems,
          correctOrder: validItems.map((_, i) => i)
        };
        break;

      case 'match-lines':
        const validLeft = mlLeft.filter(i => i.trim() !== '');
        const validRight = mlRight.filter(i => i.trim() !== '');
        if (validLeft.length < 2 || validRight.length < 2) {
          alert('Necesitas al menos 2 elementos en cada columna');
          setIsSaving(false);
          return;
        }
        newActivity = {
          type: 'match-lines',
          question,
          leftItems: validLeft,
          rightItems: validRight,
          correctMatches: mlMatches.slice(0, validRight.length)
        };
        break;

      case 'short-answer':
        if (!saAnswer.trim()) {
          alert('Por favor, ingresa la respuesta correcta');
          setIsSaving(false);
          return;
        }
        newActivity = {
          type: 'short-answer',
          question,
          correctAnswer: saAnswer
        };
        break;

      case 'video':
        if (!videoUrl.trim()) {
          alert('Por favor, ingresa la URL del video');
          setIsSaving(false);
          return;
        }
        newActivity = {
          type: 'video',
          question,
          videoUrl
        };
        break;
    }

    setIsSaving(false);
    onSave(newActivity);
  };

  const getActivityTypeIcon = (type: ActivityType) => {
    switch (type) {
      case 'multiple-choice': return '✅';
      case 'drag-drop': return '🎯';
      case 'match-lines': return '🔗';
      case 'short-answer': return '✍️';
      case 'video': return '🎥';
    }
  };

  const getActivityTypeName = (type: ActivityType) => {
    switch (type) {
      case 'multiple-choice': return 'Opción Múltiple';
      case 'drag-drop': return 'Arrastrar y Soltar';
      case 'match-lines': return 'Unir con Líneas';
      case 'short-answer': return 'Respuesta Corta';
      case 'video': return 'Video';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {getActivityTypeIcon(activityType)}
              {activity ? 'Editar Actividad' : 'Nueva Actividad'}
            </h1>
            <p className="text-gray-600 mt-1">
              Configura tu actividad interactiva
            </p>
          </div>
          <Button 
            onClick={onCancel} 
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            disabled={isSaving}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold">Configuración de la Actividad</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Tipo de Actividad */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Tipo de Actividad
              </label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {(['multiple-choice', 'drag-drop', 'match-lines', 'short-answer', 'video'] as ActivityType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActivityType(type)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      activityType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={isSaving}
                  >
                    <div className="text-2xl mb-2">{getActivityTypeIcon(type)}</div>
                    <div className="text-sm font-medium">{getActivityTypeName(type)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pregunta */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Pregunta o Instrucción
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg bg-white resize-none"
                placeholder="Escribe la pregunta o instrucción para los estudiantes..."
                rows={3}
                disabled={isSaving}
              />
            </div>

            {activityType === 'multiple-choice' && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <label className="block text-lg font-semibold text-blue-800 mb-4">
                  Opciones de Respuesta
                </label>
                <div className="space-y-3">
                  {mcOptions.map((option, index) => (
                    <div key={index} className="flex gap-3 items-center bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="correct"
                          checked={mcCorrect === index}
                          onChange={() => setMcCorrect(index)}
                          className="w-5 h-5 text-blue-600"
                          disabled={isSaving}
                        />
                        <span className="ml-2 text-sm text-blue-600 font-medium">
                          {mcCorrect === index ? 'Correcta' : 'Opción'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...mcOptions];
                          newOptions[index] = e.target.value;
                          setMcOptions(newOptions);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                        placeholder={`Opción ${index + 1}`}
                        disabled={isSaving}
                      />
                      {mcOptions.length > 2 && (
                        <Button
                          onClick={() => {
                            const newOptions = mcOptions.filter((_, i) => i !== index);
                            setMcOptions(newOptions);
                            if (mcCorrect >= newOptions.length) {
                              setMcCorrect(0);
                            }
                          }}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          disabled={isSaving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setMcOptions([...mcOptions, `Opción ${mcOptions.length + 1}`])}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Agregar Opción
                </Button>
              </div>
            )}

            {activityType === 'drag-drop' && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <label className="block text-lg font-semibold text-green-800 mb-4">
                  Elementos para Arrastrar (en orden correcto)
                </label>
                <div className="space-y-3">
                  {ddItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center bg-white rounded-lg p-3 border border-green-200">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full text-green-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...ddItems];
                          newItems[index] = e.target.value;
                          setDdItems(newItems);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:outline-none"
                        placeholder={`Elemento ${index + 1}`}
                        disabled={isSaving}
                      />
                      {ddItems.length > 2 && (
                        <Button
                          onClick={() => setDdItems(ddItems.filter((_, i) => i !== index))}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          disabled={isSaving}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setDdItems([...ddItems, `Elemento ${ddItems.length + 1}`])}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4" />
                  Agregar Elemento
                </Button>
              </div>
            )}

            {activityType === 'match-lines' && (
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <label className="block text-lg font-semibold text-orange-800 mb-4">
                  Elementos para Unir con Líneas
                </label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold text-orange-700 mb-3">Columna Izquierda</h4>
                    <div className="space-y-3">
                      {mlLeft.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center bg-white rounded-lg p-3 border border-orange-200">
                          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full text-orange-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...mlLeft];
                              newItems[index] = e.target.value;
                              setMlLeft(newItems);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none"
                            placeholder={`Pregunta ${index + 1}`}
                            disabled={isSaving}
                          />
                          {mlLeft.length > 2 && (
                            <Button
                              onClick={() => {
                                setMlLeft(mlLeft.filter((_, i) => i !== index));
                                setMlRight(mlRight.filter((_, i) => i !== index));
                                setMlMatches(mlMatches.filter((_, i) => i !== index));
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              disabled={isSaving}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        setMlLeft([...mlLeft, `Pregunta ${mlLeft.length + 1}`]);
                        setMlRight([...mlRight, `Respuesta ${mlRight.length + 1}`]);
                        setMlMatches([...mlMatches, mlLeft.length]);
                      }}
                      className="mt-3 bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                      disabled={isSaving}
                    >
                      <Plus className="h-4 w-4" />
                      Agregar Par
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold text-orange-700 mb-3">Columna Derecha</h4>
                    <div className="space-y-3">
                      {mlRight.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center bg-white rounded-lg p-3 border border-orange-200">
                          <select
                            value={mlMatches[index]}
                            onChange={(e) => {
                              const newMatches = [...mlMatches];
                              newMatches[index] = parseInt(e.target.value);
                              setMlMatches(newMatches);
                            }}
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:border-orange-500 text-sm"
                            disabled={isSaving}
                          >
                            {mlLeft.map((_, i) => (
                              <option key={i} value={i}>→ {i + 1}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newItems = [...mlRight];
                              newItems[index] = e.target.value;
                              setMlRight(newItems);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:outline-none"
                            placeholder={`Respuesta ${index + 1}`}
                            disabled={isSaving}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-orange-600 mt-4">
                  💡 Usa el selector para indicar qué pregunta corresponde a cada respuesta
                </p>
              </div>
            )}

            {activityType === 'short-answer' && (
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <label className="block text-lg font-semibold text-purple-800 mb-4">
                  Respuesta Correcta
                </label>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <input
                    type="text"
                    value={saAnswer}
                    onChange={(e) => setSaAnswer(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-lg"
                    placeholder="Escribe la respuesta correcta..."
                    disabled={isSaving}
                  />
                  <p className="text-sm text-purple-600 mt-2">
                    💡 Los estudiantes deberán escribir exactamente esta respuesta
                  </p>
                </div>
              </div>
            )}

            {activityType === 'video' && (
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <label className="block text-lg font-semibold text-red-800 mb-4">
                  Configuración del Video
                </label>
                <div className="bg-white rounded-lg p-4 border border-red-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL del Video (YouTube)
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none text-lg"
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      disabled={isSaving}
                    />
                  </div>
                  
                  {videoUrl && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vista Previa
                      </label>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                        <div className="text-center text-gray-500">
                          <Play className="h-12 w-12 mx-auto mb-2" />
                          <p>Vista previa del video</p>
                          <p className="text-sm">Se mostrará aquí cuando se guarde</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-red-600">
                    💡 Usa el formato embed de YouTube: https://www.youtube.com/embed/VIDEO_ID
                  </p>
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button 
                onClick={onCancel} 
                variant="outline" 
                className="flex-1 py-3 text-lg border-gray-300 text-gray-600 hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                className="flex-1 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Guardar Actividad
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}