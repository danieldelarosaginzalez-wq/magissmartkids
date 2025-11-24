import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { BookOpen, User, Mail, RefreshCw } from 'lucide-react';
import api from '../../services/api';

interface Subject {
  id: string;
  name: string;
  progress: number;
  grade: number;
  color: string;
  teacherName?: string;
  teacherEmail?: string;
}

const MySubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  /**
   * Carga las materias del estudiante con información del profesor
   * Endpoint: GET /students/subjects/progress
   */
  const loadSubjects = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando materias...');
      
      const response = await api.get('/students/subjects/progress');
      console.log('✅ Materias recibidas:', response.data);

      const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const formattedSubjects = response.data.map((subject: unknown, index: number) => ({
          id: (subject.subjectId || subject.id || index).toString(),
          name: subject.subjectName || subject.name || 'Materia',
          progress: subject.progress || 0,
          grade: subject.averageGrade || subject.grade || 0,
          color: colors[index % colors.length],
          teacherName: subject.teacherName || 'Prof. Sin asignar',
          teacherEmail: subject.teacherEmail || ''
        }));
        
        // Solo mostrar materias reales
        setSubjects(formattedSubjects);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error('❌ Error cargando materias:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.0) return 'bg-green-100 text-green-800';
    if (grade >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis Materias"
          description="Revisa tu progreso en cada materia"
          icon={BookOpen}
        />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Materias"
        description="Revisa tu progreso en cada materia"
        icon={BookOpen}
        action={
          <Button
            onClick={loadSubjects}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay materias asignadas</h3>
            <p className="text-gray-500">Aún no tienes materias registradas en el sistema</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{subject.name}</span>
                  <Badge className={getGradeColor(subject.grade)}>
                    {subject.grade.toFixed(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso</span>
                    <span className="font-semibold">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color
                      }}
                    ></div>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{subject.teacherName}</span>
                  </div>
                  {subject.teacherEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a 
                        href={`mailto:${subject.teacherEmail}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {subject.teacherEmail}
                      </a>
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

export default MySubjectsPage;
