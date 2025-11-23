import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Users, FileText, Plus, RefreshCw, Award, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface TeacherSubject {
  id: number;
  name: string;
  description?: string;
  grade: string;
  color: string;
  totalStudents: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progress: number;
  averageGrade: number;
}

const TeacherSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/teacher/subjects', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        let subjectsData = data.subjects || [];
        
        // FILTRAR SOLO CUARTO C
        subjectsData = subjectsData.filter((subject: TeacherSubject) => subject.grade === 'Cuarto C');
        
        setSubjects(subjectsData);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleCreateTask = (subject: TeacherSubject) => {
    navigate(`/profesor/materias/${subject.id}/tareas?name=${encodeURIComponent(subject.name)}&grade=${encodeURIComponent(subject.grade)}`);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            Mis Materias
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus materias y grados asignados
          </p>
          <Button
            onClick={loadSubjects}
            variant="outline"
            className="mt-4 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes materias asignadas
              </h3>
              <p className="text-gray-600">
                Contacta al coordinador para que te asigne materias y grados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={`${subject.id}-${subject.grade}`} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${subject.color}20` }}
                    >
                      <BookOpen className="w-6 h-6" style={{ color: subject.color }} />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: `${subject.color}20`,
                        color: subject.color
                      }}
                    >
                      {subject.grade}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {subject.name}
                  </h3>
                  
                  {subject.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {subject.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between p-3 rounded-lg mb-4"
                    style={{ backgroundColor: `${subject.color}10` }}
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" style={{ color: subject.color }} />
                      <span className="text-sm font-medium text-gray-700">Promedio</span>
                    </div>
                    <span className="text-xl font-bold" style={{ color: subject.color }}>
                      {subject.averageGrade.toFixed(1)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Progreso</span>
                      <span className="text-sm font-bold" style={{ color: subject.color }}>
                        {subject.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${subject.progress}%`,
                          backgroundColor: subject.color
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-blue-700">{subject.totalStudents}</p>
                      <p className="text-xs text-blue-600">Estudiantes</p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                      <FileText className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-purple-700">{subject.totalTasks}</p>
                      <p className="text-xs text-purple-600">Tareas</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-green-700">{subject.completedTasks}</p>
                      <p className="text-xs text-green-600">Completadas</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleCreateTask(subject)}
                    size="sm"
                    className="w-full text-xs"
                    style={{ 
                      backgroundColor: subject.color,
                      color: 'white'
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Crear Tarea
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
    </>
  );
};

export default TeacherSubjectsPage;
