import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Users, TrendingUp, RefreshCw, Plus, Eye } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';

interface TeacherSubject {
  id: number;
  name: string;
  description: string;
  grade: string;
  totalStudents: number;
  totalTasks: number;
  color: string;
}

const TeacherSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/teacher/subjects');
      if (response.data.success) {
        setSubjects(response.data.subjects);
      } else {
        // Fallback con materias de primaria
        setSubjects([
          { id: 16, name: 'Exploración del Medio', description: 'Conocimiento del entorno', grade: 'Preescolar A', totalStudents: 20, totalTasks: 5, color: '#4CAF50' },
          { id: 17, name: 'Desarrollo del Lenguaje', description: 'Comunicación oral y escrita', grade: 'Preescolar A', totalStudents: 20, totalTasks: 4, color: '#2196F3' },
          { id: 10, name: 'Matemáticas', description: 'Números y operaciones', grade: '1° B', totalStudents: 22, totalTasks: 6, color: '#2E5BFF' },
          { id: 11, name: 'Lengua Española', description: 'Lectura y escritura', grade: '1° B', totalStudents: 22, totalTasks: 5, color: '#00C764' },
          { id: 19, name: 'Ciencias Naturales', description: 'Seres vivos y medio ambiente', grade: '2° C', totalStudents: 24, totalTasks: 4, color: '#F5A623' },
          { id: 20, name: 'Ciencias Sociales', description: 'Historia y geografía', grade: '2° C', totalStudents: 24, totalTasks: 3, color: '#FF6B35' },
          { id: 24, name: 'Matemáticas', description: 'Números y operaciones', grade: '3° A', totalStudents: 26, totalTasks: 7, color: '#2E5BFF' },
          { id: 28, name: 'Inglés', description: 'Vocabulario básico', grade: '3° A', totalStudents: 26, totalTasks: 4, color: '#1494DE' },
          { id: 36, name: 'Educación Artística', description: 'Música, dibujo y teatro', grade: '4° D', totalStudents: 23, totalTasks: 3, color: '#E91E63' },
          { id: 37, name: 'Educación Física', description: 'Deportes y salud', grade: '4° D', totalStudents: 23, totalTasks: 2, color: '#795548' },
          { id: 38, name: 'Matemáticas', description: 'Números y operaciones', grade: '5° A', totalStudents: 25, totalTasks: 8, color: '#2E5BFF' },
          { id: 39, name: 'Lengua Española', description: 'Lectura y escritura', grade: '5° A', totalStudents: 25, totalTasks: 6, color: '#00C764' },
          { id: 40, name: 'Ciencias Naturales', description: 'Seres vivos y medio ambiente', grade: '5° A', totalStudents: 25, totalTasks: 5, color: '#F5A623' },
          { id: 41, name: 'Ciencias Sociales', description: 'Historia y geografía', grade: '5° B', totalStudents: 27, totalTasks: 4, color: '#FF6B35' },
          { id: 42, name: 'Inglés', description: 'Vocabulario básico', grade: '5° B', totalStudents: 27, totalTasks: 3, color: '#1494DE' }
        ]);
      }
    } catch (error) {
      console.error('Error loading teacher subjects:', error);
      // Fallback con materias de primaria completas
      setSubjects([
        { id: 16, name: 'Exploración del Medio', description: 'Conocimiento del entorno', grade: 'Preescolar A', totalStudents: 20, totalTasks: 5, color: '#4CAF50' },
        { id: 17, name: 'Desarrollo del Lenguaje', description: 'Comunicación oral y escrita', grade: 'Preescolar A', totalStudents: 20, totalTasks: 4, color: '#2196F3' },
        { id: 10, name: 'Matemáticas', description: 'Números y operaciones', grade: '1° B', totalStudents: 22, totalTasks: 6, color: '#2E5BFF' },
        { id: 11, name: 'Lengua Española', description: 'Lectura y escritura', grade: '1° B', totalStudents: 22, totalTasks: 5, color: '#00C764' },
        { id: 19, name: 'Ciencias Naturales', description: 'Seres vivos y medio ambiente', grade: '2° C', totalStudents: 24, totalTasks: 4, color: '#F5A623' },
        { id: 20, name: 'Ciencias Sociales', description: 'Historia y geografía', grade: '2° C', totalStudents: 24, totalTasks: 3, color: '#FF6B35' },
        { id: 24, name: 'Matemáticas', description: 'Números y operaciones', grade: '3° A', totalStudents: 26, totalTasks: 7, color: '#2E5BFF' },
        { id: 28, name: 'Inglés', description: 'Vocabulario básico', grade: '3° A', totalStudents: 26, totalTasks: 4, color: '#1494DE' },
        { id: 36, name: 'Educación Artística', description: 'Música, dibujo y teatro', grade: '4° D', totalStudents: 23, totalTasks: 3, color: '#E91E63' },
        { id: 37, name: 'Educación Física', description: 'Deportes y salud', grade: '4° D', totalStudents: 23, totalTasks: 2, color: '#795548' },
        { id: 38, name: 'Matemáticas', description: 'Números y operaciones', grade: '5° A', totalStudents: 25, totalTasks: 8, color: '#2E5BFF' },
        { id: 39, name: 'Lengua Española', description: 'Lectura y escritura', grade: '5° A', totalStudents: 25, totalTasks: 6, color: '#00C764' },
        { id: 40, name: 'Ciencias Naturales', description: 'Seres vivos y medio ambiente', grade: '5° A', totalStudents: 25, totalTasks: 5, color: '#F5A623' },
        { id: 41, name: 'Ciencias Sociales', description: 'Historia y geografía', grade: '5° B', totalStudents: 27, totalTasks: 4, color: '#FF6B35' },
        { id: 42, name: 'Inglés', description: 'Vocabulario básico', grade: '5° B', totalStudents: 27, totalTasks: 3, color: '#1494DE' }
      ]);
    } finally {
      setLoading(false);
    }
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
            className="border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {subjects.length === 0 ? (
        <EmptyState
          icon="book"
          title="No hay materias asignadas"
          description="Contacta al coordinador para que te asigne materias y grados."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="border-secondary-200 hover:shadow-lg transition-all duration-200 hover:border-primary-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      {subject.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Grado: {subject.grade}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {subject.description}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    Activa
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {subject.totalStudents}
                    </p>
                    <p className="text-xs text-gray-600">Estudiantes</p>
                  </div>
                  
                  <div className="text-center p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {subject.totalTasks}
                    </p>
                    <p className="text-xs text-gray-600">Tareas</p>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estado</span>
                    <span className="text-gray-900 font-medium">
                      Activa
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tareas Asignadas</span>
                    <span className="text-gray-900 font-medium">
                      {subject.totalTasks}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Link 
                    to={`/profesor/calificaciones?materia=${subject.id}&grado=${encodeURIComponent(subject.grade)}`}
                    className="flex-1"
                  >
                    <Button 
                      className="w-full bg-[#00368F] hover:bg-[#2E5BFF] text-white border-0 flex items-center gap-2"
                      size="sm"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Estudiantes
                    </Button>
                  </Link>
                  <Link 
                    to={`/profesor/tareas?materia=${subject.id}&grado=${encodeURIComponent(subject.grade)}`}
                  >
                    <Button 
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Tarea
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSubjectsPage;