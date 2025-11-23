import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, Save, X, FileText, User } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface PendingSubmission {
  id: number;
  taskTitle: string;
  studentName: string;
  studentEmail: string;
  grade: string;
  submittedAt: string;
  submissionText: string;
  submissionFileUrl: string;
}

const TeacherPendingGradesPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<number | null>(null);
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    loadPendingSubmissions();
  }, []);

  const loadPendingSubmissions = async () => {
    try {
      setLoading(true);
      if (!token) return;

      const response = await fetch('/api/teacher/submissions/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error loading pending submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (submissionId: number) => {
    const newScore = parseFloat(score);
    if (isNaN(newScore) || newScore < 0 || newScore > 5) {
      alert('La nota debe estar entre 0 y 5');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/teacher/submissions/${submissionId}/grade`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: newScore,
          feedback: feedback || 'Calificado'
        })
      });

      if (response.ok) {
        // Remover de la lista
        setSubmissions(submissions.filter(s => s.id !== submissionId));
        setGradingSubmission(null);
        setScore('');
        setFeedback('');
        alert('Nota guardada correctamente');
      } else {
        alert('Error al guardar la nota');
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Error al guardar la nota');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Tareas Pendientes de Calificar"
          description="Revisa y califica las entregas pendientes"
          icon={Clock}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tareas Pendientes de Calificar"
        description="Revisa y califica las entregas pendientes de tus estudiantes"
        icon={Clock}
      />

      {/* Contador */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-100 rounded-lg">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de entregas pendientes */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Todo al día!
            </h3>
            <p className="text-gray-600">
              No hay entregas pendientes de calificar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <span>{submission.taskTitle}</span>
                  </div>
                  <span className="text-sm font-normal text-gray-500">
                    {submission.grade}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Información del estudiante */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{submission.studentName}</span>
                    <span className="text-sm text-gray-500">({submission.studentEmail})</span>
                  </div>

                  {/* Fecha de entrega */}
                  <div className="text-sm text-gray-600">
                    Entregado: {new Date(submission.submittedAt).toLocaleString('es-ES')}
                  </div>

                  {/* Contenido de la entrega */}
                  {submission.submissionText && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Respuesta del estudiante:</p>
                      <p className="text-gray-900">{submission.submissionText}</p>
                    </div>
                  )}

                  {/* Archivo adjunto */}
                  {submission.submissionFileUrl && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <a
                        href={`/api/files/download/${submission.submissionFileUrl.replace(/^\/api\/files\/download\//, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Ver archivo adjunto
                      </a>
                    </div>
                  )}

                  {/* Formulario de calificación */}
                  {gradingSubmission === submission.id ? (
                    <div className="border-t pt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nota (0-5)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="0.0"
                            disabled={saving}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Retroalimentación
                          </label>
                          <input
                            type="text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Comentario opcional"
                            disabled={saving}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleGradeSubmission(submission.id)}
                          disabled={saving}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {saving ? 'Guardando...' : 'Guardar Calificación'}
                        </Button>
                        <Button
                          onClick={() => {
                            setGradingSubmission(null);
                            setScore('');
                            setFeedback('');
                          }}
                          variant="outline"
                          disabled={saving}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t pt-4">
                      <Button
                        onClick={() => setGradingSubmission(submission.id)}
                        className="w-full"
                      >
                        Calificar Ahora
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherPendingGradesPage;
